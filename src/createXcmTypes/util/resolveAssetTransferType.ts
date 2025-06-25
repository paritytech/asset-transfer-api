import { BaseError, BaseErrorsEnum } from '../../errors/index.js';
import { AssetTransferType } from '../../types.js';
import { resolveMultiLocation } from '../../util/resolveMultiLocation.js';
import { UnionXcmMultiLocation, XcmCreator } from '../types.js';

export const resolveAssetTransferType = (
	assetTransferType: string | undefined,
	xcmCreator: XcmCreator,
	remoteTransferLocationStr?: string,
): AssetTransferType => {
	if (!assetTransferType) {
		throw new BaseError('resolveAssetTransferType: assetTransferType not found', BaseErrorsEnum.InvalidInput);
	}
	if (xcmCreator.xcmVersion < 3) {
		throw new BaseError('Bridge txs require XCM version 3 or higher', BaseErrorsEnum.InvalidXcmVersion);
	}

	let transferType: AssetTransferType;
	let remoteTransferLocation: UnionXcmMultiLocation;
	if (remoteTransferLocationStr && assetTransferType === 'RemoteReserve') {
		remoteTransferLocation = resolveMultiLocation(remoteTransferLocationStr, xcmCreator);
		transferType = xcmCreator.remoteReserve(remoteTransferLocation);
	} else {
		transferType =
			assetTransferType === 'LocalReserve'
				? {
						LocalReserve: 'null',
					}
				: assetTransferType === 'DestinationReserve'
					? {
							DestinationReserve: 'null',
						}
					: {
							Teleport: 'null',
						};
	}

	return transferType;
};
