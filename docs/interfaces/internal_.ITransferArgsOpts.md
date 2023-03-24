[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / [<internal\>](../modules/internal_.md) / ITransferArgsOpts

# Interface: ITransferArgsOpts<T\>

[<internal>](../modules/internal_.md).ITransferArgsOpts

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Format`](../modules/internal_.md#format) |

## Table of contents

### Properties

- [format](internal_.ITransferArgsOpts.md#format)
- [isLimited](internal_.ITransferArgsOpts.md#islimited)
- [keepAlive](internal_.ITransferArgsOpts.md#keepalive)
- [payFeeWith](internal_.ITransferArgsOpts.md#payfeewith)
- [payFeeWithTo](internal_.ITransferArgsOpts.md#payfeewithto)
- [weightLimit](internal_.ITransferArgsOpts.md#weightlimit)
- [xcmVersion](internal_.ITransferArgsOpts.md#xcmversion)

## Properties

### format

• `Optional` **format**: `T`

Option that specifies the format in which to return a transaction.
It can either be a `payload`, `call`, or `submittable`.

Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
a `payload` or `call` will return a hex.

#### Defined in

[types.ts:49](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L49)

___

### isLimited

• `Optional` **isLimited**: `boolean`

Boolean to declare if this will be with limited XCM transfers.
Deafult is unlimited.

#### Defined in

[types.ts:64](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L64)

___

### keepAlive

• `Optional` **keepAlive**: `boolean`

For creating local asset transfers, this will allow for a `transferKeepAlive` as oppose
to a `transfer`.

#### Defined in

[types.ts:79](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L79)

___

### payFeeWith

• `Optional` **payFeeWith**: `string`

AssetId to pay fee's on the current common good parachain.
Statemint: default DOT
Statemine: default KSM

#### Defined in

[types.ts:55](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L55)

___

### payFeeWithTo

• `Optional` **payFeeWithTo**: `string`

AssetId to pay fee's on the destination parachain.

#### Defined in

[types.ts:59](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L59)

___

### weightLimit

• `Optional` **weightLimit**: `string`

When isLimited is true, the option for applying a weightLimit is possible.
If not inputted it will default to `Unlimited`.

#### Defined in

[types.ts:69](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L69)

___

### xcmVersion

• `Optional` **xcmVersion**: `number`

Set the xcmVersion for message construction. If this is not present a supported version
will be queried, and if there is no supported version a safe version will be queried.

#### Defined in

[types.ts:74](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/types.ts#L74)
