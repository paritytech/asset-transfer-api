/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a `polkadotXcm` pallet `transferAssets` call to send 1 WND (asset with location `{"parents":"1","interior":{"Here":""}}`)
 * from a Westend Asset Hub (System Parachain) account
 * to a Westend BridheHub account, where the `xcmVersion` is set to safeXcmVersion and no `weightLimit` option is provided declaring that
 * the tx will allow unlimited weight to be used for fees. The `dryRunCall` option is set to true, which allows for the transaction to be dry run after being constructed. The
 * fee for each XCM and the overall execution result will be returned with the TxResult info.
 *
 * NOTE: When dry running a call, the `sendersAddr` field must be provided.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://westend-asset-hub-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);
	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1002',
			'5HBuLJz9LdkUNseUEL6DLeVkx2bqEi6pQr8Ea7fS4bzx7i7E',
			['wnd'],
			['10000000000'],
			{
				format: 'call',
				dryRunCall: true,
				sendersAddr: '5EJWF8s4CEoRU8nDhHBYTT6QGFGqMXTmdQdaQJVEFNrG9sKy',
				xcmVersion: safeXcmVersion,
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
