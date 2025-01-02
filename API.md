# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### PublicHostedZoneWithReusableDelegationSet <a name="PublicHostedZoneWithReusableDelegationSet" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet"></a>

Represents a public hosted zone associated with a reusable delegation set.

Provides methods to create zones, update their name servers, share them with RAM, and manage Route 53 roles.

#### Initializers <a name="Initializers" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer"></a>

```typescript
import { PublicHostedZoneWithReusableDelegationSet } from 'RouteMaster'

new PublicHostedZoneWithReusableDelegationSet(scope: Construct, id: string, props: IPublicHostedZoneWithIReusableDelegationSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The parent construct. |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.id">id</a></code> | <code>string</code> | The unique identifier for this construct. |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.props">props</a></code> | <code><a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps">IPublicHostedZoneWithIReusableDelegationSetProps</a></code> | Properties for configuring the reusable delegation set and organization. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

##### `id`<sup>Required</sup> <a name="id" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.id"></a>

- *Type:* string

The unique identifier for this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.Initializer.parameter.props"></a>

- *Type:* <a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps">IPublicHostedZoneWithIReusableDelegationSetProps</a>

Properties for configuring the reusable delegation set and organization.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.addZone">addZone</a></code> | Adds a new public hosted zone. |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role">createRoute53Role</a></code> | Creates a cross-account Route 53 role for a specific hosted zone. |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM">shareZoneWithRAM</a></code> | Shares the hosted zone with AWS Resource Access Manager (RAM). |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.updateDomainNS">updateDomainNS</a></code> | Updates the name servers for a given domain. |

---

##### `toString` <a name="toString" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addZone` <a name="addZone" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.addZone"></a>

```typescript
public addZone(zoneName: string): void
```

Adds a new public hosted zone.

###### `zoneName`<sup>Required</sup> <a name="zoneName" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.addZone.parameter.zoneName"></a>

- *Type:* string

The domain name for the hosted zone.

---

##### `createRoute53Role` <a name="createRoute53Role" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role"></a>

```typescript
public createRoute53Role(ou: string, zoneName: string, domain: string): void
```

Creates a cross-account Route 53 role for a specific hosted zone.

###### `ou`<sup>Required</sup> <a name="ou" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.ou"></a>

- *Type:* string

The organizational unit to assign the role to.

---

###### `zoneName`<sup>Required</sup> <a name="zoneName" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.zoneName"></a>

- *Type:* string

The name of the hosted zone.

---

###### `domain`<sup>Required</sup> <a name="domain" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.domain"></a>

- *Type:* string

The domain name of the hosted zone.

---

##### `shareZoneWithRAM` <a name="shareZoneWithRAM" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM"></a>

```typescript
public shareZoneWithRAM(domain: string, orgOUIds: string[], allowExternal?: boolean): void
```

Shares the hosted zone with AWS Resource Access Manager (RAM).

###### `domain`<sup>Required</sup> <a name="domain" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM.parameter.domain"></a>

- *Type:* string

The domain name of the zone.

---

###### `orgOUIds`<sup>Required</sup> <a name="orgOUIds" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM.parameter.orgOUIds"></a>

- *Type:* string[]

The list of organizational unit IDs to share with.

---

###### `allowExternal`<sup>Optional</sup> <a name="allowExternal" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM.parameter.allowExternal"></a>

- *Type:* boolean

Whether to allow sharing with external accounts.

---

##### `updateDomainNS` <a name="updateDomainNS" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.updateDomainNS"></a>

```typescript
public updateDomainNS(zoneName: string): void
```

Updates the name servers for a given domain.

###### `zoneName`<sup>Required</sup> <a name="zoneName" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.updateDomainNS.parameter.zoneName"></a>

- *Type:* string

The domain name whose name servers are to be updated.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.isConstruct"></a>

```typescript
import { PublicHostedZoneWithReusableDelegationSet } from 'RouteMaster'

PublicHostedZoneWithReusableDelegationSet.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.PublicHostedZoneWithReusableDelegationSet.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="RouteMaster.PublicHostedZoneWithReusableDelegationSet.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### ReusableDelegationSet <a name="ReusableDelegationSet" id="RouteMaster.ReusableDelegationSet"></a>

Creates reusable delegation set in Route53 with custom resource.

https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-reusable-delegation-set

#### Initializers <a name="Initializers" id="RouteMaster.ReusableDelegationSet.Initializer"></a>

```typescript
import { ReusableDelegationSet } from 'RouteMaster'

