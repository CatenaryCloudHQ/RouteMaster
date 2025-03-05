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

  constructor(scope: Construct, id: string, props: PublicHostedZoneUtilsProps) {
    super(scope, id);
    this.props = props;
  }

  /**
   * Zone account id
   * @returns string
   */
  zoneAccount(): string {
    return this.props.accountId;
  }

  /**
   * Creates and returns IStringParameter that contains zone id (param.stringvalue)
   * @returns IStringParameter
   */
  resolveHostedZoneId(): IStringParameter {
    const domainId = this.processDomain(this.props.domain, true);
    const parameterArn = `arn:aws:ssm:${this.props.region}:${this.props.accountId}:parameter/shared/${domainId}/zone-id`;

    return StringParameter.fromStringParameterArn(this, "zone", parameterArn);
  }

  /**
   * Returns the IAM role ARN for Route 53 cross-account access.
   * @returns IAM role ARN as a string.
   */
  crossAccountRoleArn(): string {
    const subDomainId = this.processDomain(this.props.domain);
    return `arn:aws:iam::${this.props.accountId}:role/Route53Role${subDomainId}`;
  }

  /**
   * Helper method for a domain string to create IDs.
   *
   * For a given domain name, if the optional parameter `tld` is false (default), the function returns
   * a combined identifier constructed by joining any subdomains with dashes and appending the first segment
   * of the root domain.
   *
   * For example, "a1.dev.acme.com" becomes "a1-dev-acme". If `tld` is true, the function
   * returns the second-level TLD (e.g., "acme.com").
   *
   * @param domain - The input domain string (e.g., "acme.com", "dev.acme.com").
   * @param tld - Optional flag; when true, returns the second-level TLD.
   * @returns The processed domain identifier or the second-level TLD.
   */
  public processDomain(domain: string, tld: boolean = false): string {
    const parts = domain.split(".");
    if (parts.length < 2) return "";

    const rootDomain = parts.slice(-2).join(".");
    if (tld) return rootDomain;

    const subdomains = parts.slice(0, -2);
    const identifier = subdomains.length > 0 ? subdomains.join("-") : "";

    return identifier
      ? `${identifier}-${rootDomain.split(".")[0]}`
      : rootDomain.split(".")[0];
  }
}
