/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../src';
import { TxResult } from '../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../colors';

/**
 * In this example we are creating a `transferAssets` call to send WETH
 * from a Bifrost Polkadot (Parachain) account
 * to a Polkadot AssetHub (System Parachain) account, where the `xcmVersion` is set to 3 and no `weightLimit` is provided declaring that
 * the allowable weight will be `unlimited` and `paysWithFeeDest` is asset ID `DOT` (Polkadot)
 * declaring that `DOT` `should be used to pay for tx fees on the destination chain.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const xcmVersion = 3;
	const { api, specName } = await constructApiPromise('wss://bifrost-polkadot-rpc.dwellir.com/ws', {
		throwOnConnect: true,
	});
	const assetApi = new AssetTransferApi(api, specName, xcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['WETH', 'DOT'],
			['1000000000000', '10000000000'],
			{
				format: 'call',
				xcmVersion,
				paysWithFeeDest: 'DOT', // Asset to be used to pay for fees on destination chain
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
