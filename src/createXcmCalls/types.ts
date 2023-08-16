// Copyright 2023 Parity Technologies (UK) Ltd.

export interface CreateXcmCallOpts {
	isLimited?: boolean;
	weightLimit?: { refTime?: string; proofSize?: string };
	paysWithFeeDest?: string;
	isLiquidTokenTransfer: boolean;
	isForeignAssetsTransfer: boolean;
}
