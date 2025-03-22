# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### PublicHostedZoneClient <a name="PublicHostedZoneClient" id="@catenarycloud/routemaster.PublicHostedZoneClient"></a>

CDK Construct for retrieving hosted zone ID and IAM role ARN from SSM.

#### Initializers <a name="Initializers" id="@catenarycloud/routemaster.PublicHostedZoneClient.Initializer"></a>

```typescript
import { PublicHostedZoneClient } from '@catenarycloud/routemaster'

new PublicHostedZoneClient(scope: Construct, id: string, props: PublicHostedZoneUtilsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.Initializer.parameter.props">props</a></code> | <code><a href="#@catenarycloud/routemaster.PublicHostedZoneUtilsProps">PublicHostedZoneUtilsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@catenarycloud/routemaster.PublicHostedZoneClient.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@catenarycloud/routemaster.PublicHostedZoneClient.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@catenarycloud/routemaster.PublicHostedZoneClient.Initializer.parameter.props"></a>

- *Type:* <a href="#@catenarycloud/routemaster.PublicHostedZoneUtilsProps">PublicHostedZoneUtilsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.crossAccountRoleArn">crossAccountRoleArn</a></code> | Returns the IAM role ARN for Route 53 cross-account access. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.extractNamespaceDomain">extractNamespaceDomain</a></code> | Strips leading non-domain characters and returns the cleaned domain. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.extractTld">extractTld</a></code> | Extracts the second-level domain (zone identifier) from a full domain name. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.normalizeDomain">normalizeDomain</a></code> | Normalizes a domain string for use in Route53 condition keys. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.resolveHostedZoneId">resolveHostedZoneId</a></code> | Creates and returns IStringParameter that contains zone id (param.stringvalue). |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.zoneAccount">zoneAccount</a></code> | Zone account id. |

---

##### `toString` <a name="toString" id="@catenarycloud/routemaster.PublicHostedZoneClient.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `crossAccountRoleArn` <a name="crossAccountRoleArn" id="@catenarycloud/routemaster.PublicHostedZoneClient.crossAccountRoleArn"></a>

```typescript
public crossAccountRoleArn(multiZone?: boolean): string
```

Returns the IAM role ARN for Route 53 cross-account access.

Optional switch to use multi zone suffix - the client must be aware if domain shared created as a "set"

###### `multiZone`<sup>Optional</sup> <a name="multiZone" id="@catenarycloud/routemaster.PublicHostedZoneClient.crossAccountRoleArn.parameter.multiZone"></a>

- *Type:* boolean

---

##### `extractNamespaceDomain` <a name="extractNamespaceDomain" id="@catenarycloud/routemaster.PublicHostedZoneClient.extractNamespaceDomain"></a>

```typescript
public extractNamespaceDomain(input: string): string
```

Strips leading non-domain characters and returns the cleaned domain.

If subdomains exist, returns full domain after prefix removal.
Example: "!test.env.acme.com" → "test.env.acme.com"

###### `input`<sup>Required</sup> <a name="input" id="@catenarycloud/routemaster.PublicHostedZoneClient.extractNamespaceDomain.parameter.input"></a>

- *Type:* string

---

##### `extractTld` <a name="extractTld" id="@catenarycloud/routemaster.PublicHostedZoneClient.extractTld"></a>

```typescript
public extractTld(input: string): string
```

Extracts the second-level domain (zone identifier) from a full domain name.

Throws if input is not a valid domain with at least two segments.
Example: "a.b.c.dev.acme.com" → "acme.com"

###### `input`<sup>Required</sup> <a name="input" id="@catenarycloud/routemaster.PublicHostedZoneClient.extractTld.parameter.input"></a>

- *Type:* string

---

##### `normalizeDomain` <a name="normalizeDomain" id="@catenarycloud/routemaster.PublicHostedZoneClient.normalizeDomain"></a>

```typescript
public normalizeDomain(input: string): string
```

Normalizes a domain string for use in Route53 condition keys.

Converts to lowercase, removes trailing dot, and escapes all non-[a–z0–9_.-] characters
using AWS octal format (e.g. "*" → "\052").
Example: "*-Dev.Acme.com." → "\052-dev.acme.com"

###### `input`<sup>Required</sup> <a name="input" id="@catenarycloud/routemaster.PublicHostedZoneClient.normalizeDomain.parameter.input"></a>

- *Type:* string

---

##### `resolveHostedZoneId` <a name="resolveHostedZoneId" id="@catenarycloud/routemaster.PublicHostedZoneClient.resolveHostedZoneId"></a>

```typescript
public resolveHostedZoneId(): IStringParameter
```

Creates and returns IStringParameter that contains zone id (param.stringvalue).

##### `zoneAccount` <a name="zoneAccount" id="@catenarycloud/routemaster.PublicHostedZoneClient.zoneAccount"></a>

```typescript
public zoneAccount(): string
```

Zone account id.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@catenarycloud/routemaster.PublicHostedZoneClient.isConstruct"></a>

```typescript
import { PublicHostedZoneClient } from '@catenarycloud/routemaster'

