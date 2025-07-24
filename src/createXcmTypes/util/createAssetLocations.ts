import { ApiPromise } from '@polkadot/api';

import { Registry } from '../../registry/index.js';
import { validateNumber } from '../../validate/index.js';
import { FungibleAssetType, OneOfXcmJunctions, XcmCreator, XcmMultiAssets, XcmMultiLocation } from '../types.js';
import { dedupeAssets } from './dedupeAssets.js';
import { fetchPalletInstanceId } from './fetchPalletInstanceId.js';
import { getAssetId } from './getAssetId.js';
import { isRelayNativeAsset } from './isRelayNativeAsset.js';
import { sortAssetsAscending } from './sortAssetsAscending.js';

export const createAssetLocations = async ({
	api,
	assetIds,
	specName,
	amounts,
	registry,
	originChainId,
	isLiquidTokenTransfer,
	xcmCreator,
}: {
	api: ApiPromise;
	assetIds: string[];
	specName: string;
	amounts: string[];
	registry: Registry;
	originChainId: string;
	isLiquidTokenTransfer: boolean;
	xcmCreator: XcmCreator;
}): Promise<XcmMultiAssets> => {
	let multiAssets: FungibleAssetType[] = [];

	const isRelayChain = originChainId === '0' ? true : false;

	for (let i = 0; i < assetIds.length; i++) {
		let multiLocation: XcmMultiLocation;
		const amount = amounts[i];
		let assetId = assetIds[i];

		const isValidInt = validateNumber(assetId);
		const isRelayNative = isRelayNativeAsset(registry, assetId);

		const isLocation = assetId.toLowerCase().includes('parents');

		if (!isLocation && !isRelayNative && !isValidInt) {
			assetId = await getAssetId({
				api,
				registry,
				asset: assetId,
				specName,
				xcmCreator,
				isForeignAssetsTransfer: isLocation,
			});
		}

		if (isLocation) {
			multiLocation = xcmCreator.resolveMultiLocation(assetId);
		} else {
			const parents = isRelayNative && !isRelayChain ? 1 : 0;
			let interior: OneOfXcmJunctions;
			if (isRelayNative) {
				interior = { Here: '' };
			} else {
				const palletId = fetchPalletInstanceId({
					api,
					assetId,
					isLiquidToken: isLiquidTokenTransfer,
					isForeignAsset: isLocation,
					xcmCreator,
				});
				interior = {
					X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }],
				};
			}

			multiLocation = {
				parents,
				interior,
			};
		}
		const multiAsset = xcmCreator.fungibleAsset({
			amount,
			multiLocation,
		});

		multiAssets.push(multiAsset);
	}

	multiAssets = sortAssetsAscending(multiAssets);
	const sortedAndDedupedMultiAssets = dedupeAssets(multiAssets);

	return xcmCreator.multiAssets(sortedAndDedupedMultiAssets);
};
