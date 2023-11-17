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
 * In this example we are creating a call to send PHA from a Moonriver (Parachain) account
 * to a Kusama Khala (Parachain) account, where the `xcmVersion` is set to 2, and `isLimited` is set to true declaring that
 * it will be a weight limited tx and provides the `weightLimit` with both `refTime` and `proofSize` respectively.
 *
 * NOTE: When `isLimited` is true it will expect for refTime and proofSize to be provided as additional arguments.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://moonriver.public.blastapi.io');
	const assetRegistry = await parseRegistry({});
	const registry = new Registry(specName, assetRegistry);
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, registry);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2004',
			'0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063',
			['189307976387032586987344677431204943363'],
			['10000000000'],
			{
				format: 'call',
				isLimited: true,
				weightLimit: {
					refTime: '10000',
					proofSize: '3000',
				},
				xcmVersion: 2,
				// NOTE: for `xTokens` pallet `transferMultiassetWithFee` txs, `paysWithFeeDest` is the multiLocation of the asset that is intended to be used to pay for fees in the dest chain
				paysWithFeeDest:
					'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}',
			}
		);

		console.log(`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(callInfo, null, 4)}`);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

main().finally(() => process.exit());
