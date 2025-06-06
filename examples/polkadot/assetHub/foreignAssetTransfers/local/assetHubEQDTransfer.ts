/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../../src';
import { TxResult } from '../../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../../colors';

/**
 * In this example we are creating a `foreignAssets` pallet `transfer` call to send EQD (foreign asset with location `{"parents":"1","interior":{"X2":[{"Parachain":"2011"},{"GeneralKey":{"length":"3","data":"0x6571640000000000000000000000000000000000000000000000000000000000"}}]}}`)
 * from a Polkadot Asset Hub (System Parachain) account
 * to a Polkadot Asset Hub (System Parachain) account.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://polkadot-asset-hub-rpc.polkadot.io', {
		throwOnConnect: true,
	});
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000', // NOTE: The destination id is `1000` and matches the origin chain making this a local transfer
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2011"},{"GeneralKey":{"length":"3","data":"0x6571640000000000000000000000000000000000000000000000000000000000"}}]}}',
			],
			['1000000000000'],
			{
				format: 'call',
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
