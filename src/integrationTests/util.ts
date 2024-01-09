import type { AssetTransferApi } from '../AssetTransferApi';
import { CreateXcmCallOpts } from '../createXcmCalls/types';
import type { Format, TxResult } from '../types';

export type TestMultiasset = [parachainId: string, assetId: string, expected: TxResult<'payload'>];

export type TestMultiassets = [
	parachainId: string,
	assetIds: string[],
	amounts: string[],
	expected: TxResult<'payload'>,
];

export type TestMultiassetWithFormat = [
	parachainId: string,
	assetId: string,
	format: string,
	expected: TxResult<'payload'>,
];

export type TestMultiassetsWithFormat = [
	parachainId: string,
	assetIds: string[],
	amounts: string[],
	format: string,
	expected: TxResult<'payload'>,
];

export const paraTransferMultiasset = async <T extends Format>(
	parachainATA: AssetTransferApi,
	format: T,
	xcmVersion: number,
	destChainId: string,
	assetId: string,
	opts: CreateXcmCallOpts,
): Promise<TxResult<T>> => {
	return await parachainATA.createTransferTransaction(
		destChainId,
		'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		[assetId],
		['10000000000'],
		{
			format,
			xcmVersion,
			isLimited: opts.isLimited,
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		},
	);
};

export const paraTransferMultiassets = async <T extends Format>(
	parachainATA: AssetTransferApi,
	format: T,
	xcmVersion: number,
	destChainId: string,
	assetIds: string[],
	amounts: string[],
	opts: CreateXcmCallOpts,
): Promise<TxResult<T>> => {
	return await parachainATA.createTransferTransaction(
		destChainId,
		'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		assetIds,
		amounts,
		{
			paysWithFeeDest: '0',
			format,
			xcmVersion,
			isLimited: opts.isLimited,
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		},
	);
};

export const paraTransferMultiassetWithFee = async <T extends Format>(
	parachainATA: AssetTransferApi,
	format: T,
	xcmVersion: number,
	destChainId: string,
	assetId: string,
	opts: CreateXcmCallOpts,
): Promise<TxResult<T>> => {
	return await parachainATA.createTransferTransaction(
		destChainId,
		'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		[assetId],
		['10000000000'],
		{
			paysWithFeeDest:
				'{"parents": "1", "interior": {"X3": [{"Parachain": "1000"}, {"PalletInstance": "50"}, {"GeneralIndex": "1984"}]}}',
			format,
			xcmVersion,
			isLimited: opts.isLimited,
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		},
	);
};

export const paraTeleportNativeAsset = async <T extends Format>(
	parachainATA: AssetTransferApi,
	format: T,
	nativeAssetId: string,
	xcmVersion: number,
	opts: CreateXcmCallOpts,
): Promise<TxResult<T>> => {
	return await parachainATA.createTransferTransaction(
		'1000', // `1000` indicating the dest chain is a system chain.
		'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		[nativeAssetId],
		['10000000000'],
		{
			format,
			xcmVersion,
			isLimited: opts.isLimited,
			weightLimit: opts.weightLimit,
			sendersAddr: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
		},
	);
};
