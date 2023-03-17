[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / <internal\>

# Module: <internal\>

## Table of contents

### Enumerations

- [IDirection](../enums/internal_.IDirection.md)

### Interfaces

- [IChainInfo](../interfaces/internal_.IChainInfo.md)
- [ITransferArgsOpts](../interfaces/internal_.ITransferArgsOpts.md)

### Type Aliases

- [ConstructedFormat](internal_.md#constructedformat)
- [Format](internal_.md#format)

## Type Aliases

### ConstructedFormat

Ƭ **ConstructedFormat**<`T`\>: `T` extends ``"payload"`` ? \`0x${string}\` : `T` extends ``"call"`` ? \`0x${string}\` : `T` extends ``"submittable"`` ? `SubmittableExtrinsic`<``"promise"``, `ISubmittableResult`\> : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types.ts:15](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/types.ts#L15)

___

### Format

Ƭ **Format**: ``"payload"`` \| ``"call"`` \| ``"submittable"``

#### Defined in

[types.ts:13](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/types.ts#L13)
