import type { ApiPromise } from '@polkadot/api';
import type {
	VersionedMultiAssets,
	VersionedMultiLocation,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> &
			Partial<Record<Exclude<Keys, K>, undefined>>;
	}[Keys];

export interface ICreateXcmType {
	createBeneficiary: (
		api: ApiPromise,
		accountId: string,
		xcmVersion: number
	) => VersionedMultiLocation;
	createDest: (
		api: ApiPromise,
		paraId: string,
		xcmVersion: number
	) => VersionedMultiLocation;
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		assets?: string[]
	) => VersionedMultiAssets;
	createWeightLimit: (api: ApiPromise, weightLimit?: string) => WeightLimitV2;
}

interface IWeightLimitBase {
	Unlimited: null;
	Limited: string;
}

export type IWeightLimit = RequireOnlyOne<IWeightLimitBase>;
