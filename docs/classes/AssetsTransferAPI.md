[@substrate/asset-transfer-api](../README.md) / [Exports](../modules.md) / AssetsTransferAPI

# Class: AssetsTransferAPI

## Table of contents

### Constructors

- [constructor](AssetsTransferAPI.md#constructor)

### Properties

- [\_api](AssetsTransferAPI.md#_api)
- [\_info](AssetsTransferAPI.md#_info)
- [\_safeXcmVersion](AssetsTransferAPI.md#_safexcmversion)

### Methods

- [createTransferTransaction](AssetsTransferAPI.md#createtransfertransaction)
- [estimateFee](AssetsTransferAPI.md#estimatefee)

## Constructors

### constructor

• **new AssetsTransferAPI**(`api`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `ApiPromise` |

#### Defined in

[AssetsTransferAPI.ts:31](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/AssetsTransferAPI.ts#L31)

## Properties

### \_api

• `Readonly` **\_api**: `ApiPromise`

#### Defined in

[AssetsTransferAPI.ts:27](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/AssetsTransferAPI.ts#L27)

___

### \_info

• `Readonly` **\_info**: `Promise`<[`IChainInfo`](../interfaces/internal_.IChainInfo.md)\>

#### Defined in

[AssetsTransferAPI.ts:28](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/AssetsTransferAPI.ts#L28)

___

### \_safeXcmVersion

• `Readonly` **\_safeXcmVersion**: `Promise`<`u32`\>

#### Defined in

[AssetsTransferAPI.ts:29](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/AssetsTransferAPI.ts#L29)

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

[AssetsTransferAPI.ts:47](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/AssetsTransferAPI.ts#L47)

___

### estimateFee

▸ **estimateFee**(`tx`): `void`

Return a partialFee of the

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `string` \| `Bytes` | Transaction to estimate the fee for |

#### Returns

`void`

#### Defined in

[AssetsTransferAPI.ts:108](https://github.com/paritytech/asset-transfer-api/blob/747fa4b/src/AssetsTransferAPI.ts#L108)
