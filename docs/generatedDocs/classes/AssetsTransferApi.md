[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / AssetsTransferApi

# Class: AssetsTransferApi

## Table of contents

### Constructors

- [constructor](AssetsTransferApi.md#constructor)

### Properties

- [\_api](AssetsTransferApi.md#_api)
- [\_info](AssetsTransferApi.md#_info)
- [\_opts](AssetsTransferApi.md#_opts)
- [\_registry](AssetsTransferApi.md#_registry)
- [\_safeXcmVersion](AssetsTransferApi.md#_safexcmversion)

### Methods

- [createTransferTransaction](AssetsTransferApi.md#createtransfertransaction)

## Constructors

### constructor

• **new AssetsTransferApi**(`api`, `opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `ApiPromise` |
| `opts` | [`IAssetsTransferApiOpts`](../modules/internal_.md#iassetstransferapiopts) |

#### Defined in

[AssetsTransferApi.ts:43](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L43)

## Properties

### \_api

• `Readonly` **\_api**: `ApiPromise`

#### Defined in

[AssetsTransferApi.ts:37](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L37)

___

### \_info

• `Readonly` **\_info**: `Promise`<[`IChainInfo`](../interfaces/internal_.IChainInfo.md)\>

#### Defined in

[AssetsTransferApi.ts:39](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L39)

___

### \_opts

• `Readonly` **\_opts**: [`IAssetsTransferApiOpts`](../modules/internal_.md#iassetstransferapiopts)

#### Defined in

[AssetsTransferApi.ts:38](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L38)

___

### \_registry

• `Readonly` **\_registry**: [`ChainInfoRegistry`](../modules/internal_.md#chaininforegistry)

#### Defined in

[AssetsTransferApi.ts:41](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L41)

___

### \_safeXcmVersion

• `Readonly` **\_safeXcmVersion**: `Promise`<`u32`\>

#### Defined in

[AssetsTransferApi.ts:40](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L40)

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

[AssetsTransferApi.ts:61](https://github.com/Rymul/asset-transfer-api/blob/e89a971/src/AssetsTransferApi.ts#L61)
