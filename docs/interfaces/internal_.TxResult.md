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

[types.ts:36](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L36)

___

### format

• **format**: `string`

#### Defined in

[types.ts:34](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L34)

___

### method

• **method**: [`IMethods`](../modules/internal_.md#imethods)

#### Defined in

[types.ts:37](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L37)

___

### tx

• **tx**: [`ConstructedFormat`](../modules/internal_.md#constructedformat)<`T`\>

#### Defined in

[types.ts:38](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L38)

___

### xcmVersion

• **xcmVersion**: ``null`` \| `number`

#### Defined in

[types.ts:35](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L35)
