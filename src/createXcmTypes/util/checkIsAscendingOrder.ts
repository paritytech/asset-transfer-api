// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';

export const isAscendingOrder = (assets: MultiAsset[]): boolean => {
	if (assets.length === 0) {
		return true;
	}

	return assets.every((asset, idx) => {
		return (
			idx === 0 ||
			BigInt(asset.fun.Fungible) >= BigInt(assets[idx - 1].fun.Fungible)
		);
	});
};
