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
	dryRunCall?: boolean;
	sendersAddr?: string;
	xcmFeeAsset?: string;
}
