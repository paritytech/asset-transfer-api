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
 * In this example we are creating a call to send LiquidPool Asset '0' locally on westmint, using the `keepAlive` option.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://westmint-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000',
			'0xF977814e90dA44bFA03b6295A0616a897441aceC',
			['0'],
			['100000'],
			{
				format: 'call',
				keepAlive: true,
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