new ReusableDelegationSet(scope: Construct, id: string, props: IReusableDelegationSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.ReusableDelegationSet.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#RouteMaster.ReusableDelegationSet.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#RouteMaster.ReusableDelegationSet.Initializer.parameter.props">props</a></code> | <code><a href="#RouteMaster.IReusableDelegationSetProps">IReusableDelegationSetProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="RouteMaster.ReusableDelegationSet.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="RouteMaster.ReusableDelegationSet.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="RouteMaster.ReusableDelegationSet.Initializer.parameter.props"></a>

- *Type:* <a href="#RouteMaster.IReusableDelegationSetProps">IReusableDelegationSetProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#RouteMaster.ReusableDelegationSet.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="RouteMaster.ReusableDelegationSet.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#RouteMaster.ReusableDelegationSet.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="RouteMaster.ReusableDelegationSet.isConstruct"></a>

```typescript
import { ReusableDelegationSet } from 'RouteMaster'

ReusableDelegationSet.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="RouteMaster.ReusableDelegationSet.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.ReusableDelegationSet.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#RouteMaster.ReusableDelegationSet.property.delegationSetId">delegationSetId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#RouteMaster.ReusableDelegationSet.property.nameServers">nameServers</a></code> | <code>string[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="RouteMaster.ReusableDelegationSet.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `delegationSetId`<sup>Required</sup> <a name="delegationSetId" id="RouteMaster.ReusableDelegationSet.property.delegationSetId"></a>

```typescript
public readonly delegationSetId: string;
```

- *Type:* string

---

##### `nameServers`<sup>Required</sup> <a name="nameServers" id="RouteMaster.ReusableDelegationSet.property.nameServers"></a>

```typescript
public readonly nameServers: string[];
```

- *Type:* string[]

---


### SetRamShareWithAwsOrganization <a name="SetRamShareWithAwsOrganization" id="RouteMaster.SetRamShareWithAwsOrganization"></a>

Configures RAM service to work with AWS Organizations https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html Must run in the management account.

#### Initializers <a name="Initializers" id="RouteMaster.SetRamShareWithAwsOrganization.Initializer"></a>

```typescript
import { SetRamShareWithAwsOrganization } from 'RouteMaster'

new SetRamShareWithAwsOrganization(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.SetRamShareWithAwsOrganization.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#RouteMaster.SetRamShareWithAwsOrganization.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="RouteMaster.SetRamShareWithAwsOrganization.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="RouteMaster.SetRamShareWithAwsOrganization.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#RouteMaster.SetRamShareWithAwsOrganization.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="RouteMaster.SetRamShareWithAwsOrganization.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#RouteMaster.SetRamShareWithAwsOrganization.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="RouteMaster.SetRamShareWithAwsOrganization.isConstruct"></a>

```typescript
import { SetRamShareWithAwsOrganization } from 'RouteMaster'

SetRamShareWithAwsOrganization.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="RouteMaster.SetRamShareWithAwsOrganization.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.SetRamShareWithAwsOrganization.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="RouteMaster.SetRamShareWithAwsOrganization.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---




## Protocols <a name="Protocols" id="Protocols"></a>

### IPublicHostedZoneWithIReusableDelegationSetProps <a name="IPublicHostedZoneWithIReusableDelegationSetProps" id="RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps"></a>

- *Implemented By:* <a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps">IPublicHostedZoneWithIReusableDelegationSetProps</a>

Properties for configuring a public hosted zone with a reusable delegation set.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.delegationSet">delegationSet</a></code> | <code><a href="#RouteMaster.ReusableDelegationSet">ReusableDelegationSet</a></code> | The reusable delegation set to associate with the public hosted zone. |
| <code><a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgAccountId">orgAccountId</a></code> | <code>string</code> | The account ID of the AWS Organizations management account. |
| <code><a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgId">orgId</a></code> | <code>string</code> | The AWS Organizations ID of the organization. |
| <code><a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgRootId">orgRootId</a></code> | <code>string</code> | The root ID of the AWS Organizations root. |
| <code><a href="#RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.comment">comment</a></code> | <code>string</code> | A comment for the hosted zone configuration. |

---

##### `delegationSet`<sup>Required</sup> <a name="delegationSet" id="RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.delegationSet"></a>

```typescript
public readonly delegationSet: ReusableDelegationSet;
```

- *Type:* <a href="#RouteMaster.ReusableDelegationSet">ReusableDelegationSet</a>

The reusable delegation set to associate with the public hosted zone.

---

##### `orgAccountId`<sup>Required</sup> <a name="orgAccountId" id="RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgAccountId"></a>

```typescript
public readonly orgAccountId: string;
```

- *Type:* string

The account ID of the AWS Organizations management account.

---

##### `orgId`<sup>Required</sup> <a name="orgId" id="RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgId"></a>

```typescript
public readonly orgId: string;
```

- *Type:* string

The AWS Organizations ID of the organization.

---

##### `orgRootId`<sup>Required</sup> <a name="orgRootId" id="RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.orgRootId"></a>

```typescript
public readonly orgRootId: string;
```

- *Type:* string

The root ID of the AWS Organizations root.

---

##### `comment`<sup>Optional</sup> <a name="comment" id="RouteMaster.IPublicHostedZoneWithIReusableDelegationSetProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string

A comment for the hosted zone configuration.

---

### IReusableDelegationSetProps <a name="IReusableDelegationSetProps" id="RouteMaster.IReusableDelegationSetProps"></a>

- *Implemented By:* <a href="#RouteMaster.IReusableDelegationSetProps">IReusableDelegationSetProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#RouteMaster.IReusableDelegationSetProps.property.callerReference">callerReference</a></code> | <code>string</code> | https://docs.aws.amazon.com/Route53/latest/APIReference/API_CreateHostedZone.html#Route53-CreateHostedZone-request-CallerReference. |
| <code><a href="#RouteMaster.IReusableDelegationSetProps.property.hostedZoneId">hostedZoneId</a></code> | <code>string</code> | Optional property to create delegation set for existing zone id. |

---

##### `callerReference`<sup>Required</sup> <a name="callerReference" id="RouteMaster.IReusableDelegationSetProps.property.callerReference"></a>

```typescript
public readonly callerReference: string;
```

- *Type:* string

https://docs.aws.amazon.com/Route53/latest/APIReference/API_CreateHostedZone.html#Route53-CreateHostedZone-request-CallerReference.

A string to identify request in retries, required by Route53 client. Example: "r53-set-1"

---

##### `hostedZoneId`<sup>Optional</sup> <a name="hostedZoneId" id="RouteMaster.IReusableDelegationSetProps.property.hostedZoneId"></a>

```typescript
public readonly hostedZoneId: string;
```

- *Type:* string

Optional property to create delegation set for existing zone id.

---

