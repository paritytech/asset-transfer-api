/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi } from '../src/AssetTransferApi.js';
import { constructApiPromise } from '../src/constructApiPromise.js';
import { TxResult } from '../src/types.js';
import { GREEN, PURPLE, RESET } from './colors.js';

/**
 * In this example we are creating a call to send LiquidPool Asset '0' from a Westmint (System Parachain) account
 * to a Injected (Parachain) called 'testing', where the `xcmVersion` is set to safeXcmVersion and no `weightLimit` option is provided declaring that
 * the tx will allow unlimited weight to be used for fees.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://westmint-rpc.polkadot.io');
	const injectedRegistry = {
		westend: {
			'2023': {
				tokens: ['TST'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				specName: 'testing',
				poolPairsInfo: {},
			},
		},
	};
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, {
		injectedRegistry,
	});

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2023',
			'0xF977814e90dA44bFA03b6295A0616a897441aceC',
			['0'],
			['100000'],
			{
				format: 'call',
				xcmVersion: safeXcmVersion,
				transferLiquidToken: true,
			},
		);

		console.log(`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(callInfo, null, 4)}`);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

void (async () => {
	try {
		await main();
	} catch (err) {
		console.error(err);
		process.exit(1);
	} finally {
		process.exit();
	}
})();
