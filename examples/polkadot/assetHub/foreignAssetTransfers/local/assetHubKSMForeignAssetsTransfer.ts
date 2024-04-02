/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../../src';
import { TxResult } from '../../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../../colors';

/**
 * In this example we are creating a `foreignAssets` pallet `transfer` call to send KSM (foreign asset with location {"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}`)
 * from a Polkadot Asset Hub (System Parachain) account
 * to a Polkadot Asset Hub (System Parachain) account.
 *
 * NOTE: To specify the amount of weight for the tx to use, set `isLimited` to true and provide a `weightLimit` option containing desired values for `refTime` and `proofSize`..
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://polkadot-asset-hub-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000', // NOTE: The destination id is `1000` and matches the origin chain making this a local transfer
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}'],
			['1000000000000'],
			{
				format: 'call',
				xcmVersion: 3, // Note: GlobalConsensus junctions require XCM V3 or higher
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
