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

## About

WARNING: THIS PACKAGE IS NOT PRODUCTION READY!

**ALPHA**: This package is in alpha and is being rapidly and actively developed on, so some design choices are subject to change. 

**Summary**: Asset-transfer-api is a library focused on simplifying the construction of asset transfers for Substrate based chains that involves system parachains like Statemine and Statemint. It exposes a reduced set of methods which facilitates users to send transfers to other (para) chains or locally.

### Current Cross-chain Support

The below chart is focusing on what directions are supported for constructing asset transfers and in what XCM version. The goal is to have everything in green checkmarks. Note that local transfers (intra-chain) are not visualized here.

| Direction              | V2                 | V3                 |
| ---------------------  | ------------------ | ------------------ |
| System to Parachain    | :white_check_mark: | :white_check_mark: |
| System to Relay        | :x:                | :x:                |
| Relay to Parachain     | :white_check_mark: | :x:                |
| Relay to System        | :x:                | :x:                |
| Parachain to Parachain | :x:                | :x:                |
| Parachain to Relay     | :x:                | :x:                |

Note: System refers to System Parachains like `Statemine` and `Statemint`.

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
// own ApiPromise, and pass it into AssetsTransferApi.
const apiPromise = await constructApiPromise('wss://westmint-rpc.polkadot.io');

await apiPromise.isReady

const assetsApi = new AssetsTransferApi(apiPromise);

const call = await assetsApi.createTransferTransaction(
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

### AssetTransferApi & ITransferArgsOpts

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
		opts?: ITransferArgsOpts<T>
)
```

```typescript
// The ITransferArgsOpts are options that give the possibility of adding certain customization to the transaction.

interface ITransferArgsOpts<T extends Format> {
	/**
	 * Option that specifies the format in which to return a transaction.
	 * It can either be a `payload`, `call`, or `submittable`.
	 *
	 * Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
	 * a `payload` or `call` will return a hex. By default a `payload` will be returned if nothing is inputted.
	 */
	format?: T;
	/**
         * NOTE: This is in development, and being worked on and not yet supported.
         * 
	 * AssetId to pay fee's on the current common good parachain.
	 * Statemint: default DOT
	 * Statemine: default KSM
	 */
	payFeeWith?: string;
	/**
         * NOTE: This is in development, and being worked on and not yet supported.
         * 
	 * AssetId to pay fee's on the destination parachain.
	 */
	payFeeWithTo?: string;
	/**
	 * Boolean to declare if this will be with limited XCM transfers.
	 * Deafult is unlimited.
	 */
	isLimited?: boolean;
	/**
	 * When isLimited is true, the option for applying a weightLimit is possible.
	 * If not inputted it will default to `Unlimited`.
	 */
	weightLimit?: string;
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
}
```

#### **Local Transactions**

Sending an Asset locally on a System Parachain is easy. In order to create a transaction, ensure the `destChainId` is the same as the ID of the System Parachain itself. Note, the only System parachains that are supported are `Statemine`, `Statemint`, `Westmint` and as a side affect the only `destChainId` that is supported is `1000`. In addition to that, ensure the length of the `assetId's` array and `amounts` array are 1. As sending assets will only accept one asset at a time. Keep in mind `transfer`, and `transferKeepAlive` are the only supported calls.

An example would look like:
```typescript
await api.createTransferTransaction(
  	destChainId: '1000',
	destAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
	assetIds: ['1984'],
	amounts: ['10000000000'],
	opts?: {
		format: 'call',
		keepAlive: true
	}
)
```

For more information, refer to the [docs](https://github.com/paritytech/asset-transfer-api/tree/main/docs) in the repository.

## License

The source code in this repository is distributed under the Apache 2.0 license. See the <LICENSE> file. This source code comes with absolutely no warranty. Use at your own risk.

## Zombienet Testing

Zombienet is used to launch a complete network including a relay chain, and two parachains. It will create HRMP channels betweens the launched parachains allowing the testing enviornment to send XCM messages and transfer assets. 

### **Requirements**:

**Zombienet Binary**: You can download the appropriate binary from the zombienet repositor [here](https://github.com/paritytech/zombienet/releases). Ensure that it is in the root of this directory. Note: For macos users if permission is denied to run the binary you can `chmod 755 <file_name>` to allow permissions.

**Test Network Binaries**: You will need the following binaries:

- polkadot: You can find the the releases [here](https://github.com/paritytech/polkadot/releases).
- trappist-collator: This binary is compiled along with polkadot above. You can find it [here](https://github.com/paritytech/trappist).
- polkadot-parachain (ie: cumulus): You can find the releases [here](https://github.com/paritytech/cumulus/releases).

NOTE: When it comes to picking a version for both `cumulus` and and `polkadot` ensure they are the same. Cumulus will have an extra 0 at the end though. Ex: v0.9.37 (polkadot) -> v0.9.370 (cumulus)

Copy each binary that is necessary into the root `<root>/bin` folder.

### Running Zombienet

From the root directory run `./<zombienet_binary_name> -p native spawn zombienet.toml | tee zombienet.log`

### Create an asset

From the root directory run `yarn start:zombienet-post-script`. You can run this right after running your zombienet network.
