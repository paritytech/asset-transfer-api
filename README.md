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

Find full documentation [here](https://paritytech.github.io/asset-transfer-api/), for quick start guide read below. All examples can be found [here](https://github.com/paritytech/asset-transfer-api/tree/main/examples/).

## About

WARNING: This package is in stable beta, and does not support sending assets in all directions. Read **Current Cross-chain Support** for more info.

**BETA**: This package is in stable beta.

**Summary**: Asset-transfer-api is a library focused on simplifying the construction of asset transfers for Substrate based chains that involves system parachains like Asset Hub (Polkadot and Kusama). It exposes a reduced set of methods which facilitates users to send transfers to other (para) chains or locally.

### Current Cross-chain Support

The below chart is focusing on what directions are supported for constructing asset transfers and in what XCM version. The goal is to have everything in green checkmarks. Note that local transfers (intra-chain) are not visualized here.

| Direction              | V2                 | V3                 |
| ---------------------  | ------------------ | ------------------ |
| System to Parachain    |         ✅         |      ✅            |
| System to Relay        |         ✅         |      ✅            |
| Relay to Parachain     |         ✅         |      ✅            |
| Relay to System        |         ✅         |      ✅            |
| Parachain to Parachain |         ❌         |      ❌            |
| Parachain to Relay     |         ❌         |      ❌            |
| Parachain to System    |         ✅         |      ✅            |
| System to System       |         ✅         |      ✅            |

Note: System refers to System Parachains like Asset Hub.

## Usage

### Npm

`npm install @substrate/asset-transfer-api`

### Yarn

`yarn add @substrate/asset-transfer-api`

### Example Usage

**NOTE:** For more practical usage, and specified examples please look through our `./examples` directory to see more use cases. To
run these examples: `yarn build:examples && node ./examples/build/examples/<file_to_run>.js`.

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
 * @param assetIds Array of assetId's to be transferred
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

### Teleport and Reserve Transfer via polkadotXcm pallet

The `AssetsTransferApi.createTransferTransaction` is able to infer what kind of transaction is necessary given the inputs. When sending cross chain transfers the api does a lot of validation to ensure the inputs are valid, and the assets either exist or dont. This process is done through a registry which is maintained in a seperate repo [here](https://github.com/paritytech/asset-transfer-api-registry). If the asset in not in the registry it will then lookup if that asset exists on chain and cache it if necessary. On chain verification is not always possible in respect to the direction the asset is being sent and what the destination chain is since we only maintain one api connection. Therefore, if you would like the inject information into the registry, you can using the `injectedRegistry` option for the `AssetsTransferApi`.

### Transferring assets via xTokens pallet

If the transfer is being sent from a parachain that utilizes the `xTokens` pallet, the API will detect that and construct the transaction that is necessary. It will construct one of three calls: `transferMultiAsset`, `transferMultiAssets`, or `transferMultiAssetWithFee`. This is only application when the intended transfer direction starts from a parachain.

### Foreign Asset Transfers

Sending a foreign asset requires the input `assetIds` in `createTransferTransaction` to include the `multiLocation` of the asset you would like to send. If a multilocation is not passed it will not know if the asset you are sending is a foreign asset. If the `multiLocation` passed in has a `Parachain` id which matches the `destChainId` input for the transfer then it will be a `teleportAssets`, otherwise it will be a `reserveTransferAssets`.

An example would look like:
```typescript
api.createTransferTransaction(
	'2125', // Note: the Parchain ID matches the MultiLocations 'Parachain' ID, making this a teleportAssets
	'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
	['{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'],
	['1000000000000'],
	{
		format: 'call',
		isLimited: true,
		xcmVersion: 3,
	}
)
```

If you would like to run an example to understand the output run: `yarn build:examples && node ./examples/build/examples/systemToParaTeleportForeignAssets.js`

### Liquid Pool Asset Transfers

Sending a Liquid Pool Asset is as simple as setting the option `transferLiquidToken` to true. That being said, it does have some nuances. A liquid transfer must be in the direction of a SystemToPara, and the inputted asset must be a valid integer as a string. The api will error if either of these conditions are not met. 

An example would look like:
```typescript
api.createTransferTransaction(
	'2023',
	'0xF977814e90dA44bFA03b6295A0616a897441aceC',
	['0'],
	['100000'],
	{
		format: 'call',
		isLimited: true,
		xcmVersion: 2,
		transferLiquidToken: true,
	}
);
```

If you would like to run an example to understand the output run: `yarn build:examples && node ./examples/build/examples/systemToParaLpToken.js`

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
