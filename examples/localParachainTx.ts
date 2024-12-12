/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * The following example demonstrates a local transaction on a parachain. It is important to note that
 * if any token and or asset is passed in, the api will resolve to using the tokens pallet. When there
 * is no asset passed in it will resort to using the balances pallet.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://wss.api.moonbeam.network');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2004',
			'0xF977814e90dA44bFA03b6295A0616a897441aceC',
			[],
			['100000'],
			{
				format: 'call',
				keepAlive: true,
			},
		);

		console.log(`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(callInfo, null, 4)}`);
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
