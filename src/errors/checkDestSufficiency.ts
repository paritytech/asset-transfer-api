// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';

export class InsufficientDestinationAccount extends Error {
	address: string;

	constructor(address: string) {
		const msg = `Destination is insufficient. Assets may be reaped. account=${address}`;
		super(msg);
		this.address = address;
		this.name = 'InsufficientDestinationAccount';
	}
}

export interface CheckDestSufficiencyParams {
	destApi?: ApiPromise;
	destAddr: string;
	destChainId: string;
	assetIds: string[];
	assetAmounts: string[];
}

/**
 * Check whether the destination account/address will be sufficient
 *
 * If insufficient, the transaction will be successful,
 * but the account will be reaped and assets may be lost.
 * An insufficient account, is one where the balance of
 * all sufficient assets is below the listed existential deposit
 * for that chain.
 *
 * WARN: This check is a pass-through if the optional `destApi`
 * is not provided.
 *
 * @param destApi
 * @param destChainId
 * @param destAddr
 * @param assetIds
 * @param assetAmounts
 *
 * @throws InsufficientDestinationAccount if destination will be reaped.
 */
export const checkDestSufficiency = async ({
	destApi,
	destAddr,
	destChainId,
	assetIds,
	assetAmounts,
}: CheckDestSufficiencyParams) => {
	if (!destApi) {
		// Skip sufficiency check
		// Allows introducing this feature without breaking the existing API
		return;
	}

	await verifyChainId(destApi, destChainId);

	const [isSufficient, sufficientAssets] = await checkSufficiency(destApi, destAddr);
	if (isSufficient) {
		return;
	}
	if (
		await willBeSufficentAfterTx({
			api: destApi,
			addr: destAddr,
			assetIds,
			assetAmounts,
			sufficientAssets,
		})
	) {
		return;
	}

	throw new InsufficientDestinationAccount(destAddr);
};

/**
 * Verify that the chainId returned by the API matches the expected chainId.
 *
 * @param api
 * @param chainId
 */
const verifyChainId = async (api: ApiPromise, chainId: string) => {
	const apiChainId = await api.query.parachainInfo?.parachainId();
	if (apiChainId && chainId !== apiChainId.toString()) {
		throw new Error('API returning unexpected chainId');
	}
};

type SufficientAsset = {
	id: string;
	minBalance: number;
};

/**
 * Check if an account is cuurently sufficient.
 *
 * Return a boolean and any sufficiency requirements that have been retrieved.
 *
 * @param api
 * @param addr
 * @returns Promise<[boolean, SufficientAsset[]]
 */
const checkSufficiency = async (api: ApiPromise, addr: string): Promise<[boolean, SufficientAsset[]]> => {
	const [accountInfo, existentialDeposit] = await Promise.all([
		api.query.system.account(addr),
		api.consts.balances.existentialDeposit,
	]);
	const free = accountInfo.data.free;
	const sufficients = accountInfo.sufficients;

	if (free.gte(existentialDeposit)) {
		return [true, []];
	}
	if (sufficients.toNumber() > 0) {
		return [false, []];
	}

	const sufficientAssets = await getSufficientAssets(api);
	if (await accountHasSufficientAsset(api, addr, sufficientAssets)) {
		return [true, sufficientAssets];
	}

	return [false, sufficientAssets];
};

/**
 * Get a list a sufficient assets and their minimum balances.
 *
 * WARN: Native assets are not included here.
 *
 * @param api
 * @returns
 */
const getSufficientAssets = async (api: ApiPromise): Promise<SufficientAsset[]> => {
	const assetEntries = await api.query.assets.asset.entries();
	const sufficientAssets = assetEntries
		.filter(([_, meta]) => meta.isSome && meta.unwrap().isSufficient.isTrue)
		.map(([key, meta]) => {
			const data = meta.unwrap();
			return {
				id: key.args[0].toString(),
				minBalance: data.minBalance.toNumber(),
			};
		});
	return sufficientAssets;
};

