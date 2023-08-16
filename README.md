<br /><br />

<div align="center">
  <h1 align="center">@substrate/asset-transfer-api</h1>
  <h4 align="center"> Asset API used for common good parachains </h4>
  <p align="center">
    <a href="https://www.npmjs.com/package/@substrate/asset-transfer-api">
      <img alt="npm" src="https://img.shields.io/npm/v/@substrate/asset-transfer-api" />
    </a>
    <a href="https://github.com/paritytech/asset-transfer-api/actions">
      <img alt="Github Actions" src="https://github.com/paritytech/asset-transfer-api/workflows/pr/badge.svg" />
    </a>
    <a href="https://github.com/paritytech/asset-transfer-api/blob/master/LICENSE">
      <img alt="GPL-3.0-or-later" src="https://img.shields.io/npm/l/@substrate/asset-transfer-api" />
    </a>
  </p>
</div>

<br /><br />

## Docs

Find full documentation [here](https://paritytech.github.io/asset-transfer-api/), for quick start guide read below. All examples can be found [here](./examples/).

## About

WARNING: This package is in stable beta, and does not support sending assets in all directions. Read **Current Cross-chain Support** for more info.

**BETA**: This package is in stable beta.

**Summary**: Asset-transfer-api is a library focused on simplifying the construction of asset transfers for Substrate based chains that involves system parachains like Kusama AssetHub and Polkadot AssetHub. It exposes a reduced set of methods which facilitates users to send transfers to other (para) chains or locally.

### Current Cross-chain Support

The below chart is focusing on what directions are supported for constructing asset transfers and in what XCM version. The goal is to have everything in green checkmarks. Note that local transfers (intra-chain) are not visualized here.

| Direction              | V2                 | V3                 |
| ---------------------  | ------------------ | ------------------ |
| System to Parachain    | :white_check_mark: | :white_check_mark: |
| System to Relay        | :white_check_mark: | :white_check_mark: |
| Relay to Parachain     | :white_check_mark: | :white_check_mark: |
| Relay to System        | :white_check_mark: | :white_check_mark: |
| Parachain to Parachain | :x:                | :x:                |
| Parachain to Relay     | :x:                | :x:                |
| Parachain to System    | :white_check_mark: | :white_check_mark: |
| System to System       | :white_check_mark: | :white_check_mark: |

Note: System refers to System Parachains like `Kusama AssetHub` and `Polkadot AssetHub`.

## Usage

### Npm

`npm install @substrate/asset-transfer-api`

### Yarn

`yarn add @substrate/asset-transfer-api`

### Example Usage

```typescript
import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api';

// NOTE: This should all be wrapped in an asynchronous layer.

// This constructs a polkadot-js ApiPromise, it is totally viable for one to construct their
// own ApiPromise, and pass it into AssetsTransferApi, but keep in mind the `specName`, and `safeXcmVersion` are also necessary.
const { api, specName, safeXcmVersion } = await constructApiPromise('wss://westmint-rpc.polkadot.io');

const assetsApi = new AssetsTransferApi(api, specName, safeXcmVersion);

const call = assetsApi.createTransferTransaction(
  '2001', // destChainId (If the destination is a relay chain put `0`)
  '0x00', // destAddress
  ['1', '2'], // Array of AssetIds
  ['1000000000', '2000000000'], // Array of amounts of each token to transfer
  {
    format: 'call',
    isLimited: true,
    xcmVersion: 1
  } // Options
)
```

### AssetTransferApi & AssetsTransferApiOpts & TransferArgsOpts

```Typescript
// The AssetsTransferApi exposes one method as of now called: `createTransferTransaction`

/**
 * Create an XCM transaction to transfer Assets, or native tokens from one
 * chain to another.
 *
 * @param destChainId ID of the destination (para) chain (‘0’ for Relaychain)
 * @param destAddr Address of destination account
 * @param assetIds Array of assetId's to be transferred (‘0’ for Native Relay Token)
 * @param amounts Array of the amounts of each token to transfer
 * @param opts Options
 */
AssetsTransferApi.createTransferTransaction(
  	destChainId: string,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	opts?: TransferArgsOpts<T>
)
```


```typescript
// AssetsTransferApiOpts are the options for the `AssetsTransferApi`

type AssetsTransferApiOpts = {
	/**
	 * The injectedRegistry allows you to add custom values to the predefined initialized registry.
	 * If you would like to see the registry you may visit https://github.com/paritytech/asset-transfer-api-registry/blob/main/registry.json
	 * 
	 * An example input of the registry would be:
	 * {
	 *     polkadot: {
	 *         '9876': {
	 *             tokens: ['TST'],
	 *             assetsInfo,
	 *             specName: 'testing',
	 *         }
	 *     }
	 * }
	 * 
	 * NOTE: It supports adding info for `polkadot`, `kusama`, and `westend`.
	 */
	injectedRegistry?: RequireAtLeastOne<ChainInfoRegistry>;
};
```

```typescript
// The TransferArgsOpts are options that give the possibility of adding certain customization to the transaction.

interface TransferArgsOpts<T extends Format> {
	/**
	 * Option that specifies the format in which to return a transaction.
	 * It can either be a `payload`, `call`, or `submittable`.
	 *
	 * Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
	 * a `payload` or `call` will return a hex. By default a `payload` will be returned if nothing is inputted.
	 */
	format?: T;
	/**
	 * AssetId to pay fees on the current common good parachain.
	 * Polkadot AssetHub: default DOT
	 * Kusama AssetHub: default KSM
	 */
	paysWithFeeOrigin?: string;
	/**
	 * AssetId to pay fees on the destination parachain.
	 */
	paysWithFeeDest?: string;
	/**
	 * Boolean to declare if this will be with limited XCM transfers.
	 * Deafult is unlimited.
	 */
	isLimited?: boolean;
	/**
	 * When isLimited is true, the option for applying a weightLimit is possible.
	 * If not inputted it will default to `Unlimited`.
	 */
	weightLimit?: { refTime?: string, proofSize?: string };
	/**
	 * Set the xcmVersion for message construction. If this is not present a supported version
	 * will be queried, and if there is no supported version a safe version will be queried.
	 */
	xcmVersion?: number;
    /**
	 * For creating local asset transfers, this will allow for a `transferKeepAlive` as oppose
	 * to a `transfer`.
	 */
	keepAlive?: boolean;
	/**
	 * Boolean to declare if this will transfer liquidity tokens.
	 * Default is false.
	 */
	transferLiquidToken?: boolean;
}
```

#### **Local Transactions**

Sending an Asset or Native token locally on a System Parachain is easy. In order to create a transaction, ensure the `destChainId` is the same as the ID of the System Parachain itself. Note, the only System parachains that are supported are `Kusama AssetHub`, `Polkadot AssetHub`, `Westend AssetHub` and as a side affect the only `destChainId` that is supported is `1000`. In addition to that, ensure the length of the `assetId's` array and `amounts` array are 1. As sending assets will only accept one asset at a time. Keep in mind `transfer`, and `transferKeepAlive` are the only supported calls.

An example would look like:
```typescript
api.createTransferTransaction(
  	'1000', // destChainId
	'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', // destAddr
	['1984'], // assetIds
	['10000000000'], // amounts
	{
		format: 'call',
		keepAlive: true
	} // opts
)
```

The api can also send native tokens as well. Similar to the above you would replace the `assetIds` with `['DOT']`, in addition to that you may provide an empty array to denote you want to send the chains native token. 

The api can also send local transactions for Relay chains. Its the same principal as above, the only difference being that the `destChainId` woule need to be `'0'`.

For more information, refer to the [docs](https://github.com/paritytech/asset-transfer-api/tree/main/docs) in the repository.

## License

The source code in this repository is distributed under the Apache 2.0 license. See the <LICENSE> file. This source code comes with absolutely no warranty. Use at your own risk.

## Zombienet Testing

Zombienet is used to launch a complete network including a relay chain, and two parachains. It will create HRMP channels betweens the launched parachains allowing the testing enviornment to send XCM messages and transfer assets. 

### **Requirements**:

**Zombienet Binary**: You can download the appropriate binary from the zombienet repositor [here](https://github.com/paritytech/zombienet/releases). Ensure that it is in the root of this directory. Note: For macos users if permission is denied to run the binary you can `chmod 755 <file_name>` to allow permissions.

**Test Network Binaries**: You will need the following binaries depending on whether you want to run a small or medium network:

- polkadot: You can find the the releases [here](https://github.com/paritytech/polkadot/releases). (Needed for small, or medium network)
- trappist-collator: This binary is compiled along with polkadot above. You can find it [here](https://github.com/paritytech/trappist). (Needed for medium network)
- polkadot-parachain (ie: cumulus): You can find the releases [here](https://github.com/paritytech/cumulus/releases). (Needed for small, or medium network)

NOTES: 

- When it comes to picking a version for both `cumulus` and and `polkadot` ensure they are the same. Cumulus will have an extra 0 at the end though. Ex: v0.9.37 (polkadot) -> v0.9.370 (cumulus)

- You can retrieve the binaries via the release, or by compiling yourself. It's recommended to compile it yourself.

Copy each binary that is necessary into the root `<root>/bin` folder.

### Running Zombienet

From the root directory run `./<zombienet_binary_name> -p native spawn ./zombienet/<network_file>.toml | tee zombienet.log`

### Create an asset

From the root directory run `yarn start:zombienet-post-script`. You can run this right after running your zombienet network.
