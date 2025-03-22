import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {
  PublicHostedZoneClient,
  PublicHostedZoneUtilsProps,
} from "../src/constructs/publicHostedZoneClient";

const tldDomain = "acme.com";
const domain = "dev.acme.com";
const accountId = "123456789012";
const region = "us-east-1";

describe("PublicHostedZoneClient", () => {
  let stack: Stack;
  let client: PublicHostedZoneClient;
  let props: PublicHostedZoneUtilsProps;
  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, "TestStack");
    props = {
      accountId: accountId,
      region: region,
      domain: domain,
    };
    client = new PublicHostedZoneClient(stack, "TestClient", props);
  });

  describe("normalizeDomain", () => {
    test("normalizes mixed case and trailing dot", () => {
      expect(client.normalizeDomain("Dev.Acme.com.")).toBe("dev.acme.com");
    });

    test("escapes invalid characters", () => {
      expect(client.normalizeDomain("*.acme.com")).toBe("\\052.acme.com");
      expect(client.normalizeDomain("*-Dev.Acme.com.")).toBe(
        "\\052-dev.acme.com",
      );
    });

    test("preserves valid characters", () => {
      expect(client.normalizeDomain("api_1.dev-acme.com")).toBe(
        "api_1.dev-acme.com",
      );
    });
  });

  describe("extractNamespaceDomain", () => {
    test("removes leading wildcard", () => {
      expect(client.extractNamespaceDomain("*.dev.acme.com")).toBe(
        "dev.acme.com",
      );
    });

    test("removes leading non-domain characters", () => {
      expect(client.extractNamespaceDomain("*-dev.acme.com")).toBe(
        "dev.acme.com",
      );
      expect(client.extractNamespaceDomain("!test.env.acme.com")).toBe(
        "test.env.acme.com",
      );
    });

    test("returns root domain when no subdomain present", () => {
      expect(client.extractNamespaceDomain("acme.com")).toBe("acme.com");
    });

    test("returns single-segment domain unchanged", () => {
      expect(client.extractNamespaceDomain("localhost")).toBe("localhost");
    });
  });

  describe("extractTld", () => {
    test("extracts second-level domain from valid input", () => {
      expect(client.extractTld("a.b.dev.acme.com")).toBe("acme.com");
    });

    test("extracts TLD from simple domain", () => {
      expect(client.extractTld("foo.bar")).toBe("foo.bar");
    });

    test("throws on invalid input with no dot", () => {
      expect(() => client.extractTld("localhost")).toThrow(
        'extractTld: input does not contain a valid TLD → "localhost"',
      );
    });
  });

  describe("resolveHostedZoneId", () => {
    test("creates an SSM parameter for hosted zone lookup", () => {
      const sharingParameterArn = `arn:aws:ssm:${region}:${accountId}:parameter/shared/${tldDomain}/zone-id`;
      // const domainId = client.processDomain(tldDomain, true);
      const param = client.resolveHostedZoneId();

      expect(stack.resolve(param.parameterArn)).toEqual(sharingParameterArn);
      expect(stack.resolve(param.parameterName)).toEqual(`zone-id`);
      expect(stack.resolve(param.parameterType)).toEqual("String");
      // TODO How AWS makes these tests without prefixes??
      // https://github.com/aws/aws-cdk/blob/ab368ee5029e96d2ff774d3015a744784bde4ee1/packages/aws-cdk-lib/aws-ssm/test/parameter.test.ts#L356C1-L377C4
      expect(stack.resolve(param.stringValue)).toEqual({
        Ref: `TestClientzoneParameter97C1E1DC`,
      });
      Template.fromStack(stack).templateMatches({
        Parameters: {
          TestClientzoneParameter97C1E1DC: {
            Type: "AWS::SSM::Parameter::Value<String>",
            Default: sharingParameterArn,
          },
        },
      });
    });
  });

  describe("zoneAccount getter", () => {
    test("Gets correct account id ", () => {
      expect(client.zoneAccount()).toBe(accountId);
    });
  });

  describe("rossAccountRoleArn test", () => {
    test("constructs correct IAM role ARN", () => {
      expect(client.crossAccountRoleArn()).toBe(
        `arn:aws:iam::${accountId}:role/Route53Role-dev.acme.com`,
      );
      expect(client.crossAccountRoleArn(true)).toBe(
        `arn:aws:iam::${accountId}:role/Route53Role-dev.acme.com-MtplZn`,
      );
    });

    test("constructs IAM role ARN for a different domain", () => {
      const differentClient = new PublicHostedZoneClient(stack, "TestClient2", {
        ...props,
        domain: "test.example.com",
      });

      expect(differentClient.crossAccountRoleArn()).toBe(
        `arn:aws:iam::${accountId}:role/Route53Role-test.example.com`,
      );
    });
  });
});
