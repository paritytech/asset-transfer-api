// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';

/**
 * This fetches the metadata for the chain we are connected to and searches for the appropriate pallet and returns its index.
 *
 * @param api ApiPromise.
 * @param isLiquidToken Boolean to determine whether or not to fetch the PoolAssets id.
 */
export const fetchPalletInstanceId = (
	api: ApiPromise,
	isLiquidToken: boolean
): string => {
	const palletName = isLiquidToken ? 'PoolAssets' : 'Assets';
	const pallet = api.registry.metadata.pallets.filter(
		(pallet) => pallet.name.toString() === palletName
	);

	if (pallet.length === 0) {
		throw Error(
			`No ${palletName} pallet available, can't find a valid PalletInstance.`
		);
	}

	return pallet[0].index.toString();
};
