# RouteMaster

Zone delegation in Route53 cross-account is complicated. RouteMaster simplifies zone management in one account with fine-grained permissions for each zone and subdomain.

The clients that use shared zones will need to make more effort to work with those zones.

AWS designs constructs with a big assumption: zones are always local and are in the same account. That's why they added everywhere zone import methods. It makes it very convenient for clients to use it. On the flip side, it hides the legacy of managing zones delegation.

With RouteMaster, there is no need for DNS legacy sharing method with delegation. The clients update zone records directly and security with designed IAM role, designated per OU.

This is very scalable and cost-effective method to manage zones.

![savings](./media/savings.png.jpg)
Change in Route53 cost after zones consolidation with RouteMaster

# How to use

In the account with consolidated Route53:

```ts
export class Route53Resources extends Stack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    // Enable RAM sharing - this is optional and may be already enabled in your org
    new SetRamShareWithAwsOrganization(this, "RamSharing");

    // Create reusable delegation set
    const set = new ReusableDelegationSet(this, "DelegationSet", {
      callerReference: "r53-set-1",
    });

    // Instantiate zone creator class, it needs AWS Organizations account id
    // and Organization ID and the AWS Organizations ID root (it's the same thing but different ids)
    const zoneCreator = new PublicHostedZoneWithReusableDelegationSet(
      this,
      "dnsmanagement",
      {
        orgAccountId: "243332259153",
        orgId: "o-4skejfwken",
        orgRootId: "6sw3",
        delegationSet: set,
        comment: "Managed by cdk, repo: cdk-root-hosted-zones",
      }
    );

    // Add new zones first
    const tldZones = [
      { domain: "acme.com", name: "acme" },
      { domain: "acme.ai", name: "acme-ai" }
      // ... many more
    ];

    // Define dev zones
    const devZones = [{ domain: "dev.acme.com", name: "dev-acme" }];

    // Create zones per domain
    zones.forEach((tldZones) => zoneCreator.addZone(zone.domain));

    // Share zones with OUs so the can add the records
    zones.forEach((tldZones) => zoneCreator.shareZoneWithRAM(zone.domain, orgIds));

    // Create IAM roles for the OUs which they will use to update records in specific zones
    zones.forEach((tldZones) =>
      zoneCreator.createRoute53Role(["shf24sfws"], [zone.domain])
    );

    // Note that for dev domains there is no need to create new zones
    // The dev records gets updated in respective TLD zone, but security with own IAM role shared to specific UOs
    devZones.forEach((zone) =>
      zoneCreator.createRoute53Role(["x81hd0je"], [zone.domain])
    );

    // Finally, after zone setup is ready - update name servers in Route53 registrar
    // Important! This will switch zones for the registered domains!
    // If you had zones provisioned in Route53, then make sure you migrated all records to zones managed with RouteMaster constructs.
    ["acme.com", "acme.ai"].forEach(
      (domain) => zoneCreator.updateDomainNS(domain)
    );
  }
```

## Domain Processing Patterns

RouteMaster supports three distinct domain patterns with different permission sets:

### 1. Wildcard domains: `*.dev.acme.com`
Creates permissions for:
- Wildcard domain match (normalized): `\052.dev.acme.com`
- Star match: `*.dev.acme.com`  
- Base domain match: `dev.acme.com`

### 2. Pattern domains: `dev*.acme.com`
Creates permissions for:
- Star match: `dev*.acme.com` (matches `dev1.acme.com`, `dev-test.acme.com`)
- Base domain match: `dev.acme.com`
- Nested wildcard match: `*.dev*.acme.com`

### 3. Plain subdomains: `dev.acme.com`
Creates permissions for:
- Domain match: `dev.acme.com`
- Wildcard subdomain match: `*.dev.acme.com`

**Role Naming**: Role names are always clean - asterisks are removed. For example, `dev*.acme.com` creates role `R53-dev.acme.com`.

**Multiple Domain Roles**: When creating roles for multiple domains, the `-MtplZn` suffix is automatically added to distinguish them from single-domain roles. The role name uses the first domain as the base. For example:
- Single domain: `createRoute53Role(["ou1"], ["dev.acme.com"])` creates `R53-dev.acme.com`
- Multiple domains: `createRoute53Role(["ou1"], ["dev.acme.com", "test.example.com"])` creates `R53-dev.acme.com-MtplZn`

And in the app accounts:

```ts
import { CrossAccountRoute53RecordSet } from "cdk-cross-account-route53";

const domain = "acme.com";
const dnsAccount = "243332259153";

// Get helper instantiated
const zoneHelper = new PublicHostedZoneClient(this, "helper", {
  accountId: dnsAccount,
  domain: domain,
  region: "us-east-1",
});

// To updated records cross-account, use CrossAccountRoute53RecordSet construct
// It needs to know what zone to update and what IAM Role to assume
// To get zone, use hosted zone id provided by resolveHostedZoneId() helper method
// To get IAM role ARN use crossAccountRoleArn() helper method
const zoneIdParam = zoneHelper.resolveHostedZoneId();

const zone = HostedZone.fromHostedZoneAttributes(this, "zone", {
  hostedZoneId: zoneIdParam.stringValue,
  zoneName: zoneHelper.extractTld(domain),
});

const dnsRole: IRole = Role.fromRoleArn(
  this,
  "dnsRole",
  zoneHelper.crossAccountRoleArn(),
);

// Create records, for example Google verification txt record
const record: ResourceRecordSet = {
  Name: props.domain + ".",
  Type: "TXT",
  ResourceRecords: [{ Value: props.googleVerificationToken }],
  TTL: 300,
};

new CrossAccountRoute53RecordSet(this, "GoogleVerification", {
  delegationRoleName: dnsRole.roleName,
  delegationRoleAccount: dnsAccount,
  hostedZoneId: zone.hostedZoneId,
  resourceRecordSets: [record],
});
```
