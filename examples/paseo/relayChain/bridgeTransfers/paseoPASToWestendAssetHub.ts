/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../src';
import { TxResult } from '../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../colors';

/**
 * In this example we are creating an `xcmPallet` `transferAssetsUsingTypeAndThen` call to send 1 PAS (asset with location `{"parents":"0","interior":{"Here":""}}`)
 * from a Paseo (Relay Chain) account
 * to a Westend Asset Hub account, where the `xcmVersion` is set to 4 and no `weightLimit` option is provided declaring that
 * the tx will allow unlimited weight to be used for fees.
 * The `paysWithFeeDest` value is set to pay fees with PAS and the values for `assetTransferType` and `feesTransferType`
 * are both set to the `RemoteReserve` location of Paseo AssetHub, specifying that the reserve location to be used for transferring and fees is Paseo AssetHub.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://paseo-rpc.polkadot.io', {
		throwOnConnect: true,
	});
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			`{"parents":"1","interior":{"X2":[{"GlobalConsensus":"Westend"},{"Parachain":"1000"}]}}`,
			'13EoPU88424tufnjevEYbbvZ7sGV3q1uhuN4ZbUaoTsnLHYt',
			[`{"parents":"0","interior":{"Here":""}}`],
			['1000000000000'],
			{
				format: 'call',
				xcmVersion: 4,
				paysWithFeeDest: `{"parents":"0","interior":{"Here":""}}`,
				assetTransferType: 'RemoteReserve',
				remoteReserveAssetTransferTypeLocation: '{"parents":"0","interior":{"X1":{"Parachain":"1000"}}}',
				feesTransferType: 'RemoteReserve',
				remoteReserveFeesTransferTypeLocation: '{"parents":"0","interior":{"X1":{"Parachain":"1000"}}}',
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
