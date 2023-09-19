// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { Direction } from '../../types';

export const isParachainPrimaryNativeAsset = (
	registry: Registry,
	specName: string,
	xcmDirection: Direction,
	assetId?: string
) => {
	// check direction is origin Para
	if (xcmDirection != Direction.ParaToSystem) {
		return false;
	}

	// in case of empty array, undefined assetId is considered to be the relay chains primary native asset
	if (!assetId) {
		return true;
	}

	// if assetId is an empty string
	// treat it as the parachains primary native asset
	if (assetId === '') {
		return true;
	}

	const currentChainId = registry.lookupChainIdBySpecName(specName);
	const { tokens } = registry.currentRelayRegistry[currentChainId];
	const primaryParachainNativeAsset = tokens[0];
	if (primaryParachainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
		return true;
	}

	return false;
};
