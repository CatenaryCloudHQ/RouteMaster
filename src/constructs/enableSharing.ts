import {
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

/**
 * Configures RAM service to work with AWS Organizations
 * https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html
 * Must run in the management account
 */
export class SetRamShareWithAwsOrganization extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsCustomResource(this, "custom", {
      onCreate: {
        service: "ram",
        action: "enableSharingWithAwsOrganization",
        parameters: {},
        physicalResourceId: PhysicalResourceId.of(
          "EnableSharingWithAwsOrganization",
        ),
      },

      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),

      role: new Role(this, "CustomResource", {
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole",
          ),
        ],
        inlinePolicies: {
          EnableSharingPolicy: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: [
                  "ram:EnableSharingWithAwsOrganization",
                  "organizations:DescribeOrganization",
                  "organizations:EnableAWSServiceAccess",
                  "iam:CreateServiceLinkedRole",
                ],
                resources: ["*"],
              }),
            ],
          }),
        },
      }),
    });
  }
}
