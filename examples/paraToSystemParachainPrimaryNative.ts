/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send MOVR from a Moonriver (Parachain) account
 * to a Kusama Asset Hub (System Parachain) account, where the `xcmVersion` is set to 3, and `isLimited` is false declaring that
 * it will allow `unlimited` weight for the tx. 
 *
 * NOTE: When `isLimited` is true it will expect for refTime and proofSize to be provided as additional arguments.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise(
		'wss://moonriver.api.onfinality.io/public-ws'
	);
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000',
			'0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063',
			['movr'], // Note: since it is the primary asset of Moonriver that is being sent to AssetHub, it will be a `teleportAssets` call
			['1000000000000'],
			{
				format: 'call',
				isLimited: false,
				xcmVersion: 3,
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
