/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../../src';
import { TxResult } from '../../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../../colors';

/**
 * In this example we are creating a `polkadotXcm` pallet `transferAssets` call to send WETH (foreign asset with location `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`)
 * from a Rococo Asset Hub (System Parachain) account
 * to a Rococo Contracts (System ParaChain) account, where the `xcmVersion` is set to 4, the `isLimited` option is set to true and there is no
 * `weightLimit` option provided which declares that the tx will allow unlimited weight to be used for fees.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of either `reserveTransferAssets`, or `teleportAssets`.
 */
const main = async () => {
	const { api, specName, chainName, safeXcmVersion } = await constructApiPromise(
		'wss://rococo-asset-hub-rpc.polkadot.io',
	);
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion, {
		chainName,
	});

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1002',
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			[
				`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`,
			],
			['1000000000000'],
			{
				format: 'call',
				xcmVersion: 4,
				isLimited: true,
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
