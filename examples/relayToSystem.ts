/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send 1 WND from a Westend (Relay Chain) account
 * to a Westmint (System Parachain) account, where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise(
		'wss://westend-rpc.polkadot.io'
	);
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['WND'],
			['1000000000000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 2,
			}
		);

		
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	
};

main().finally(() => process.exit());
