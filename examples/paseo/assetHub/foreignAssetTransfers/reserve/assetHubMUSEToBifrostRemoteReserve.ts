/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../../src';
import { TxResult } from '../../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../../colors';

/**
 * In this example we are creating a `polkadotXcm` pallet `transferAssetsUsingTypeAndThen` call to send MUSE (foreign asset with location `{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}`)
 * from a Paseo Asset Hub (System Parachain) account
 * to a Bifrost Paseo (Parachain) testnet account, where the `xcmVersion` is set to safeXcmVersion, and there is no
 * `weightLimit` option provided which declares that the tx will allow unlimited weight to be used for fees.
 * We provide a `paysWithFeeDest` asset location for MUSE which will be used to pay for fees on the destination chain.
 * We also provide a value of `RemoteReserve` for the `assetTransferType` and `feeTransferType` options declaring a custom reserve location for both
 * the `remoteReserveAssetTransferTypeLocation` and `remoteReserveFeesTransferTypeLocation` options.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, chainName, safeXcmVersion } = await constructApiPromise(
		'wss://paseo-asset-hub-rpc.polkadot.io',
		{
			throwOnConnect: true,
		},
	);
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, {
		chainName,
	});

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			`2030`,
			'0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
			[`{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}`],
			['1000000000000'],
			{
				format: 'call',
				xcmVersion: safeXcmVersion,
				paysWithFeeDest: '{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}',
				assetTransferType: 'RemoteReserve',
				remoteReserveAssetTransferTypeLocation: '{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}',
				feesTransferType: 'RemoteReserve',
				remoteReserveFeesTransferTypeLocation: '{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}',
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
