/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a reserve payload to send 1 USDt (assetId: 1984)
 * from a Kusama Asset Hub (System Parachain) account
 * to a Moonriver (ParaChain) account, where the `xcmVersion` is set to 3 and no `weightLimit` is provided declaring that
 * the allowable weight will be `unlimited` and `paysWithFeeOrigin` is `1984`
 * declaring that asset with ID `1984` (USDt) should be used to pay for tx fees in the origin.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://kusama-asset-hub-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'payload'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2023',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['1984'],
			['1000000'],
			{
				format: 'payload',
				xcmVersion: 3,
				paysWithFeeOrigin: '1984',
				sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
			},
		);

		console.log(callInfo);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx.toHex(), 'payload');
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
