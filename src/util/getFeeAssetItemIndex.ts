// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { getAssetId } from '../createXcmTypes/util/getAssetId';
import { BaseError, BaseErrorsEnum } from '../errors';
import { Registry } from '../registry';
import { MultiAsset } from '../types';

/**
 * For System origin XCM V3 Tx's, if paysWithFeeDest option is provided, finds and returns the index
 * of the MultiAsset to be used for fees on the destination chain
 *
 * @param paysWithFeeDest string
 * @param multiAssets MultiAsset[]
 * @param specName string
 */
export const getFeeAssetItemIndex = async (
	api: ApiPromise,
	registry: Registry,
	paysWithFeeDest: string,
	multiAssets: MultiAsset[],
	specName: string,
	isForeignAssetsTransfer?: boolean
): Promise<number> => {
	let result = -1;

	if (paysWithFeeDest) {
		const isRelayFeeAsset =
			paysWithFeeDest.toLowerCase() === 'dot' ||
			paysWithFeeDest.toLowerCase() === 'ksm' ||
			paysWithFeeDest.toLowerCase() === 'wnd';

		for (let i = 0; i < multiAssets.length; i++) {
			const multiAsset = multiAssets[i];

			if (isRelayFeeAsset) {
				// if the asset id is a relay asset, match Here interior
				if (multiAsset.id.Concrete.interior.isHere) {
					result = i;
					break;
				}
			} else {
				const parsedAssetIdAsNumber = Number.parseInt(paysWithFeeDest);
				const isNotANumber = Number.isNaN(parsedAssetIdAsNumber);

				// if not a number, get the general index of the pays with fee asset
				// to compare against the current multi asset
				if (isNotANumber) {
					const paysWithFeeDestGeneralIndex = await getAssetId(
						api,
						registry,
						paysWithFeeDest,
						specName,
						isForeignAssetsTransfer
					);
					// if isForeignAssetsTransfer, compare the multiAsset interior to the the paysWithFeeDestGeneralIndex as a multilocation
					if (isForeignAssetsTransfer) {
						const paysWithFeeDestMultiLocation = api.registry.createType(
							'MultiLocation',
							JSON.parse(paysWithFeeDestGeneralIndex)
						);
						if (multiAsset.id.Concrete.interior.eq(paysWithFeeDestMultiLocation.interior)) {
							result = i;
							break;
						}
					} else {
						// if the current multiAsset is the relay asset we skip it since the
						// pays with fee dest item is not the relay asset
						if (multiAsset.id.Concrete.interior.isHere) {
							continue;
						}

						if (
							multiAsset.id.Concrete.interior.isX2 &&
							multiAsset.id.Concrete.interior.asX2[1].asGeneralIndex.toString() === paysWithFeeDestGeneralIndex
						) {
							result = i;
							break;
						}
					}
				} else {
					if (
						multiAsset.id.Concrete.interior.isX2 &&
						multiAsset.id.Concrete.interior.asX2[1].asGeneralIndex.toString() === paysWithFeeDest
					) {
						result = i;
						break;
					}
				}
			}
		}
	}

	if (result === -1) {
		throw new BaseError(
			`Invalid paysWithFeeDest value. ${paysWithFeeDest} did not match any asset in assets: ${multiAssets
				.map((asset) => asset.id.Concrete.interior.toString())
				.toString()}`,
			BaseErrorsEnum.InvalidInput
		);
	}

	return result;
};
