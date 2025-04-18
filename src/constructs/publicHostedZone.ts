import { CustomResource, Duration, Names } from "aws-cdk-lib";
import {
  ArnPrincipal,
  Policy,
  PolicyStatement,
  PrincipalWithConditions,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { LogLevel, NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { CfnResourceShare } from "aws-cdk-lib/aws-ram";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { ParameterTier, StringParameter } from "aws-cdk-lib/aws-ssm";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
  PhysicalResourceIdReference,
  Provider,
} from "aws-cdk-lib/custom-resources";
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
  private publicHostedZones: Record<string, IHostedZone> = {};
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
        forceDockerBundling: false,
        logLevel: LogLevel.SILENT,
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
      throw new Error(`Zone ${zoneName} already provisioned.`);
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
   * Adds zone into this.publicHostedZones record set with domain name as record id
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
      throw new Error(
        `Zone ${domain} must be added before sharing. Use addZone method`,
      );
    }

    const zone = new CustomResource(this, `zid${domain}`, {
      serviceToken: this.zoneGetterProvider.serviceToken,
      properties: {
        zoneDescriptionFilter: "Managed by cdk",
        zoneName: domain,
      },
    });

    const zoneId = zone.getAttString("zoneId");
    const importedZone: IHostedZone = HostedZone.fromHostedZoneId(
      this,
      `zone${domain}`,
      zoneId,
    );

    this.publicHostedZones[domain] = importedZone;

    // This creates domain:zoneId map
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

  // *.dev.acme.com, *-dev.acme.com
  // Role name: dev.acme.com - acting kinda like namespace reservation
  // Zone: acme.com

  /**
   * Creates a cross-account Route 53 role for a specific hosted zone with custom name with optional suffix: R53-acme.com-[Multizone]
   *
   * Method adds suffix when there are multiple domains
   *
   * @param OUs A list of organizational unit to allow Role be assumed from
   * @param domains A list of domain names the role gets created for
   * @throws If zone for any domain was not shared before creating the role
   */
  createRoute53Role(OUs: string[], domains: string[]): void {
    const multiZoneSuffix = domains.length > 1 ? "-MtplZn" : "";
    const firstDomain = this.zoneHelper.extractNamespaceDomain(domains[0]);

    const domainZoneArns: string[] = [];
    const ouPaths: string[] = [];

    const stringLike: string[] = [];
    const stringEquals: string[] = [];

    for (const ou of OUs) {
      ouPaths.push(
        `${this.props.orgId}/r-${this.props.orgRootId}/ou-${this.props.orgRootId}-${ou}/`,
      );
    }

    for (const d of domains) {
      const tld = this.zoneHelper.extractTld(d);
      domainZoneArns.push(this.publicHostedZones[tld].hostedZoneArn);

      if (!this.zoneIdParameters[tld]) {
        throw new Error(
          `Zone ${d} must be shared with RAM before we can create a role for. Use shareZoneWithRAM method.`,
        );
      }

      if (this.zoneHelper.isWildCardDomain(d)) {
        stringEquals.push(this.zoneHelper.normalizeDomain(d));
        stringLike.push(d);
        continue;
      }

      if (this.zoneHelper.isPatternDomain(d)) {
        stringLike.push(d);
        continue;
      }

      if (this.zoneHelper.isPlainSubdomain(d)) {
        const wildcard = `*.${d}`;
        // Add permissions for records in the domain itself dev.acme.com
        stringEquals.push(this.zoneHelper.normalizeDomain(wildcard));
        // Then all subdomains match: *.dev.acme.com
        stringLike.push(wildcard);
        // Finally the wildcard itself: *.dev.acme.com
        stringEquals.push(this.zoneHelper.normalizeDomain(d));
        continue;
      }
    }

    const statements = [];

    statements.push(
      // cross-account cert manager is using this permission
      new PolicyStatement({
        actions: ["route53:GetChange"],
        resources: ["*"],
      }),
    );

    if (stringEquals.length > 0) {
      statements.push(
        new PolicyStatement({
          actions: ["route53:ChangeResourceRecordSets"],
          resources: domainZoneArns,
          conditions: {
            "ForAllValues:StringEquals": {
              "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                stringEquals,
            },
          },
        }),
      );
    }

    if (stringLike.length > 0) {
      statements.push(
        new PolicyStatement({
          actions: ["route53:ChangeResourceRecordSets"],
          resources: domainZoneArns,
          conditions: {
            "ForAllValues:StringLike": {
              "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                stringLike,
            },
          },
        }),
      );
    }

    const policy = new Policy(
      this,
      `R53Policy-${firstDomain}-${multiZoneSuffix}`,
      {
        statements,
      },
    );

    const r = new Role(this, `Route53Role${firstDomain}${multiZoneSuffix}`, {
      roleName: `R53-${firstDomain}${multiZoneSuffix}`,
      assumedBy: new PrincipalWithConditions(new ArnPrincipal("*"), {
        "ForAnyValue:StringLike": {
          "aws:PrincipalOrgPaths": ouPaths,
        },
      }),
    });

    policy.attachToRole(r);
  }
}
