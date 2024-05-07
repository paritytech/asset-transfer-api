// Copyright 2024 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { AnyJson } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import { normalizeArrToStr } from '../../util/normalizeArrToStr';
import type { CreateXcmCallOpts } from '../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
import type { PolkadotXcmBaseArgs } from './types';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { resolveAssetTransferType } from '../../createXcmTypes/util/resolveAssetTransferType';
/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferAssets` call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferAssetsUsingTypeAndThen = async (
	baseArgs: PolkadotXcmBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, destChainId, xcmVersion, specName, registry } = baseArgs;
	const { 
        weightLimit,
         paysWithFeeDest, 
         isForeignAssetsTransfer, 
         isLiquidTokenTransfer, 
         assetTransferType: assetTransferTypeStr, 
         remoteReserveAssetTransferTypeLocation,
         feesTransferType: feesTransferTypeStr,
         remoteReserveFeesTransferTypeLocation,
         customXcmOnDest: customXcmOnDestStr,
        } = opts;
    
    if (!paysWithFeeDest || !assetTransferTypeStr || !feesTransferTypeStr) {
        throw new BaseError('Bridge inputs not found', BaseErrorsEnum.InvalidInput)
    }

	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].transferAssetsUsingTypeAndThen;
	const typeCreator = createXcmTypes[direction];
	const ben = typeCreator.createBeneficiary(destAddr, xcmVersion);
    console.log('WHAT IS BEN', JSON.stringify(ben));
    const beneficiary = {
        parents: 0,
        interior: {
          X1: [
                             {
                   AccountId32: {
                    id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
                   },
                              }
                           ]
              }
}

	const dest = typeCreator.createDest(destChainId, xcmVersion);
	const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), xcmVersion, specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		api,
	});

	const weightLimitValue = typeCreator.createWeightLimit({
		weightLimit,
	});

    console.log('REMOTE RESERVE ASSET TYPE LOCATION', remoteReserveAssetTransferTypeLocation);
    const assetTransferType = resolveAssetTransferType(feesTransferTypeStr, xcmVersion, remoteReserveAssetTransferTypeLocation);
    const feeAssetTransferType = resolveAssetTransferType(feesTransferTypeStr, xcmVersion, remoteReserveFeesTransferTypeLocation);
	const remoteFeesId = {
        V4: {
            parents: 2,
            interior: {
                X2: [
                    {
                        GlobalConsensus: {
                            Ethereum: {
                                chainId: 11155111 
                            }
                        }
                    },
                    {
                        AccountKey20: {
                            network:null,
                            key: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
                        }
                    }
                ]
             }
        }
    }
    // TODO: update remote fees id construction
    // TODO: update beneficiary construction to be an object with no reference to XCM version
    console.log(remoteFeesId);

    const defaultDestXcm: AnyJson = xcmVersion === 3 ? {
        V3: [
            {
                depositAsset: { 
                    assets: {
                    Wild: {
                        AllCounted: 1
                    }
                    }, 
                    beneficiary 
                }
            }
        ]
    } : {
        V4: [
            {
                depositAsset: { 
                    assets: {
                    Wild: {
                        AllCounted: 1
                    }
                    }, 
                    beneficiary
                }
            }
        ]  
    };

    const customXcmOnDest = customXcmOnDestStr ? JSON.parse(customXcmOnDestStr) as AnyJson : defaultDestXcm;

	return ext(dest, assets, assetTransferType, remoteFeesId, feeAssetTransferType, customXcmOnDest, weightLimitValue);
};

// dest: Box<VersionedLocation>,
// assets: Box<VersionedAssets>,
// assets_transfer_type: Box<TransferType>,
// remote_fees_id: Box<VersionedAssetId>,
// fees_transfer_type: Box<TransferType>,
// custom_xcm_on_dest: Box<VersionedXcm<()>>,
// weight_limit: WeightLimit,