/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send LiquidPool Asset '0' from a Westmint (System Parachain) account
 * to a Injected (Parachain) called 'testing', where the `xcmVersion` is set to 2, and the `isLimited` declaring that
 * it will be `unlimited` since there is no `weightLimit` option as well.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of the either `reserveAssetTransfer`, or `teleportAssets`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise(
		'wss://westmint-rpc.polkadot.io'
	);
	const injectedRegistry = {
		westend: {
			'2023': {
				tokens: ['TST'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				specName: 'testing',
				assetsPalletInstance: '100',
				foreignAssetsPalletInstance: '1000',
				poolPairsInfo: {},
			},
		},
	};
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion, {
		injectedRegistry,
	});

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2023',
			'0xF977814e90dA44bFA03b6295A0616a897441aceC',
			['0'],
			['100000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 2,
				transferLiquidToken: true,
			}
		);

		console.log(
			`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(
				callInfo,
				null,
				4
			)}`
		);
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
