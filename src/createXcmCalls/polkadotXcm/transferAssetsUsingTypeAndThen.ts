import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { ASSET_HUB_CHAIN_ID } from '../../consts.js';
import { getTypeCreator } from '../../createXcmTypes/index.js';
import { FungibleAssetType, XcmJunction, XcmVersionedAssetId } from '../../createXcmTypes/types.js';
import { assetIdIsLocation } from '../../createXcmTypes/util/assetIdIsLocation.js';
import { createXcmOnDestBeneficiary } from '../../createXcmTypes/util/createXcmOnDestBeneficiary.js';
import { createXcmOnDestination } from '../../createXcmTypes/util/createXcmOnDestination.js';
import { createXcmVersionedAssetId } from '../../createXcmTypes/util/createXcmVersionedAssetId.js';
import { getAssetId } from '../../createXcmTypes/util/getAssetId.js';
import { resolveAssetTransferType } from '../../createXcmTypes/util/resolveAssetTransferType.js';
import { getXcmCreator } from '../../createXcmTypes/xcm/index.js';
import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { sanitizeAddress } from '../../sanitize/sanitizeAddress.js';
import { AssetTransferType, Direction } from '../../types.js';
import { normalizeArrToStr } from '../../util/normalizeArrToStr.js';
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

	const xcmCreator = getXcmCreator(xcmVersion);

	const typeCreator = getTypeCreator(direction, xcmVersion);
	const beneficiary = createXcmOnDestBeneficiary(destAddr, xcmVersion);
	const assets = await typeCreator.createAssets(normalizeArrToStr(amounts), specName, assetIds, {
		registry,
		isForeignAssetsTransfer,
		isLiquidTokenTransfer,
		api,
		destChainId,
	});

	let assetTransferType: AssetTransferType;
	let feeAssetTransferType: AssetTransferType;

	if (direction === Direction.ParaToEthereum) {
		let erc20Location: FungibleAssetType | undefined = undefined;
		let erc20Key: string | undefined = undefined;

		// get erc20 Asset Location from assetIds
		for (const assetId of assetIds) {
			const assetIdLocationStr = await getAssetId({
				api,
				registry,
				asset: assetId,
				specName,
				xcmCreator,
				isForeignAssetsTransfer: true,
			});
			if (!assetIdLocationStr.toLowerCase().includes('ethereum')) {
				continue;
			}
			let assetLocation = xcmCreator.resolveMultiLocation(assetIdLocationStr);

			if ('v1' in assetLocation) {
				assetLocation = xcmCreator.resolveMultiLocation(JSON.stringify(assetLocation.v1));
			}

			// parse registry xc assets erc20 v1 location
			if ('X2' in assetLocation.interior && Array.isArray(assetLocation.interior.X2)) {
				if ('AccountKey20' in assetLocation.interior.X2[1]) {
					erc20Location = xcmCreator.fungibleAsset({
						multiLocation: {
							parents: assetLocation.parents,
							interior: assetLocation.interior,
						},
						amount: 'Fungible',
					});
					const erc20KeyX2 = assetLocation.interior?.X2 as [XcmJunction, XcmJunction] | undefined;
					if (erc20KeyX2 && 'AccountKey20' in erc20KeyX2[1]) {
						erc20Key = (erc20KeyX2[1].AccountKey20 as { network?: string; key: string }).key;
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

		const reanchoredERC20AccountLocation = xcmCreator.fungibleAsset({
			multiLocation: {
				parents: 0,
				interior: {
					X1: {
						AccountKey20: {
							key: erc20Key,
						},
					},
				},
			},
			amount: '1',
		});

		if (!sendersAddr || !erc20Location) {
			throw new BaseError(
				'sendersAddr and a valid ERC20 token are needed for ParaToEthereum direction',
				BaseErrorsEnum.InvalidInput,
			);
		}

		sendersAddr = sanitizeAddress(sendersAddr);
		const sendersAccount = createXcmOnDestBeneficiary(sendersAddr, xcmVersion);
		const resolvedDestChainId = xcmCreator.resolveMultiLocation(destChainId);
		customXcmOnDestStr = `[{"setAppendix":[{"depositAsset":{"assets":{"Wild":"All"},"beneficiary":${JSON.stringify(sendersAccount)}}}]},{"initiateReserveWithdraw":{"assets":{"Wild":{"AllOf":${JSON.stringify(erc20Location)}}},"reserve":${JSON.stringify(resolvedDestChainId)},"xcm":[{"buyExecution":{"fees":${JSON.stringify(reanchoredERC20AccountLocation)},"weightLimit":"Unlimited"}},{"depositAsset":{"assets":{"Wild":{"AllCounted":"1"}},"beneficiary":${JSON.stringify(beneficiary)}}},{"setTopic":"0x0000000000000000000000000000000000000000000000000000000000000000"}]}},{"setTopic":"0x0000000000000000000000000000000000000000000000000000000000000000"}]`;

		feeAssetTransferType = {
			DestinationReserve: 'null',
		};
		assetTransferType = {
			DestinationReserve: 'null',
		};
		destChainId = ASSET_HUB_CHAIN_ID;
	} else {
		assetTransferType = resolveAssetTransferType(
			assetTransferTypeStr,
			xcmCreator,
			remoteReserveAssetTransferTypeLocation,
		);
		feeAssetTransferType = resolveAssetTransferType(
			feesTransferTypeStr,
			xcmCreator,
			remoteReserveFeesTransferTypeLocation,
		);
	}

	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].transferAssetsUsingTypeAndThen;
	const dest = typeCreator.createDest(destChainId);

	const weightLimitValue = typeCreator.createWeightLimit({
		weightLimit,
	});

	let remoteFeesId: XcmVersionedAssetId;
	if (paysWithFeeDest && !assetIdIsLocation({ assetId: paysWithFeeDest, xcmCreator })) {
		const remoteFeesAssetLocation = await getAssetId({ api, registry, asset: paysWithFeeDest, specName, xcmCreator });
		remoteFeesId = createXcmVersionedAssetId(remoteFeesAssetLocation, xcmCreator);
	} else {
		remoteFeesId = createXcmVersionedAssetId(paysWithFeeDest, xcmCreator);
	}

	const customXcmOnDestination = createXcmOnDestination({
		assets: assetIds,
		beneficiary,
		customXcmOnDest: customXcmOnDestStr,
		xcmCreator,
	});

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
