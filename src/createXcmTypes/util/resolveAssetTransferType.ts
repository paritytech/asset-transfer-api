// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../../errors';
import { AssetTransferType } from '../../types';
import { resolveMultiLocation } from '../../util/resolveMultiLocation';
import { UnionXcmMultiLocation } from '../types';

export const resolveAssetTransferType = (
	assetTransferType: string,
	xcmVersion: number,
	remoteTransferLocationStr?: string,
): AssetTransferType => {
	if (xcmVersion < 3) {
		throw new BaseError('Bridge txs require XCM version 3 or higher', BaseErrorsEnum.InvalidXcmVersion);
	}

	let transferType: AssetTransferType;
	let remoteTransferLocation: UnionXcmMultiLocation;
	if (remoteTransferLocationStr && assetTransferType === 'RemoteReserve') {
		remoteTransferLocation = resolveMultiLocation(remoteTransferLocationStr, xcmVersion);
		transferType =
			xcmVersion === 3
				? { RemoteReserve: { V3: remoteTransferLocation } }
				: { RemoteReserve: { V4: remoteTransferLocation } };
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
