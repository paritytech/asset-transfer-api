/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi } from '../src/AssetsTransferApi';
import { constructApiPromise } from '../src/constructApiPromise';

const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise(
		'wss://westend-rpc.polkadot.io'
	);
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion);

	try {
		const callHex = await assetApi.createTransferTransaction(
			'1000',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['WND'],
			['1000000000'],
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
