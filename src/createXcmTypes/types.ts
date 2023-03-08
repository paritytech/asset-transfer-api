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
		xcmVersion?: number
	) => MultiLocation;
	createDest: (
		api: ApiPromise,
		paraId: string,
		xcmVersion?: number
	) => MultiLocation;
	createAssets: (
		api: ApiPromise,
		assets: string[],
		amounts: (string | number)[],
		xcmVersion: number
	) => VersionedMultiAssets;
	createWeightLimit: (api: ApiPromise) => WeightLimitV2;
}
