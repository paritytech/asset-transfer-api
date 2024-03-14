// Copyright 2024 Parity Technologies (UK) Ltd.

import { getGlobalConsensusSystemName } from './getGlobalConsensusSystemName';

describe('getGlobalConsensusSystemName', () => {
    it('Should correctly return the consensus system name for Polkadot', () => {
        const destLocation = `{"parents":"2","interior":{"X1":"Polkadot"}}}`;

        const result = getGlobalConsensusSystemName(destLocation);

        expect(result).toEqual('polkadot');
    });
    it('Should correctly return the consensus system name for Kusama', () => {
        const destLocation = `{"parents":"2","interior":{"X1":"Kusama"}}}`;

        const result = getGlobalConsensusSystemName(destLocation);

        expect(result).toEqual('kusama');
    });
    it('Should correctly return the consensus system name for Ethereum', () => {
        const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"11155111"}}}}}`;

        const result = getGlobalConsensusSystemName(destLocation);

        expect(result).toEqual('ethereum');
    });
    it('Should correctly throw an error when no valid consensus system name is found', () => {
        const destLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Cosmos":{"chainId":"0"}}}}}`;

        const err = () => getGlobalConsensusSystemName(destLocation);

        expect(err).toThrow(`No known consensus system found for location {"parents":"2","interior":{"X1":{"GlobalConsensus":{"Cosmos":{"chainId":"0"}}}}}`);
    });
})