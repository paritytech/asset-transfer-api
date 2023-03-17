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

**BETA**: This package is in beta and is being rapidly and actively developed on, so some design choices are subject to change.

**Summary**: Asset-transfer-api is a library focused on simplifying constructing asset transfers for substrate based chains that involves system parachains like Statemine, and Statemint.

## Usage

### Npm

`npm install @substrate/asset-transfer-api`

### Yarn

`yarn add @substrate/asset-transfer-api`

### Example

```typescript
import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api';

// NOTE: This should all be wrapped in an asynchronous layer.

// This constructs a polkadot-js ApiPromise 
const apiPromise = await constructApiPromise('wss://westmint-rpc.polkadot.io');

await apiPromise.isReady

const assetsApi = new AssetsTransferAPI(apiPromise);

const call = await assetsApi.createTransferTransaction(
  '1984', // destChainId (If the destination is a relay chain put `0`)
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

For more information, refer to the [docs](https://github.com/paritytech/asset-transfer-api/tree/main/docs) in the repository.

## License

The source code in this repository is distributed under the GPLv3 license. See the <LICENSE> file. This source code comes with absolutely no warranty. Use at your own risk.

## Zombienet Testing

Zombienet is used to launch a complete network including a relay chain, and two parachains. It will create hrmp channels betweens the launched parachains allowing the testing enviornment to send xcm messages and transfer assets. 

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
