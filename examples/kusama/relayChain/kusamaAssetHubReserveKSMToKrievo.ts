/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../src';
import { TxResult } from '../../../src/types';
import { GREEN, PURPLE, RESET } from '../../colors';

/**
 * In this example we are creating an `xcmPallet` `transferAssetsUsingTypeAndThen` call to send 1 KSM (asset with location `{"parents":"0","interior":{"Here":""}}`)
 * from a Kusama (Relay Chain) account
 * to a Kreivo Parachain account using Kusama AssetHub as a reserve location, where the `xcmVersion` is set to 3 and no `weightLimit` option is provided declaring that
 * the tx will allow unlimited weight to be used for fees.
 * The `paysWithFeeDest` value is set to pay fees with KSM and the values for `assetTransferType` and `feesTransferType`
 * are both set to `Teleport` specifying that the transfer type to be used for the first hop to AssetHub is a `teleport`.
 * The `customXcmOnDest` field specifies three XCM instructions (`depositReserveAsset`, `buyExecution` and `depositAsset`) which will be executed
 * on Kusama AssetHub in order to `ReserveTransfer` the deposited `KSM` to Kreivo from Kusama AssetHub.
 *
 * NOTE: To specify the amount of weight for the tx to use provide a `weightLimit` option containing desired values for `refTime` and `proofSize`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://kusama-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			`1000`,
			'13EoPU88424tufnjevEYbbvZ7sGV3q1uhuN4ZbUaoTsnLHYt',
			[`{"parents":"0","interior":{"Here":""}}`],
			['1000000000000'],
			{
				format: 'call',
				xcmVersion: 3,
				paysWithFeeDest: `{"parents":"0","interior":{"Here":""}}`,
				assetTransferType: 'Teleport',
				feesTransferType: 'Teleport',
				customXcmOnDest: `[{"depositReserveAsset":{"assets":{"Wild":{"AllCounted":"1"}},"dest":{"parents":"1","interior":{"X1":{"Parachain":"2281"}}}}},{"buyExecution":{"fees":{"id":{"concrete":{"parents":"1","interior":{"Here":""}}},"fun":{"fungible":"100000000000"}},"weightLimit":{"Unlimited":""}}},{"depositAsset":{"assets":{"Wild":{"AllCounted":"1"}},"beneficiary":{"parents":"0","interior":{"X1":{"AccountId32":{"id":"0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b"}}}}}}]`,
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
