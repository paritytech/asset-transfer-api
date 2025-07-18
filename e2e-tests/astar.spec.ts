import { testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import BN from 'bn.js';
import { beforeEach, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { NetworkHelper } from './helper.js';
import { configs, setupParachainsWithRelay } from './networks.js';

describe('Polkadot Asset Hub <-> Astar', () => {
	const ASSET_HUB_CHAIN_ID = '1000';
	const ASTAR_CHAIN_ID = '2006';
	const ASSET_IDS = {
		polkadot: {
			USDT: '1984',
		},
		astar: {
			USDT: '4294969280',
		},
	};

	let networks: { [key: string]: NetworkHelper };

	let relay: NetworkContext;
	let polkadotAssetHub: NetworkContext;
	let astar: NetworkContext;

	const safeXcmVersion = 5;

	const { alice, bob } = testingPairs();
	const aliceInitialNative = new BN(100 * 1e12);
	const aliceInitialUsdt = new BN(100 * 1e6);

	async function verifyStartingBalances(networks: { [key: string]: NetworkHelper }) {
		// AssetHub
		await networks.polkadotAssetHub.expectAssetBalance(
			'USDT',
			alice.address,
			aliceInitialUsdt,
			"Alice's initial USDT balance is incorrect on PAH",
		);
		await networks.polkadotAssetHub.expectNativeBalance(
			alice.address,
			aliceInitialNative,
			"Alice's initial native balance is incorrect on PAH",
		);
		await networks.polkadotAssetHub.expectAssetBalance(
			'USDT',
			bob.address,
			0,
			"Bob's initial USDT balance is incorrect on PAH",
		);
		await networks.polkadotAssetHub.expectNativeBalance(
			bob.address,
			0,
			"Bob's initial native balance is incorrect on PAH",
		);

		// Astar
		await networks.astar.expectAssetBalance(
			'USDT',
			alice.address,
			aliceInitialUsdt,
			"Alice's initial USDT balance is incorrect on Astar",
		);
		await networks.astar.expectNativeBalance(
			alice.address,
			aliceInitialNative,
			"Alice's initial native balance is incorrect on Astar",
		);
		await networks.astar.expectAssetBalance('USDT', bob.address, 0, "Bob's initial USDT balance is incorrect on Astar");
		await networks.astar.expectNativeBalance(bob.address, 0, "Bob's initial native balance is incorrect on Astar");
	}

	beforeAll(async () => {
		[relay, [polkadotAssetHub, astar]] = await setupParachainsWithRelay(
			configs.polkadot,
			[configs.polkadotAssetHub, configs.astar],
			__filename,
		);
		networks = {
			polkadot: new NetworkHelper(relay),
			polkadotAssetHub: new NetworkHelper(polkadotAssetHub, ASSET_HUB_CHAIN_ID, ASSET_IDS.polkadot),
			astar: new NetworkHelper(astar, ASTAR_CHAIN_ID, ASSET_IDS.astar),
		};
	}, 60000);

	beforeEach(async () => {
		await polkadotAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: aliceInitialNative.toNumber() } }],
					[[bob.address], { providers: 1, data: { free: 0 * 1e12 } }],
				],
			},
			Assets: {
				Account: [
					[[ASSET_IDS.polkadot.USDT, alice.address], { balance: aliceInitialUsdt.toNumber(), isFrozen: false }],
					[[ASSET_IDS.polkadot.USDT, bob.address], { balance: 0, isFrozen: false }],
				],
			},
		});
		await astar.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: aliceInitialNative.toNumber() } }],
					[[bob.address], { providers: 1, data: { free: 0 * 1e12 } }],
				],
			},
			Assets: {
				Account: [
					[[ASSET_IDS.astar.USDT, alice.address], { balance: aliceInitialUsdt.toNumber(), isFrozen: false }],
					[[ASSET_IDS.astar.USDT, bob.address], { balance: 0, isFrozen: false }],
				],
			},
		});
		await relay.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: aliceInitialNative.toNumber() } }],
					[[bob.address], { providers: 1, data: { free: 0 * 1e12 } }],
				],
			},
		});

		await verifyStartingBalances(networks);
	}, 60000);

	afterAll(async () => {
		await polkadotAssetHub.teardown();
		await astar.teardown();
		await relay.teardown();
	}, 60000);

	describe('Polkadot Asset Hub -> Astar', () => {
		test('USDT', async () => {
			const ata = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', safeXcmVersion);
			const amount = new BN(1e6);
			const txResult = await ata.createTransferTransaction(
				ASTAR_CHAIN_ID,
				bob.address,
				[ASSET_IDS.polkadot.USDT],
				[amount.toString()],
				{
					sendersAddr: alice.address,
					format: 'submittable',
				},
			);

			await networks.polkadotAssetHub.signAndSend(txResult, alice);

			await polkadotAssetHub.dev.newBlock();
			await relay.dev.newBlock();
			await astar.dev.newBlock();

			// Fee data
			// We can derive this later for robustness but for now they will be constants
			const dotTransactionFee = new BN(17_126_364);
			const dotXcmFeesPaid = new BN(305_450_000);
			const usdtXcmFee = new BN(188); // Can see in trace `TRACE: [25] XcmFeeHandler::take_revenue took 188 of asset Id 4294969280`

			const aliceExpectedDot = aliceInitialNative.sub(dotTransactionFee.add(dotXcmFeesPaid));

			await networks.polkadotAssetHub.expectNativeBalance(
				alice.address,
				aliceExpectedDot,
				"Alices's final native balance is incorrect on Astar",
			);
			await networks.polkadotAssetHub.expectAssetBalance(
				'USDT',
				alice.address,
				aliceInitialUsdt.sub(amount),
				"Alice's final USDT balance is incorrect on Polkadot Asset Hub",
			);
			await networks.astar.expectAssetBalance(
				'USDT',
				bob.address,
				amount.sub(usdtXcmFee),
				"Bob's final USDT balance is incorrect on Astar",
			);
		}, 60000);
	});
	describe('Polkadot Asset Hub -> Astar', () => {
		test.skip('USDT', async () => {
			// Failing to execute XCM
			// runtime::system  DEBUG: [10] Extrinsic Weight(ref_time: 18446744073709551000, proof_size: 0) is greater than the max extrinsic Weight(ref_time: 1299891843000, proof_size: 6815744)
			const ata = new AssetTransferApi(astar.api, 'astar', safeXcmVersion);
			const amount = new BN(1e6);
			const txResult = await ata.createTransferTransaction(
				ASSET_HUB_CHAIN_ID,
				bob.address,
				[ASSET_IDS.astar.USDT],
				[amount.toString()],
				{
					sendersAddr: alice.address,
					format: 'submittable',
					weightLimit: {
						refTime: '1600000000',
						proofSize: '16000',
					},
				},
			);

			await networks.astar.signAndSend(txResult, alice);

			await astar.dev.newBlock();
			await relay.dev.newBlock();
			await polkadotAssetHub.dev.newBlock();
		}, 60000);
	});
});
