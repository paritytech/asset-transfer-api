import { setupNetworks, testingPairs, withExpect } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { AccountData } from '@polkadot/types/interfaces';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
const { checkSystemEvents } = withExpect(expect);

import { AssetTransferApi } from '../src/AssetTransferApi';
import { Option } from '@polkadot/types-codec';
import { AugmentedEvents } from '@polkadot/api/types';

describe('Hydration <> Ethereum', () => {
    const ethereumNetworkGlobalConsensusLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`;
    const recipientAddress = '15McF4S5ZsoAJGzdXE3FwSFVjSPoz1Cd7Xj7VQZCb7HULcjx';
    const snowbridgeWETHLocation = {
		parents: 2,
		interior: {
			X2: [
				{ GlobalConsensus: { Ethereum: { chainId: 1 } } },
				{ AccountKey20: { network: null, key: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' } },
			],
		},
	};

    let hydration: NetworkContext;
	let polkadotAssetHub: NetworkContext;
    let polkadotBridgeHub: NetworkContext;

	const { alice, alith } = testingPairs();

    beforeEach(async () => {
		const { hydration1, polkadotBridgeHub1, polkadotAssetHub1 } = await setupNetworks({
            hydration1: {
				endpoint: 'wss://rpc.hydradx.cloud',
				db: './db.sqlite',
			},
			polkadotBridgeHub1: {
				endpoint: 'wss://bridge-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8011,
			},
			polkadotAssetHub1: {
				endpoint: 'wss://asset-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8012,
			},
		});

        hydration = hydration1;
		polkadotBridgeHub = polkadotBridgeHub1;
		polkadotAssetHub = polkadotAssetHub1;
	}, 200000);

    afterEach(async () => {
		await hydration.teardown();
        await polkadotAssetHub.teardown();
        await polkadotBridgeHub.teardown();
	}, 200000);

    test('Transfer Snowbridge WETH from Hydration to Ethereum', async () => {
        await hydration.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
				],
			},
			Tokens: {
				Accounts: [
					[[alice.address, 0], { free: '50000000000000000000000000' }], // HDX
                    [[alice.address, 5], { free: '50000000000000000000000000' }], // DOT
					[[alice.address, 1000189], { free: '500000000000000000000' }], // Snowbridge WETH
				],
			},
		});

        const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', 4, {
            registryType: 'NPM',
			injectedRegistry: {
				polkadot: {
					2034: {
						tokens: [],
						assetsInfo: {},
						foreignAssetsInfo: {},
						poolPairsInfo: {},
						specName: 'hydradx',
						xcAssetsData: [
							{
								paraID: 0,
								symbol: 'WETH.snow',
								decimals: 18,
								xcmV1MultiLocation:
									'{"v1":{"parents":2,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}',
								asset: '1000189',
								assetHubReserveLocation: '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							},
						],
					},
				},
			},
        });

		const tx = await assetTransferApi.createTransferTransaction(
            ethereumNetworkGlobalConsensusLocation,
            alith.address,
            ['DOT', 'WETH.snow'],
            ['500000000000', '75000000000000'],
            {
                sendersAddr: alice.address,
                format: 'payload',
                xcmVersion: 4,
                paysWithFeeDest: 'DOT',
            },
        );

        console.log("payload", JSON.stringify(tx));

        const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await hydration.api.tx(extrinsic).signAndSend(alice);
        await hydration.dev.newBlock();
        await polkadotAssetHub.dev.newBlock();

        const assetHubEvents = await polkadotAssetHub.api.query.system.events();
        for (const event of assetHubEvents) {
            console.log("EVENT---", event.toHuman());
        }
		const foreignAssetsBurnedEvent = assetHubEvents[4];
        expect(foreignAssetsBurnedEvent.phase.toString()).toEqual('Finalization');
		expect(foreignAssetsBurnedEvent.event.section).toEqual('foreignAssets');
		expect(foreignAssetsBurnedEvent.event.method).toEqual('Burned');

        const xcmMessageSentEvent = assetHubEvents[6];
        expect(xcmMessageSentEvent.phase.toString()).toEqual('Finalization');
        expect(xcmMessageSentEvent.event.method).toEqual('XcmpMessageSent');
        expect(xcmMessageSentEvent.event.section).toEqual('xcmpQueue');

        await polkadotBridgeHub.dev.newBlock();

        await checkSystemEvents(polkadotBridgeHub, 'ethereumOutboundQueue', 'balances')
        const bridgeHubEvents = await polkadotBridgeHub.api.query.system.events();
        for (const event of bridgeHubEvents) {
            console.log("BridgeHub Events---", event.toHuman());
        }
    }, 100000);
});