/**
 * Return true if the account has a sufficient amount of any sufficient asset.
 *
 * @param api
 * @param address
 * @param sufficientAssets
 * @returns
 */
const accountHasSufficientAsset = async (
	api: ApiPromise,
	address: string,
	sufficientAssets: SufficientAsset[],
): Promise<boolean> => {
	try {
		await Promise.any(
			sufficientAssets.map(({ id, minBalance }) =>
				api.query.assets.account(id, address).then((opt) => {
					const account = opt.unwrapOrDefault();
					const balance = account.balance;
					if (balance.gte(new BN(minBalance))) {
						return true;
					} else {
						throw new Error('Not sufficient');
					}
				}),
			),
		);
		return true;
	} catch (e) {
		return false;
	}
};

/**
 * Return true if an account will be sufficient after the transaction.
 */
const willBeSufficentAfterTx = async ({
	api,
	addr,
	assetIds,
	assetAmounts,
	sufficientAssets,
}: {
	api: ApiPromise;
	addr: string;
	assetIds: string[];
	assetAmounts: string[];
	sufficientAssets?: SufficientAsset[];
}): Promise<boolean> => {
	if (assetIds.length === 0) {
		// We can assume a native transfer
		return await willNativeBeSufficientAfterTx({
			api,
			addr,
			amount: assetAmounts[0],
		});
	}
	return await willNonNativeBeSufficientAfterTx({
		api,
		addr,
		assetIds,
		assetAmounts,
		sufficientAssets,
	});
};

/**
 * Return true if an account will have a sufficient amount of a Native Asset after a transaction.
 *
 * WARN: This does not cover NonNative Assets.
 */
const willNativeBeSufficientAfterTx = async ({
	api,
	addr,
	amount,
}: {
	api: ApiPromise;
	addr: string;
	amount: string;
}): Promise<boolean> => {
	// Potential optimization: reuse call from earlier
	const [accountInfo, existentialDeposit] = await Promise.all([
		api.query.system.account(addr),
		api.consts.balances.existentialDeposit,
	]);

	const free = accountInfo.data.free;
	const balance = free.add(new BN(amount));

	return balance.gte(existentialDeposit);
};

/**
 * Return true if an account will have a sufficient amount of a sufficient asset after a transaction.
 *
 * WARN: This does not cover Native Assets.
 */
const willNonNativeBeSufficientAfterTx = async ({
	api,
	addr,
	assetIds,
	assetAmounts,
	sufficientAssets,
}: {
	api: ApiPromise;
	addr: string;
	assetIds: string[];
	assetAmounts: string[];
	sufficientAssets?: SufficientAsset[];
}): Promise<boolean> => {
	if (!sufficientAssets) {
		sufficientAssets = await getSufficientAssets(api);
	}

	const sufficientAssetMap = new Map(sufficientAssets.map((asset) => [asset.id, asset]));

	const checks = assetIds.map(async (assetId, i) => {
		const meta = sufficientAssetMap.get(assetId);
		if (!meta) throw new Error('Not sufficient');

		const amount = new BN(assetAmounts[i]);
		const minBalance = new BN(meta.minBalance);

		// No need for api call if change is greater than minBalance
		if (amount.gte(minBalance)) {
			return true;
		}

		const accountInfoOpt = await api.query.assets.account(assetId, addr);
		const accountInfo = accountInfoOpt.unwrapOrDefault();
		const currentBalance = accountInfo.balance;

		const newBalance = currentBalance.add(amount);

		if (newBalance.gte(minBalance)) {
			return true;
		} else {
			throw new Error('Not sufficient');
		}
	});

	// Once one sufficient asset is above the minBalance threshold, we can stop
	try {
		await Promise.any(checks);
		return true;
	} catch (e) {
		return false;
	}
};
