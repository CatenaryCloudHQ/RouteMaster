import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { PublicHostedZoneWithReusableDelegationSet } from "../src/constructs/publicHostedZone";
import { ReusableDelegationSet } from "../src/constructs/reusableSet";

/**
 * Tests for domain processing patterns and role creation logic
 */
describe("Domain Processing Patterns", () => {
  let app: App;
  let stack: Stack;
  let set: ReusableDelegationSet;
  let zoneConstruct: PublicHostedZoneWithReusableDelegationSet;

  beforeEach(() => {
    app = new App({
      context: { "aws:cdk:bundling-stacks-docker-enabled": false },
    });
    stack = new Stack(app, "TestStack");
    set = new ReusableDelegationSet(stack, "DelegationSet", {
      callerReference: "test-ref",
    });
    zoneConstruct = new PublicHostedZoneWithReusableDelegationSet(
      stack,
      "TestConstruct",
      {
        delegationSet: set,
        orgId: "test-org-id",
        orgRootId: "test-org-root-id",
        orgAccountId: "123456789012",
      },
    );

    // Setup base zone
    zoneConstruct.addZone("acme.com");
    zoneConstruct.shareZoneWithRAM("acme.com", ["org1"]);
  });

  describe("Wildcard domains: *.dev.acme.com", () => {
    test("should create wildcard domain match, star match, and base domain match", () => {
      zoneConstruct.createRoute53Role(["org1"], ["*.dev.acme.com"]);

      const template = Template.fromStack(stack);

      // Should have both StringEquals and StringLike conditions
      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Condition: Match.objectLike({
                "ForAllValues:StringEquals": Match.objectLike({
                  "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                    Match.arrayWith(["\\052.dev.acme.com"]),
                }),
              }),
            }),
            Match.objectLike({
              Condition: Match.objectLike({
                "ForAllValues:StringLike": Match.objectLike({
                  "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                    Match.arrayWith(["*.dev.acme.com"]),
                }),
              }),
            }),
          ]),
        },
      });

      // Should also match dev.acme.com
      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Condition: Match.objectLike({
                "ForAllValues:StringEquals": Match.objectLike({
                  "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                    Match.arrayWith(["dev.acme.com"]),
                }),
              }),
            }),
          ]),
        },
      });
    });

    test("should create role with correct name (no star mangling)", () => {
      zoneConstruct.createRoute53Role(["org1"], ["*.dev.acme.com"]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-dev.acme.com",
      });
    });
  });

  describe("Pattern domains: dev*.acme.com", () => {
    test("should create star match for dev*.acme.com, dev.acme.com AND *.dev*.acme.com", () => {
      zoneConstruct.createRoute53Role(["org1"], ["dev*.acme.com"]);

      const template = Template.fromStack(stack);

      // Should have StringLike condition with all three patterns
      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Condition: Match.objectLike({
                "ForAllValues:StringLike": Match.objectLike({
                  "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                    Match.arrayWith([
                      "dev*.acme.com",
                      "dev.acme.com",
                      "*.dev*.acme.com",
                    ]),
                }),
              }),
            }),
          ]),
        },
      });

      // Should NOT have StringEquals condition at all for pattern domains
      const template2 = Template.fromStack(stack);
      const policies = template2.findResources("AWS::IAM::Policy");

      // Check that no policy has StringEquals condition
      let hasStringEquals = false;
      for (const [key, policy] of Object.entries(policies)) {
        if (key.includes("R53Policy")) {
          const statements = policy.Properties?.PolicyDocument?.Statement || [];
          for (const statement of statements) {
            if (
              statement.Condition &&
              statement.Condition["ForAllValues:StringEquals"]
            ) {
              hasStringEquals = true;
              break;
            }
          }
        }
      }
      expect(hasStringEquals).toBe(false);
    });

    test("should create role with correct name (no star mangling)", () => {
      zoneConstruct.createRoute53Role(["org1"], ["dev*.acme.com"]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-dev.acme.com",
      });
    });
  });

  describe("Plain subdomain: dev.acme.com", () => {
    test("should create star string match for dev.acme.com AND *.dev.acme.com", () => {
      zoneConstruct.createRoute53Role(["org1"], ["dev.acme.com"]);

      const template = Template.fromStack(stack);

      // Should have StringEquals for both patterns
      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Condition: Match.objectLike({
                "ForAllValues:StringEquals": Match.objectLike({
                  "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                    Match.arrayWith(["dev.acme.com", "\\052.dev.acme.com"]),
                }),
              }),
            }),
          ]),
        },
      });

      // Should have StringLike for wildcard pattern
      template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Condition: Match.objectLike({
                "ForAllValues:StringLike": Match.objectLike({
                  "route53:ChangeResourceRecordSetsNormalizedRecordNames":
                    Match.arrayWith(["*.dev.acme.com"]),
                }),
              }),
            }),
          ]),
        },
      });
    });

    test("should create role with correct name", () => {
      zoneConstruct.createRoute53Role(["org1"], ["dev.acme.com"]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-dev.acme.com",
      });
    });
  });

  describe("Role name extraction", () => {
    test("should extract clean domain name from wildcard pattern", () => {
      zoneConstruct.createRoute53Role(["org1"], ["*.dev.acme.com"]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-dev.acme.com",
      });
    });

    test("should extract clean domain name from star pattern", () => {
      zoneConstruct.createRoute53Role(["org1"], ["dev*.acme.com"]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-dev.acme.com",
      });
    });

    test("should extract clean domain name from complex pattern", () => {
      zoneConstruct.createRoute53Role(["org1"], ["*dev*test*.acme.com"]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-devtest.acme.com",
      });
    });
  });

  describe("Multiple domains with MtplZn suffix", () => {
    test("should use first domain for role name and add MtplZn suffix", () => {
      zoneConstruct.addZone("example.com");
      zoneConstruct.shareZoneWithRAM("example.com", ["org1"]);

      zoneConstruct.createRoute53Role(
        ["org1"],
        ["*.dev.acme.com", "test.example.com"],
      );

      const template = Template.fromStack(stack);
      template.hasResourceProperties("AWS::IAM::Role", {
        RoleName: "R53-dev.acme.com-MtplZn",
      });
    });
  });
});
