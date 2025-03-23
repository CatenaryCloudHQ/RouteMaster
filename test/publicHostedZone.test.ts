import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { PublicHostedZoneWithReusableDelegationSet } from "../src/constructs/publicHostedZone";
import { ReusableDelegationSet } from "../src/constructs/reusableSet";

let set: ReusableDelegationSet;

describe("PublicHostedZoneWithReusableDelegationSet", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      context: { "aws:cdk:bundling-stacks-docker-enabled": false },
    });
    stack = new Stack(app, "TestStack");
    set = new ReusableDelegationSet(stack, "DelegationSet", {
      callerReference: "test-ref",
    });
  });

  test("should add a hosted zone with addZone", () => {
    const zoneConstruct = new PublicHostedZoneWithReusableDelegationSet(
      stack,
      "TestConstruct",
      {
        delegationSet: set,
        orgId: "test-org-id",
        orgRootId: "test-org-root-id",
        orgAccountId: "123456789012",
        comment: "Test comment",
      },
    );
    zoneConstruct.addZone("example.com");

    const template = Template.fromStack(stack);

    template.resourceCountIs("Custom::AWS", 2);
    template.hasResourceProperties("Custom::AWS", {
      Create:
        '{"service":"Route53","action":"createReusableDelegationSet","parameters":{"CallerReference":"test-ref"},"physicalResourceId":{"responsePath":"DelegationSet.Id"}}',
    });
  });

  test("should update domain NS with updateDomainNS", () => {
    const zoneConstruct = new PublicHostedZoneWithReusableDelegationSet(
      stack,
      "TestConstruct",
      {
        delegationSet: set,
        orgId: "test-org-id",
        orgRootId: "test-org-root-id",
        orgAccountId: "123456789012",
      },
    );
    zoneConstruct.updateDomainNS("example.com");

    const template = Template.fromStack(stack);
    template.resourceCountIs("Custom::AWS", 2);
    template.hasResourceProperties(
      "Custom::AWS",
      Match.objectLike({
        Create: Match.objectLike({
          "Fn::Join": [
            "",
            Match.arrayWith([
              '{"service":"Route53Domains","action":"updateDomainNameservers","parameters":{"DomainName":"example.com","Nameservers":[{"Name":"',
              ...Array.from({ length: 4 }, (_, i) =>
                Match.objectLike({
                  "Fn::GetAtt": [
                    Match.anyValue(),
                    `DelegationSet.NameServers.${i}`,
                  ],
                }),
              ),
              '"}]},"physicalResourceId":{"id":"NS-example.com"}}',
            ]),
          ],
        }),
      }),
    );
  });

  test("should share zone with RAM using shareZoneWithRAM", () => {
    const zoneConstruct = new PublicHostedZoneWithReusableDelegationSet(
      stack,
      "TestConstruct",
      {
        delegationSet: set,
        orgId: "test-org-id",
        orgRootId: "test-org-root-id",
        orgAccountId: "123456789012",
      },
    );
    zoneConstruct.addZone("example.com");
    zoneConstruct.shareZoneWithRAM("example.com", ["org1", "org2"]);

    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::SSM::Parameter", 1);
    template.resourceCountIs("AWS::RAM::ResourceShare", 1);
  });

  test("should create Route53 role with createRoute53Role", () => {
    const zoneConstruct = new PublicHostedZoneWithReusableDelegationSet(
      stack,
      "TestConstruct",
      {
        delegationSet: set,
        orgId: "test-org-id",
        orgRootId: "test-org-root-id",
        orgAccountId: "123456789012",
      },
    );
    zoneConstruct.addZone("example.com");
    zoneConstruct.shareZoneWithRAM("example.com", ["org1"]);
    zoneConstruct.createRoute53Role(["org1"], ["example.com"]);

    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::IAM::Role", 4);
    template.resourceCountIs("AWS::IAM::Policy", 5);

    template.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "R53-example.com",
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: "sts:AssumeRole",
            Condition: {
              "ForAnyValue:StringLike": {
                "aws:PrincipalOrgPaths": [
                  "test-org-id/r-test-org-root-id/ou-test-org-root-id-org1/",
                ],
              },
            },
          }),
        ]),
      },
    });

    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: "route53:ChangeResourceRecordSets",
            Condition: {
              "ForAllValues:StringLike": {
                "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
                  "example.com",
                ],
              },
            },
          }),
        ]),
      },
    });
  });

  test("should create Route53 role with MtplZn suffix and correct domain matchers", () => {
    const zoneConstruct = new PublicHostedZoneWithReusableDelegationSet(
      stack,
      "TestConstruct",
      {
        delegationSet: set,
        orgId: "test-org-id",
        orgRootId: "test-org-root-id",
        orgAccountId: "123456789012",
      },
    );
    zoneConstruct.addZone("acme.com");
    zoneConstruct.addZone("example.com");
    zoneConstruct.shareZoneWithRAM("acme.com", ["org1"]);
    zoneConstruct.shareZoneWithRAM("example.com", ["org1"]);
    zoneConstruct.createRoute53Role(
      ["org1"],
      ["dev.acme.com", "*dev.example.com"],
    );

    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "R53-dev.acme.com-MtplZn",
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: "sts:AssumeRole",
            Condition: {
              "ForAnyValue:StringLike": {
                "aws:PrincipalOrgPaths": [
                  "test-org-id/r-test-org-root-id/ou-test-org-root-id-org1/",
                ],
              },
            },
          }),
        ]),
      },
    });

    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: "route53:ChangeResourceRecordSets",
            Condition: {
              "ForAllValues:StringLike": {
                "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
                  "dev.acme.com",
                  "\\052dev.example.com",
                ],
              },
            },
          }),
        ]),
      },
    });
  });
});
