// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import { FungibleStrMultiAsset } from '../createXcmTypes/types';
import { getAssetId } from '../createXcmTypes/util/getAssetId';
import { BaseError, BaseErrorsEnum } from '../errors';
import { Registry } from '../registry';
import { resolveMultiLocation } from '../util/resolveMultiLocation';
import { validateNumber } from '../validate/validateNumber';

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
	multiAssets: FungibleStrMultiAsset[],
	specName: string,
	xcmVersion: number,
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
			const multiAssetInterior = multiAsset.id.Concrete.interior || multiAsset.id.Concrete['Interior'];

			if (isRelayFeeAsset) {
				// if the asset id is a relay asset, match Here interior
				if (multiAsset.id.Concrete.interior.Here || multiAsset.id.Concrete.interior['here']) {
					result = i;
					break;
				}
			} else {
				const isValidNumber = validateNumber(paysWithFeeDest);

				// if not a number, get the general index of the pays with fee asset
				// to compare against the current multi asset
				if (!isValidNumber) {
					const paysWithFeeDestGeneralIndex = await getAssetId(
						api,
						registry,
						paysWithFeeDest,
						specName,
						xcmVersion,
						isForeignAssetsTransfer
					);
					// if isForeignAssetsTransfer, compare the multiAsset interior to the the paysWithFeeDestGeneralIndex as a multilocation
					if (isForeignAssetsTransfer) {
						const paysWithFeeDestMultiLocation = resolveMultiLocation(paysWithFeeDestGeneralIndex, xcmVersion);
						const paysWithFeeDestMultiLocationInterior =
							paysWithFeeDestMultiLocation.interior || paysWithFeeDestMultiLocation['Interior'];
						if (JSON.stringify(multiAssetInterior) === JSON.stringify(paysWithFeeDestMultiLocationInterior)) {
							result = i;
							break;
						}
					} else {
						// if the current multiAsset is the relay asset we skip it since the
						// pays with fee dest item is not the relay asset
						if (multiAssetInterior.Here || multiAssetInterior['here']) {
							continue;
						}

						if (
							multiAssetInterior.X2 &&
							(multiAssetInterior.X2[1].GeneralIndex || multiAssetInterior.X2[1]['Generalindex']) ===
								paysWithFeeDestGeneralIndex
						) {
							result = i;
							break;
						}
					}
				} else {
					if (
						multiAssetInterior.X2 &&
						(multiAssetInterior.X2[1].GeneralIndex || multiAssetInterior.X2[1]['Generalindex']) === paysWithFeeDest
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
				.map((asset) => JSON.stringify(asset.id.Concrete.interior))
				.join(',')}`,
			BaseErrorsEnum.InvalidInput
		);
	}

	return result;
};
