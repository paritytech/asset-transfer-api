import { setupNetworks, testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { AccountData } from '@polkadot/types/interfaces';
import { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import { Option } from '@polkadot/types-codec';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';

describe('Polkadot AssetHub <> Hydration', () => {
	let hydration: NetworkContext;
	let polkadotAssetHub: NetworkContext;

	const { alice } = testingPairs();
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

	beforeEach(async () => {
		const { hydration1, polkadotAssetHub1 } = await setupNetworks({
			hydration1: {
				endpoint: 'wss://hydration.ibp.network',
				db: './db.sqlite',
				port: 8006,
			},
			polkadotAssetHub1: {
				endpoint: 'wss://polkadot-asset-hub-rpc.polkadot.io',
				db: './db.sqlite',
				port: 8007,
			},
		});

		hydration = hydration1;
		polkadotAssetHub = polkadotAssetHub1;
	}, 500000);

	afterEach(async () => {
		await polkadotAssetHub.teardown();
		await hydration.teardown();
	}, 500000);

	test('AssetHub Local DOT Transfer', async () => {
		await polkadotAssetHub.api.isReady;

		await polkadotAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
				],
			},
		});

		const recipientsInitialDOTBalance = (await polkadotAssetHub.api.query.system.account(recipientAddress)).data.free;
		expect(recipientsInitialDOTBalance.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', 4);
		const tx = await assetTransferApi.createTransferTransaction('1000', recipientAddress, ['dot'], ['1000000000000'], {
			format: 'payload',
			xcmVersion: 4,
			sendersAddr: alice.address,
		});

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
		await polkadotAssetHub.dev.newBlock();

		const recipientsUpdatedDOTBalance = (await polkadotAssetHub.api.query.system.account(recipientAddress)).data.free;
		expect(recipientsUpdatedDOTBalance.toNumber()).toBeGreaterThan(1000000);
	}, 100000);

	test('AssetHub Local Pool Asset Transfer', async () => {
		await polkadotAssetHub.api.isReady;

		await polkadotAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
					[[recipientAddress], { providers: 1, data: { free: 2 * 1e12 } }], // DOT
				],
			},
			PoolAssets: {
				Account: [[[30, alice.address], { balance: 75000000000000 }]],
			},
		});

		const aliceBalance = (await polkadotAssetHub.api.query.poolAssets.account(30, alice.address)).unwrapOrDefault();
		expect(aliceBalance.balance.toNumber()).toEqual(75000000000000);

		const recipientsInitialPoolAssetBalance = (
			await polkadotAssetHub.api.query.poolAssets.account(30, recipientAddress)
		).unwrapOrDefault();
		expect(recipientsInitialPoolAssetBalance.balance.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', 4);
		const tx = await assetTransferApi.createTransferTransaction('1000', recipientAddress, ['30'], ['10'], {
			format: 'payload',
			xcmVersion: 4,
			sendersAddr: alice.address,
			transferLiquidToken: true,
		});

		console.log('payload', JSON.stringify(tx));

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
		await polkadotAssetHub.dev.newBlock();

		const recipientsUpdatedPoolAssetBalance = (
			await polkadotAssetHub.api.query.poolAssets.account(30, recipientAddress)
		).unwrapOrDefault();
		expect(recipientsUpdatedPoolAssetBalance.balance.toNumber()).toBeGreaterThan(
			recipientsInitialPoolAssetBalance.balance.toNumber(),
		);
	}, 100000);

	test('Hydration Local HDX Transfer', async () => {
		await hydration.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
				],
			},
			Tokens: {
				Accounts: [
					[[alice.address, 0], { free: '10000000000000000000000' }], // HDX
				],
			},
		});

		const recipientInitialHDXBalance = await hydration.api.query.tokens.accounts(recipientAddress, 0);
		expect((recipientInitialHDXBalance as AccountData).free.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', 4);
		const tx = await assetTransferApi.createTransferTransaction(
			'2034',
			recipientAddress,
			['0'], // HDX currency ID
			['1000000000000'],
			{
				format: 'payload',
				xcmVersion: 4,
				sendersAddr: alice.address,
			},
		);

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await hydration.api.tx(extrinsic).signAndSend(alice);
		await hydration.dev.newBlock();

		const recipientUpdatedHDXBalance = await hydration.api.query.tokens.accounts(recipientAddress, 0);
		expect((recipientUpdatedHDXBalance as AccountData).free.toNumber()).toBeGreaterThan(
			(recipientInitialHDXBalance as AccountData).free.toNumber(),
		);
	}, 100000);

	test('Transfer DOT From Hydration to AssetHub', async () => {
		await hydration.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
				],
			},
			Tokens: {
				Accounts: [
					[[alice.address, 5], { free: 1000 * 1e12 }], // DOT
				],
			},
		});

		const recipientsInitialDOTBalance = (await polkadotAssetHub.api.query.system.account(recipientAddress)).data.free;
		expect(recipientsInitialDOTBalance.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', 4);
		const tx = await assetTransferApi.createTransferTransaction('1000', recipientAddress, ['DOT'], ['1000000000000'], {
			format: 'payload',
			xcmVersion: 4,
			sendersAddr: alice.address,
		});
		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await hydration.api.tx(extrinsic).signAndSend(alice);
		await hydration.dev.newBlock();
		await polkadotAssetHub.dev.newBlock();

		const recipientsUpdatedDOTBalance = (await polkadotAssetHub.api.query.system.account(recipientAddress)).data.free;
		expect(recipientsUpdatedDOTBalance.toNumber()).not.toEqual(0);
		expect(recipientsUpdatedDOTBalance.toNumber()).toBeGreaterThan(recipientsInitialDOTBalance.toNumber());
	}, 100000);

	test('Transfer DOT From AssetHub to Hydration', async () => {
		await polkadotAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
				],
			},
		});

		const recipientsInitialDOTBalance = await hydration.api.query.tokens.accounts(recipientAddress, 5);
		expect((recipientsInitialDOTBalance as AccountData).free.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', 4);
		const tx = await assetTransferApi.createTransferTransaction('2034', recipientAddress, ['DOT'], ['1000000000000'], {
			format: 'payload',
			xcmVersion: 4,
			sendersAddr: alice.address,
		});
		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
		await polkadotAssetHub.dev.newBlock();
		await hydration.dev.newBlock();

		const recipientsUpdatedDOTBalance = await hydration.api.query.tokens.accounts(recipientAddress, 5);
		expect((recipientsUpdatedDOTBalance as AccountData).free.toNumber()).toBeGreaterThan(
			(recipientsInitialDOTBalance as AccountData).free.toNumber(),
		);
	}, 100000);

	test('Transfer SnowBridge WETH From Hydration To AssetHub', async () => {
		await hydration.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
				],
			},
			Tokens: {
				Accounts: [
					[[alice.address, 0], { free: '50000000000000000000000000' }], // HDX
					[[alice.address, 1000189], { free: '50000000000000000000000000' }], // Snowbridge WETH
				],
			},
		});

		const recipientsInitialWETHBalance = (
			(await polkadotAssetHub.api.query.foreignAssets.account(
				snowbridgeWETHLocation,
				recipientAddress,
			)) as Option<PalletAssetsAssetAccount>
		).unwrapOrDefault();
		expect(recipientsInitialWETHBalance.balance.toNumber()).toEqual(0);

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
			'1000',
			recipientAddress,
			['WETH.snow'],
			['25000000000000'],
			{
				format: 'payload',
				xcmVersion: 4,
				sendersAddr: '7NPoMQbiA6trJKkjB35uk96MeJD4PGWkLQLH7k7hXEkZpiba',
			},
		);

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await hydration.api.tx(extrinsic).signAndSend(alice);
		await hydration.dev.newBlock();

		await polkadotAssetHub.dev.newBlock();

		const recipientsUpdatedWETHBalance = (
			(await polkadotAssetHub.api.query.foreignAssets.account(
				snowbridgeWETHLocation,
				recipientAddress,
			)) as Option<PalletAssetsAssetAccount>
		).unwrapOrDefault();

		expect(JSON.stringify(recipientsUpdatedWETHBalance)).not.toEqual('null');
		expect(recipientsUpdatedWETHBalance.balance.toNumber()).toBeGreaterThan(0);
	}, 100000);

	test('Transfer SnowBridge WETH From AssetHub To Hydration', async () => {
		await polkadotAssetHub.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
				],
			},
			ForeignAssets: {
				Account: [[[snowbridgeWETHLocation, alice.address], { balance: 75000000000000 }]],
			},
		});

		const recipientsInitialHydrationWETHBalance = await hydration.api.query.tokens.accounts(recipientAddress, 1000189);
		expect((recipientsInitialHydrationWETHBalance as AccountData).free.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', 4);
		const tx = await assetTransferApi.createTransferTransaction(
			'2034',
			recipientAddress,
			[
				`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}},{"AccountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}`,
			],
			['25000000000000'],
			{
				format: 'payload',
				xcmVersion: 4,
				sendersAddr: alice.address,
				paysWithFeeDest:
					'{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}},{"AccountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}',
				assetTransferType: 'LocalReserve',
				remoteReserveAssetTransferTypeLocation: '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
				feesTransferType: 'LocalReserve',
				remoteReserveFeesTransferTypeLocation: '{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
			},
		);

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
		await polkadotAssetHub.dev.newBlock();
		await hydration.dev.newBlock();

		const recipientsUpdatedWETHBalance = await hydration.api.query.tokens.accounts(recipientAddress, 1000189);
		expect((recipientsUpdatedWETHBalance as AccountData).free.toNumber()).toBeGreaterThan(
			(recipientsInitialHydrationWETHBalance as AccountData).free.toNumber(),
		);
	}, 100000);
});
