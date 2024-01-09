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

Find the full documentation [here](https://paritytech.github.io/asset-transfer-api/), for quick start guide read below. All examples can be found [here](https://github.com/paritytech/asset-transfer-api/tree/main/examples/).

**Summary**: Asset-transfer-api is a library focused on simplifying the construction of asset transfers for Substrate based chains that involves system parachains like Asset Hub (Polkadot and Kusama). It exposes a reduced set of methods which facilitates users to send transfers to other (para) chains or locally.

### Current Cross-chain Support

The below chart is focusing on what directions are supported for constructing asset transfers and in what XCM version. The goal is to have everything in green checkmarks. Note that local transfers (intra-chain) are not visualized here.


| Direction              | V2                 | V3                 |
| ---------------------  | ------------------ | ------------------ |
| System to Parachain    |         ✅         |      ✅            |
| System to Relay        |         ✅         |      ✅            |
| Relay to Parachain     |         ✅         |      ✅            |
| Relay to System        |         ✅         |      ✅            |
| Parachain to Parachain |         ✅         |      ✅            |
| Parachain to Relay     |         ✅         |      ✅            |
| Parachain to System    |         ✅         |      ✅            |
| System to System       |         ✅         |      ✅            |

## Note on Parachain to Parachain Support
Parachain To Parachain support is currently limited to XCM V2, with the exception of Parachain primary asset tx construction (e.g. MOVR, SDN, etc.).

Note: System refers to System Parachains like Asset Hub.

## Usage

### Npm

`npm install @substrate/asset-transfer-api`

### Yarn

`yarn add @substrate/asset-transfer-api`

### NodeJS Version

Recommended: v21 or greater
When the API is initalized using the `CDN`, `node:fetch` is being used and is stable in node v21. Therefore it is recommended to use v21 or greater. 

### Example Usage

**NOTE:** For more practical usage, and specified examples please look through our `./examples` directory to see more use cases. To
run these examples: `yarn build:examples && node ./examples/build/examples/<file_to_run>.js`.

```typescript
import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api';

// NOTE: This should all be wrapped in an asynchronous layer.

// This constructs a polkadot-js ApiPromise, it is totally viable for one to construct their
// own ApiPromise, and pass it into AssetTransferApi, but keep in mind the `specName`, and `safeXcmVersion` are also necessary.
const { api, specName, safeXcmVersion } = await constructApiPromise('wss://westmint-rpc.polkadot.io');

const assetsApi = new AssetTransferApi(api, specName, safeXcmVersion);

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

### AssetTransferApi & AssetTransferApiOpts & TransferArgsOpts

```Typescript
// The AssetTransferApi exposes one method as of now called: `createTransferTransaction`

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
AssetTransferApi.createTransferTransaction(
  	destChainId: string,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	opts?: TransferArgsOpts<T>
)
```


```typescript
// AssetTransferApiOpts are the options for the `AssetTransferApi`

type AssetTransferApiOpts = {
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
	/**
	 * RegistryTypes is a string and can either be 'CDN' or 'NPM'.
	 * 
	 * CDN - The registry will be initialized with the up to date version given the CDN
	 * NPM - The registry will be initialized with the NPM version which is updated less frequently.
	 */
	registryType?: RegistryTypes;
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

The `AssetTransferApi.createTransferTransaction` is able to infer what kind of transaction is necessary given the inputs. When sending cross chain transfers, the api does a lot of validation to ensure the inputs are valid, and the assets either exist or don't. This process is done through a registry which is maintained in a separate repo [here](https://github.com/paritytech/asset-transfer-api-registry). If the asset is not in the registry, it will then lookup if that asset exists on-chain and cache it if necessary. On-chain verification is not always possible in respect to the direction the asset is being sent and what the destination chain is since we only maintain one api connection. Therefore, if you would like to inject information into the registry, you can using the `injectedRegistry` option for the `AssetTransferApi`.

### Transferring assets via xTokens pallet

If the transfer is being sent from a parachain that utilizes the `xTokens` pallet, the API will detect that and construct the transaction that is necessary. It will construct one of three calls: `transferMultiasset`, `transferMultiassets`, or `transferMultiassetWithFee`. This is only applicable when the intended transfer direction starts from a parachain. The `xTokens` pallet can be found [here](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens).

An example would look like:
```typescript
api.createTransferTransaction(
	'1000',
	'0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063',
	['xcUSDT'],
	['1000000'],
	{
		format: 'call',
		isLimited: false,
		xcmVersion: 2,
	}
);
```

If you would like to run an example to understand the output, run: `yarn build:examples && node ./examples/build/examples/paraToSystemTransferMultiAsset.js`

### Foreign Asset Transfers

Sending a foreign asset requires the input `assetIds` in `createTransferTransaction` to include the `MultiLocation` of the asset you would like to send. If a `MultiLocation` is not passed it will not know if the asset you are sending is a foreign asset. If the `MultiLocation` passed in has a `Parachain` id which matches the `destChainId` input for the transfer, then the output will be a teleport, otherwise it will be a reserve backed transfer.

An example would look like:
```typescript
api.createTransferTransaction(
	'2125', // Note: the Parchain ID matches the MultiLocations 'Parachain' ID, making this a teleport of assets
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

Sending a liquidity token (from the `poolAssets` pallet) in Asset Hub is as simple as setting the option `transferLiquidToken` to true. That being said, it does have some nuances. A liquidity token cross-chain transfer must be in the direction of a SystemToPara, and the inputted asset must be a valid integer as a string. The api will error if either of these conditions are not met.

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

### Local Transactions

Sending an Asset or Native token locally on a System Parachain is easy. In order to create a transaction, ensure the `destChainId` is the same as the ID of the System Parachain itself. Note, the only System parachains that are supported are `Kusama AssetHub`, `Polkadot AssetHub`, `Westend AssetHub`, `Rococo AssetHub` ([note](https://github.com/paritytech/asset-transfer-api/pull/297#issue-1913578303) on how to use it) and as a side effect the only `destChainId` that is supported is `1000`. In addition to that, ensure the length of the `assetId's` array and `amounts` array are 1. As sending assets will only accept one asset at a time. Keep in mind `transfer`, and `transferKeepAlive` are the only supported calls.

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

The api can also send native tokens as well. Similar to the above you would replace the `assetIds` with `['DOT']`. In addition to that, you may provide an empty array to denote you want to send the chain's native token.

The api can also send local transactions for Relay chains. It is the same principal as above, the only difference being that the `destChainId` would need to be `'0'`.

For more information, refer to the [docs](https://github.com/paritytech/asset-transfer-api/tree/main/docs) in the repository.

Note: For other parachains, local transfers are currently supported via balances and assets pallets. The plan is to extend local transfer support to other pallets like ORML tokens pallet in coming releases.

## License

The source code in this repository is distributed under the Apache 2.0 license. See the [LICENSE](https://github.com/paritytech/asset-transfer-api/blob/main/LICENSE) file. This source code comes with absolutely no warranty. Use at your own risk.

## Zombienet Testing

Zombienet is used to launch a complete network including a relay chain, and two parachains. It will create HRMP channels betweens the launched parachains allowing the testing enviornment to send XCM messages and transfer assets. 

### **Requirements**:

**Zombienet Binary**: You can download the appropriate binary from the zombienet repository [here](https://github.com/paritytech/zombienet/releases). Ensure that it is in the root of this directory. Note: For macos users if permission is denied to run the binary you can `chmod 755 <file_name>` to allow permissions.

**Test Network Binaries**: You will need the following binaries depending on whether you want to run a small or medium network:

- polkadot: You can find the releases [here](https://github.com/paritytech/polkadot-sdk/releases). (Needed for small, or medium network)
- trappist-collator: This binary is compiled along with polkadot above. You can find it [here](https://github.com/paritytech/trappist). (Needed for medium network)
- polkadot-parachain (ie: cumulus): You can find the releases [here](https://github.com/paritytech/polkadot-sdk/releases). (Needed for small, or medium network)

NOTES: 

- When it comes to picking a version for both `cumulus` and `polkadot` ensure they are the same. Cumulus will have an extra 0 at the end though. Ex: v0.9.37 (polkadot) -> v0.9.370 (cumulus)

- You can retrieve the binaries via the release, or by compiling yourself. It's recommended to compile it yourself.

Copy each binary that is necessary into the root `<root>/bin` folder.

### Running Zombienet

From the root directory run `./<zombienet_binary_name> -p native spawn ./zombienet/<network_file>.toml | tee zombienet.log`

### Create an asset

From the root directory run `yarn start:zombienet-post-script`. You can run this right after running your zombienet network.
