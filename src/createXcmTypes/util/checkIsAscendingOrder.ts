// Copyright 2023 Parity Technologies (UK) Ltd.

export type MultiAssetInterior =
	| {
			X2: [{ PalletInstance: string }, { GeneralIndex: string }];
	  }
	| {
			Here: string;
	  };

export type MultiAsset = {
	fun: {
		Fungible: string;
	};
	id: {
		Concrete: {
			interior: MultiAssetInterior;
			parents: number;
		};
	};
};

export const isAscendingOrder = (assets: MultiAsset[]): boolean => {
	if (assets.length === 0) {
		return true;
	}

	return assets.every(function (asset, idx) {
		return (
			idx === 0 ||
			parseInt(asset.fun.Fungible) >= parseInt(assets[idx - 1].fun.Fungible)
		);
	});
};
