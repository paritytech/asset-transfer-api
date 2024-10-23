import type { AssetTransferApi } from '../AssetTransferApi.js';
import { CreateXcmCallOpts } from '../createXcmCalls/types.js';
import type { Format, TxResult } from '../types.js';

export type TestMultiasset = [parachainId: string, assetId: string, expected: `0x${string}`];

export type TestMultiassets = [parachainId: string, assetIds: string[], amounts: string[], expected: `0x${string}`];

export type TestMultiassetWithFormat = [parachainId: string, assetId: string, format: string, expected: `0x${string}`];

export type TestMultiassetsWithFormat = [
	parachainId: string,
	assetIds: string[],
	amounts: string[],
	format: string,
	expected: `0x${string}`,
];

export const paraTransferAssets = async <T extends Format>(
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
			format,
			xcmVersion,
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
		},
	);
};

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
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
			xcmPalletOverride: 'xTokens',
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
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
			xcmPalletOverride: 'xTokens',
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
			weightLimit: opts.weightLimit,
			sendersAddr: 'FBeL7DanUDs5SZrxZY1CizMaPgG9vZgJgvr52C2dg81SsF1',
			xcmPalletOverride: 'xTokens',
		},
	);
};
