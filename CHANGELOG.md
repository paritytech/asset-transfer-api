# Changelog

## [0.1.3](https://github.com/paritytech/asset-transfer-api/compare/v0.1.2..v0.1.3)(2023-11-07)

## Features

- feat: support para to para xcm tx construction

## Fix

- fix: sorting bug for ascending assets
- fix: add Ethereum address check in createBeneficiary for ParaToPara direction
- fix(internal): refactor dest and beneficiary types generators
- fix(internal): Refactor multiassets creation, and xcm types
- fix(internal): refactor all weight limits to not use createType
- fix(internal): remove createType(Call) where applicable
- fix(registry): update asset-registry to inlcude extra foreign assets

## Test

- test: add foreign assets script to test network
- test: add liquid assets script to test network
- test: fix jest tests running twice

## Docs

- docs: update the README with corrections

## Chore

- chore: chore(yarn): bump yarn to 3.6.2
- chore: bump actions/setup-node from 3 to 4

## [0.1.2](https://github.com/paritytech/asset-transfer-api/compare/v0.1.1..v0.1.2)(2023-09-26)

## Fix

- fix: rococo initialization in the registry ([#297](https://github.com/paritytech/asset-transfer-api/pull/297))

NOTE: 

In order to use rococo's asset hub with the `AssetTransferApi` one will need to hardcode the `specName` into the initialization like the following:

```typescript
new AssetTransferApi(api, `asset-hub-rococo`, xcmVersion);
```

The reason being, kusama's asset hub and and rococo's asset-hub both share the same specName currently and will cause conflicts. We currently do an overewrite in the registry that the api uses and set the `specName` for rococo's asset hub to be `asset-hub-rococo`. This is on the horizon to get solved on the actual chain itself soon, so this wont be necessary in the coming future. 

## Docs

- docs: Fixed typos ([#296](https://github.com/paritytech/asset-transfer-api/pull/296))

## [0.1.1](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0..v0.1.1)(2023-09-25)

## Features

- feat: add rococo support and to the registry ([#293](https://github.com/paritytech/asset-transfer-api/pull/293))

## Fix

- fix(internal): remove getChainIdBySpecName and add caching system ([#288](https://github.com/paritytech/asset-transfer-api/pull/288))
- fix(internal): remove all use of MultiLocation, and use correct versioned type. ([#292](https://github.com/paritytech/asset-transfer-api/pull/292))
- fix: update the registry to the new xcAssets format ([#284](https://github.com/paritytech/asset-transfer-api/pull/284))

## Docs

- docs: Improve README.md ([#291](https://github.com/paritytech/asset-transfer-api/pull/291))

## [0.1.0](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-beta.5..v0.1.0)(2023-09-19)

## Summary

This release assumes the following is stable, and tested. The api is still not fully featured as we don't have support for certain things which will be listed below. Please review the documentation in the [README.md](https://github.com/paritytech/asset-transfer-api/blob/main/README.md) for any information, and feel free to file an issue if anything is unclear. 

What is not supported:

- ParaToPara
- ParaToRelay
- NFTs

What is supported:

- SystemToPara (native assets, foreign assets, liquid pool assets, CrossChain Transfers)
- SystemToRelay (Native relay token, CrossChain Transfers)
- RelayToParachain (Native relay token, CrossChain Transfers)
- RelayToSystem (Native relay token, CrossChain Transfers)
- SystemToSystem (Native relay token, CrossChain Transfers)
- ParaToSystem (Asset Hub assets, foreign assets, CrossChain Transfers via either Xtokens, or polkadotXcm pallet).
    - NOTE: There is a performance bottleneck currently with the construction of xtokens pallet transfers. This is actively being looked into and will be resovled soon.
- Decoding extrinsics
- Estimating fees of extrinsics
- Registry lookup

## Breaking Change

- fix!: replace AssetsTransferApi with AssetTransferApi

## Docs

- docs: enhance the documentation and add inline code examples
- docs: update readme, and add use case examples

## [0.1.0-beta.5](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-beta.4..v0.1.0-beta.5)(2023-09-13)

## Features

- feat: support construction of teleports for parachains' primary native assets to AssetHub
- feat: add disabled options config and function

## Fix

- fix: adjust fetchPalletInstanceId to handle ForeignAssets pallet
- fix: remove remaining use of parseInt

## Chore

- chore: bump actions/checkout from 3 to 4
- chore(lint): change print-width for prettier to 120

## [0.1.0-beta.4](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-beta.3..v0.1.0-beta.4)(2023-08-30)

## Features

- feat: sendersAddr, add options validation, and fix payload format
- feat: add cache to registry

## Fix

- fix: weight limit check issue
- fix: Re-implement AssetHub ForeignAsset queries
- fix: add ENUM for organizing error, and apply to stack
- fix: resolve TODO for destId for relay chains
- fix: empty string assetId Balances bug for local tx
- fix: replace all unsafe instances of parseInt
- fix: unused conditional, and DRY cache logic in checkParaAssets

## Docs

- docs: update README & docs

## Chore

- chore(yarn): bump yarn

## CI

- ci: semantic title check

## [0.1.0-beta.3](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-beta.2..v0.1.0-beta.3)(2023-08-21)

## Fix

- fix: Update System Parachain Id check based on chainId 
- fix: remove incorrect reference to '0' for Native Relay Token

## Features

- feat: add poolAssets support
- feat: add support for xTokens pallet

## Docs

- docs: update README.md 

## Chore

- chore(deps): bump word-wrap from 1.2.3 to 1.2.5
- chore(examples): add payload paysWithFeeOrigin example
- chore(deps): bump semver from 6.3.0 to 6.3.1
- chore: update naming to support AssetHub specnames 

## [0.1.0-beta.2](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-beta.1..v0.1.0-beta.2)(2023-08-09)

## Fix

- fix: added unpaidExecution for testnet XCM message

## Features

- feat: ParaToSystem
- feat: SystemToSystem
- feat: add support for foreign asset multilocations

## Chore

- chore: cleanup tech debt
- chore(yarn): bump yarn
- chore: remove grocers' apostrophe

## [0.1.0-beta.1](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-beta.0..v0.1.0-beta.1)(2023-06-21)

## Chore

- chore(registry): update registry

## [0.1.0-beta.0](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-alpha.5..v0.1.0-beta.0)(2023-06-16)

### Stable Beta is here!

- Add `AssetsTransferApi.fetchFeeInfo`
- Add `AssetsTransferApi.regsitry` which exposes a bunch of useful functionality now. Check out the following [PR #183](https://github.com/paritytech/asset-transfer-api/pull/183)
- Implement `paysWithFeeOrigin` as an option for `AssetsTransferApi.createTransferTransaction`
- Fix type issues for `SystemToPara`
- Add examples
- Update polkadot-js deps
- More verbose errors for when multiple identical assets symbols exists in the same registry.
- Fix ascending order for multiple multi assets for `SystemToPara`.
- Export types at top level.
- Add `dest`, and `origin` to `TxResult<T>`.
- Update `fetchFeeInfo` to take in `call`, and `payload` types.

NOTE - The API is considered stable for the following direction:

- RelayToPara
- RelayToSystem
- SystemToRelay
- SystemToPara

## [0.1.0-alpha.5](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-alpha.4..v0.1.0-alpha.5)(2023-06-07)

- Breaking Change: Rework `AssetTransferApi` constructor, and `constructApiPromise`
- Check primitive and object types for `createTransferTransaction` inputs
- Fix CI set-output
- Add function to get General Index of a valid token symbol
- Ensure a user can input a native token symbol or an empty array for relay directions
- Update tests to use v9420 metadata
- Add `decodeExtrinsic` to `AssetsTransferApi`
- Add balances pallet support for local transfers on relay, and system parachains
- Set `RelayToPara` AssetType explicitly to Foreign
- Ensure MultiAsset Ordering

## [0.1.0-alpha.4](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-alpha.3..v0.1.0-alpha.4)(2023-05-30)

- change isNative to isRelayNative for System to Para 
- Add additional xcmDirection validation checks, fix SystemToRelay AssetType

## [0.1.0-alpha.3](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-alpha.2..v0.1.0-alpha.3) (2023-05-30)

- Fix bug in args passed into ext construction

## [0.1.0-alpha.2](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-alpha.1..v0.1.0-alpha.2) (2023-05-29)

- Update polkadot-js deps
- Support for Ethereum addresses
- Proper xcm input validation for assetIds
- Fix xcm construction of parents field for SystemToPara
- Add teleport logic for native vs foreign assets
- Add fee estimation
- Improve github pages docs
- Add registry functionality, as well as `injectedRegistry`
- Add V3 support, and remove V1 and V0 support

## [0.1.0-alpha.1](https://github.com/paritytech/asset-transfer-api/compare/v0.1.0-alpha.0..v0.1.0-alpha.1) (2023-03-21)

- Include V1 and V0 support
- Add local transaction support
- Fix local types
- Update polkadot-js deps

## [0.1.0-alpha.0](https://github.com/paritytech/asset-transfer-api/reelases/v0.1.0-alpha.0)

- First Alpha release
