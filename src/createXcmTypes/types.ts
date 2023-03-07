import { ApiPromise } from '@polkadot/api';
import {
	MultiLocation,
	VersionedMultiAssets,
} from '@polkadot/types/interfaces';

export type SupportedXcmVersions = 0 | 1;

export interface ICreateXcmType {
    createBeneficiary: (api: ApiPromise, accountId: string, xcmVersion?: SupportedXcmVersions) => MultiLocation;
    createDest: (api: ApiPromise, paraId: number, xcmVersion?: SupportedXcmVersions) => MultiLocation;
    createAssets: (api: ApiPromise, assets: string[], amounts: (string | number)[], xcmVersion: number) => VersionedMultiAssets;
}
