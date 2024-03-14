// Copyright 2024 Parity Technologies (UK) Ltd.

import { getGlobalConsensusDestFromAssetLocation } from './getGlobalConsensusDestFromAssetLocation';
import { InteriorKeyValue } from '../types';

describe('getGlobalConsensusDestFromAssetLocation', () => {
    it('Should correctly retrieve the global consensus dest based on the asset location for Polkadot', () => {
        const assetLocationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Polkadot"}}}`;
        const xcmVersion = 4;

        const expected: InteriorKeyValue = {
            GlobalConsensus: 'Polkadot'
        };

        const result = getGlobalConsensusDestFromAssetLocation(assetLocationStr, xcmVersion);

        expect(result).toEqual(expected);
    });
    it('Should correctly retrieve the global consensus dest based on the asset location for Kusama', () => {
        const assetLocationStr = `{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}`;
        const xcmVersion = 3;
        const expected: InteriorKeyValue = {
            GlobalConsensus: 'Kusama'
        };

        const result = getGlobalConsensusDestFromAssetLocation(assetLocationStr, xcmVersion);

        expect(result).toEqual(expected);
    });
    it('Should correctly retrieve the global consensus dest based on the asset location for Ethereum', () => {
        const assetLocationStr = `{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}},{"AccountKey20":{"network":null,"key":"0xfff9976782d46cc05630d1f6ebab18b2324d6b14"}}]}}`;
        const xcmVersion = 4;

        const expected: InteriorKeyValue = {
            GlobalConsensus: {
                Ethereum: {
                    chainId: '11155111'
                }
            }
        };

        const result = getGlobalConsensusDestFromAssetLocation(assetLocationStr, xcmVersion);

        expect(result).toEqual(expected);
    });
    it('Should correctly throw an error when an assetLocation is provided that does not contain a GlobalConsensus destination junction value', () => {
        const assetLocationStr = `{"parents":"1","interior":{"X1":{"Parachain":"2030"}}}`;
        const xcmVersion = 3;

        const err = () => getGlobalConsensusDestFromAssetLocation(assetLocationStr, xcmVersion);

        expect(err).toThrow(`Bridge transaction asset location {"parents":"1","interior":{"X1":{"Parachain":"2030"}}} does not contain a GlobalConsensus Junction`);
    });
    it('Should correctly throw an error when an assetLocation is provided that does not contain a valid GlobalConsensus at the 0 index', () => {
        const assetLocationStr = `{"parents":"1","interior":{"X2":[{"Parachain":"2030"},{"GlobalConsensus":"Kusama"}]}}`;
        const xcmVersion = 4;

        const err = () => getGlobalConsensusDestFromAssetLocation(assetLocationStr, xcmVersion);

        expect(err).toThrow(`Bridge transaction asset location interior {"X2":[{"Parachain":"2030\"},{"GlobalConsensus":"Kusama"}]} does not contain a GlobalConsensus Junction in the first index`);
    });
});