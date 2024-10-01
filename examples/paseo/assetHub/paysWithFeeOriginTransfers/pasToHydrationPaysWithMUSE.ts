/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../src';
import { TxResult } from '../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../colors';

/**
 * In this example we are creating a `transferAssets` payload to send 1 PAS
 * from a Paseo Asset Hub (System Parachain) account
 * to a Hydration Paseo (Parachain) account, where the `xcmVersion` is set to safeXcmVersion and no `weightLimit` is provided declaring that
 * the allowable weight will be `unlimited` and `paysWithFeeOrigin` is asset location `{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}` (MUSE)
 * declaring that `MUSE` `should be used to pay for tx fees in the origin. In order to pay fees on the origin with a different asset than the native asset, the selected asset is expected to have an existing liquidity pool/pair with the native asset in AssetHub.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://paseo-asset-hub-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let payloadInfo: TxResult<'payload'>;
	try {
		payloadInfo = await assetApi.createTransferTransaction(
			'2034',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			[''],
			['1000000'],
			{
				format: 'payload',
				xcmVersion: safeXcmVersion,
				paysWithFeeOrigin: `{"parents":"1","interior":{"X1":{"Parachain":"3369"}}}`,
				sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
			},
		);

		const payloadWithAssetId = {
			origin: payloadInfo.origin,
			dest: payloadInfo.dest,
			direction: payloadInfo.direction,
			tx: payloadInfo.tx.toHex(),
			assetId: JSON.stringify(payloadInfo.tx.assetId),
			format: payloadInfo.format,
			method: payloadInfo.method,
			xcmVersion: payloadInfo.xcmVersion,
		};

		console.log(payloadWithAssetId);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(payloadInfo.tx.toHex(), 'payload');
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
