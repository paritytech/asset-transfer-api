import { ApiPromise } from '@polkadot/api';

/**
 * This fetches the metadata for the chain we are connected to and searches for the Assets pallet and returns its index.
 *
 * @param api ApiPromise
 */
export const fetchPalletInstanceId = async (
	api: ApiPromise
): Promise<string> => {
	const metadata = await api.rpc.state.getMetadata();
	const pallets = metadata.asV14.pallets;
	const assetsPallet = pallets.filter(
		(pallet) => pallet.name.toString() === 'Assets'
	);

	if (assetsPallet.length === 0) {
		throw Error(
			"No assets pallet available, can't find a valid PalletInstance."
		);
	}

	return assetsPallet[0].index.toString();
};
