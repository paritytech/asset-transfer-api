// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
// import { u32 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import type { Registry } from '../../registry';
import { Direction } from '../../types';
import { normalizeArrToStr } from '../../util/normalizeArrToStr';
import { establishXcmPallet } from '../util/establishXcmPallet';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferMultiAssetWithFee`
 * call.
 *
 * @param api ApiPromise
 * @param direction Denotes the xcm direction of the call.
 * @param destAddr The address the funds will be transfered too.
 * @param assetIds An array of asset ids. Note, this should be the same size and order as amounts.
 * @param amounts An array of amounts. Note, this should be the same size and order as assetIds.
 * @param destChainId The id of the destination chain. This will be zero for a relay chain.
 * @param xcmVersion Supported XCM version.
 */
export const transferMultiAssetWithFee = (
	api: ApiPromise,
	direction: Direction,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	// destChainId: string,
	xcmVersion: number,
	specName: string,
	registry: Registry,
	weightLimit?: string,
	// paysWithFeeDest?: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	const pallet = establishXcmPallet(api, direction);
    console.log('pallet is', pallet);
	const ext = api.tx[pallet].transferMultiassetWithFee;
    console.log('ext call index', ext.toJSON());
    console.log(Object.keys)
	const typeCreator = createXcmTypes[direction];
	const beneficiary = typeCreator.createBeneficiary(api, destAddr, xcmVersion);
	// const dest = typeCreator.createDest(api, destChainId, xcmVersion);
	const assets = typeCreator.createAssets(
		api,
		normalizeArrToStr(amounts),
		xcmVersion,
		specName,
		assetIds,
		{ registry }
	);
    console.log('assets', assets.toHuman());
	const weightLimitType = typeCreator.createWeightLimit(api, weightLimit);
    console.log('weightLimit', weightLimitType.toString());

	// const feeAssetItem: u32 = paysWithFeeDest
	// 	? typeCreator.createFeeAssetItem(api, {
	// 			registry,
	// 			paysWithFeeDest,
	// 			specName,
	// 			assetIds,
	// 			amounts,
	// 			xcmVersion,
	// 	  })
	// 	: api.registry.createType('u32', 0);
    const feeAsset = api.registry.createType('XcmVersionedMultiLocation', {
        V3: {
            parents: 1,
            interior: null,
        }
    });

    const asset =  {
      V3: {
                id: {
                concrete:  {
                    parents: 1,
                    interior: {
                        X3: [
                            {
                                Parachain: 1000
                            },
                            {
                                PalletInstance: 50
                            },
                            {
                                GeneralIndex: 11
                            }
                        ]
                    }
                },
            },
            fun: {
               Fungible: 1000000000000 // 1 token
            },
        }
    }

    const destWeightLimit = { Unlimited: null };


    console.log('beneficiary', beneficiary.toString());

	return ext(asset, feeAsset, beneficiary, destWeightLimit);
};
