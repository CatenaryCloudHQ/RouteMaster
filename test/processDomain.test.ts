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

  describe("processDomain", () => {
    test("returns empty string for invalid domain", () => {
      expect(client.processDomain("localhost")).toBe("");
    });

    test("returns only root domain if no subdomain is present", () => {
      expect(client.processDomain(tldDomain)).toBe("acme");
    });

    test("returns combined identifier if subdomain is present", () => {
      expect(client.processDomain(domain)).toBe("dev-acme");
    });

    test("returns second-level TLD if tld is true", () => {
      expect(client.processDomain(domain, true)).toBe("acme.com");
    });

    test("handles multiple subdomains", () => {
      expect(client.processDomain(`a1.${domain}`)).toBe("a1-dev-acme");
    });

    test("handles multiple subdomains with tld true", () => {
      expect(client.processDomain(`a1.${domain}`, true)).toBe("acme.com");
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
        `arn:aws:iam::${accountId}:role/Route53Roledev-acme`,
      );
    });

    test("constructs IAM role ARN for a different domain", () => {
      const differentClient = new PublicHostedZoneClient(stack, "TestClient2", {
        ...props,
        domain: "test.example.com",
      });

      expect(differentClient.crossAccountRoleArn()).toBe(
        `arn:aws:iam::${accountId}:role/Route53Roletest-example`,
      );
    });
  });
});
