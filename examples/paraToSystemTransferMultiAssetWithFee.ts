/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetsTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send 1 xcRMRK from a Moonriver (Parachain) account
 * to a Kusama Asset Hub (System Parachain) account, where the `xcmVersion` is set to 3, and `isLimited` is set to true declaring that
 * it will be a weight limited tx and provides the `weightLimit` with both `refTime` and `proofSize` respectively.
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
			['182365888117048807484804376330534607370'], // note: we are passing in the assetId for xcRMRK on Moonriver
			['10000000000'],
			{
				format: 'call',
				isLimited: true,
				weightLimit: {
					refTime: '10000',
					proofSize: '3000',
				},
				xcmVersion: 3,
				// NOTE: for xTokens txs, paysWithFeeDest is a multiLocation that is used to pay for fees in the dest chain
				paysWithFeeDest:
					'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}',
			}
		);

		
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	
};

main().finally(() => process.exit());
