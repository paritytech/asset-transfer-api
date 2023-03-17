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

AssetsTransferApi.ts:32

## Properties

### \_api

• `Readonly` **\_api**: `ApiPromise`

#### Defined in

AssetsTransferApi.ts:28

___

### \_info

• `Readonly` **\_info**: `Promise`<[`IChainInfo`](../interfaces/internal_.IChainInfo.md)\>

#### Defined in

AssetsTransferApi.ts:29

___

### \_safeXcmVersion

• `Readonly` **\_safeXcmVersion**: `Promise`<`u32`\>

#### Defined in

AssetsTransferApi.ts:30

## Methods

### createTransferTransaction

▸ **createTransferTransaction**<`T`\>(`destChainId`, `destAddr`, `assetIds`, `amounts`, `opts?`): `Promise`<[`ConstructedFormat`](../modules/internal_.md#constructedformat)<`T`\>\>

Create an XCM transaction to transfer Assets, or native tokens from one
chain to another.

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

`Promise`<[`ConstructedFormat`](../modules/internal_.md#constructedformat)<`T`\>\>

#### Defined in

AssetsTransferApi.ts:48
