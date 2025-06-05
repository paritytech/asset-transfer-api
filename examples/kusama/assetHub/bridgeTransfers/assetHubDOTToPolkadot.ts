/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi } from '../../../../src/AssetTransferApi.js';
import { constructApiPromise } from '../../../../src/constructApiPromise.js';
import { TxResult } from '../../../../src/types.js';
import { GREEN, PURPLE, RESET } from '../../../colors.js';

/**
 * In this example we are creating a `polkadotXcm` pallet `transferAssets` call to send 1 DOT (foreign asset with location `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`)
 * from a Kusama Asset Hub (System Parachain) account
 * to a Polkadot Asset Hub account, where the `xcmVersion` is set to safeXcmVersion and no `weightLimit` option is provided declaring that
 * the tx will allow unlimited weight to be used for fees.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://kusama-asset-hub-rpc.polkadot.io', {
		throwOnConnect: true,
	});
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Polkadot"},{"Parachain":"1000"}]}}`,
			'13EoPU88424tufnjevEYbbvZ7sGV3q1uhuN4ZbUaoTsnLHYt',
			[`{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`],
			['10000000000'],
			{
				format: 'call',
				xcmVersion: safeXcmVersion,
			},
		);

		console.log(callInfo);
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
