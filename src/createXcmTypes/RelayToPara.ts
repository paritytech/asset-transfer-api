import { ApiPromise } from '@polkadot/api';
import { MultiLocation } from '@polkadot/types/interfaces';
import { SupportedXcmVersions } from './types';

/**
 * XCM type generation for transactions from the relay chain to a parachain.
 */
export class RelayToPara {
    /**
     * Create a XcmVersionedMultiLocation type for a beneficiary.
     *
     * @param api ApiPromise
     * @param accountId The accountId of the beneficiary
     * @param xcmVersion The accepted xcm version
     */
    static createBeneficiary(
        api: ApiPromise,
        accountId: string,
        xcmVersion?: SupportedXcmVersions
    ): MultiLocation {
        /**
         * The main difference between V0 vs V1 is that there is no parent associated.
         */
        if (xcmVersion === 0) {
            return api.registry.createType('XcmVersionedMultiLocation', {
                V0: {
                    X1: {
                        AccountId32: {
                            network: 'Any',
                            id: accountId,
                        },
                    },
                },
            });
        }

        /**
         * This accounts for an xcmVersion of 1, or if no xcmVersion is passed in
         */
        return api.registry.createType('XcmVersionedMultiLocation', {
            V1: {
                parents: 0,
                interior: {
                    X1: {
                        AccountId32: {
                            network: 'Any',
                            id: accountId,
                        },
                    },
                },
            },
        });
    }

    /**
     * Create a XcmVersionedMultiLocation type for a destination.
     *
     * @param api ApiPromise
     * @param paraId The parachain Id of the destination
     * @param xcmVersion The accepted xcm version
     */
    static createDest(
        api: ApiPromise,
        paraId: number,
        xcmVersion?: SupportedXcmVersions
    ): MultiLocation {
        if (xcmVersion === 0) {
            return api.registry.createType('XcmVersionedMultiLocation', {
                V0: {
                    X1: {
                        parachain: paraId,
                    },
                },
            });
        }
    
        /**
         * This accounts for an xcmVersion of 1, or if no xcmVersion is passed in
         */
        return api.registry.createType('XcmVersionedMultiLocation', {
            V1: {
                parents: 0,
                interior: {
                    X1: {
                        parachain: paraId,
                    },
                },
            },
        });
    }
}
