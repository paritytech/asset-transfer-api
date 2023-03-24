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

- [ConstructedFormat](internal_.md#constructedformat)
- [Format](internal_.md#format)
- [IMethods](internal_.md#imethods)

## Type Aliases

### ConstructedFormat

Ƭ **ConstructedFormat**<`T`\>: `T` extends ``"payload"`` ? \`0x${string}\` : `T` extends ``"call"`` ? \`0x${string}\` : `T` extends ``"submittable"`` ? `SubmittableExtrinsic`<``"promise"``, `ISubmittableResult`\> : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types.ts:17](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L17)

___

### Format

Ƭ **Format**: ``"payload"`` \| ``"call"`` \| ``"submittable"``

#### Defined in

[types.ts:15](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L15)

___

### IMethods

Ƭ **IMethods**: ``"transfer"`` \| ``"transferKeepAlive"`` \| ``"reserveTransferAssets"`` \| ``"limitedReserveTransferAssets"`` \| ``"teleportAssets"`` \| ``"limitedTeleportAssets"``

#### Defined in

[types.ts:25](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L25)
