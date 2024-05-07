// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from "../../errors";
import { AssetTransferType } from "../../types";

export const resolveAssetTransferType = (assetTransferType: string, xcmVersion: number, remoteTransferLocation?: string): AssetTransferType => {
    console.log(remoteTransferLocation);

    if (xcmVersion < 3) {
        throw new BaseError('Bridge txs require XCM version 3 or higher', BaseErrorsEnum.InvalidXcmVersion);
    }

    let transferType: AssetTransferType;

    if (xcmVersion === 3) {
        transferType = assetTransferType === 'RemoteReserve' ?
        { 
            RemoteReserve: {
                V3: {
                    parents: 1,
                    interior: {
                        X1: {
                            Parachain: 1000
                        }
                    }
                }
             }
        } : assetTransferType === 'LocalReserve' ?
        {
            LocalReserve: 'null'
        } : assetTransferType === 'DestinationReserve' ?
        {
            DestinationReserve: 'null'
        } : {
            Teleport: 'null'
        }
    } else {
        transferType = assetTransferType === 'RemoteReserve' ? { 
            RemoteReserve: {
                V4: {
                        parents: 1,
                        interior: {
                            X1: [
                                {
                                    Parachain: 1000
                                }
                            ]
                        }
                }
             }
        } : assetTransferType === 'LocalReserve' ?
        {
            LocalReserve: 'null'
        } : assetTransferType === 'DestinationReserve' ?
        {
            DestinationReserve: 'null'
        } : {
            Teleport: 'null'
        }
    }

    return transferType;
}