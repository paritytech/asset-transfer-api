import { setupNetworks, testingPairs, withExpect } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { setTimeout } from 'timers/promises';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';

const { checkSystemEvents } = withExpect(expect);

describe('Bifrost Polkadot <> Ethereum', () => {
	const ethereumNetworkGlobalConsensusLocation = `{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`;
	let bifrostPolkadot: NetworkContext;
	let polkadotAssetHub: NetworkContext;
	let polkadotBridgeHub: NetworkContext;

	const { alice, alith } = testingPairs();

	beforeEach(async () => {
		const { bifrostPolkadot1, polkadotBridgeHub1, polkadotAssetHub1 } = await setupNetworks({
			bifrostPolkadot1: {
				endpoint: 'wss://bifrost-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8013,
			},
			polkadotBridgeHub1: {
				endpoint: 'wss://bridge-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8014,
			},
			polkadotAssetHub1: {
				endpoint: 'wss://asset-hub-polkadot-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8015,
			},
		});

		bifrostPolkadot = bifrostPolkadot1;
		polkadotBridgeHub = polkadotBridgeHub1;
		polkadotAssetHub = polkadotAssetHub1;
	}, 1000000);

	afterEach(async () => {
		await bifrostPolkadot.teardown();
		await polkadotAssetHub.teardown();
		await polkadotBridgeHub.teardown();
	}, 1000000);

	describe('XCM V3', () => {
		const xcmVersion = 3;

		test('Transfer Snowbridge WETH from Bifrost Polkadot to Ethereum', async () => {
			await bifrostPolkadot.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // BNC
					],
				},
				Tokens: {
					Accounts: [
						[[alice.address, { Token2: 0 }], { free: '1000000000000000000000000000000000' }], // DOT
						[[alice.address, { Token2: 13 }], { free: '1000000000000000000000000000000' }], // Snowbridge WETH
					],
				},
			});

			const assetTransferApi = new AssetTransferApi(bifrostPolkadot.api, 'bifrost_polkadot', xcmVersion, {
				registryType: 'NPM',
				injectedRegistry: {
					polkadot: {
						2030: {
							tokens: [],
							assetsInfo: {},
							foreignAssetsInfo: {},
							poolPairsInfo: {},
							specName: 'bifrost_polkadot',
							xcAssetsData: [
								{
									paraID: 0,
									symbol: 'WETH.snow',
									decimals: 18,
									xcmV1MultiLocation:
										'{"v1":{"parents":2,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}',
									asset: { Token2: '13' },
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
				['100000000000', '750000000000000'],
				{
					sendersAddr: alice.address,
					format: 'payload',
					xcmVersion,
					paysWithFeeDest: 'DOT',
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await bifrostPolkadot.api.tx(extrinsic).signAndSend(alice);
			await bifrostPolkadot.dev.newBlock();

			await checkSystemEvents(bifrostPolkadot, 'polkadotXcm')
				.redact({ redactKeys: new RegExp('messageId') })
				.toMatchSnapshot('bifrost polkadot xcm message sent');

			await setTimeout(10000);
			await polkadotAssetHub.dev.timeTravel(1);

			await checkSystemEvents(polkadotAssetHub, 'foreignAssets').toMatchSnapshot('assethub foreign assets burned');
			await checkSystemEvents(polkadotAssetHub, 'xcmpQueue', 'XcmpMessageSent').toMatchSnapshot(
				'assetHub xcmp message sent',
			);

			await setTimeout(10000);
			await polkadotBridgeHub.dev.timeTravel(1);

			await checkSystemEvents(polkadotBridgeHub, 'ethereumOutboundQueue')
				.redact({ redactKeys: new RegExp('nonce') })
				.toMatchSnapshot('bridgehub ethereum outbound queue events');
		}, 200000);
	});
	describe('XCM V4', () => {
		const xcmVersion = 4;

		test('Transfer Snowbridge WETH from Bifrost Polkadot to Ethereum', async () => {
			await bifrostPolkadot.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // BNC
					],
				},
				Tokens: {
					Accounts: [
						[[alice.address, { Token2: 0 }], { free: '1000000000000000000000000000000000' }], // DOT
						[[alice.address, { Token2: 13 }], { free: '1000000000000000000000000000000' }], // Snowbridge WETH
					],
				},
			});

			const assetTransferApi = new AssetTransferApi(bifrostPolkadot.api, 'bifrost_polkadot', xcmVersion, {
				registryType: 'NPM',
				injectedRegistry: {
					polkadot: {
						2030: {
							tokens: [],
							assetsInfo: {},
							foreignAssetsInfo: {},
							poolPairsInfo: {},
							specName: 'bifrost_polkadot',
							xcAssetsData: [
								{
									paraID: 0,
									symbol: 'WETH.snow',
									decimals: 18,
									xcmV1MultiLocation:
										'{"v1":{"parents":2,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}',
									asset: { Token2: '13' },
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
				['100000000000', '750000000000000'],
				{
					sendersAddr: alice.address,
					format: 'payload',
					xcmVersion,
					paysWithFeeDest: 'DOT',
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await bifrostPolkadot.api.tx(extrinsic).signAndSend(alice);
			await bifrostPolkadot.dev.newBlock();

			await checkSystemEvents(bifrostPolkadot, 'polkadotXcm')
				.redact({ redactKeys: new RegExp('messageId') })
				.toMatchSnapshot('bifrost polkadot xcm message sent');

			await setTimeout(10000);
			await polkadotAssetHub.dev.timeTravel(1);

			await checkSystemEvents(polkadotAssetHub, 'foreignAssets').toMatchSnapshot('assethub foreign assets burned');
			await checkSystemEvents(polkadotAssetHub, 'xcmpQueue', 'XcmpMessageSent').toMatchSnapshot(
				'assetHub xcmp message sent',
			);

			const assetHubEvents = await polkadotAssetHub.api.query.system.events();

			const xcmMessageProcessed = assetHubEvents[assetHubEvents.length - 1];
			expect(xcmMessageProcessed.phase.toString()).toEqual('Finalization');
			expect(xcmMessageProcessed.event.method).toEqual('Processed');
			expect(xcmMessageProcessed.event.section).toEqual('messageQueue');

			await setTimeout(10000);
			await polkadotBridgeHub.dev.timeTravel(1);

			await checkSystemEvents(polkadotBridgeHub, 'ethereumOutboundQueue')
				.redact({ redactKeys: new RegExp('nonce') })
				.toMatchSnapshot('bridgehub ethereum outbound queue events');

			const bridgeHubEvents = await polkadotBridgeHub.api.query.system.events();
			const messageAcceptedEvent = bridgeHubEvents[bridgeHubEvents.length - 3];
			expect(messageAcceptedEvent.event.section).toEqual('ethereumOutboundQueue');
			expect(messageAcceptedEvent.event.method).toEqual('MessageAccepted');

			const messageCommittedEvent = bridgeHubEvents[bridgeHubEvents.length - 1];
			expect(messageCommittedEvent.event.section).toEqual('ethereumOutboundQueue');
			expect(messageCommittedEvent.event.method).toEqual('MessagesCommitted');
		}, 200000);
	});
});
