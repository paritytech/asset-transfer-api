// TODO: XCM between relay and AssetHub?

import { testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { InsufficientDestinationAccount } from '../src/errors/checkDestSufficiency';
import { configs, setupNetworksWithRelay } from './networks.js';

describe('checkDestSufficiency on Westend and Westend Asset Hub', () => {
	const WESTEND_ASSET_HUB_CHAIN_ID = '1000';
	const USDC_ASSET_ID = 31337;

	let westend: NetworkContext;
	let westendAssetHub: NetworkContext;
	let westendAta: AssetTransferApi;
	let westendAssetHubAta: AssetTransferApi;
	const safeXcmVersion = 4;

	const { alice, bob } = testingPairs();
	const aliceInitialNative = 100 * 1e12;
	const aliceInitialUsdc = 100 * 1e6;

	beforeAll(async () => {
		[westend, [westendAssetHub]] = await setupNetworksWithRelay(configs.westend, [configs.westendAssetHub]);
	}, 1000000);

	beforeEach(async () => {
		await westendAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: aliceInitialNative } }],
					[[bob.address], { providers: 1, data: { free: 0 * 1e12 } }],
				],
			},
			Assets: {
				Account: [
					[[USDC_ASSET_ID, alice.address], { balance: aliceInitialUsdc, isFrozen: false }],
					[[USDC_ASSET_ID, bob.address], { balance: 0, isFrozen: false }],
				],
			},
		});
		await westend.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: aliceInitialNative } }],
					[[bob.address], { providers: 1, data: { free: 0 * 1e12 } }],
				],
			},
		});

		westendAta = new AssetTransferApi(westend.api, 'westend', safeXcmVersion);
		westendAssetHubAta = new AssetTransferApi(westendAssetHub.api, 'asset-hub-westend', safeXcmVersion);
	}, 1000000);

	afterEach(async () => {
		await westendAssetHub.teardown();
		await westend.teardown();
	}, 1000000);

	const expectRelayBalance = async (address: string, amount: number, msg: string) => {
		await expectNativeBalance({
			api: westend.api,
			address,
			amount,
			msg,
		});
	};
	const expectAssetHubBalance = async (address: string, amount: number, msg: string) => {
		await expectNativeBalance({
			api: westendAssetHub.api,
			address,
			amount,
			msg,
		});
	};
	const expectUsdcBalance = async (address: string, amount: number, msg: string) => {
		await expectAssetBalance({
			api: westendAssetHub.api,
			assetId: USDC_ASSET_ID,
			address,
			amount,
			msg,
		});
	};
	describe('Local AssetHub transfers', () => {
		// Always send from alice
		const sendNative = async (dest: string, amount: number) => {
			const assetTransferApi = westendAssetHubAta;
			const nativeTx = await assetTransferApi.createTransferTransaction(
				WESTEND_ASSET_HUB_CHAIN_ID,
				dest,
				[],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: alice.address,
					destApi: westendAssetHub.api,
				},
			);
			const nativeExtrinsic = assetTransferApi.api.registry.createType(
				'Extrinsic',
				{ method: nativeTx.tx.method },
				{ version: 4 },
			);

			await westendAssetHub.api.tx(nativeExtrinsic).signAndSend(alice);
			await westendAssetHub.dev.newBlock();
		};

		// Always send from alice
		const sendUsdc = async (dest: string, amount: number) => {
			const assetTransferApi = westendAssetHubAta;
			const usdcTx = await assetTransferApi.createTransferTransaction(
				WESTEND_ASSET_HUB_CHAIN_ID,
				dest,
				[USDC_ASSET_ID.toString()],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: alice.address,
					destApi: westendAssetHub.api,
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

		test('Sufficent transfer of Native Asset and then USDC will not throw error', async () => {
			await expectAssetHubBalance(alice.address, aliceInitialNative, 'alice inital native balance is incorrect');
			await expectUsdcBalance(alice.address, aliceInitialUsdc, 'alice inital USDC balance is incorrect');
			await expectAssetHubBalance(bob.address, 0, 'bob inital native balance is incorrect');
			await expectUsdcBalance(bob.address, 0, 'bob inital USDC balance is incorrect');

			const nativeToSend = 1e9; // Existential deposit
			const usdcToSend = 1000; // minBalance

			await sendNative(bob.address, nativeToSend);
			await expectAssetHubBalance(bob.address, nativeToSend, 'bob did not receive expected native amount');

			await sendUsdc(bob.address, usdcToSend);
			await expectUsdcBalance(bob.address, usdcToSend, 'bob did not receive expected USDC amount');
		}, 200000);

		test('Transfers to insufficient account will throw error if destApi is given', async () => {
			await expectAssetHubBalance(alice.address, aliceInitialNative, 'alice inital native balance is incorrect');
			await expectUsdcBalance(alice.address, aliceInitialUsdc, 'alice inital USDC balance is incorrect');
			await expectAssetHubBalance(bob.address, 0, 'bob inital native balance is incorrect');
			await expectUsdcBalance(bob.address, 0, 'bob inital USDC balance is incorrect');

			const usdcToSend = 999; // minBalance - 1
			await expect(sendUsdc(bob.address, usdcToSend)).rejects.toThrow(InsufficientDestinationAccount);

			const nativeToSend = 1e9 - 1; // existential deposit - 1
			await expect(sendNative(bob.address, nativeToSend)).rejects.toThrow(InsufficientDestinationAccount);
		}, 200000);
	});

	describe('XCM transfers between Relay and AssetHub', () => {
		// Always send from alice
		const sendToAssetHub = async (dest: string, amount: number) => {
			const assetTransferApi = westendAta; // From relay chain
			const nativeTx = await assetTransferApi.createTransferTransaction(
				WESTEND_ASSET_HUB_CHAIN_ID,
				dest,
				[],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: alice.address,
					destApi: westendAssetHub.api,
				},
			);
			const nativeExtrinsic = assetTransferApi.api.registry.createType(
				'Extrinsic',
				{ method: nativeTx.tx.method },
				{ version: 4 },
			);

			await westend.api.tx(nativeExtrinsic).signAndSend(alice);
			await westend.dev.newBlock();
			await westendAssetHub.dev.newBlock();
		};

		// Always send from alice
		const sendToRelay = async (dest: string, amount: number) => {
			const assetTransferApi = westendAta; // From asset hub
			const nativeTx = await assetTransferApi.createTransferTransaction(
				'0', // relay chain
				dest,
				[],
				[amount.toString()],
				{
					format: 'payload',
					sendersAddr: alice.address,
					destApi: westend.api,
				},
			);
			const nativeExtrinsic = assetTransferApi.api.registry.createType(
				'Extrinsic',
				{ method: nativeTx.tx.method },
				{ version: 4 },
			);

			console.log('=============================');
			console.log(JSON.stringify(nativeExtrinsic.toHuman(), null, 2));
			console.log('=============================');

			await westendAssetHub.api.tx(nativeExtrinsic).signAndSend(alice);
			// await westendAssetHub.dev.newBlock();
			// await westend.dev.newBlock(); // TODO: check that I need this
		};

		test('TODO', async () => {
			await expectAssetHubBalance(alice.address, aliceInitialNative, 'alice inital asset hub balance is incorrect');
			await expectUsdcBalance(alice.address, aliceInitialUsdc, 'alice inital USDC balance is incorrect');
			await expectRelayBalance(alice.address, aliceInitialNative, 'alice inital relay balance is incorrect');

			await expectAssetHubBalance(bob.address, 0, 'bob inital asset hub balance is incorrect');
			await expectUsdcBalance(bob.address, 0, 'bob inital USDC balance is incorrect');
			await expectRelayBalance(bob.address, 0, 'bob inital relay balance is incorrect');

			const amountToSend = 1e10; // existential deposit on westend. Asset hub is 1e9
			await sendToAssetHub(bob.address, amountToSend);
			await sendToRelay(bob.address, amountToSend);

			// debugging
			const account = await westend.api.query.system.account(bob.address);
			console.log(`Westend : ${account.data.free.toHuman()}`);
			const assetHubAccount = await westendAssetHub.api.query.system.account(bob.address);
			console.log(`AssetHub: ${assetHubAccount.data.free.toHuman()}`);

			await expectAssetHubBalance(bob.address, amountToSend, 'bob asset hub balance is incorrect after XCM');

			// const usdcToSend = 999; // minBalance - 1
			// await expect(sendUsdc(assetTransferApi, bob.address, usdcToSend)).rejects.toThrow(InsufficientDestinationAccount);
			// const nativeToSend = 1e9 - 1; // existential deposit - 1
			// await expect(sendNative(assetTransferApi, bob.address, nativeToSend)).rejects.toThrow(
			// 	InsufficientDestinationAccount,
			// );
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
	const balance = account.data.free;
	expect(balance.eq(amount), `${msg} { value: ${balance.toHuman()}, expected: ${amount.toString()} }`).toBe(true);
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
	const balance = account.unwrap().balance;
	expect(balance.eq(amount), `${msg} { value: ${balance.toHuman()}, expected: ${amount.toLocaleString()} }`).toBe(true);
}