PublicHostedZoneClient.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@catenarycloud/routemaster.PublicHostedZoneClient.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneClient.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@catenarycloud/routemaster.PublicHostedZoneClient.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### PublicHostedZoneWithReusableDelegationSet <a name="PublicHostedZoneWithReusableDelegationSet" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet"></a>

Represents a public hosted zone associated with a reusable delegation set.

Provides methods to create zones, update their name servers, share them with RAM, and manage Route 53 roles.

#### Initializers <a name="Initializers" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer"></a>

```typescript
import { PublicHostedZoneWithReusableDelegationSet } from '@catenarycloud/routemaster'

new PublicHostedZoneWithReusableDelegationSet(scope: Construct, id: string, props: IPublicHostedZoneWithIReusableDelegationSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The parent construct. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.id">id</a></code> | <code>string</code> | The unique identifier for this construct. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.props">props</a></code> | <code><a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps">IPublicHostedZoneWithIReusableDelegationSetProps</a></code> | Properties for configuring the reusable delegation set and organization. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.id"></a>

- *Type:* string

The unique identifier for this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.props"></a>

- *Type:* <a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps">IPublicHostedZoneWithIReusableDelegationSetProps</a>

Properties for configuring the reusable delegation set and organization.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.addZone">addZone</a></code> | Adds a new public hosted zone. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role">createRoute53Role</a></code> | Creates a cross-account Route 53 role for a specific hosted zone with custom name with optional suffix: R53-acme.com-[Multizone]. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM">shareZoneWithRAM</a></code> | Shares the hosted zone with AWS Resource Access Manager (RAM) Adds zone into this.publicHostedZones record set with domain name as record id. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.updateDomainNS">updateDomainNS</a></code> | Updates the name servers for a given domain. |

---

##### `toString` <a name="toString" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addZone` <a name="addZone" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.addZone"></a>

```typescript
public addZone(zoneName: string): void
```

Adds a new public hosted zone.

###### `zoneName`<sup>Required</sup> <a name="zoneName" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.addZone.parameter.zoneName"></a>

- *Type:* string

The domain name for the hosted zone.

---

##### `createRoute53Role` <a name="createRoute53Role" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role"></a>

```typescript
public createRoute53Role(OUs: string[], domains: string[]): void
```

Creates a cross-account Route 53 role for a specific hosted zone with custom name with optional suffix: R53-acme.com-[Multizone].

Method adds suffix when there are multiple domains

###### `OUs`<sup>Required</sup> <a name="OUs" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.OUs"></a>

- *Type:* string[]

A list of organizational unit to allow Role be assumed from.

---

###### `domains`<sup>Required</sup> <a name="domains" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.domains"></a>

- *Type:* string[]

A list of domain names the role gets created for.

---

##### `shareZoneWithRAM` <a name="shareZoneWithRAM" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM"></a>

```typescript
public shareZoneWithRAM(domain: string, orgOUIds: string[], allowExternal?: boolean): void
```

Shares the hosted zone with AWS Resource Access Manager (RAM) Adds zone into this.publicHostedZones record set with domain name as record id.

###### `domain`<sup>Required</sup> <a name="domain" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM.parameter.domain"></a>

- *Type:* string

The domain name of the zone.

---

###### `orgOUIds`<sup>Required</sup> <a name="orgOUIds" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM.parameter.orgOUIds"></a>

- *Type:* string[]

The list of organizational unit IDs to share with.

---

###### `allowExternal`<sup>Optional</sup> <a name="allowExternal" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM.parameter.allowExternal"></a>

