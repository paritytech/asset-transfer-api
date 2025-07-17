import { testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import { beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { configs, setupParachainsWithRelay } from './networks.js';

describe('Westend Relay <-> Westend Asset Hub', () => {
	const WESTEND_ASSET_HUB_CHAIN_ID = '1000';
	const USDC_ASSET_ID = 31337;

	let westend: NetworkContext;
	let westendAssetHub: NetworkContext;
	let westendAta: AssetTransferApi;
	let westendAssetHubAta: AssetTransferApi;
	const safeXcmVersion = 5;

	const { alice, bob } = testingPairs();
	const aliceInitialNative = new BN(100 * 1e12);
	const aliceInitialUsdc = new BN(100 * 1e6);

	beforeAll(async () => {
		[westend, [westendAssetHub]] = await setupParachainsWithRelay(
			configs.westend,
			[configs.westendAssetHub],
			__filename,
		);
	}, 1000000);

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
					[[USDC_ASSET_ID, alice.address], { balance: aliceInitialUsdc.toNumber(), isFrozen: false }],
					[[USDC_ASSET_ID, bob.address], { balance: 0, isFrozen: false }],
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

		westendAta = new AssetTransferApi(westend.api, 'westend', safeXcmVersion);
		westendAssetHubAta = new AssetTransferApi(westendAssetHub.api, 'asset-hub-westend', safeXcmVersion);
	}, 1000000);

	afterAll(async () => {
		await westendAssetHub.teardown();
		await westend.teardown();
	}, 1000000);

	const expectRelayBalance = async (address: string, amount: BN, msg: string) => {
		await expectNativeBalance({
			api: westend.api,
			address,
			amount,
			msg,
		});
	};
	const expectAssetHubBalance = async (address: string, amount: BN, msg: string) => {
		await expectNativeBalance({
			api: westendAssetHub.api,
			address,
			amount,
			msg,
		});
	};
	const expectUsdcBalance = async (address: string, amount: BN, msg: string) => {
		await expectAssetBalance({
			api: westendAssetHub.api,
			assetId: USDC_ASSET_ID,
			address,
			amount,
			msg,
		});
	};
	describe('Local AssetHub transfers', () => {
		/**
		 * Send WND from alice to `dest` within the Asset Hub
		 * @param dest
		 * @param amount
		 */
		const sendNative = async (dest: string, amount: BN) => {
			const assetTransferApi = westendAssetHubAta;
			const nativeTx = await assetTransferApi.createTransferTransaction(
				WESTEND_ASSET_HUB_CHAIN_ID,
				dest,
				[],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: alice.address,
				},
			);
			const nativeExtrinsic = assetTransferApi.api.registry.createType(
				'Extrinsic',
				{ method: nativeTx.tx.method },
				{ version: 4 },
			);

			await westendAssetHub.api.tx(nativeExtrinsic).signAndSend(alice, (result) => {
				console.log(`Tx status: ${result.status.toString()}`);

				if (result.status.isInBlock) {
					console.log(`✅ Included at blockHash: ${result.status.asInBlock.toString()}`);
				}

				if (result.status.isFinalized) {
					console.log(`✅ Finalized at blockHash: ${result.status.asFinalized.toString()}`);

					result.events.forEach(({ event: { section, method, data } }) => {
						console.log(`→ Event: ${section}.${method}`, data.toHuman());
					});
				}
			});

			await westendAssetHub.dev.newBlock();
		};

		/**
		 * Send USDC from alice to `dest` within the Asset Hub
		 * @param dest
		 * @param amount
		 */
		const sendUsdc = async (dest: string, amount: BN) => {
			const assetTransferApi = westendAssetHubAta;
			const usdcTx = await assetTransferApi.createTransferTransaction(
				WESTEND_ASSET_HUB_CHAIN_ID,
				dest,
				[USDC_ASSET_ID.toString()],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: alice.address,
				},
			);
			const usdcExtrinsic = assetTransferApi.api.registry.createType(
				'Extrinsic',
				{ method: usdcTx.tx.method },
				{ version: 4 },
			);

			await westendAssetHub.api.tx(usdcExtrinsic).signAndSend(alice);
			await westendAssetHub.dev.newBlock();
		};

		test('Transfers of WND and USDC above the existential deposit work', async () => {
			await expectAssetHubBalance(alice.address, aliceInitialNative, 'alice inital native balance is incorrect');
			await expectUsdcBalance(alice.address, aliceInitialUsdc, 'alice inital USDC balance is incorrect');
			await expectAssetHubBalance(bob.address, new BN(0), 'bob inital native balance is incorrect');
			await expectUsdcBalance(bob.address, new BN(0), 'bob inital USDC balance is incorrect');

			const nativeToSend = new BN(1e9); // Existential deposit
			const usdcToSend = new BN(1000); // minBalance

			await sendNative(bob.address, nativeToSend);
			await expectAssetHubBalance(bob.address, nativeToSend, 'bob did not receive expected native amount');

			await sendUsdc(bob.address, usdcToSend);
			await expectUsdcBalance(bob.address, usdcToSend, 'bob did not receive expected USDC amount');
		}, 200000);
	});

	describe('XCM transfers between Relay and AssetHub', () => {
		/**
		 * Send WND from alice on the relay chain to `dest` on the Asset Hub
		 * @param dest
		 * @param amount
		 */
		const sendToAssetHub = async (dest: string, amount: BN): Promise<BN> => {
			const assetTransferApi = westendAta; // From relay chain
			const destApi = westendAssetHub.api;
			const originNetowrk = westend;
			const destNetwork = westendAssetHub;
			const sender = alice;

			const nativeTx = await assetTransferApi.createTransferTransaction(
				WESTEND_ASSET_HUB_CHAIN_ID,
				dest,
				[],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: sender.address,
				},
			);
			const nativeExtrinsic = assetTransferApi.api.registry.createType(
				'Extrinsic',
				{ method: nativeTx.tx.method },
				{ version: 4 },
			);

			await originNetowrk.api.tx(nativeExtrinsic).signAndSend(sender);
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
			await expectAssetHubBalance(alice.address, aliceInitialNative, 'alice inital asset hub balance is incorrect');
			await expectUsdcBalance(alice.address, aliceInitialUsdc, 'alice inital USDC balance is incorrect');
			await expectRelayBalance(alice.address, aliceInitialNative, 'alice inital relay balance is incorrect');

			await expectAssetHubBalance(bob.address, new BN(0), 'bob inital asset hub balance is incorrect');
			await expectUsdcBalance(bob.address, new BN(0), 'bob inital USDC balance is incorrect');
			await expectRelayBalance(bob.address, new BN(0), 'bob inital relay balance is incorrect');

			// existential deposit on westend is 1e10.
			// existential deposit on Asset hub is 1e9.
			// XCMs incur execution fees so result must be greater than ED
			const amountToSend = new BN(1e10);
			const executionFee = await sendToAssetHub(bob.address, amountToSend);

			await expectAssetHubBalance(
				bob.address,
				amountToSend.sub(executionFee),
				'bob asset hub balance is incorrect after XCM',
			);
		}, 200000);
	});
});

async function expectNativeBalance({
	api,
	address,
	amount,
	msg,
}: {
	api: ApiPromise;
	address: string;
	amount: number | BN;
	msg: string;
}) {
	const account = await api.query.system.account(address);
	const balance = new BN(account.data.free);
	const expected = new BN(amount);
	const diff = expected.sub(balance);

	expect(
		balance.eq(expected),
		`${msg} { value: ${balance.toLocaleString()}; expected: ${expected.toLocaleString()}; diff: ${diff.toLocaleString()} }`,
	).toBe(true);
}

async function expectAssetBalance({
	api,
	assetId,
	address,
	amount,
	msg,
}: {
	api: ApiPromise;
	assetId: number | BN;
	address: string;
	amount: number | BN;
	msg: string;
}) {
	const account = await api.query.assets.account(assetId, address);
	expect(account.isSome).toBe(true);
	const balance = new BN(account.unwrap().balance);
	const expected = new BN(amount);
	const diff = expected.sub(balance);
	expect(
		balance.eq(expected),
		`${msg} { value: ${balance.toLocaleString()}; expected: ${amount.toLocaleString()}; diff: ${diff.toLocaleString()} }`,
	).toBe(true);
}

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
