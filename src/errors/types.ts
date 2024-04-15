// Copyright 2023 Parity Technologies (UK) Ltd.

export interface CheckXcmTxInputsOpts {
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
	isPrimaryParachainNativeAsset: boolean;
	paysWithFeeDest?: string;
	weightLimit?: { refTime?: string; proofSize?: string };
}
