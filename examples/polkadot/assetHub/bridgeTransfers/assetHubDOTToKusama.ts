/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../src';
import { TxResult } from '../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../colors';

/**
 * In this example we are creating a `polkadotXcm` pallet `transferAssets` call to send 1 DOT (asset with location `{"parents":"1","interior":{"Here":""}}`)
 * from a Polkadot Asset Hub (System Parachain) account
 * to a Kusama Asset Hub account, where the `xcmVersion` is set to safeXcmVersion and no `weightLimit` option is provided declaring that
 * the tx will allow unlimited weight to be used for fees.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://polkadot-asset-hub-rpc.polkadot.io'), {
		throwOnConnect: true,
	};
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			`{"parents":"2","interior":{"X2":[{"GlobalConsensus":"Kusama"},{"Parachain":"1000"}]}}`,
			'Ep7uTCvpbpMDnbfTyzbMQTQQqZ5ACGx5nUKnxmBjB4ktmSa',
			[`DOT`],
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

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
