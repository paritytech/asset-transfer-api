// Copyright 2023 Parity Technologies (UK) Ltd.

export interface CreateXcmCallOpts {
	weightLimit?: { refTime?: string; proofSize?: string };
	paysWithFeeDest?: string;
	isLiquidTokenTransfer: boolean;
	isForeignAssetsTransfer: boolean;
}
