// Copyright 2024 Parity Technologies (UK) Ltd.

export interface CreateXcmCallOpts {
	weightLimit?: { refTime?: string; proofSize?: string };
	paysWithFeeDest?: string;
	isLiquidTokenTransfer: boolean;
	isForeignAssetsTransfer: boolean;
	assetTransferType?: string;
	remoteReserveAssetTransferTypeLocation?: string;
	feesTransferType?: string;
	remoteReserveFeesTransferTypeLocation?: string;
	customXcmOnDest?: string;
	sendersAddr?: string;
}