- *Type:* boolean

Whether to allow sharing with external accounts.

---

##### `updateDomainNS` <a name="updateDomainNS" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.updateDomainNS"></a>

```typescript
public updateDomainNS(zoneName: string): void
```

Updates the name servers for a given domain.

###### `zoneName`<sup>Required</sup> <a name="zoneName" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.updateDomainNS.parameter.zoneName"></a>

- *Type:* string

The domain name whose name servers are to be updated.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.isConstruct"></a>

```typescript
import { PublicHostedZoneWithReusableDelegationSet } from '@catenarycloud/routemaster'

PublicHostedZoneWithReusableDelegationSet.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### ReusableDelegationSet <a name="ReusableDelegationSet" id="@catenarycloud/routemaster.ReusableDelegationSet"></a>

Creates reusable delegation set in Route53 with custom resource.

https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-reusable-delegation-set

#### Initializers <a name="Initializers" id="@catenarycloud/routemaster.ReusableDelegationSet.Initializer"></a>

```typescript
import { ReusableDelegationSet } from '@catenarycloud/routemaster'

new ReusableDelegationSet(scope: Construct, id: string, props: IReusableDelegationSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.Initializer.parameter.props">props</a></code> | <code><a href="#@catenarycloud/routemaster.IReusableDelegationSetProps">IReusableDelegationSetProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@catenarycloud/routemaster.ReusableDelegationSet.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@catenarycloud/routemaster.ReusableDelegationSet.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@catenarycloud/routemaster.ReusableDelegationSet.Initializer.parameter.props"></a>

- *Type:* <a href="#@catenarycloud/routemaster.IReusableDelegationSetProps">IReusableDelegationSetProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@catenarycloud/routemaster.ReusableDelegationSet.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@catenarycloud/routemaster.ReusableDelegationSet.isConstruct"></a>

```typescript
import { ReusableDelegationSet } from '@catenarycloud/routemaster'

ReusableDelegationSet.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@catenarycloud/routemaster.ReusableDelegationSet.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.property.delegationSetId">delegationSetId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet.property.nameServers">nameServers</a></code> | <code>string[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@catenarycloud/routemaster.ReusableDelegationSet.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `delegationSetId`<sup>Required</sup> <a name="delegationSetId" id="@catenarycloud/routemaster.ReusableDelegationSet.property.delegationSetId"></a>

```typescript
public readonly delegationSetId: string;
```

- *Type:* string

---

##### `nameServers`<sup>Required</sup> <a name="nameServers" id="@catenarycloud/routemaster.ReusableDelegationSet.property.nameServers"></a>

```typescript
public readonly nameServers: string[];
```

- *Type:* string[]

---


### SetRamShareWithAwsOrganization <a name="SetRamShareWithAwsOrganization" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization"></a>

Configures RAM service to work with AWS Organizations https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html Must run in the management account.

#### Initializers <a name="Initializers" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.Initializer"></a>

```typescript
import { SetRamShareWithAwsOrganization } from '@catenarycloud/routemaster'

new SetRamShareWithAwsOrganization(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.SetRamShareWithAwsOrganization.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.SetRamShareWithAwsOrganization.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.SetRamShareWithAwsOrganization.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@catenarycloud/routemaster.SetRamShareWithAwsOrganization.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.isConstruct"></a>

```typescript
import { SetRamShareWithAwsOrganization } from '@catenarycloud/routemaster'

SetRamShareWithAwsOrganization.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.SetRamShareWithAwsOrganization.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@catenarycloud/routemaster.SetRamShareWithAwsOrganization.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### PublicHostedZoneUtilsProps <a name="PublicHostedZoneUtilsProps" id="@catenarycloud/routemaster.PublicHostedZoneUtilsProps"></a>

Interface for hosted zone utility configuration.

#### Initializer <a name="Initializer" id="@catenarycloud/routemaster.PublicHostedZoneUtilsProps.Initializer"></a>

```typescript
import { PublicHostedZoneUtilsProps } from '@catenarycloud/routemaster'

const publicHostedZoneUtilsProps: PublicHostedZoneUtilsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneUtilsProps.property.accountId">accountId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneUtilsProps.property.domain">domain</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneUtilsProps.property.region">region</a></code> | <code>string</code> | *No description.* |

---

##### `accountId`<sup>Required</sup> <a name="accountId" id="@catenarycloud/routemaster.PublicHostedZoneUtilsProps.property.accountId"></a>

```typescript
public readonly accountId: string;
```

- *Type:* string

---

##### `domain`<sup>Required</sup> <a name="domain" id="@catenarycloud/routemaster.PublicHostedZoneUtilsProps.property.domain"></a>

```typescript
public readonly domain: string;
```

- *Type:* string

---

##### `region`<sup>Required</sup> <a name="region" id="@catenarycloud/routemaster.PublicHostedZoneUtilsProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IPublicHostedZoneWithIReusableDelegationSetProps <a name="IPublicHostedZoneWithIReusableDelegationSetProps" id="@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps"></a>

- *Implemented By:* <a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps">IPublicHostedZoneWithIReusableDelegationSetProps</a>

Properties for configuring a public hosted zone with a reusable delegation set.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.delegationSet">delegationSet</a></code> | <code><a href="#@catenarycloud/routemaster.ReusableDelegationSet">ReusableDelegationSet</a></code> | The reusable delegation set to associate with the public hosted zone. |
| <code><a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgAccountId">orgAccountId</a></code> | <code>string</code> | The account ID of the AWS Organizations management account. |
| <code><a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgId">orgId</a></code> | <code>string</code> | The AWS Organizations ID of the organization. |
| <code><a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgRootId">orgRootId</a></code> | <code>string</code> | The root ID of the AWS Organizations root. |
| <code><a href="#@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.comment">comment</a></code> | <code>string</code> | A comment for the hosted zone configuration. |

---

##### `delegationSet`<sup>Required</sup> <a name="delegationSet" id="@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.delegationSet"></a>

```typescript
public readonly delegationSet: ReusableDelegationSet;
```

- *Type:* <a href="#@catenarycloud/routemaster.ReusableDelegationSet">ReusableDelegationSet</a>

The reusable delegation set to associate with the public hosted zone.

---

##### `orgAccountId`<sup>Required</sup> <a name="orgAccountId" id="@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgAccountId"></a>

```typescript
public readonly orgAccountId: string;
```

- *Type:* string

The account ID of the AWS Organizations management account.

---

##### `orgId`<sup>Required</sup> <a name="orgId" id="@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgId"></a>

```typescript
public readonly orgId: string;
```

- *Type:* string

The AWS Organizations ID of the organization.

---

##### `orgRootId`<sup>Required</sup> <a name="orgRootId" id="@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgRootId"></a>

```typescript
public readonly orgRootId: string;
```

- *Type:* string

The root ID of the AWS Organizations root.

---

##### `comment`<sup>Optional</sup> <a name="comment" id="@catenarycloud/routemaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

A comment for the hosted zone configuration.

---

### IReusableDelegationSetProps <a name="IReusableDelegationSetProps" id="@catenarycloud/routemaster.IReusableDelegationSetProps"></a>

- *Implemented By:* <a href="#@catenarycloud/routemaster.IReusableDelegationSetProps">IReusableDelegationSetProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@catenarycloud/routemaster.IReusableDelegationSetProps.property.callerReference">callerReference</a></code> | <code>string</code> | https://docs.aws.amazon.com/Route53/latest/APIReference/API_CreateHostedZone.html#Route53-CreateHostedZone-request-CallerReference. |
| <code><a href="#@catenarycloud/routemaster.IReusableDelegationSetProps.property.hostedZoneId">hostedZoneId</a></code> | <code>string</code> | Optional property to create delegation set for existing zone id. |

---

##### `callerReference`<sup>Required</sup> <a name="callerReference" id="@catenarycloud/routemaster.IReusableDelegationSetProps.property.callerReference"></a>

```typescript
public readonly callerReference: string;
```

- *Type:* string

https://docs.aws.amazon.com/Route53/latest/APIReference/API_CreateHostedZone.html#Route53-CreateHostedZone-request-CallerReference.

A string to identify request in retries, required by Route53 client. Example: "r53-set-1"

---

##### `hostedZoneId`<sup>Optional</sup> <a name="hostedZoneId" id="@catenarycloud/routemaster.IReusableDelegationSetProps.property.hostedZoneId"></a>

```typescript
public readonly hostedZoneId: string;
```

- *Type:* string

Optional property to create delegation set for existing zone id.

---

