[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / [<internal\>](../modules/internal_.md) / TxResult

# Interface: TxResult<T\>

[<internal>](../modules/internal_.md).TxResult

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [direction](internal_.TxResult.md#direction)
- [format](internal_.TxResult.md#format)
- [method](internal_.TxResult.md#method)
- [tx](internal_.TxResult.md#tx)
- [xcmVersion](internal_.TxResult.md#xcmversion)

## Properties

### direction

• **direction**: [`IDirection`](../enums/internal_.IDirection.md) \| ``"local"``

#### Defined in

[types.ts:50](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L50)

___

### format

• **format**: `string`

#### Defined in

[types.ts:48](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L48)

___

### method

• **method**: [`IMethods`](../modules/internal_.md#imethods)

#### Defined in

[types.ts:51](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L51)

___

### tx

• **tx**: [`ConstructedFormat`](../modules/internal_.md#constructedformat)<`T`\>

#### Defined in

[types.ts:52](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L52)

___

### xcmVersion

• **xcmVersion**: ``null`` \| `number`

#### Defined in

[types.ts:49](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/types.ts#L49)
