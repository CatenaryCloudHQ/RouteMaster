# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

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
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role">createRoute53Role</a></code> | Creates a cross-account Route 53 role for a specific hosted zone. |
| <code><a href="#@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM">shareZoneWithRAM</a></code> | Shares the hosted zone with AWS Resource Access Manager (RAM). |
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
public createRoute53Role(ou: string, zoneName: string, domain: string): void
```

Creates a cross-account Route 53 role for a specific hosted zone.

###### `ou`<sup>Required</sup> <a name="ou" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.ou"></a>

- *Type:* string

The organizational unit to assign the role to.

---

###### `zoneName`<sup>Required</sup> <a name="zoneName" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.zoneName"></a>

- *Type:* string

The name of the hosted zone.

---

###### `domain`<sup>Required</sup> <a name="domain" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.createRoute53Role.parameter.domain"></a>

- *Type:* string

The domain name of the hosted zone.

---

##### `shareZoneWithRAM` <a name="shareZoneWithRAM" id="@catenarycloud/routemaster.PublicHostedZoneWithReusableDelegationSet.shareZoneWithRAM"></a>

```typescript
public shareZoneWithRAM(domain: string, orgOUIds: string[], allowExternal?: boolean): void
```

Shares the hosted zone with AWS Resource Access Manager (RAM).

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

