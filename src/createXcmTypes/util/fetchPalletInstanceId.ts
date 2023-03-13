import type { ApiPromise } from '@polkadot/api';

/**
 * This fetches the metadata for the chain we are connected to and searches for the Assets pallet and returns its index.
 *
 * @param api ApiPromise
 */
export const fetchPalletInstanceId = (api: ApiPromise): string => {
	const assetsPallet = api.registry.metadata.pallets.filter(
		(pallet) => pallet.name.toString() === 'Assets'
	);

	if (assetsPallet.length === 0) {
		throw Error(
			"No assets pallet available, can't find a valid PalletInstance."
		);
	}

	return assetsPallet[0].index.toString();
};
