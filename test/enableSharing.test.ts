import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { SetRamShareWithAwsOrganization } from "../src/constructs/enableSharing";

test("SetRamShareWithAwsOrganization creates a custom resource and role", () => {
  const app = new App();
  const stack = new Stack(app, "Stack");

  new SetRamShareWithAwsOrganization(stack, "TestConstruct");

  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::IAM::Role", 1);

  template.hasResourceProperties("Custom::AWS", {
    Create: JSON.stringify({
      service: "ram",
      action: "enableSharingWithAwsOrganization",
      parameters: {},
      physicalResourceId: { id: "EnableSharingWithAwsOrganization" },
    }),
  });
});
