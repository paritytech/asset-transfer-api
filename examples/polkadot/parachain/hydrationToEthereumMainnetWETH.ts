/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../src';
import { TxResult } from '../../../src/types';
import { GREEN, PURPLE, RESET } from '../../colors';

/**
 * In this example we are creating a `transferAssetsUsingTypeAndThen` call to send Snowbridge WETH
 * from a Hydration Polkadot (Parachain) account
 * to a Ethereum Mainner (Chain Id 1) account, where the `xcmVersion` is set to 4 and no `weightLimit` is provided declaring that
 * the allowable weight will be `unlimited` and `paysWithFeeDest` is asset ID `DOT` (Polkadot)
 * declaring that `DOT` `should be used to pay for tx fees on the first leg of the XCM transfer (Polkadot AssetHub).
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const xcmVersion = 4;
	const { api, specName } = await constructApiPromise('wss://hydradx-rpc.dwellir.com');
	const assetApi = new AssetTransferApi(api, specName, xcmVersion, {
		injectedRegistry: {
			polkadot: {
				2034: {
					xcAssetsData: [
						{
							symbol: 'WETH.snow',
							xcmV1MultiLocation:
								'{"v1":{"parents":2,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}',
						},
					],
				},
			},
		},
	});

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			`{"parents":"2","interior":{"X1":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}]}}`,
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['WETH.snow', 'DOT'],
			['1000000000000', '10000000000'],
			{
				sendersAddr: '7KqMfyEXGMAgkNGxiTf3PNgKqSH1WNghbAGLKezYyLLW4Zp1',
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
