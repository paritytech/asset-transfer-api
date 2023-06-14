/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi } from '../src/AssetsTransferApi';
import { constructApiPromise } from '../src/constructApiPromise';

/**
 * In this example we are creating a call to send 1 WND from a Westmint (System Parachain) account
 * to a Westend (Relay Chain) account, where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise(
		'wss://westmint-rpc.polkadot.io'
	);
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion);

	try {
		const callHex = await assetApi.createTransferTransaction(
			'0', // NOTE: The destination id is `0` noting that we are sending to the relay chain.
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['WND'],
			['1000000000000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 2,
			}
		);

		console.log(callHex);
	} catch (e) {
		console.error(e);
	}
};

main().finally(() => process.exit());
