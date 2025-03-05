import { CustomResource, Duration, Names } from "aws-cdk-lib";
import {
  ArnPrincipal,
  PolicyStatement,
  PrincipalWithConditions,
} from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { CfnResourceShare } from "aws-cdk-lib/aws-ram";
import { HostedZone, IHostedZone, RecordType } from "aws-cdk-lib/aws-route53";
import { ParameterTier, StringParameter } from "aws-cdk-lib/aws-ssm";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
  PhysicalResourceIdReference,
  Provider,
} from "aws-cdk-lib/custom-resources";
import { CrossAccountRoute53Role } from "cdk-cross-account-route53";
import { Construct } from "constructs";
import { PublicHostedZoneClient } from "./publicHostedZoneClient";
import { ReusableDelegationSet } from "./reusableSet";

/**
 * Properties for configuring a public hosted zone with a reusable delegation set.
 */
export interface IPublicHostedZoneWithIReusableDelegationSetProps {
  /**
   * The reusable delegation set to associate with the public hosted zone.
   */
  delegationSet: ReusableDelegationSet;

  /**
   * A comment for the hosted zone configuration.
   */
  comment?: string;

  /**
   * The AWS Organizations ID of the organization.
   */
  orgId: string;

  /**
   * The root ID of the AWS Organizations root.
   */
  orgRootId: string;

  /**
   * The account ID of the AWS Organizations management account.
   */
  orgAccountId: string;
}

/**
 * Represents a public hosted zone associated with a reusable delegation set.
 * Provides methods to create zones, update their name servers, share them with RAM, and manage Route 53 roles.
 */
export class PublicHostedZoneWithReusableDelegationSet extends Construct {
  private publicHostedZoneResources: Record<string, AwsCustomResource> = {};
  private zoneIdParameters: Record<string, StringParameter> = {};
  private domains: string[] = [];
  private zoneGetterProvider: Provider;
  private props: IPublicHostedZoneWithIReusableDelegationSetProps;
  private zoneHelper: PublicHostedZoneClient;

  /**
   * Creates a new PublicHostedZoneWithReusableDelegationSet construct.
   * @param scope The parent construct.
   * @param id The unique identifier for this construct.
   * @param props Properties for configuring the reusable delegation set and organization.
   */
  constructor(
    scope: Construct,
    id: string,
    props: IPublicHostedZoneWithIReusableDelegationSetProps,
  ) {
    super(scope, id);
    this.props = props;
    this.zoneHelper = new PublicHostedZoneClient(scope, "test", {
      accountId: "",
      domain: "",
      region: "",
    });
    const zoneGetterLambda = new NodejsFunction(this, "zone", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: "src/constructs/functions/route53Getter/index.ts",
      timeout: Duration.minutes(5),
      initialPolicy: [
        new PolicyStatement({
          actions: ["route53:List*"],
          resources: ["*"],
        }),
      ],
      bundling: {
        externalModules: ["@aws-sdk/client-route53"],
        sourceMap: true,
      },
    });

