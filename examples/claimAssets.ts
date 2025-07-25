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
 * In this example we are creating a `claimAssets` call to claim `WND` tokens trapped in the AssetTrap of Westend AssetHub where the `xcmVersion` is set to 3.
 *
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://westend-asset-hub-rpc.polkadot.io', {
		throwOnConnect: true,
	});
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.claimAssets(
			['WND'],
			['10000000000'],
			'5HBuLJz9LdkUNseUEL6DLeVkx2bqEi6pQr8Ea7fS4bzx7i7E',
			{
				format: 'call',
				xcmVersion: safeXcmVersion,
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
