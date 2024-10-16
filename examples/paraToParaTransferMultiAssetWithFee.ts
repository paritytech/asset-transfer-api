/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send PHA from a Moonriver (Parachain) account
 * to a Kusama Khala (Parachain) account, where the `xcmVersion` is set to safeXcmVersion and a `weightLimit` option is provided declaring that
 * it will be a weight limited tx with a custom `refTime` and `proofSize`.
 *
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://moonriver.public.blastapi.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2004',
			'0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063',
			['189307976387032586987344677431204943363'],
			['10000000000'],
			{
				format: 'call',
				weightLimit: {
					refTime: '10000',
					proofSize: '3000',
				},
				xcmPalletOverride: 'xTokens',
				xcmVersion: safeXcmVersion,
				// NOTE: for `xTokens` pallet `transferMultiassetWithFee` txs, `paysWithFeeDest` is the multiLocation of the asset that is intended to be used to pay for fees in the dest chain
				paysWithFeeDest:
					'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}',
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
