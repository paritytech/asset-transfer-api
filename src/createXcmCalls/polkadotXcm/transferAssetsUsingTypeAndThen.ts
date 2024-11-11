// Copyright 2024 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes';
import {
	UnionXcmMultiLocation,
	WildAsset,
	XcmAsset,
	XcmMultiAsset,
	XcmV2Junction,
	XcmV3Junction,
	XcmV4Junction,
	XcmVersionedAssetId,
} from '../../createXcmTypes/types';
import { assetIdIsLocation } from '../../createXcmTypes/util/assetIdIsLocation';
import { createXcmOnDestBeneficiary } from '../../createXcmTypes/util/createXcmOnDestBeneficiary';
import { createXcmOnDestination } from '../../createXcmTypes/util/createXcmOnDestination';
import { createXcmVersionedAssetId } from '../../createXcmTypes/util/createXcmVersionedAssetId';
import { getAssetId } from '../../createXcmTypes/util/getAssetId';
import { parseLocationStrToLocation } from '../../createXcmTypes/util/parseLocationStrToLocation';
import { resolveAssetTransferType } from '../../createXcmTypes/util/resolveAssetTransferType';
import { BaseError, BaseErrorsEnum } from '../../errors';
import { sanitizeAddress } from '../../sanitize/sanitizeAddress';
import { AssetTransferType, Direction } from '../../types';
import { normalizeArrToStr } from '../../util/normalizeArrToStr';
import type { CreateXcmCallOpts } from '../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
import type { PolkadotXcmBaseArgs } from './types';
/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferAssetsUsingTypeAndThen` call.
 *
 * @param baseArgs The base args needed to construct this call.
 * @param opts CreateXcmCallOpts
 */
export const transferAssetsUsingTypeAndThen = async (
	baseArgs: PolkadotXcmBaseArgs,
	opts: CreateXcmCallOpts,
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> => {
	const { api, direction, destAddr, assetIds, amounts, xcmVersion, specName, registry } = baseArgs;
	let { destChainId } = baseArgs;
	const {
		weightLimit,
		paysWithFeeDest,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		assetTransferType: assetTransferTypeStr,
		remoteReserveAssetTransferTypeLocation,
		feesTransferType: feesTransferTypeStr,
		remoteReserveFeesTransferTypeLocation,
	} = opts;
	let { customXcmOnDest: customXcmOnDestStr, sendersAddr } = opts;

	const typeCreator = createXcmTypes[direction];
	const beneficiary = createXcmOnDestBeneficiary(destAddr, xcmVersion);
	const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), xcmVersion, specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		api,
	});

	let assetTransferType: AssetTransferType;
	let feeAssetTransferType: AssetTransferType;

	if (direction === Direction.ParaToEthereum) {
		let erc20Location: WildAsset | undefined = undefined;
		let erc20Key: string | undefined = undefined;

		// get erc20 Asset Location from assetIds
		for (const assetId of assetIds) {
			const assetIdLocationStr = await getAssetId(api, registry, assetId, specName, xcmVersion, true);
			if (!assetIdLocationStr.toLowerCase().includes('ethereum')) {
				continue;
			}
			let assetLocation = JSON.parse(assetIdLocationStr) as UnionXcmMultiLocation;

			if ('v1' in assetLocation) {
				assetLocation = parseLocationStrToLocation(JSON.stringify(assetLocation.v1));
			}

			// parse registry xc assets erc20 v1 location
			if ('x2' in assetLocation.interior && Array.isArray(assetLocation.interior.x2)) {
				if ('accountKey20' in assetLocation.interior.x2[1]) {
					erc20Location =
						xcmVersion === 3
							? {
									id: {
										Concrete: {
											parents: assetLocation.parents,
											interior: assetLocation.interior,
										} as UnionXcmMultiLocation,
									},
									fun: 'Fungible',
								}
							: {
									id: {
										parents: assetLocation.parents,
										interior: assetLocation.interior,
									} as UnionXcmMultiLocation,
									fun: 'Fungible',
								};
					const erc20KeyX2 = assetLocation.interior?.x2 as
						| [XcmV4Junction, XcmV4Junction]
						| [XcmV3Junction, XcmV3Junction]
						| [XcmV2Junction, XcmV2Junction]
						| undefined;
					if (erc20KeyX2 && 'accountKey20' in erc20KeyX2[1]) {
						erc20Key = (erc20KeyX2[1].accountKey20 as { network?: string; key: string }).key;
					}
				}
			}
		}

		if (!erc20Key) {
			throw new BaseError(
				`A valid Snowbridge ERC20 token must provided for ParaToEthereum Direction.`,
				BaseErrorsEnum.InvalidInput,
			);
		}

		const reanchoredERC20AccountLocation: XcmMultiAsset | XcmAsset =
			xcmVersion === 3
				? {
						id: {
							Concrete: {
								parents: 0,
								interior: {
									X1: {
										AccountKey20: {
											key: erc20Key,
										},
									},
								},
							} as UnionXcmMultiLocation,
						},
						fun: {
							Fungible: '1',
						},
					}
				: {
						id: {
							parents: 0,
							interior: {
								X1: [
									{
										AccountKey20: {
											key: erc20Key,
										},
									},
								],
							},
						} as UnionXcmMultiLocation,
						fun: {
							Fungible: '1',
						},
					};

		if (!sendersAddr || !erc20Location) {
			throw new BaseError(
				'sendersAddr and a valid ERC20 token are needed for ParaToEthereum direction',
				BaseErrorsEnum.InvalidInput,
			);
		}

		sendersAddr = sanitizeAddress(sendersAddr);
		const sendersAccount = createXcmOnDestBeneficiary(sendersAddr, xcmVersion);
		customXcmOnDestStr = `[{"setAppendix":[{"depositAsset":{"assets":{"Wild":"All"},"beneficiary":${JSON.stringify(sendersAccount)}}}]},{"initiateReserveWithdraw":{"assets":{"Wild":{"AllOf":${JSON.stringify(erc20Location)}}},"reserve":${destChainId},"xcm":[{"buyExecution":{"fees":${JSON.stringify(reanchoredERC20AccountLocation)},"weightLimit":"Unlimited"}},{"depositAsset":{"assets":{"Wild":{"AllCounted":"1"}},"beneficiary":${JSON.stringify(beneficiary)}}},{"setTopic":"0x0000000000000000000000000000000000000000000000000000000000000000"}]}},{"setTopic":"0x0000000000000000000000000000000000000000000000000000000000000000"}]`;

		feeAssetTransferType = {
			DestinationReserve: 'null',
		};
		assetTransferType = {
			DestinationReserve: 'null',
		};
		destChainId = '1000'; // Set AssetHub as first hop after constructing custom XCM
	} else {
		assetTransferType = resolveAssetTransferType(
			assetTransferTypeStr,
			xcmVersion,
			remoteReserveAssetTransferTypeLocation,
		);
		feeAssetTransferType = resolveAssetTransferType(
			feesTransferTypeStr,
			xcmVersion,
			remoteReserveFeesTransferTypeLocation,
		);
	}

	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].transferAssetsUsingTypeAndThen;
	const dest = typeCreator.createDest(destChainId, xcmVersion);

	const weightLimitValue = typeCreator.createWeightLimit({
		weightLimit,
	});

	let remoteFeesId: XcmVersionedAssetId;
	if (paysWithFeeDest && !assetIdIsLocation(paysWithFeeDest)) {
		const remoteFeesAssetLocation = await getAssetId(api, registry, paysWithFeeDest, specName, xcmVersion);
		remoteFeesId = createXcmVersionedAssetId(remoteFeesAssetLocation, xcmVersion);
	} else {
		remoteFeesId = createXcmVersionedAssetId(paysWithFeeDest, xcmVersion);
	}

	const customXcmOnDestination = createXcmOnDestination(assetIds, beneficiary, xcmVersion, customXcmOnDestStr);

	return ext(
		dest,
		assets,
		assetTransferType,
		remoteFeesId,
		feeAssetTransferType,
		customXcmOnDestination,
		weightLimitValue,
	);
};
