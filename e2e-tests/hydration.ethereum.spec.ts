import { testingPairs, withExpect } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { ETHEREUM_MAINNET_NETWORK_GLOBAL_CONSENSUS_LOCATION } from '../src/consts';
import { configs, setupParachains } from './networks.js';

const { checkSystemEvents } = withExpect(expect);

describe('Hydration <> Ethereum', () => {
	let hydration: NetworkContext;
	let polkadotAssetHub: NetworkContext;
	let polkadotBridgeHub: NetworkContext;

	const { alice, alith } = testingPairs();

	beforeEach(async () => {
		[hydration, polkadotBridgeHub, polkadotAssetHub] = await setupParachains([
			configs.hydration,
			configs.polkadotBridgeHub,
			configs.polkadotAssetHub,
		]);
	}, 1000000);

	afterEach(async () => {
		await hydration.teardown();
		await polkadotAssetHub.teardown();
		await polkadotBridgeHub.teardown();
	}, 1000000);

	describe('XCM V3', () => {
		const xcmVersion = 3;

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

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', xcmVersion, {
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
				ETHEREUM_MAINNET_NETWORK_GLOBAL_CONSENSUS_LOCATION,
				alith.address,
				['DOT', 'WETH.snow'],
				['500000000000', '75000000000000'],
				{
					sendersAddr: alice.address,
					format: 'payload',
					xcmVersion,
					paysWithFeeDest: 'DOT',
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();

			await checkSystemEvents(hydration, 'polkadotXcm')
				.redact({ redactKeys: new RegExp('messageId|proofSize|refTime') })
				.toMatchSnapshot('hydration xcm message sent');

			const polkadotAssetHubCurrentChainHead = polkadotAssetHub.chain.head.number;
			await polkadotAssetHub.dev.newBlock();
			await polkadotAssetHub.dev.setHead(polkadotAssetHubCurrentChainHead + 1);

			await checkSystemEvents(polkadotAssetHub, 'foreignAssets').toMatchSnapshot('assethub foreign assets burned');
			await checkSystemEvents(polkadotAssetHub, 'xcmpQueue', 'XcmpMessageSent').toMatchSnapshot(
				'assetHub xcmp message sent',
			);

			const polkadotBridgeHubCurrentChainHead = polkadotBridgeHub.chain.head.number;
			await polkadotBridgeHub.dev.newBlock();
			await polkadotBridgeHub.dev.setHead(polkadotBridgeHubCurrentChainHead + 1);

			await checkSystemEvents(polkadotBridgeHub, 'ethereumOutboundQueue')
				.redact({ redactKeys: new RegExp('nonce') })
				.toMatchSnapshot('bridgehub ethereum outbound queue events');
		}, 200000);
	});
	describe('XCM V4', () => {
		const xcmVersion = 4;

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

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', xcmVersion, {
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
				ETHEREUM_MAINNET_NETWORK_GLOBAL_CONSENSUS_LOCATION,
				alith.address,
				['DOT', 'WETH.snow'],
				['500000000000', '75000000000000'],
				{
					sendersAddr: alice.address,
					format: 'payload',
					xcmVersion,
					paysWithFeeDest: 'DOT',
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();

			await checkSystemEvents(hydration, 'polkadotXcm')
				.redact({ redactKeys: new RegExp('messageId|proofSize|refTime') })
				.toMatchSnapshot('hydration xcm message sent');

			const polkadotAssetHubCurrentChainHead = polkadotAssetHub.chain.head.number;
			await polkadotAssetHub.dev.newBlock();
			await polkadotAssetHub.dev.setHead(polkadotAssetHubCurrentChainHead + 1);

			await checkSystemEvents(polkadotAssetHub, 'foreignAssets').toMatchSnapshot('assethub foreign assets burned');
			await checkSystemEvents(polkadotAssetHub, 'xcmpQueue', 'XcmpMessageSent').toMatchSnapshot(
				'assetHub xcmp message sent',
			);

			const assetHubEvents = await polkadotAssetHub.api.query.system.events();

			const xcmMessageProcessed = assetHubEvents[assetHubEvents.length - 1];
			expect(xcmMessageProcessed.phase.toString()).toEqual('Finalization');
			expect(xcmMessageProcessed.event.method).toEqual('Processed');
			expect(xcmMessageProcessed.event.section).toEqual('messageQueue');

			const polkadotBridgeHubCurrentChainHead = polkadotBridgeHub.chain.head.number;
			await polkadotBridgeHub.dev.newBlock();
			await polkadotBridgeHub.dev.setHead(polkadotBridgeHubCurrentChainHead + 1);

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
