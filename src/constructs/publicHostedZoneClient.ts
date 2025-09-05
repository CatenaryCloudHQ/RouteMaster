import { IStringParameter, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

/**
 * Interface for hosted zone utility configuration.
 */
export interface PublicHostedZoneUtilsProps {
  readonly accountId: string;
  readonly region: string;
  readonly domain: string;
}

/**
 * CDK Construct for retrieving hosted zone ID and IAM role ARN from SSM.
 */
export class PublicHostedZoneClient extends Construct {
  private readonly props: PublicHostedZoneUtilsProps;
  private readonly multiZoneSuffix: string;

  constructor(scope: Construct, id: string, props: PublicHostedZoneUtilsProps) {
    super(scope, id);
    this.props = props;
    this.multiZoneSuffix = "MtplZn";
  }

  /**
   * Zone account id
   * @returns string
   */
  zoneAccount(): string {
    return this.props.accountId;
  }

  /**
   * For a given domain (ok to include any subdomains), it creates and returns IStringParameter that contains zone id (param.stringvalue)
   * @returns IStringParameter
   */
  resolveHostedZoneId(domain: string): IStringParameter {
    const domainId = this.extractTld(domain);
    const parameterArn = `arn:aws:ssm:${this.props.region}:${this.props.accountId}:parameter/shared/${domainId}/zone-id`;

    return StringParameter.fromStringParameterArn(this, "zone", parameterArn);
  }

  /**
   * Returns the IAM role ARN for Route 53 cross-account access
   *
   * Optional switch to use multi zone suffix - the client must be aware if domain shared created as a "set"
   * @returns IAM role ARN as a string.
   */
  crossAccountRoleArn(multiZone?: boolean): string {
    const subDomainId = this.extractNamespaceDomain(this.props.domain);
    const multiZoneSuffix = multiZone ? `-${this.multiZoneSuffix}` : "";
    return `arn:aws:iam::${this.props.accountId}:role/R53-${subDomainId}${multiZoneSuffix}`;
  }

  /**
   * Test if domain wildcard
   * @param input domain name
   * @returns true if input a wildcard domain *.test.acme.com
   */
  public isWildCardDomain(input: string): boolean {
    try {
      this.extractTld(input);
      return input.startsWith("*.");
    } catch {
      return false;
    }
  }

  /**
   * Normalizes a domain string for use in Route53 condition keys.
   * Converts to lowercase, removes trailing dot, and escapes all non-[a–z0–9_.-] characters
   * using AWS octal format (e.g. "*" → "\052").
   * Example: "*-Dev.Acme.com." → "\052-dev.acme.com"
   */
  public normalizeDomain(input: string): string {
    const trimmed = input.replace(/\.$/, "").toLowerCase();

    return trimmed
      .split("")
      .map((char) =>
        /[a-z0-9_.-]/.test(char)
          ? char
          : `\\${`000${char.charCodeAt(0).toString(8)}`.slice(-3)}`,
      )
      .join("");
  }

  /**
   * Extracts the second-level domain (zone identifier) from a full domain name.
   * Throws if input is not a valid domain with at least two segments.
   * Example: "a.b.c.dev.acme.com" → "acme.com"
   */
  public extractTld(input: string): string {
    const parts = input.split(".");
    if (parts.length < 2) {
      throw new Error(
        `extractTld: input does not contain a valid TLD → "${input}"`,
      );
    }
    return parts.slice(-2).join(".");
  }

  /**
   * Strips leading non-domain characters and all asterisks to return clean domain for role naming.
   * If subdomains exist, returns full domain after prefix removal and asterisk cleanup.
   * Example: "*.dev.acme.com" → "dev.acme.com"
   * Example: "dev*.acme.com" → "dev.acme.com"
   * Example: "*dev*test*.acme.com" → "devtest.acme.com"
   */
  public extractNamespaceDomain(input: string): string {
    return input.replace(/^[^a-z0-9]+/i, "").replace(/\*/g, "");
  }

  /**
   * Determines if domain contains wildcard pattern (e.g. "*-test.acme.com")
   * without being a classic wildcard subdomain like "*.test.acme.com"
   *
   * @param input domain string
   * @returns true for any embedded wildcard pattern not at start followed by dot
   */
  public isPatternDomain(input: string): boolean {
    try {
      this.extractTld(input);
      return input.includes("*") && !input.startsWith("*.");
    } catch {
      return false;
    }
  }

  /**
   * Returns true for plain subdomain with only dots and hyphens
   * Must start and end with alphanumeric
   * Wildcards not allowed
   * Assumes input is already lowercase
   */
  public isPlainSubdomain(input: string): boolean {
    try {
      this.extractTld(input);
      return (
        /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(input) && !input.includes("*")
      );
    } catch {
      return false;
    }
  }
}