    this.zoneGetterProvider = new Provider(this, "provider", {
      onEventHandler: zoneGetterLambda,
    });
  }

  /**
   * Adds a new public hosted zone.
   * @param zoneName The domain name for the hosted zone.
   * @throws If the zone is already added.
   */
  addZone(zoneName: string): void {
    if (this.domains.includes(zoneName)) {
      throw new Error(`Zone ${zoneName} already added.`);
    }

    this.domains.push(zoneName);

    const publicHostedZoneResource = new AwsCustomResource(
      this,
      `pubZone${zoneName}`,
      {
        onCreate: {
          service: "Route53",
          action: "createHostedZone",
          parameters: {
            CallerReference: `${Names.uniqueResourceName(this, {
              maxLength: 15,
            })}-${Date.now()}`,
            Name: zoneName,
            DelegationSetId: this.props.delegationSet.delegationSetId,
            HostedZoneConfig: {
              Comment: this.props.comment,
              PrivateZone: false,
            },
          },
          physicalResourceId: PhysicalResourceId.fromResponse("HostedZone.Id"),
        },
        onDelete: {
          service: "Route53",
          action: "deleteHostedZone",
          parameters: {
            Id: new PhysicalResourceIdReference(),
          },
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      },
    );

    this.publicHostedZoneResources[zoneName] = publicHostedZoneResource;
  }

  /**
   * Updates the name servers for a given domain.
   * @param zoneName The domain name whose name servers are to be updated.
   */
  updateDomainNS(zoneName: string) {
    new AwsCustomResource(this, zoneName, {
      onCreate: {
        service: "Route53Domains",
        action: "updateDomainNameservers",
        parameters: {
          DomainName: zoneName,
          Nameservers: this.props.delegationSet.nameServers.map((ns) => ({
            Name: ns,
          })),
        },
        physicalResourceId: PhysicalResourceId.of(`NS-${zoneName}`),
      },
      onUpdate: {
        service: "Route53Domains",
        action: "updateDomainNameservers",
        parameters: {
          DomainName: zoneName,
          Nameservers: this.props.delegationSet.nameServers.map((ns) => ({
            Name: ns,
          })),
        },
        physicalResourceId: PhysicalResourceId.of(`NS-${zoneName}`),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }

  /**
   * Shares the hosted zone with AWS Resource Access Manager (RAM)
   *
   * @param domain The domain name of the zone.
   * @param orgOUIds The list of organizational unit IDs to share with.
   * @param allowExternal Whether to allow sharing with external accounts.
   * @throws If the zone is not added before sharing.
   */
  shareZoneWithRAM(
    domain: string,
    orgOUIds: string[],
    allowExternal: boolean = false,
  ): void {
    if (!this.publicHostedZoneResources[domain]) {
      throw new Error(`Zone ${domain} must be added before sharing.`);
    }

    const zone = new CustomResource(this, `zid${domain}`, {
      serviceToken: this.zoneGetterProvider.serviceToken,
      properties: {
        zoneDescriptionFilter: "Managed by cdk",
        zoneName: domain,
      },
    });

    const zoneId = zone.getAttString("zoneId");

    const zoneIdParameter = new StringParameter(this, `${domain}Param`, {
      parameterName: `/shared/${domain}/zone-id`,
      stringValue: zoneId,
      tier: ParameterTier.ADVANCED,
    });

    this.zoneIdParameters[domain] = zoneIdParameter;

    new CfnResourceShare(this, `${domain}Share`, {
      allowExternalPrincipals: allowExternal,
      name: domain,
      resourceArns: [zoneIdParameter.parameterArn],
      principals: orgOUIds.map(
        (ouId) =>
          `arn:aws:organizations::${this.props.orgAccountId}:ou/${this.props.orgId}/ou-${this.props.orgRootId}-${ouId}`,
      ),
      permissionArns: [
        "arn:aws:ram::aws:permission/AWSRAMDefaultPermissionSSMParameterReadOnly",
      ],
    });
  }

  /**
   * Creates a cross-account Route 53 role for a specific hosted zone.
   * @param ou The organizational unit to assign the role to.
   * @param zoneName The name of the hosted zone.
   * @param domain The domain name of the hosted zone.
   * @throws If the zone is not shared before creating the role.
   */
  createRoute53Role(ou: string, zoneName: string, domain: string): void {
    const tld = this.zoneHelper.processDomain(domain, true);

    if (!this.zoneIdParameters[tld]) {
      throw new Error(`Zone ${domain} must be shared before creating a role.`);
    }

    const zone: IHostedZone = HostedZone.fromHostedZoneId(
      this,
      `import${zoneName}`,
      this.zoneIdParameters[tld].stringValue,
    );

    new CrossAccountRoute53Role(this, `Route53Role${zoneName}`, {
      roleName: `Route53Role${zoneName}`,
      assumedBy: new PrincipalWithConditions(new ArnPrincipal("*"), {
        "ForAnyValue:StringLike": {
          "aws:PrincipalOrgPaths": [
            `${this.props.orgId}/r-${this.props.orgRootId}/ou-${this.props.orgRootId}-${ou}/`,
          ],
        },
      }),
      zone: zone,
      records: [
        {
          domainNames: [`*.${domain}`, `${domain}`],
          types: Object.values(RecordType) as (keyof typeof RecordType)[],
        },
      ],
      normaliseDomains: false,
    });
  }
}
