import { testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import { beforeEach, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { NetworkHelper } from './helper.js';
import { configs, setupParachainsWithRelay } from './networks.js';

describe('Westend Relay <-> Westend Asset Hub', () => {
	const ASSET_HUB_CHAIN_ID = '1000';
	const ASSET_IDS = {
		westend: {
			USDC: '31337',
		},
	};

	let networks: { [key: string]: NetworkHelper };

	let westend: NetworkContext;
	let westendAssetHub: NetworkContext;
	const safeXcmVersion = 5;

	const { alice, bob } = testingPairs();
	const aliceInitialNative = new BN(100 * 1e12);
	const aliceInitialUsdc = new BN(100 * 1e6);

	async function verifyStartingBalances(networks: { [key: string]: NetworkHelper }) {
		// AssetHub
		await networks.westendAssetHub.expectAssetBalance(
			'USDC',
			alice.address,
			aliceInitialUsdc,
			"Alice's initial USDC balance is incorrect on Westend Asset Hub",
		);
		await networks.westendAssetHub.expectNativeBalance(
			alice.address,
			aliceInitialNative,
			"Alice's initial native balance is incorrect on Westend Asset Hub",
		);
		await networks.westendAssetHub.expectAssetBalance(
			'USDC',
			bob.address,
			0,
			"Bob's initial USDC balance is incorrect on Westend Asset Hub",
		);
		await networks.westendAssetHub.expectNativeBalance(
			bob.address,
			0,
			"Bob's initial native balance is incorrect on Westend Asset Hub",
		);

		// Relay
		await networks.westend.expectNativeBalance(
			alice.address,
			aliceInitialNative,
			"Alice's initial native balance is incorrect on Westend Relay",
		);
		await networks.westend.expectNativeBalance(
			bob.address,
			0,
			"Bob's initial native balance is incorrect on Westend Relay",
		);
	}

	beforeAll(async () => {
		[westend, [westendAssetHub]] = await setupParachainsWithRelay(
			configs.westend,
			[configs.westendAssetHub],
			__filename,
		);
		networks = {
			westend: new NetworkHelper(westend),
			westendAssetHub: new NetworkHelper(westendAssetHub, ASSET_HUB_CHAIN_ID, ASSET_IDS.westend),
		};
	}, 60000);

	beforeEach(async () => {
		await westendAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: aliceInitialNative.toNumber() } }],
					[[bob.address], { providers: 1, data: { free: 0 * 1e12 } }],
				],
			},
			Assets: {
				Account: [
					[[ASSET_IDS.westend.USDC, alice.address], { balance: aliceInitialUsdc.toNumber(), isFrozen: false }],
					[[ASSET_IDS.westend.USDC, bob.address], { balance: 0, isFrozen: false }],
				],
			},
		});
		await westend.dev.setStorage({
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
		await westendAssetHub.teardown();
		await westend.teardown();
	}, 60000);

	describe('Local AssetHub transfers', () => {
		/**
		 * Send WND from alice to `dest` within the Asset Hub
		 * @param dest
		 * @param amount
		 */
		const sendNative = async (dest: string, amount: BN) => {
			const assetTransferApi = new AssetTransferApi(westendAssetHub.api, 'asset-hub-westend', safeXcmVersion);
			const txResult = await assetTransferApi.createTransferTransaction(
				ASSET_HUB_CHAIN_ID,
				dest,
				[],
				[amount.toString()],
				{
					format: 'submittable',
					sendersAddr: alice.address,
				},
			);

			await networks.westendAssetHub.signAndSend(txResult, alice);

			await westendAssetHub.dev.newBlock();
		};

		/**
		 * Send USDC from alice to `dest` within the Asset Hub
		 * @param dest
		 * @param amount
		 */
		const sendUsdc = async (dest: string, amount: BN) => {
			const assetTransferApi = new AssetTransferApi(westendAssetHub.api, 'asset-hub-westend', safeXcmVersion);
			const txResult = await assetTransferApi.createTransferTransaction(
				ASSET_HUB_CHAIN_ID,
				dest,
				[ASSET_IDS.westend.USDC],
				[amount.toString()],
				{
					format: 'submittable',
					sendersAddr: alice.address,
				},
			);

			await networks.westendAssetHub.signAndSend(txResult, alice);
			await westendAssetHub.dev.newBlock();
		};

		test('Transfers of WND and USDC above the existential deposit work', async () => {
			const nativeToSend = new BN(1e9); // Existential deposit
			const usdcToSend = new BN(1000); // minBalance

			await sendNative(bob.address, nativeToSend);
			await networks.westendAssetHub.expectNativeBalance(
				bob.address,
				nativeToSend,
				'bob did not receive expected native amount',
			);

			await sendUsdc(bob.address, usdcToSend);
			await networks.westendAssetHub.expectAssetBalance(
				'USDC',
				bob.address,
				usdcToSend,
				'bob did not receive expected USDC amount',
			);
		}, 60000);
	});

	describe('XCM transfers between Relay and AssetHub', () => {
		/**
		 * Send WND from alice on the relay chain to `dest` on the Asset Hub
		 * @param dest
		 * @param amount
		 */
		const sendToAssetHub = async (dest: string, amount: BN): Promise<BN> => {
			const assetTransferApi = new AssetTransferApi(westend.api, 'westend', safeXcmVersion);
			const destApi = westendAssetHub.api;
			const originNetowrk = westend;
			const destNetwork = westendAssetHub;
			const sender = alice;

			const txResult = await assetTransferApi.createTransferTransaction(
				ASSET_HUB_CHAIN_ID,
				dest,
				[],
				[amount.toString()],
				{
					format: 'submittable',
					sendersAddr: sender.address,
				},
			);

			await networks.westend.signAndSend(txResult, alice);
			await originNetowrk.dev.newBlock();
			const blockHash = await destNetwork.dev.newBlock();

			const executionFee = await deriveXcmExecutionFee({
				api: destApi,
				blockHash,
				receiver: dest,
			});

			return executionFee;
		};

		test('Relay chain -> Asset Hub works', async () => {
			// existential deposit on westend is 1e10.
			// existential deposit on Asset hub is 1e9.
			// XCMs incur execution fees so result must be greater than ED
			const amountToSend = new BN(1e10);
			const executionFee = await sendToAssetHub(bob.address, amountToSend);

			await networks.westendAssetHub.expectNativeBalance(
				bob.address,
				amountToSend.sub(executionFee),
				'bob asset hub balance is incorrect after XCM',
			);
		}, 60000);
	});
});

async function deriveXcmExecutionFee({
	api,
	blockHash,
	receiver,
}: {
	api: ApiPromise;
	blockHash: string;
	receiver: string;
}): Promise<BN> {
	const events = await api.query.system.events.at(blockHash);

	let burnedAmount = new BN(0);
	let receivedAmount = new BN(0);

	for (const { event } of events) {
		const { method, section, data } = event;

		// Possible fee deductions from sender
		if (section === 'balances' && method === 'Burned') {
			// const who = data[0]?.toString?.();
			const amount = new BN(data[2]?.toString?.() || data[1]?.toString?.() || 0);
			burnedAmount = burnedAmount.add(amount);
		}

		// Detect funds received by destination user
		if (section === 'balances' && method === 'Endowed') {
			const account = data[0].toString();
			const amount = new BN(data[1].toString());
			if (account === receiver) {
				receivedAmount = receivedAmount.add(amount);
			}
		}
	}

	const executionFee = burnedAmount.sub(receivedAmount);

	return executionFee;
}
