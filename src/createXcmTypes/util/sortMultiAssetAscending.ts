// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from './checkIsAscendingOrder';

export const sortMultiAssetsAscending = (multiAssets: MultiAsset[]) => {
	multiAssets.sort((a, b) => {
		const sortOrder =
			parseInt(a.fun.Fungible) < parseInt(b.fun.Fungible) ? -1 : 1;

		return sortOrder;
	});
};
