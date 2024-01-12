## E2E Tests

End-to-end tests that run on a zombienet testnet.

**NOTE: tested using polkadot v1.4.0**

### Setup

To setup the testing environment you need to first download the `polkadot`, `polkadot-execute-worker`, `polkadot-prepare-worker` and `polkadot-parachain` from the `polkadot-sdk` [release page](https://github.com/paritytech/polkadot-sdk/releases/latest), as well as the `trappist-node` from its [release page](https://github.com/paritytech/trappist/releases/latest), and place them in the `../zombienet/bin/` folder.

You also need to have the latest `zombienet` executable in the `../zombienet/` folder, which you can download from [here](https://github.com/paritytech/zombienet/releases/latest).
 
### Launching zombienet

To launch the zombienet, all you need to do is run the following commands:
```bash
$ yarn build && yarn e2e:build
```
Then you need to run:
```bash
$ yarn e2e:zombienet
```
And this will launch the zombienet using the config file located in the `../zombienet/` directory. Once it finished its setup, you can proceed to the following step.

### Launching the tests

For testing, we provide 4 options:

* Testing liquidity tokens transfers with the command `yarn e2e:liquidity-assets`.
* Testing foreign assets transfers with the command `yarn e2e:foreign-assets`.
* Testing local transferss with the command `yarn e2e:local`.
* Testing assets transfers with the command `yarn e2e:assets`.

Each of these commands will run the appropiate script to setup the basics, located in `../scripts/`, wait for it to finish setting up the testing environment, and then go through the tests indicated in the `./tests/index.ts` file for the chosen option.

After each testing suite has been completed, it's recommended to restart the zombienet before running another test suite.
