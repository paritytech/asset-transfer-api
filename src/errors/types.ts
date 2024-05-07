// Copyright 2024 Parity Technologies (UK) Ltd.

export interface CheckXcmTxInputsOpts {
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
	isPrimaryParachainNativeAsset: boolean;
	paysWithFeeDest?: string;
	weightLimit?: { refTime?: string; proofSize?: string };
	assetTransferType?: string;
	remoteReserveAssetTransferTypeLocation?: string;
	feesTransferType?: string;
	remoteReserveFeesTransferTypeLocation?: string;
}
