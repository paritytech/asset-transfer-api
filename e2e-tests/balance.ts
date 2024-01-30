// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { FrameSystemAccountInfo, PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import type { Option } from '@polkadot/types-codec';

export interface IBalance {
	initial: [string, number][];
	final: [string, number][];
}

/**
 *
 * @param api api instance
 * @param test name of the test currently being ran
 * @param address address of the account whose balance is being queried
 * @param assetIds Ids of the assets being queried
 * @param balance initial balance for the account queried
 * @returns instance of IBalance containing the initial and optionally the final
 * balance of the account queried
 */
export const balanceTracker = async (
	api: ApiPromise,
	test: string,
	address: string,
	assetIds: string[],
	balance?: IBalance,
): Promise<IBalance> => {
	let balances: IBalance = { initial: [], final: [] };
	let accountInfo: FrameSystemAccountInfo | Option<PalletAssetsAssetAccount>;
	switch (test) {
		case '--foreign-assets':
			if (!balance) {
				for (const assetId of assetIds) {
					accountInfo = (await api.query.foreignAssets.account(assetId, address)) as Option<PalletAssetsAssetAccount>;
					if (accountInfo.valueOf() === null) {
						balances.initial.push([assetId, 0]);
					} else {
						balances.initial.push([assetId, accountInfo.unwrap().balance.toBn().toNumber()]);
					}
				}
			} else {
				balances = balance;
				for (const assetId of assetIds) {
					accountInfo = (await api.query.foreignAssets.account(assetId, address)) as Option<PalletAssetsAssetAccount>;
					balances.final.push([assetId, accountInfo.unwrap().balance.toBn().toNumber()]);
				}
			}
			return balances;
		case '--liquidity-assets':
			if (!balance) {
				for (const assetId of assetIds) {
					accountInfo = await api.query.poolAssets.account(assetId, address);
					if (accountInfo.isNone) {
						balances.initial.push([assetId, 0]);
					} else {
						balances.initial.push([assetId, accountInfo.unwrap().balance.toBn().toNumber()]);
					}
				}
			} else {
				balances = balance;
				for (const assetId of assetIds) {
					accountInfo = await api.query.poolAssets.account(assetId, address);
					balances.final.push([assetId, accountInfo.unwrap().balance.toBn().toNumber()]);
				}
			}
			return balances;
		case '--local':
			if (!balance) {
				accountInfo = await api.query.system.account(address);
				if (accountInfo === null) {
					balances.initial.push(['0', 0]);
				} else {
					balances.initial.push(['0', Number(accountInfo.data.free)]);
				}
			} else {
				balances = balance;
				accountInfo = await api.query.system.account(address);
				balances.final.push(['0', Number(accountInfo.data.free)]);
			}
			return balances;
		case '--assets':
			if (!balance) {
				for (const assetId of assetIds) {
					accountInfo = await api.query.assets.account(assetId, address);
					if (accountInfo.isNone) {
						balances.initial.push([assetId, 0]);
					} else {
						balances.initial.push([assetId, accountInfo.unwrap().balance.toBn().toNumber()]);
					}
				}
			} else {
				balances = balance;
				for (const assetId of assetIds) {
					accountInfo = await api.query.assets.account(assetId, address);
					balances.final.push([assetId, accountInfo.unwrap().balance.toBn().toNumber()]);
				}
			}
			return balances;
		default:
			if (!balance) {
				for (const assetId of assetIds) {
					accountInfo = await api.query.system.account(address);
					if (accountInfo) {
						balances.initial.push([assetId, accountInfo.data.free.toBn().toNumber()]);
					} else {
						balances.initial.push([assetId, 0]);
					}
				}
			} else {
				balances = balance;
				for (const assetId of assetIds) {
					accountInfo = await api.query.system.account(address);
					balances.final.push([assetId, accountInfo.data.free.toBn().toNumber()]);
				}
			}
			return balances;
	}
};
