// Copyright 2023 Parity Technologies (UK) Ltd.

import { ForeignAssetMultiLocation } from '../../types';
import { SYSTEM_PARACHAINS_IDS } from '../../consts';
import { BaseError } from '../../errors';
import { Registry } from '../../registry';
import { getChainIdBySpecName } from './getChainIdBySpecName';

/**
 * Returns the correct asset index for a valid system chain token symbol
 * errors if given an invalid symbol
 *
 * @param tokenSymbol string
 * @param specName string
 */
export const getSystemChainTokenSymbolGeneralIndex = (
	asset: string,
	specName: string,
	transferForeignAssets?: boolean
): string => {
	console.log('WHAT IS ASSET', asset);
	let assetId: string | undefined = '';

	const newRegistry = new Registry(specName, {});

	const systemChainId = getChainIdBySpecName(newRegistry, specName);

	if (!SYSTEM_PARACHAINS_IDS.includes(systemChainId)) {
		throw new BaseError(
			`specName ${specName} did not match a valid system chain ID. Found ID ${systemChainId}`
		);
	}

	if (transferForeignAssets) {
		const foreignAsset = (JSON.stringify(asset)) as unknown as ForeignAssetMultiLocation;
		console.log('foreign asset is', foreignAsset);

		const { foreignAssetsInfo } = newRegistry.currentRelayRegistry[systemChainId];
		console.log('foreign assets', foreignAssetsInfo);

		if (foreignAssetsInfo)
	} else {
		const { assetsInfo } = newRegistry.currentRelayRegistry[systemChainId];

		if (Object.keys(assetsInfo).length === 0) {
			throw new BaseError(
				`${specName} has no associated token symbol ${asset}`
			);
		}
	
		// get the corresponding asset id index from the assets registry
		assetId = Object.keys(assetsInfo).find(
			(key) => assetsInfo[key].toLowerCase() === asset.toLowerCase()
		);
	
		if (!assetId) {
			throw new BaseError(
				`general index for assetId ${asset} was not found`
			);
		}
	
	}
	
	return assetId;
};
