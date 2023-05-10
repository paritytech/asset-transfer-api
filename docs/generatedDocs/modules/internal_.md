[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / <internal\>

# Module: <internal\>

## Table of contents

### Enumerations

- [IDirection](../enums/internal_.IDirection.md)

### Interfaces

- [IChainInfo](../interfaces/internal_.IChainInfo.md)
- [ITransferArgsOpts](../interfaces/internal_.ITransferArgsOpts.md)
- [TxResult](../interfaces/internal_.TxResult.md)

### Type Aliases

- [ChainInfo](internal_.md#chaininfo)
- [ChainInfoRegistry](internal_.md#chaininforegistry)
- [ConstructedFormat](internal_.md#constructedformat)
- [Format](internal_.md#format)
- [IAssetsTransferApiOpts](internal_.md#iassetstransferapiopts)
- [IMethods](internal_.md#imethods)
- [RequireAtLeastOne](internal_.md#requireatleastone)

## Type Aliases

### ChainInfo

Ƭ **ChainInfo**: `Object`

#### Index signature

▪ [x: `string`]: { `assetIds`: `number`[] ; `specName`: `string` ; `tokens`: `string`[]  }

#### Defined in

[registry/types.ts:3](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/registry/types.ts#L3)

___

### ChainInfoRegistry

Ƭ **ChainInfoRegistry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `kusama` | [`ChainInfo`](internal_.md#chaininfo) |
| `polkadot` | [`ChainInfo`](internal_.md#chaininfo) |
| `westend` | [`ChainInfo`](internal_.md#chaininfo) |

#### Defined in

[registry/types.ts:11](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/registry/types.ts#L11)

___

### ConstructedFormat

Ƭ **ConstructedFormat**<`T`\>: `T` extends ``"payload"`` ? \`0x${string}\` : `T` extends ``"call"`` ? \`0x${string}\` : `T` extends ``"submittable"`` ? `SubmittableExtrinsic`<``"promise"``, `ISubmittableResult`\> : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types.ts:27](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L27)

___

### Format

Ƭ **Format**: ``"payload"`` \| ``"call"`` \| ``"submittable"``

#### Defined in

[types.ts:25](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L25)

___

### IAssetsTransferApiOpts

Ƭ **IAssetsTransferApiOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `injectedRegistry?` | [`RequireAtLeastOne`](internal_.md#requireatleastone)<[`ChainInfoRegistry`](internal_.md#chaininforegistry)\> |

#### Defined in

[types.ts:43](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L43)

___

### IMethods

Ƭ **IMethods**: ``"transfer"`` \| ``"transferKeepAlive"`` \| ``"reserveTransferAssets"`` \| ``"limitedReserveTransferAssets"`` \| ``"teleportAssets"`` \| ``"limitedTeleportAssets"``

#### Defined in

[types.ts:35](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L35)

___

### RequireAtLeastOne

Ƭ **RequireAtLeastOne**<`T`, `Keys`\>: `Pick`<`T`, `Exclude`<keyof `T`, `Keys`\>\> & { [K in Keys]-?: Required<Pick<T, K\>\> & Partial<Pick<T, Exclude<Keys, K\>\>\> }[`Keys`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `Keys` | extends keyof `T` = keyof `T` |

#### Defined in

[types.ts:8](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L8)
