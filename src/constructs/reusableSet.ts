import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

export interface IReusableDelegationSetProps {
  /**
   * https://docs.aws.amazon.com/Route53/latest/APIReference/API_CreateHostedZone.html#Route53-CreateHostedZone-request-CallerReference
   *
   * A string to identify request in retries, required by Route53 client. Example: "r53-set-1"
   */
  callerReference: string;
  /**
   * Optional property to create delegation set for existing zone id.
   */
  hostedZoneId?: string;
}

/**
 * Creates reusable delegation set in Route53 with custom resource
 *
 * https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-reusable-delegation-set
 */
export class ReusableDelegationSet extends Construct {
  public readonly delegationSetId: string;
  public readonly nameServers: string[];
  constructor(
    scope: Construct,
    id: string,
    props: IReusableDelegationSetProps,
  ) {
    super(scope, id);

    const parameters: Record<string, string> = {
      CallerReference: props.callerReference,
      ...(props.hostedZoneId && { HostedZoneId: props.hostedZoneId }),
    };

    const createDelegationSetResource = new AwsCustomResource(
      this,
      "CreateDelegationSet",
      {
        onCreate: {
          service: "Route53",
          action: "createReusableDelegationSet",
          parameters,
          physicalResourceId:
            PhysicalResourceId.fromResponse("DelegationSet.Id"),
        },

        onUpdate: {
          service: "Route53",
          action: "getReusableDelegationSet",
          parameters: {
            Id: PhysicalResourceId.fromResponse("DelegationSet.Id"),
          },
          physicalResourceId: PhysicalResourceId.of("DelegationSet.Get"),
        },

        onDelete: {
          service: "Route53",
          action: "deleteReusableDelegationSet",
          parameters: {
            Id: PhysicalResourceId.fromResponse("DelegationSet.Id"),
          },
        },

        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      },
    );

    this.delegationSetId =
      createDelegationSetResource.getResponseField("DelegationSet.Id");

    this.nameServers = [
      createDelegationSetResource.getResponseField(
        "DelegationSet.NameServers.0",
      ),
      createDelegationSetResource.getResponseField(
        "DelegationSet.NameServers.1",
      ),
      createDelegationSetResource.getResponseField(
        "DelegationSet.NameServers.2",
      ),
      createDelegationSetResource.getResponseField(
        "DelegationSet.NameServers.3",
      ),
    ];
  }
}
