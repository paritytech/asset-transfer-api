// Copyright 2023 Parity Technologies (UK) Ltd.

import { MultiAsset } from '../../types';
import { dedupeMultiAssets } from './dedupeMultiAssets';

describe('dedupeMultiAssets', () => {
    it('Should dedupe a sorted list of MultiAssets', () => {
        const expected: MultiAsset[] = [
                {
                    fun: {
                        Fungible: '100000',
                    },
                    id: {
                        Concrete: {
                            interior: {
                                X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
                            },
                            parents: 0,
                        },
                    },
                },
                {
                    fun: {
                        Fungible: '200000',
                    },
                    id: {
                        Concrete: {
                            interior: {
                                X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
                            },
                            parents: 1,
                        },
                    },
                },
        ];
        const multiAssets: MultiAsset[] = [
            {
                fun: {
                    Fungible: '100000',
                },
                id: {
                    Concrete: {
                        interior: {
                            X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
                        },
                        parents: 0,
                    },
                },
            },
            {
                fun: {
                    Fungible: '100000',
                },
                id: {
                    Concrete: {
                        interior: {
                            X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
                        },
                        parents: 0,
                    },
                },
            },
            {
                fun: {
                    Fungible: '200000',
                },
                id: {
                    Concrete: {
                        interior: {
                            X2: [{ PalletInstance: '50' }, { GeneralIndex: '1984' }],
                        },
                        parents: 1,
                    },
                },
            },
        ];

        const deduped = dedupeMultiAssets(multiAssets);

        expect(deduped.length).toEqual(expected.length);
    })
})