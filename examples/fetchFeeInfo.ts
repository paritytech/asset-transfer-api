/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send WETH from a Bifrost Polkadot (Parachain) account
 * to a Polkadot AssetHub (System Parachain) account, where the `xcmVersion` is set to 3.
 *
 * `fetchFeeInfo` returns the associated weight of the transaction, the transaction's class and the estimated fee denoted in the native asset of the origin chain.
 *
 */
const main = async () => {
	const safeXcmVersion = 3;
	const { api, specName } = await constructApiPromise('wss://bifrost-polkadot-rpc.dwellir.com');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000',
			'0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063',
			['WETH'],
			['1000000000000000000'],
			{
				format: 'call',
				xcmVersion: safeXcmVersion,
			},
		);

		const feeInfo = await assetApi.fetchFeeInfo(callInfo.tx, 'call');

		console.log(
			`${PURPLE}The following feeInfo data that is returned:\n${GREEN}${JSON.stringify(feeInfo?.toHuman(), null, 4)}`,
		);
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
