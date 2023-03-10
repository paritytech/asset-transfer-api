import { ApiPromise } from '@polkadot/api';
import {
	MultiLocation,
	VersionedMultiAssets,
	WeightLimitV2,
} from '@polkadot/types/interfaces';

export interface ICreateXcmType {
	createBeneficiary: (
		api: ApiPromise,
		accountId: string,
		xcmVersion: number
	) => MultiLocation;
	createDest: (
		api: ApiPromise,
		paraId: string,
		xcmVersion: number
	) => MultiLocation;
	createAssets: (
		api: ApiPromise,
		amounts: string[],
		xcmVersion: number,
		assets?: string[]
	) => VersionedMultiAssets;
	createWeightLimit: (api: ApiPromise) => WeightLimitV2;
}
