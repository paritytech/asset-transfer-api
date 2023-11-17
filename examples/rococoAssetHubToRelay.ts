/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { parseRegistry, Registry } from '../src/registry';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send 1 ROC from a asset-hub-rococo (System Parachain) account
 * to a Rococo (Relay Chain) account, where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE:
 *
 * - When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 *
 * - Currently rococos asset-hub shares the same `specName` as kusamas asset-hub, therefore to use rococo you will need to hardcore the
 * `specName` value as `asset-hub-rococo` into the `AssetTransferApi`.
 */
const main = async () => {
	const { api, safeXcmVersion } = await constructApiPromise('wss://rococo-asset-hub-rpc.polkadot.io');
	const specName = 'asset-hub-rococo';
	const assetRegistry = await parseRegistry({});
	const registry = new Registry(specName, assetRegistry);
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, registry);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'0', // NOTE: The destination id is `0` noting that we are sending to the relay chain.
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['ROC'],
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
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

main().finally(() => process.exit());
