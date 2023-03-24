[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / AssetsTransferApi

# Class: AssetsTransferApi

## Table of contents

### Constructors

- [constructor](AssetsTransferApi.md#constructor)

### Properties

- [\_api](AssetsTransferApi.md#_api)
- [\_info](AssetsTransferApi.md#_info)
- [\_safeXcmVersion](AssetsTransferApi.md#_safexcmversion)

### Methods

- [createTransferTransaction](AssetsTransferApi.md#createtransfertransaction)

## Constructors

### constructor

• **new AssetsTransferApi**(`api`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `ApiPromise` |

#### Defined in

[AssetsTransferApi.ts:38](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/AssetsTransferApi.ts#L38)

## Properties

### \_api

• `Readonly` **\_api**: `ApiPromise`

#### Defined in

[AssetsTransferApi.ts:34](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/AssetsTransferApi.ts#L34)

___

### \_info

• `Readonly` **\_info**: `Promise`<[`IChainInfo`](../interfaces/internal_.IChainInfo.md)\>

#### Defined in

[AssetsTransferApi.ts:35](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/AssetsTransferApi.ts#L35)

___

### \_safeXcmVersion

• `Readonly` **\_safeXcmVersion**: `Promise`<`u32`\>

#### Defined in

[AssetsTransferApi.ts:36](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/AssetsTransferApi.ts#L36)

## Methods

### createTransferTransaction

▸ **createTransferTransaction**<`T`\>(`destChainId`, `destAddr`, `assetIds`, `amounts`, `opts?`): `Promise`<[`TxResult`](../interfaces/internal_.TxResult.md)<`T`\>\>

Create an asset transfer transaction. This can be either locally on a systems parachain,
or between chains using xcm.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Format`](../modules/internal_.md#format) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destChainId` | `string` | ID of the destination (para) chain (‘0’ for Relaychain) |
| `destAddr` | `string` | Address of destination account |
| `assetIds` | `string`[] | Array of assetId's to be transferred (‘0’ for Native Relay Token) |
| `amounts` | `string`[] | Array of the amounts of each token to transfer |
| `opts?` | [`ITransferArgsOpts`](../interfaces/internal_.ITransferArgsOpts.md)<`T`\> | Options |

#### Returns

`Promise`<[`TxResult`](../interfaces/internal_.TxResult.md)<`T`\>\>

#### Defined in

[AssetsTransferApi.ts:54](https://github.com/paritytech/asset-transfer-api/blob/96cf018/src/AssetsTransferApi.ts#L54)
