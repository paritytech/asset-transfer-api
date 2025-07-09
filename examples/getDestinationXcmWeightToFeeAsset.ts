/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi } from '../src/AssetTransferApi.js';
import { constructApiPromise } from '../src/constructApiPromise.js';
import { GREEN, PURPLE, RESET } from './colors.js';

const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://polkadot-asset-hub-rpc.polkadot.io', {
		throwOnConnect: true,
	});

	const assetTransferApi = new AssetTransferApi(api, specName, safeXcmVersion);

	const sendersAddr = '16FNntR3F4ZjsTdYHysWSiP2vGHoVL7uZ9tyfyd4o5Cdaghf';
	const tx =
		'0x1f0b04010100c91f0400010100e823f55dbee3d394f448f2f74194078ba4259e4b31c28e155c29531106a8ea0804080002043205011f0002093d000100000700e40b54020000000000';
	const dryRunResult = await assetTransferApi.dryRunCall(sendersAddr, tx, 'call');

	const hydrationAssetHubUsdtAssetId = '10';
	const destinationFees = await AssetTransferApi.getDestinationXcmWeightToFeeAsset(
		'hydradx',
		'wss://hydration.ibp.network',
		4,
		dryRunResult,
		hydrationAssetHubUsdtAssetId,
	);

	let feeCount = 0;
	for (const fee of destinationFees) {
		if (feeCount > 0) {
			console.log('--------------------------------------------------------------------------------');
		}
		const [xcm, feeInfo] = fee;
		console.log(`${PURPLE}XCM:\n${GREEN}${JSON.stringify(xcm, null, 4)}${RESET}`);
		console.log();
		console.log(`${PURPLE}FeeInfo:\n${GREEN}${JSON.stringify(feeInfo, null, 4)}${RESET}`);
		feeCount += 1;
	}
};

void (async () => {
	try {
		await main();
	} catch (err) {
		console.error(err);
		process.exit(1);
	} finally {
		process.exit();
	}
})();
