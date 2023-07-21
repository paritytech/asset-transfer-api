// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
// import { u32 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import type { Registry } from '../../registry';
import { Direction, XcmMultiAsset, XcmWeight, XCMDestBenificiary } from '../../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
import { BaseError } from '../../errors';
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
export const transferMultiAssets = (
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
	paysWithFeeDest?: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	const pallet = establishXcmPallet(api, direction);
	const ext = api.tx[pallet].transferMultiassets;
	const typeCreator = createXcmTypes[direction];

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
    // const feeAsset2 = {
    //     V3: {
    //         parents: 1,
    //         interior: null,
    //     }
    // };

    const assets =  [
		{
			V3: {
					  id: {
					  concrete:  {
						  parents: 1,
						  interior: api.registry.createType('InteriorMultiLocation', {
							  X3: [
								  {
									  Parachain: 1000
								  },
								  {
									  PalletInstance: 50
								  },
								  {
									  GeneralIndex: 10
								  }
							  ]
						  }
					  ),
				  },
				  fun: {
					 Fungible: 1000000000000
				  },
			   }
			  }
		  },
		{
      V3: {
                id: {
                concrete:  {
                    parents: 1,
                    interior: api.registry.createType('InteriorMultiLocation', {
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
                ),
            },
            fun: {
               Fungible: 1000000000000
            },
         }
        }
    }
];

    const destWeightLimit2 = { Unlimited: null };

    const beneficiary2 =  {
        V3: {
            parents: 1,
            interior: {
              X1: {
                AccountId32: { id: "0xc224aad9c6f3bbd784120e9fceee5bfd22a62c69144ee673f76d6a34d280de16" }
              }
            }
        }
      };

    // let assets: XcmMultiAsset[] | undefined;
    let feeAsset: XcmMultiAsset | undefined;
    let beneficiary: XCMDestBenificiary | undefined;
    let destWeightLimit: XcmWeight | undefined;
    
    console.log("WHAT ARE ASSETS", assetIds);
    if (
        typeCreator.createXTokensAssets && 
        typeCreator.createXTokensFeeAssetItem &&
        typeCreator.createXTokensBeneficiary &&
        typeCreator.createXTokensFeeAssetItem  &&
        typeCreator.createXTokensWeightLimit
        ) {
        // assets = typeCreator.createXTokensAssets(api, amounts, xcmVersion, specName, assetIds, { registry })
        // console.log('beneficiary', beneficiary.toString());
        
            feeAsset = typeCreator.createXTokensFeeAssetItem(
                api,
                {
                    registry,
                    paysWithFeeDest,
                    specName,
                    assetIds,
                    amounts,
                    xcmVersion,
                }
            );

            beneficiary = typeCreator.createXTokensBeneficiary(destAddr, xcmVersion);
    
            destWeightLimit = typeCreator.createXTokensWeightLimit(weightLimit)

            console.log('ASSET IS', JSON.stringify(assets));
            console.log('FEE ASSET IS', JSON.stringify(feeAsset));
            console.log('BENEFICIARY IS', JSON.stringify(beneficiary));
            console.log('WEIGHT LIMIT', destWeightLimit);

			console.log('pays with FEE DEST', paysWithFeeDest);

        return ext(assets, paysWithFeeDest, beneficiary2, destWeightLimit2);
    }
    
    throw new BaseError('Unable to create xTokens assets');
};
