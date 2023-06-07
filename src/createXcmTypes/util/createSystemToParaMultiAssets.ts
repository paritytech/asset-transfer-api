// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

import { findRelayChain, parseRegistry } from '../../registry';
import { MultiAsset, MultiAssetInterior } from '../../types';
import { isAscendingOrder } from './checkIsAscendingOrder';
import { dedupeMultiAssets } from './dedupeMultiAssets';
import { fetchPalletInstanceId } from './fetchPalletInstanceId';
import { getSystemChainTokenSymbolGeneralIndex } from './getTokenSymbolGeneralIndex';
import { sortMultiAssetsAscending } from './sortMultiAssetsAscending';

/**
 * Creates and returns a MultiAsset array for system parachains based on provided specName, assets and amounts
 *
 * @param api ApiPromise[]
 * @param amounts string[]
 * @param specName string
 * @param assets string[]
 */
export const createSystemToParaMultiAssets = (
	api: ApiPromise,
	amounts: string[],
	specName: string,
	assets: string[]
): MultiAsset[] => {
	const palletId = fetchPalletInstanceId(api);
	const multiAssets = [];
	const registry = parseRegistry({});
	const relayChain = findRelayChain(specName, registry);
	// We know this is a System parachain direction which is chainId 1000.
	const { tokens } = registry[relayChain]['1000'];

	for (let i = 0; i < assets.length; i++) {
		let assetId: string = assets[i];
		const amount = amounts[i];

		const parsedAssetIdAsNumber = Number.parseInt(assetId);
		const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);
		const isRelayNative = isRelayNativeAsset(tokens, assetId);

		if (!isRelayNative && isNotANumber) {
			assetId = getSystemChainTokenSymbolGeneralIndex(assetId, specName);
		}

		const interior: MultiAssetInterior = isRelayNative
			? { Here: '' }
			: { X2: [{ PalletInstance: palletId }, { GeneralIndex: assetId }] };
		const parents = isRelayNative ? 1 : 0;

		const multiAsset = {
			id: {
				Concrete: {
					parents,
					interior,
				},
			},
			fun: {
				Fungible: amount,
			},
		};

		multiAssets.push(multiAsset);
	}

	if (!isAscendingOrder(multiAssets)) {
		sortMultiAssetsAscending(multiAssets);
	}

	const sortedAndDedupedMultiAssets = dedupeMultiAssets(multiAssets);

	return sortedAndDedupedMultiAssets;
};

const isRelayNativeAsset = (tokens: string[], assetId: string): boolean => {
	for (const token of tokens) {
		if (token.toLowerCase() === assetId.toLowerCase()) {
			return true;
		}
	}

	return false;
};
