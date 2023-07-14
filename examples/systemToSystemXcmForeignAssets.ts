/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send foreign asset '{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}'
 * from a Kusama Asset Hub (System Parachain) account
 * to a Kusama Collectives (System Chain) account, where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise(
		'wss://kusama-asset-hub-rpc.polkadot.io'
	);
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1001', // NOTE: The destination id is `1001` noting that we are sending to the collectives/encointer System parachain
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			[
				'{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
			],
			['1000000000000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 2,
			}
		);

		console.log(callInfo);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	console.log(
		`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(
			JSON.parse(decoded),
			null,
			4
		)}${RESET}`
	);
};

main().finally(() => process.exit());
