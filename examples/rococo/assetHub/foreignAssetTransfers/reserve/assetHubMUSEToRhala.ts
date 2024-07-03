/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../../src';
import { TxResult } from '../../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../../colors';

/**
 * In this example we are creating a `polkadotXcm` pallet `transferAssetsUsingTypeAndThen` call to send MUSE (foreign asset with location `{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}`)
 * from a Rococo Asset Hub (System Parachain) account
 * to a Rhala Testnet (ParaChain) account, where the `xcmVersion` is set to safeXcmVersion, and there is no
 * `weightLimit` option provided which declares that the tx will allow unlimited weight to be used for fees.
 *  * The `paysWithFeeDest` value is set to pay fees with `MUSE` and the values for `assetTransferType` and `feesTransferType`
 * are both set to `LocalReserve` specifying that the reserve location to be used for transfers and fees is AssetHub.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion, chainName } = await constructApiPromise(
		'wss://rococo-asset-hub-rpc.polkadot.io',
	);
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, { chainName });

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2004',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			[`{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}`],
			['1000000000000'],
			{
				format: 'call',
				xcmVersion: safeXcmVersion,
				paysWithFeeDest: '{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}',
				assetTransferType: 'LocalReserve',
				feesTransferType: 'LocalReserve',
			},
		);

		console.log(callInfo);
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
