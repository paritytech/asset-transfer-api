// Copyright 2024 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../../createXcmTypes/index.js';
import {
	UnionXcmMultiLocation,
	WildAsset,
	XcmAsset,
	XcmMultiAsset,
	XcmV2Junction,
	XcmV3Junction,
	XcmV4Junction,
	XcmVersionedAssetId,
} from '../../createXcmTypes/types.js';
import { assetIdIsLocation } from '../../createXcmTypes/util/assetIdIsLocation.js';
import { createXcmOnDestBeneficiary } from '../../createXcmTypes/util/createXcmOnDestBeneficiary.js';
import { createXcmOnDestination } from '../../createXcmTypes/util/createXcmOnDestination.js';
import { createXcmVersionedAssetId } from '../../createXcmTypes/util/createXcmVersionedAssetId.js';
import { getAssetId } from '../../createXcmTypes/util/getAssetId.js';
import { parseLocationStrToLocation } from '../../createXcmTypes/util/parseLocationStrToLocation.js';
import { resolveAssetTransferType } from '../../createXcmTypes/util/resolveAssetTransferType.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { sanitizeAddress } from '../../sanitize/sanitizeAddress.js';
import { AssetTransferType, Direction } from '../../types.js';
import { normalizeArrToStr } from '../../util/normalizeArrToStr.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import type { CreateXcmCallOpts } from '../types.js';
import { establishXcmPallet } from '../util/establishXcmPallet.js';
import type { PolkadotXcmBaseArgs } from './types.js';
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
		destChainId,
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
		const resolvedDestChainId = resolveMultiLocation(destChainId, xcmVersion);
		customXcmOnDestStr = `[{"setAppendix":[{"depositAsset":{"assets":{"Wild":"All"},"beneficiary":${JSON.stringify(sendersAccount)}}}]},{"initiateReserveWithdraw":{"assets":{"Wild":{"AllOf":${JSON.stringify(erc20Location)}}},"reserve":${JSON.stringify(resolvedDestChainId)},"xcm":[{"buyExecution":{"fees":${JSON.stringify(reanchoredERC20AccountLocation)},"weightLimit":"Unlimited"}},{"depositAsset":{"assets":{"Wild":{"AllCounted":"1"}},"beneficiary":${JSON.stringify(beneficiary)}}},{"setTopic":"0x0000000000000000000000000000000000000000000000000000000000000000"}]}},{"setTopic":"0x0000000000000000000000000000000000000000000000000000000000000000"}]`;

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
