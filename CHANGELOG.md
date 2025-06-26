# Changelog

## [1.0.0](https://github.com/paritytech/asset-transfer-api/compare/v0.7.2..v1.0.0)

### Breaking Changes

- No longer implicitly change XCM version when dealing with ForeignAssets
- Changed default XCM version to 4

### Feat

- feat: Improve fetchSafeXcmVersion to throw error on unsupported versions ([#589](https://github.com/paritytech/asset-transfer-api/pull/589))
- feat: XCM v5 ([#590](https://github.com/paritytech/asset-transfer-api/pull/590))
- feat: Add CI job to unit test code across node versions. ([#583](https://github.com/paritytech/asset-transfer-api/pull/583))

### Refactor

- refactor: Decouple XCM versioning from Direction logic handlers ([#598](https://github.com/paritytech/asset-transfer-api/pull/598))
    - **BREAKING CHANGE**: `xcmVersion` is no longer implicitly change to V4 when dealing with ForeignAssets transfers. `xcmVersion` must be explicitly set to V4 or greater.
- refactor: Consolidate FungibleStrAssetType and FungibleObjAssetType ([#596](https://github.com/paritytech/asset-transfer-api/pull/596))
- refactor: Remove isForeignAssetsTransfer from `fetchCallType` ([#585](https://github.com/paritytech/asset-transfer-api/pull/585))
- refactor: Move to object params for private methods with many arguments ([#584](https://github.com/paritytech/asset-transfer-api/pull/584))

### Fix

- fix: example building + add CI step to catch failure of any example code ([#581](https://github.com/paritytech/asset-transfer-api/pull/581))
- test: fix failing integration test ([#580](https://github.com/paritytech/asset-transfer-api/pull/580))

## Docs

- docs: add top level NOTICE and remove individual copyright headers ([#601](https://github.com/paritytech/asset-transfer-api/pull/601))

### Chore

- chore(deps-dev): bump vitest from 3.2.3 to 3.2.4 ([#599](https://github.com/paritytech/asset-transfer-api/pull/599))
- chore(deps): bump the pjs group across 1 directory with 6 updates ([#595](https://github.com/paritytech/asset-transfer-api/pull/595))
- chore(deps-dev): bump @acala-network/chopsticks-core from 1.0.6 to 1.1.0 ([#593](https://github.com/paritytech/asset-transfer-api/pull/593))
- chore(deps): bump the pjs group with 4 updates ([#594](https://github.com/paritytech/asset-transfer-api/pull/594))
- chore(deps-dev): bump tsx from 4.19.4 to 4.20.3 ([#592](https://github.com/paritytech/asset-transfer-api/pull/592))
- chore(deps-dev): bump @acala-network/chopsticks-testing from 1.0.6 to 1.1.0 ([#591](https://github.com/paritytech/asset-transfer-api/pull/591))
- chore: Update default xcm version from v2 to v4. ([#588](https://github.com/paritytech/asset-transfer-api/pull/588))
    - **BREAKING CHANGE**: Default behaviour may change if xcmVersion has not been explicitly set.
- chore(deps-dev): bump vitest from 3.2.0 to 3.2.3 ([#587](https://github.com/paritytech/asset-transfer-api/pull/587))
- chore(deps): bump @polkadot/types-codec from 16.1.1 to 16.1.2 in the pjs group ([#586](https://github.com/paritytech/asset-transfer-api/pull/586))

### Test

- test: refactor e2e + add simple westend / westend asset hub e2e test ([#579](https://github.com/paritytech/asset-transfer-api/pull/579))


## [0.7.2](https://github.com/paritytech/asset-transfer-api/compare/v0.7.1..v0.7.2)

### Fix

- fix: replace `assert` with `with` to support newer node versions ([#577](https://github.com/paritytech/asset-transfer-api/pull/577))
- fix: dryRun requires xcmVersion, so use safeXcmVersion if none given ([#571](https://github.com/paritytech/asset-transfer-api/pull/571))

### Chore

- chore(deps-dev): bump @acala-network/chopsticks-core from 1.0.5 to 1.0.6 ([#576](https://github.com/paritytech/asset-transfer-api/pull/576))
- chore(deps-dev): bump @acala-network/chopsticks-testing from 1.0.5 to 1.0.6 ([#575](https://github.com/paritytech/asset-transfer-api/pull/575))
- chore(deps): bump @polkadot/types-codec from 16.0.1 to 16.1.1 in the pjs group ([#574](https://github.com/paritytech/asset-transfer-api/pull/574))
- chore(deps-dev): bump vitest from 3.1.4 to 3.2.0 ([#573](https://github.com/paritytech/asset-transfer-api/pull/573))
- chore(deps-dev): bump vitest from 3.1.3 to 3.1.4 ([#568](https://github.com/paritytech/asset-transfer-api/pull/568))
- chore(deps): bump the pjs group with 6 updates ([#567](https://github.com/paritytech/asset-transfer-api/pull/567))
- chore(deps-dev): bump typedoc from 0.28.4 to 0.28.5 ([#566](https://github.com/paritytech/asset-transfer-api/pull/566))
- chore(deps): bump @polkadot/types-codec from 15.9.2 to 15.10.2 in the pjs group ([#564](https://github.com/paritytech/asset-transfer-api/pull/564))

### Test

- test: Remove moonbeam e2e tests involving asset (+ lint ignore fix) ([#572](https://github.com/paritytech/asset-transfer-api/pull/572))

## [0.7.1](https://github.com/paritytech/asset-transfer-api/compare/v0.7.0..v0.7.1)

### Fix

- feat: Add ESM support while maintaining CJS support ([#561](https://github.com/paritytech/asset-transfer-api/pull/561))

## [0.7.0](https://github.com/paritytech/asset-transfer-api/compare/v0.6.1..v0.7.0)

### Fix

- fix: add xcmVersion arg to DryRunCall ([#553](https://github.com/paritytech/asset-transfer-api/pull/553))([5cda6e6](https://github.com/paritytech/asset-transfer-api/commit/5cda6e61a260cebefd865524622f95df15cb08ba))

  BREAKING CHANGE
  - The `DryRunCall` now takes also the `xcmVersion` as an argument.

### Docs

- docs: fix broken relative path to e2e examples ([#555](https://github.com/paritytech/asset-transfer-api/pull/555))([820003d](https://github.com/paritytech/asset-transfer-api/commit/820003ddf2119b9d2824fd42dff3312cba86d695))

### Chore

- chore(deps): update deps ([#554](https://github.com/paritytech/asset-transfer-api/pull/554))([04e3de3](https://github.com/paritytech/asset-transfer-api/commit/04e3de3884b13c0b264141a13ffd564bf227c86a))
- chore(deps-dev): bump typedoc from 0.28.3 to 0.28.4 ([#552](https://github.com/paritytech/asset-transfer-api/pull/552))([6eede23](https://github.com/paritytech/asset-transfer-api/commit/6eede236bc45c0578f0e1c0b5ab62d9aa8fb4ac0))
- chore(deps-dev): bump vitest from 3.1.2 to 3.1.3 ([#551](https://github.com/paritytech/asset-transfer-api/pull/551))([5ea1dd8](https://github.com/paritytech/asset-transfer-api/commit/5ea1dd8e52baeaed63b9a96c27bca8b420e63127))

## [0.6.1](https://github.com/paritytech/asset-transfer-api/compare/v0.6.0..v0.6.1)

### Chore

- chore(deps): update non pjs deps ([#549](https://github.com/paritytech/asset-transfer-api/pull/549))([67e9f94](https://github.com/paritytech/asset-transfer-api/commit/67e9f94d7f878f9cf9aa286ed405e93998b069b3))
- chore(deps): update polkadot-js deps ([#548](https://github.com/paritytech/asset-transfer-api/pull/548))([45e93fe](https://github.com/paritytech/asset-transfer-api/commit/45e93fe1a52c22d23fddea6955985bdb06f542c4))
- chore(deps): bump the pjs group across 1 directory with 6 updates ([#542](https://github.com/paritytech/asset-transfer-api/pull/542))([26fc6e0](https://github.com/paritytech/asset-transfer-api/commit/26fc6e05477af380e84a37625c5d6342f9f71d8c))
- chore(deps-dev): bump typedoc from 0.28.2 to 0.28.3 ([#541](https://github.com/paritytech/asset-transfer-api/pull/541))([fe6713e](https://github.com/paritytech/asset-transfer-api/commit/fe6713e1824ca86e3ecec4432a6791f467bceb52))
- chore(deps-dev): bump vitest from 3.1.1 to 3.1.2 ([#543](https://github.com/paritytech/asset-transfer-api/pull/543))([04a32e5](https://github.com/paritytech/asset-transfer-api/commit/04a32e57e2bd410b5ff904d6d462dafc0950715f))
- chore(deps): bump @acala-network/chopsticks-core from 1.0.3 to 1.0.4 ([#537](https://github.com/paritytech/asset-transfer-api/pull/537))([e5d923e](https://github.com/paritytech/asset-transfer-api/commit/e5d923eeb9cd4d51ee4a63674964c0c641c5fb4f))
- chore(deps-dev): bump typedoc-theme-hierarchy from 5.0.5 to 6.0.0 ([#535](https://github.com/paritytech/asset-transfer-api/pull/535))([6007bb0](https://github.com/paritytech/asset-transfer-api/commit/6007bb0fd52983b40a53f7c26a78762a480fd401))
- chore(deps): bump @acala-network/chopsticks-testing from 1.0.3 to 1.0.4 ([#536](https://github.com/paritytech/asset-transfer-api/pull/536))([16f0dc5](https://github.com/paritytech/asset-transfer-api/commit/16f0dc5521027e1befbc36953b8a5d7cc955f542))
- chore(deps-dev): bump typedoc from 0.28.1 to 0.28.2 ([#534](https://github.com/paritytech/asset-transfer-api/pull/534))([c0c4495](https://github.com/paritytech/asset-transfer-api/commit/c0c4495b3865c2ea0ae84d82bbd59a5deaece2a0))
- chore(deps-dev): bump typedoc-theme-hierarchy from 5.0.4 to 5.0.5 ([#532](https://github.com/paritytech/asset-transfer-api/pull/532))([7e36951](https://github.com/paritytech/asset-transfer-api/commit/7e369510add74dae5371d53d30845af569b13932))
- chore(deps-dev): bump vitest from 3.0.9 to 3.1.1 ([#531](https://github.com/paritytech/asset-transfer-api/pull/531))([1459c8b](https://github.com/paritytech/asset-transfer-api/commit/1459c8b56384e631fa90b85810410727e51a2089))
- chore(deps): bump the pjs group with 4 updates ([#530](https://github.com/paritytech/asset-transfer-api/pull/530))([e9dde78](https://github.com/paritytech/asset-transfer-api/commit/e9dde78ad2befd7f7a532b364dce85c76a73fcf1))
- chore(deps-dev): bump typedoc-plugin-missing-exports from 3.1.0 to 4.0.0 ([#529](https://github.com/paritytech/asset-transfer-api/pull/529))([5708aa2](https://github.com/paritytech/asset-transfer-api/commit/5708aa2bd210672f16c5539ad8136a334157ac7f))
- chore(deps-dev): bump typedoc from 0.28.0 to 0.28.1 ([#528](https://github.com/paritytech/asset-transfer-api/pull/528))([4411500](https://github.com/paritytech/asset-transfer-api/commit/4411500b5f4992fc981963c03a8c7a74c1eb813b))
- chore(deps-dev): bump vitest from 3.0.8 to 3.0.9 ([#525](https://github.com/paritytech/asset-transfer-api/pull/525))([70f1bd8](https://github.com/paritytech/asset-transfer-api/commit/70f1bd8bee8f9cdba8d0af84369f5c7dd6c810c8))
- chore(deps-dev): bump typedoc from 0.27.9 to 0.28.0 ([#524](https://github.com/paritytech/asset-transfer-api/pull/524))([4e95b4d](https://github.com/paritytech/asset-transfer-api/commit/4e95b4d0243d0578cec6ee59ba1bcbe4aec273ba))

### Fix

- fix: check if X1 exists in multilocation ([#546](https://github.com/paritytech/asset-transfer-api/pull/546))([17874c9](https://github.com/paritytech/asset-transfer-api/commit/17874c91eea6d56afef3ba5c52a95ab75bf8c026))
- fix: add type guards to fix error from getDestinationXcmWeightToFeeAsset ([#540](https://github.com/paritytech/asset-transfer-api/pull/540))([a19b5fc](https://github.com/paritytech/asset-transfer-api/commit/a19b5fcb63c8f12fa1f8f7932affe5b02dade0ce))
- fix: handle error when xcmpaymentapi is not found ([#533](https://github.com/paritytech/asset-transfer-api/pull/533))([8d62f7d](https://github.com/paritytech/asset-transfer-api/commit/8d62f7d3134fb88477fe98477d02c48b98581f70))
- fix: Change package entry point ([#527](https://github.com/paritytech/asset-transfer-api/pull/527))([901482f](https://github.com/paritytech/asset-transfer-api/commit/901482fc36f4f3e1a94e31aee3ec49f1d6ad8af5))

## [0.6.0](https://github.com/paritytech/asset-transfer-api/compare/v0.5.0..v0.6.0)

### Feat

- feat: add dest xcm fee check for forwarded xcms ([#519](https://github.com/paritytech/asset-transfer-api/pull/519))([2a70a42](https://github.com/paritytech/asset-transfer-api/commit/ecc2eccd33eaa9cd25c7bf3fdc2bc37162a70a42))

### Chore

- ([#522](https://github.com/paritytech/asset-transfer-api/pull/522))([81db2f8](https://github.com/paritytech/asset-transfer-api/commit/15b493678a626ef1794230d428341b05681db2f8))
- chore(deps-dev): bump vitest from 3.0.7 to 3.0.8 ([#521](https://github.com/paritytech/asset-transfer-api/pull/521))([9484b42f](https://github.com/paritytech/asset-transfer-api/commit/8f15a3c4d8419d0c9129cf90b8f53bba9484b42f))
- chore(deps): bump the pjs group with 4 updates ([#520](https://github.com/paritytech/asset-transfer-api/pull/520))([8581846](https://github.com/paritytech/asset-transfer-api/commit/a13c7599dce665fa8074fe9fc9fb7589b8581846))
- chore(deps-dev): bump vitest from 3.0.6 to 3.0.7 ([#518](https://github.com/paritytech/asset-transfer-api/pull/518))([0ba31ab](https://github.com/paritytech/asset-transfer-api/commit/fd75866e18995e4329dc9532340a07a220ba31ab))
- chore(deps): bump @acala-network/chopsticks-core from 1.0.2 to 1.0.3 ([#517](https://github.com/paritytech/asset-transfer-api/pull/517))([6ec3325](https://github.com/paritytech/asset-transfer-api/commit/5e291d193af7b77263de6454b403287ba6ec3325))
- chore(deps-dev): bump typedoc from 0.27.8 to 0.27.9 ([#516](https://github.com/paritytech/asset-transfer-api/pull/516))([7da05a6](https://github.com/paritytech/asset-transfer-api/commit/1bc61c26715e993aa1191784b8c9fa3367da05a6))
- chore(deps): bump @acala-network/chopsticks-testing from 1.0.2 to 1.0.3 ([#515](https://github.com/paritytech/asset-transfer-api/pull/515))([73e5f9a](https://github.com/paritytech/asset-transfer-api/commit/b78cd868be1f0a2865d08692d9bcb4cbb73e5f9a))
- chore(deps): bump the pjs group with 4 updates ([#514](https://github.com/paritytech/asset-transfer-api/pull/514))([48e3fb7](https://github.com/paritytech/asset-transfer-api/commit/b5b64311866e00d05eaf6fb36e91a3a3348e3fb7))
- chore(deps-dev): bump vitest from 3.0.5 to 3.0.6 ([#513](https://github.com/paritytech/asset-transfer-api/pull/513))([c175a97](https://github.com/paritytech/asset-transfer-api/commit/195da9da5c22f22e6f30c048892fb77b9c175a97))
- chore(deps-dev): bump typedoc from 0.27.7 to 0.27.8 ([#512](https://github.com/paritytech/asset-transfer-api/pull/512))([b57809d](https://github.com/paritytech/asset-transfer-api/commit/71148481df8e181372920bf7d97164ac2b57809d))
- chore(deps): bump the pjs group with 4 updates ([#511](https://github.com/paritytech/asset-transfer-api/pull/511))([465d2af](https://github.com/paritytech/asset-transfer-api/commit/50d1d83d041e8b768d3d7683045bb1d46465d2af))
- chore(deps): bump the pjs group with 2 updates ([#510](https://github.com/paritytech/asset-transfer-api/pull/510))([7d9e3b8](https://github.com/paritytech/asset-transfer-api/commit/23aa3eaa4a94147e7efe6cf3f67f296217d9e3b8))
- chore(deps-dev): bump typedoc from 0.27.6 to 0.27.7 ([#509](https://github.com/paritytech/asset-transfer-api/pull/509))([fc0871a](https://github.com/paritytech/asset-transfer-api/commit/a949bba1d1102eb7f4640c872fdb9c491fc0871a))
- chore(deps-dev): bump vitest from 3.0.4 to 3.0.5 ([#508](https://github.com/paritytech/asset-transfer-api/pull/508))([21a13e8](https://github.com/paritytech/asset-transfer-api/commit/0ed3e542b84ea9f26ac19239f92f69eb821a13e8))
- chore(deps): bump the pjs group with 4 updates ([#507](https://github.com/paritytech/asset-transfer-api/pull/507))([8928c27](https://github.com/paritytech/asset-transfer-api/commit/ae61808ecc0b6e19bc6822abed2eec4718928c27))
- chore(deps-dev): bump vitest from 3.0.2 to 3.0.4 ([#506](https://github.com/paritytech/asset-transfer-api/pull/506))([765f73b](https://github.com/paritytech/asset-transfer-api/commit/30dae18dbe051f2f5e4e9e0a74d1f19d6765f73b))
- chore(deps): bump @acala-network/chopsticks-core from 1.0.1 to 1.0.2 ([#505](https://github.com/paritytech/asset-transfer-api/pull/505))([88c04cc](https://github.com/paritytech/asset-transfer-api/commit/c721b3b956b72a1fbcf0326ddd36cca0488c04cc))
- chore(deps): bump @acala-network/chopsticks-testing from 1.0.1 to 1.0.2 ([#504](https://github.com/paritytech/asset-transfer-api/pull/504))([ba16c37](https://github.com/paritytech/asset-transfer-api/commit/41603ceb0d0340ab508433a42b9a9587bba16c37))
- chore(deps): bump the pjs group with 4 updates ([#503](https://github.com/paritytech/asset-transfer-api/pull/503))([3d99714](https://github.com/paritytech/asset-transfer-api/commit/cf75c7055b68aa5525f62c67c2d27bf193d99714))
- chore(deps): update asset transfer api registry ([#502](https://github.com/paritytech/asset-transfer-api/pull/502))([ed76677](https://github.com/paritytech/asset-transfer-api/commit/c5fd8e381451810a673af1edc16dedadeed76677))
- chore(deps-dev): bump vitest from 2.1.8 to 3.0.2 ([#500](https://github.com/paritytech/asset-transfer-api/pull/500))([e88d93c](https://github.com/paritytech/asset-transfer-api/commit/dc3b6aa221a616a5be4b3a4d7cac8bf72e88d93c))
- chore(deps): bump the pjs group with 4 updates ([#499](https://github.com/paritytech/asset-transfer-api/pull/499))([3f9648d](https://github.com/paritytech/asset-transfer-api/commit/aef4ff6156d99ee5633fd40195eb1925d3f9648d))

### Test 

- test: update e2e tests ([#498](https://github.com/paritytech/asset-transfer-api/pull/498))([21becd0](https://github.com/paritytech/asset-transfer-api/commit/b1b31033c730283f43144b128268ab00421becd0))

## [0.5.0](https://github.com/paritytech/asset-transfer-api/compare/v0.4.5..v0.5.0)

### Chore

- chore(deps): update pjs ([#496](https://github.com/paritytech/asset-transfer-api/pull/496))([fa010be](https://github.com/paritytech/asset-transfer-api/commit/8a4b885607fcd4bbe0497d8e487ed6765fa010be))
- chore(deps-dev): bump typedoc from 0.27.5 to 0.27.6 ([#494](https://github.com/paritytech/asset-transfer-api/pull/494))([b39abae](https://github.com/paritytech/asset-transfer-api/commit/dd558ad6c9b9afb4465b562726c1f669cb39abae))
- chore(deps-dev): bump chalk from 5.3.0 to 5.4.1 ([#492](https://github.com/paritytech/asset-transfer-api/pull/492))([040adb4](https://github.com/paritytech/asset-transfer-api/commit/d86590a0d1c827c17d0ee3a078eedab39040adb4))
- chore(deps-dev): bump typedoc-theme-hierarchy from 5.0.3 to 5.0.4 ([#491](https://github.com/paritytech/asset-transfer-api/pull/491))([3a9afd1](https://github.com/paritytech/asset-transfer-api/commit/8065c2ba86e06fb2e904d666710c8448b3a9afd1))

### Fix

- fix: expand dest addr validation ([#493](https://github.com/paritytech/asset-transfer-api/pull/493))([973d8e6](https://github.com/paritytech/asset-transfer-api/commit/a90ca7cf7394c0c4da1d053077073a902973d8e6))
- fix: update extrinsic payload decoding ([#490](https://github.com/paritytech/asset-transfer-api/pull/490))([0e657a1](https://github.com/paritytech/asset-transfer-api/commit/aa9e26a7c57db28e42c8bd8912e6541600e657a1))

### Test

- test: update e2e tests ([#495](https://github.com/paritytech/asset-transfer-api/pull/495))([5148fc8](https://github.com/paritytech/asset-transfer-api/commit/0ac76918e9adb00447f0755a69ae1c35d5148fc8))
- test: update xcm v4 e2e tests ([#489](https://github.com/paritytech/asset-transfer-api/pull/489))([5b95137](https://github.com/paritytech/asset-transfer-api/commit/0b974d31f3b9bbd85351125b1953c8e525b95137))

### Feat

- feat: ParaToEthereum ([#487](https://github.com/paritytech/asset-transfer-api/pull/487))([45a1216](https://github.com/paritytech/asset-transfer-api/commit/4a619254d4c17c051c74e5793c2e6c2e945a1216))

## [0.4.5](https://github.com/paritytech/asset-transfer-api/compare/v0.4.4..v0.4.5)

### Test

- test: add chopsticks e2e tests ([#481](https://github.com/paritytech/asset-transfer-api/pull/481))([7406b5c](https://github.com/paritytech/asset-transfer-api/commit/d7354428e634792e33c294f358cbbeb737406b5c))

### Fix

- fix: dependabot PR title ([#464](https://github.com/paritytech/asset-transfer-api/pull/464))([1f576b1](https://github.com/paritytech/asset-transfer-api/commit/29963b5fc1c1f4f20cd957f7a87d9f6f51f576b1))

### Docs

- docs: Update README.md and add installation instructions for examples ([#454](https://github.com/paritytech/asset-transfer-api/pull/454))([029ec73](https://github.com/paritytech/asset-transfer-api/commit/ecda631fe80d4d5b799cb13e895d40245029ec73))

### Chore

- chore(deps): update pjs ([#484](https://github.com/paritytech/asset-transfer-api/pull/484))([664ba3c](https://github.com/paritytech/asset-transfer-api/commit/464a2e20303ef54e92b8d7fb9335229d8664ba3c))
- chore(deps-dev): bump typedoc from 0.27.2 to 0.27.4 ([#480](https://github.com/paritytech/asset-transfer-api/pull/480))([710ab6e](https://github.com/paritytech/asset-transfer-api/commit/af7f27860a43be114748380bcc6f529de710ab6e))
- chore(deps-dev): bump typedoc from 0.26.11 to 0.27.2 ([#479](https://github.com/paritytech/asset-transfer-api/pull/479))([44f4ef8](https://github.com/paritytech/asset-transfer-api/commit/410410a7ca36193ba9254a23a140efa2f44f4ef8))
- chore(deps): bump the pjs group with 4 updates ([#478](https://github.com/paritytech/asset-transfer-api/pull/478))([21359a7](https://github.com/paritytech/asset-transfer-api/commit/420b25bcb84fa862f28db409b905e1fc521359a7))
- chore(deps-dev): bump typedoc-plugin-missing-exports from 3.0.0 to 3.1.0 ([#477](https://github.com/paritytech/asset-transfer-api/pull/477))([5d12392](https://github.com/paritytech/asset-transfer-api/commit/b86dac416871584783856ff61042eea695d12392))
- chore(deps): bump the pjs group across 1 directory with 6 updates ([#476](https://github.com/paritytech/asset-transfer-api/pull/476))([54f46b5](https://github.com/paritytech/asset-transfer-api/commit/f56781dcab9bdb820f0dab2def449a48f54f46b5))
- chore(deps): revert bump @substrate/asset-transfer-api-registry from 0.2.24 to 0.2.25 ([#472](https://github.com/paritytech/asset-transfer-api/pull/471))([b1f004c](https://github.com/paritytech/asset-transfer-api/commit/72b341a2f0b20f63a195ef47b3c0c2804b1f004c))
- chore(deps-dev): bump @substrate/dev from 0.8.0 to 0.9.0 ([#471](https://github.com/paritytech/asset-transfer-api/pull/471))([e5c0881](https://github.com/paritytech/asset-transfer-api/commit/69c8bfc52dc9146e1769f995adbd40990e5c0881))
- chore(deps-dev): bump typedoc from 0.26.10 to 0.26.11 ([#470](https://github.com/paritytech/asset-transfer-api/pull/470))([a104c49](https://github.com/paritytech/asset-transfer-api/commit/1582fb96adf870d0cd0fa151a2de0715aa104c49))
- chore(deps): bump the pjs group with 6 updates ([#469](https://github.com/paritytech/asset-transfer-api/pull/469))([7c87c81](https://github.com/paritytech/asset-transfer-api/commit/a37540d8881672f8058650b98bbfd98447c87c81))
- chore(deps): bump @substrate/asset-transfer-api-registry from 0.2.24 to 0.2.2 ([#468](https://github.com/paritytech/asset-transfer-api/pull/468))([9ad862a](https://github.com/paritytech/asset-transfer-api/commit/bb0c3f47f43a3bc0f4ac3f59c1484d2709ad862a))
- chore(deps-dev): bump chalk from 4.1.2 to 5.3.0 ([#467](https://github.com/paritytech/asset-transfer-api/pull/467))([65e9f5f](https://github.com/paritytech/asset-transfer-api/commit/46f8598265da4be5528b6f970eb49a33e65e9f5f))
- chore(deps-dev): bump typedoc-theme-hierarchy from 4.0.0 to 5.0.3 ([#466](https://github.com/paritytech/asset-transfer-api/pull/466))([601026b](https://github.com/paritytech/asset-transfer-api/commit/5d73c1ed705252e1f49894be6748cfcdb601026b))
- chore(deps): bump the pjs group across 1 directory with 6 updates ([#465](https://github.com/paritytech/asset-transfer-api/pull/465))([630624d](https://github.com/paritytech/asset-transfer-api/commit/0c26dcdc196327328385d336819e89c84630624d))
- chore(deps-dev): bump @types/cli-progress from 3.11.5 to 3.11.6([#463](https://github.com/paritytech/asset-transfer-api/pull/463))([d8c6de2](https://github.com/paritytech/asset-transfer-api/commit/c1f6541388062a8d2f67014402b7ad686d8c6de2))
- chore(deps-dev): bump typedoc from 0.25.4 to 0.26.10 ([#462](https://github.com/paritytech/asset-transfer-api/pull/462))([4c42bf5](https://github.com/paritytech/asset-transfer-api/commit/bf740e6d3b7aab5948f4a4c6e753d09af4c42bf5))
- chore(deps-dev): bump typedoc-plugin-missing-exports from 1.0.0 to 3.0.0 ([#461](https://github.com/paritytech/asset-transfer-api/pull/461))([1d9dccb](https://github.com/paritytech/asset-transfer-api/commit/229a94142f49af8675e3df74060eab5bf1d9dccb))
- chore(deps-dev): bump @substrate/dev from 0.7.1 to 0.8.0 ([#460](https://github.com/paritytech/asset-transfer-api/pull/460))([b66d5a7](https://github.com/paritytech/asset-transfer-api/commit/db398842d50eb88d3f2bd2344916f130cb66d5a7))
- chore: declare explicit pjs dependencies ([#458](https://github.com/paritytech/asset-transfer-api/pull/458))([151f964](https://github.com/paritytech/asset-transfer-api/commit/217d05e3fe860dd0fab0a0cc74985ffcf151f964))
- chore: enable dependabot ([#457](https://github.com/paritytech/asset-transfer-api/pull/457))([b5af4c6](https://github.com/paritytech/asset-transfer-api/commit/155ebe4bf036e87e2c087c332d204d48ab5af4c6))
- chore: run prettier format ([#456](https://github.com/paritytech/asset-transfer-api/pull/456))([d13b8a0](https://github.com/paritytech/asset-transfer-api/commit/bab268ab19279ec131da1fa717885c008d13b8a0))
- chore(deps): bump tar from 6.1.13 to 6.2.1 ([#453](https://github.com/paritytech/asset-transfer-api/pull/453))([da25d80](https://github.com/paritytech/asset-transfer-api/commit/7f326b8aedb65f29fe26cb1bef4150c82da25d80))
- chore(deps): bump micromatch from 4.0.5 to 4.0.8 ([#452](https://github.com/paritytech/asset-transfer-api/pull/452))([ab5e927](https://github.com/paritytech/asset-transfer-api/commit/9d7d205c77ba373b610221d30cd28e387ab5e927))
- chore(deps): bump braces from 3.0.2 to 3.0.3 ([#451](https://github.com/paritytech/asset-transfer-api/pull/451))([7704d7f](https://github.com/paritytech/asset-transfer-api/commit/593545316aa7b950f80f5c207512b48bc7704d7f))

## [0.4.4](https://github.com/paritytech/asset-transfer-api/compare/v0.4.3..v0.4.4)

### Chore

- chore: migrate rococo refs to paseo ([#447](https://github.com/paritytech/asset-transfer-api/pull/447))([5b13228](https://github.com/paritytech/asset-transfer-api/commit/da53859c6ec5213864b409bcbd93943895b13228))

## [0.4.3](https://github.com/paritytech/asset-transfer-api/compare/v0.4.2..v0.4.3)

### Fix

- fix: enable paysWithFeeDest for transferAssets ([#444](https://github.com/paritytech/asset-transfer-api/pull/444))([2a78ecb](https://github.com/paritytech/asset-transfer-api/commit/63b70328bdca2a9b48594f11252383efa2a78ecb))

## [0.4.2](https://github.com/paritytech/asset-transfer-api/compare/v0.4.1..v0.4.2)

### Fix

- fix: default to xcmPallet ([#442](https://github.com/paritytech/asset-transfer-api/pull/442))([771f264](https://github.com/paritytech/asset-transfer-api/commit/81904a2df0c5e9f03cc936e461fedc4f4771f264))

## [0.4.1](https://github.com/paritytech/asset-transfer-api/compare/v0.4.0..v0.4.1)

### Chore

- chore(deps): update pjs ([#440](https://github.com/paritytech/asset-transfer-api/pull/440))([6187377](https://github.com/paritytech/asset-transfer-api/commit/bc7918e761ad370c369a8e4183c3c30536187377))

### Fix

- fix(bug): fix fetchFeeInfo partial fee ([#439](https://github.com/paritytech/asset-transfer-api/pull/439))([d227a14](https://github.com/paritytech/asset-transfer-api/commit/8238bf090413ae8c655f9a466a077bd90d227a14))

## [0.4.0](https://github.com/paritytech/asset-transfer-api/compare/v0.3.1..v0.4.0)

### Feat

- feat: implement transfer all ([#434](https://github.com/paritytech/asset-transfer-api/pull/434))([cf960c5](https://github.com/paritytech/asset-transfer-api/commit/811eba83a37ad9cf54d486fb392a87567cf960c5))
- feat: implement dryRunCall option ([#433](https://github.com/paritytech/asset-transfer-api/pull/433))([19dfab3](https://github.com/paritytech/asset-transfer-api/commit/9ea6e2015df610cc1be4654ee17f2a8a319dfab3))

### Chore

- chore(yarn): bump yarn to 4.5.0 ([#436](https://github.com/paritytech/asset-transfer-api/pull/436))([bcb4335](https://github.com/paritytech/asset-transfer-api/commit/bb1f4d90ffaef0d6d9146b912a4e727b2bcb4335))
- chore(registry): update registry dep ([#435](https://github.com/paritytech/asset-transfer-api/pull/435))([26b1466](https://github.com/paritytech/asset-transfer-api/commit/ed3efdb1fc39f45df9cec212270f3a90c26b1466))
- chore(deps): update pjs ([#432](https://github.com/paritytech/asset-transfer-api/pull/432))([b9f19ca](https://github.com/paritytech/asset-transfer-api/commit/00b245fcc8612a930dcddda223b0a484fb9f19ca))
- chore(deps): update pjs ([#426](https://github.com/paritytech/asset-transfer-api/pull/426))([bfb6edd](https://github.com/paritytech/asset-transfer-api/commit/1947f5d7dad21428d3d74637a45052f75bfb6edd))

### Docs

- docs: Update Instructions on the Repo ([#428](https://github.com/paritytech/asset-transfer-api/pull/428))([ceeac5a](https://github.com/paritytech/asset-transfer-api/commit/d5bf1319b88bbb6d03e346fb5c0ff0b62ceeac5a))

## [0.3.1](https://github.com/paritytech/asset-transfer-api/compare/v0.3.0..v0.3.1)

### Fix

- fix(bug): added support for checkMetadataHash SignedExtension ([#421](https://github.com/paritytech/asset-transfer-api/pull/421))([2d84bfd](https://github.com/paritytech/asset-transfer-api/commit/36d4318920161cdb7945e289c059fee552d84bfd))
- fix: Update paysWithFeeOrigin examples and errors ([#420](https://github.com/paritytech/asset-transfer-api/pull/420))([8d13795](https://github.com/paritytech/asset-transfer-api/commit/7eb9ce979a7b212623711bf716bda80fc8d13795))
- fix: improve error messages ([#416](https://github.com/paritytech/asset-transfer-api/pull/416))([f42ae74](https://github.com/paritytech/asset-transfer-api/commit/5a11307491858d5317bd8f5fa60413633f42ae74))

### Chore

- chore(registry): update registry dep ([#423](https://github.com/paritytech/asset-transfer-api/pull/423))([7a58ae7](https://github.com/paritytech/asset-transfer-api/commit/c02d5bd65ca96afef52ebb798d8442aae7a58ae7))
- chore(deps): bumped PJS/API to 12.1.1 ([#422](https://github.com/paritytech/asset-transfer-api/pull/422))([6a5e0d2](https://github.com/paritytech/asset-transfer-api/commit/a3f1740f90e5952fedbcb6254317d56bb6a5e0d2))

### Docs

- docs: add multiasset and AH reserve examples ([#418](https://github.com/paritytech/asset-transfer-api/pull/418))([1e6e060](https://github.com/paritytech/asset-transfer-api/commit/0bd701d0ae5da96b612934b8ee57f12b41e6e060))

## [0.3.0](https://github.com/paritytech/asset-transfer-api/compare/v0.2.1..v0.3.0)

### Feat

- feat: support relay to bridge tx construction ([#409](https://github.com/paritytech/asset-transfer-api/pull/409))([436d78b](https://github.com/paritytech/asset-transfer-api/commit/436d78bf6cdd086ee179ebbe8e11d0e06bdcdee2))

### Chore

- chore(deps): update pjs ([#414](https://github.com/paritytech/asset-transfer-api/pull/414))([563d208](https://github.com/paritytech/asset-transfer-api/commit/563d2088172feebe50402df596e8b7834e99fd2d))
- chore(registry): update registry dep ([#413](https://github.com/paritytech/asset-transfer-api/pull/413))([f3be2fe](https://github.com/paritytech/asset-transfer-api/commit/f3be2feca6e0d19b7c571ff4b4befb3e04e8f1a6))
- chore(yarn): bump yarn to 4.2.2 ([#411](https://github.com/paritytech/asset-transfer-api/pull/411))([54e8148](https://github.com/paritytech/asset-transfer-api/commit/54e8148431e6def75beaa6f4c14a8847270511b7))
- chore(examples): update xmcVersion to safeXcmVersion ([#410](https://github.com/paritytech/asset-transfer-api/pull/410))([615d3be](https://github.com/paritytech/asset-transfer-api/commit/615d3be891cd554e2c9a24ac1b6e2d67828f4b6c))

## [0.2.1](https://github.com/paritytech/asset-transfer-api/compare/v0.2.0..v0.2.1)

### Fix

- fix: explicitly use passed in dest locations for bridgeTransfers ([#406](https://github.com/paritytech/asset-transfer-api/pull/406))([b3a199a](https://github.com/paritytech/asset-transfer-api/commit/b3a199ace74bc951abe9045d70110c1b9eac8089))

## [0.2.0](https://github.com/paritytech/asset-transfer-api/compare/v0.2.0-beta.2..v0.2.0)

### Chore

- chore(deps): update pjs ([#403](https://github.com/paritytech/asset-transfer-api/pull/403))([60f82f9](https://github.com/paritytech/asset-transfer-api/commit/60f82f9a478ca65e1f8831b87ab6458c598edd34))
- chore(registry): update registry dep ([#402](https://github.com/paritytech/asset-transfer-api/pull/402))([014c8f0](https://github.com/paritytech/asset-transfer-api/commit/014c8f0f79b8134ff44d8ca0cb96eb2c22dbf46f))
- chore(deps): update pjs ([#398](https://github.com/paritytech/asset-transfer-api/pull/398))([339e032](https://github.com/paritytech/asset-transfer-api/commit/339e0322f22e5e3a8b5fd98c145212b6e1cc94b2))
  Note: This PJS update allows for paysWithFeeOrigin to work on Polkadot Asset Hub.
- chore(deps): up pjs ([#396](https://github.com/paritytech/asset-transfer-api/pull/396))([4073aa2](https://github.com/paritytech/asset-transfer-api/commit/4073aa21250643d4503ef9fb123eaf27bea1fa90))
- chore(registry): update registry dep ([#395](https://github.com/paritytech/asset-transfer-api/pull/395))([d7f3d8a](https://github.com/paritytech/asset-transfer-api/commit/d7f3d8afeb02f9c4b9e322d02337a33c19fe0856))
- chore(deps): up pjs ([#387](https://github.com/paritytech/asset-transfer-api/pull/387))([f3f2b28](https://github.com/paritytech/asset-transfer-api/commit/f3f2b28bada384be23317cf281bdd74426553461))
- chore(registry): update registry dep ([#385](https://github.com/paritytech/asset-transfer-api/pull/385))([00064ea](https://github.com/paritytech/asset-transfer-api/commit/00064ea628b0095bcf0227bccb0122ddbd3b4f1d))

### Feat

- feat: support system to bridge txs ([#383](https://github.com/paritytech/asset-transfer-api/pull/383))([311ecd9](https://github.com/paritytech/asset-transfer-api/commit/311ecd91ade1756933500760211d1e351ba907c0))
- feat: add support for pallet-xcm claimAssets call ([#394](https://github.com/paritytech/asset-transfer-api/pull/394))([685ca19](https://github.com/paritytech/asset-transfer-api/commit/685ca19e54bdc6dc76b93423b09c9b44f57a009e))

## Breaking Change

- fix!: always use limited calls ([#392](https://github.com/paritytech/asset-transfer-api/pull/392))([c7ff030](https://github.com/paritytech/asset-transfer-api/commit/c7ff0302dcea92ecb92623832f6460cc56e28491))
- fix!: change TxResult<payload> type ([#391](https://github.com/paritytech/asset-transfer-api/pull/391))([09d1410](https://github.com/paritytech/asset-transfer-api/commit/09d141006f928ecf9b08e2b894ae6dfd4df7d8de))

### Fix

- fix: update lp pool token storage key destructuring ([#390](https://github.com/paritytech/asset-transfer-api/pull/390))([cb7d39f](https://github.com/paritytech/asset-transfer-api/commit/cb7d39fb3ffbaa7f905545268f014c8ba51156ab))

## [0.2.0-beta.2](https://github.com/paritytech/asset-transfer-api/compare/v0.2.0-beta.1..v0.2.0-beta.2)(2024-04-24)

### Chore

- chore(deps): update pjs ([#398](https://github.com/paritytech/asset-transfer-api/pull/398))([339e032](https://github.com/paritytech/asset-transfer-api/commit/339e0322f22e5e3a8b5fd98c145212b6e1cc94b2))
  Note: This PJS update allows for paysWithFeeOrigin to work on Polkadot Asset Hub.

## [0.2.0-beta.1](https://github.com/paritytech/asset-transfer-api/compare/v0.2.0-beta.0..v0.2.0-beta.1)(2024-04-24)

### Chore

- chore(deps): up pjs ([#396](https://github.com/paritytech/asset-transfer-api/pull/396))([4073aa2](https://github.com/paritytech/asset-transfer-api/commit/4073aa21250643d4503ef9fb123eaf27bea1fa90))
- chore(registry): update registry dep ([#395](https://github.com/paritytech/asset-transfer-api/pull/395))([d7f3d8a](https://github.com/paritytech/asset-transfer-api/commit/d7f3d8afeb02f9c4b9e322d02337a33c19fe0856))

### Feat

- feat: add support for pallet-xcm claimAssets call ([#394](https://github.com/paritytech/asset-transfer-api/pull/394))([685ca19](https://github.com/paritytech/asset-transfer-api/commit/685ca19e54bdc6dc76b93423b09c9b44f57a009e))

## [0.2.0-beta.0](https://github.com/paritytech/asset-transfer-api/compare/v0.1.8..v0.2.0-beta.0)(2024-04-02)

## Breaking Change

- fix!: always use limited calls ([#392](https://github.com/paritytech/asset-transfer-api/pull/392))([c7ff030](https://github.com/paritytech/asset-transfer-api/commit/c7ff0302dcea92ecb92623832f6460cc56e28491))
- fix!: change TxResult<payload> type ([#391](https://github.com/paritytech/asset-transfer-api/pull/391))([09d1410](https://github.com/paritytech/asset-transfer-api/commit/09d141006f928ecf9b08e2b894ae6dfd4df7d8de))

### Fix

- fix: update lp pool token storage key destructuring ([#390](https://github.com/paritytech/asset-transfer-api/pull/390))([cb7d39f](https://github.com/paritytech/asset-transfer-api/commit/cb7d39fb3ffbaa7f905545268f014c8ba51156ab))

### Chore

- chore(deps): up pjs ([#387](https://github.com/paritytech/asset-transfer-api/pull/387))([f3f2b28](https://github.com/paritytech/asset-transfer-api/commit/f3f2b28bada384be23317cf281bdd74426553461))
- chore(registry): update registry dep ([#385](https://github.com/paritytech/asset-transfer-api/pull/385))([00064ea](https://github.com/paritytech/asset-transfer-api/commit/00064ea628b0095bcf0227bccb0122ddbd3b4f1d))

## [0.1.8](https://github.com/paritytech/asset-transfer-api/compare/v0.1.7..v0.1.8)(2024-03-05)

### Feat

- feat: add transfer assets call ([#378](https://github.com/paritytech/asset-transfer-api/pull/378))([1273b7d](https://github.com/paritytech/asset-transfer-api/commit/1273b7d18facad98589e923c14ff9fb7b352dc62))
- feat: allow for registry override ([#369](https://github.com/paritytech/asset-transfer-api/pull/369)([856a638](https://github.com/paritytech/asset-transfer-api/commit/856a6387c0a8ddf21e5b098934884aef78b006f8)))

### Fix

- fix: update foreign asset location construction ([#377](https://github.com/paritytech/asset-transfer-api/pull/377))([9c6cbc1](https://github.com/paritytech/asset-transfer-api/commit/9c6cbc14448689feabfd73a8a6e5d46b0daebbb0))

- fix: resolve tx calls based on current runtime ([#375](https://github.com/paritytech/asset-transfer-api/pull/375))([d55fa29](https://github.com/paritytech/asset-transfer-api/commit/d55fa29a7beb8305fab628a3a5d094d835d0182d))
- fix: add support for xcmv4 types ([#372](https://github.com/paritytech/asset-transfer-api/pull/372))([0e5c545](https://github.com/paritytech/asset-transfer-api/commit/0e5c54552e85913cde178b5bc6c0dcbe7fe7ef9a))

### Chore

- chore(deps): update polkadot-js ([#379](https://github.com/paritytech/asset-transfer-api/pull/379))([db1c22e](https://github.com/paritytech/asset-transfer-api/commit/db1c22e718231bbfcc3e8511bf82e8f3dd505bef))
- chore(deps): bump ip from 2.0.0 to 2.0.1 ([#374](https://github.com/paritytech/asset-transfer-api/pull/374))([424b788](https://github.com/paritytech/asset-transfer-api/commit/424b78848db3c04c4a6df06183fa12f52887b822))

## [0.1.7](https://github.com/paritytech/asset-transfer-api/compare/v0.1.6..v0.1.7)(2024-02-07)

### Feat

- feat: ensure the injectedRegsitry opt does deep comparisons ([#359](https://github.com/paritytech/asset-transfer-api/pull/359)) ([724a89d](https://github.com/paritytech/asset-transfer-api/commit/724a89d7e2728a2a42604dc4e5e2d9b535926213))
- feat: add local transfers for orml, and parachains ([#352](https://github.com/paritytech/asset-transfer-api/pull/352)) ([57cc037](https://github.com/paritytech/asset-transfer-api/commit/57cc037190e8ca14beb1e56485e2782a34523596))

### Fix

- fix(internal): add deepEqual functionality for comparing two objects ([#365](https://github.com/paritytech/asset-transfer-api/pull/365)) ([e305138](https://github.com/paritytech/asset-transfer-api/commit/e305138f79ecf7cbd118869db2429c3f2726d0a1))
- fix(internal-refactor): adjust naming to be more conventional ([#358](https://github.com/paritytech/asset-transfer-api/pull/358)) ([6b42fdb](https://github.com/paritytech/asset-transfer-api/commit/6b42fdba43b02fb924fb824b3898d74d27ea2caa))
- fix: renaming statemine in zombienet toml files ([#356](https://github.com/paritytech/asset-transfer-api/pull/356)) ([f653810](https://github.com/paritytech/asset-transfer-api/commit/f653810154321d349adbce7ea0b3a69efa1c9334))

### Chore

- chore(yarn): update berry to 4.1.0 ([#362](https://github.com/paritytech/asset-transfer-api/pull/362)) ([46a4d07](https://github.com/paritytech/asset-transfer-api/commit/46a4d07100a89b59725946f8dae19c660de13584))
- chore(registry): update registry dep ([#360](https://github.com/paritytech/asset-transfer-api/pull/360)) ([d71af0f](https://github.com/paritytech/asset-transfer-api/commit/d71af0fbbeacbc53221afd8ed646b51cf8c16b77))

### Docs

- docs: add `RELEASE.md` ([#355](https://github.com/paritytech/asset-transfer-api/pull/355)) ([550e76f](https://github.com/paritytech/asset-transfer-api/commit/550e76f44f99458e899acb888cec38ffb3cdd000))

### Test

- test: set registries to NPM for AssetTransferApi ([#363](https://github.com/paritytech/asset-transfer-api/pull/363)) ([94d6c31](https://github.com/paritytech/asset-transfer-api/commit/94d6c31e74a4d32a072c455d2f8dcbeddb605122))
- test: e2e tests ([#343](https://github.com/paritytech/asset-transfer-api/pull/343)) ([7d5de87](https://github.com/paritytech/asset-transfer-api/commit/7d5de8726328728edca8be63eb79ce25b8439d1e))

## [0.1.6](https://github.com/paritytech/asset-transfer-api/compare/v0.1.5..v0.1.6)(2024-01-22)

## Features

- feat: add browser compatibility ([#341](https://github.com/paritytech/asset-transfer-api/pull/341))

## Fix

- fix: add rococo to RELAY_CHAIN_NAMES ([#344](https://github.com/paritytech/asset-transfer-api/pull/344))
- fix(internal): ensure all sanitizeKeys int values are sanitized to str ([#346](https://github.com/paritytech/asset-transfer-api/pull/346))
- fix: add catch try for CDN_URL fetching ([#350](https://github.com/paritytech/asset-transfer-api/pull/350))

## Build

- build: remove .spec files from lib ([#342](https://github.com/paritytech/asset-transfer-api/pull/342))

## Chore

- chore(registry): update registry package ([#347](https://github.com/paritytech/asset-transfer-api/pull/347))
- chore(deps): bump actions/cache from 3 to 4 ([#349](https://github.com/paritytech/asset-transfer-api/pull/349))

## Docs

- docs: fix readme nit for spacing ([#348](https://github.com/paritytech/asset-transfer-api/pull/348))

## [0.1.5](https://github.com/paritytech/asset-transfer-api/compare/v0.1.4..v0.1.5)(2024-01-03)

## Features

- feat: give registry option between CDN and npm package ([#332](https://github.com/paritytech/asset-transfer-api/pull/332))
- feat: add paysWithFeeOrigin support for MultiLocations ([#333](https://github.com/paritytech/asset-transfer-api/pull/333))

## Fix

- fix(internal): cleanup structure for args passed into calls ([#328](https://github.com/paritytech/asset-transfer-api/pull/328))
- fix: check fee asset lp exists for paysWithFeeOrigin ([#336](https://github.com/paritytech/asset-transfer-api/pull/336))

## Docs

- docs(readme): Add explanation for local transfers in parachains ([#331](https://github.com/paritytech/asset-transfer-api/pull/331))

## Chore

- chore(deps): bump @babel/traverse from 7.21.4 to 7.23.4 ([#329](https://github.com/paritytech/asset-transfer-api/pull/329))
- chore(substrate-dev): update @substrate/dev to 0.7.1 ([#334](https://github.com/paritytech/asset-transfer-api/pull/334))
- chore(yarn): bump yarn to 4.0.2 ([#335](https://github.com/paritytech/asset-transfer-api/pull/335))
- chore(pjs): update polkadot-js to 10.11.2 ([#339](https://github.com/paritytech/asset-transfer-api/pull/339))

## [0.1.4](https://github.com/paritytech/asset-transfer-api/compare/v0.1.3..v0.1.4)(2023-11-14)

## Features

- feat: ParaToRelay

## Fix

- fix: updated zombienet to work with polkadot-sdk nodes
- fix: support parachains without assets pallet in runtime

## Docs

- docs: adjust inline docs for createXcmTypes

## [0.1.3](https://github.com/paritytech/asset-transfer-api/compare/v0.1.2..v0.1.3)(2023-11-07)

## Features

- feat: support para to para xcm tx construction

## Fix

- fix: xtokens and xTokens naming for ParaTo\*
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
