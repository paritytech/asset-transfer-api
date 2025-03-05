import { setupNetworks, testingPairs, withExpect } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { AccountData, VersionedXcm } from '@polkadot/types/interfaces';
import { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import { Option } from '@polkadot/types-codec';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { XcmFeeInfo } from '../src/types';

const { check } = withExpect(expect);

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
	}, 1000000);

	afterEach(async () => {
		await polkadotAssetHub.teardown();
		await hydration.teardown();
	}, 1000000);

	describe('Local Transfers', () => {
		test('AssetHub Local DOT Transfer', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
					],
				},
			});

			const recipientsInitialDOTBalance = await polkadotAssetHub.api.query.system.account(recipientAddress);

			await check(recipientsInitialDOTBalance).toMatchSnapshot('local assethub recipient initial dot balance');
			expect(recipientsInitialDOTBalance.data.free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', 4);
			const tx = await assetTransferApi.createTransferTransaction(
				'1000',
				recipientAddress,
				['dot'],
				['1000000000000'],
				{
					format: 'payload',
					sendersAddr: alice.address,
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
			await polkadotAssetHub.dev.newBlock();

			const recipientsUpdatedDOTBalance = await polkadotAssetHub.api.query.system.account(recipientAddress);

			await check(recipientsUpdatedDOTBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('local assethub recipient updated dot balance');
			expect(recipientsUpdatedDOTBalance.data.free.toNumber()).toBeGreaterThan(1000000);
		}, 200000);

		test('AssetHub Local Pool Asset Transfer', async () => {
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

			await check(recipientsInitialPoolAssetBalance).toMatchSnapshot(
				'local assethub recipients initial pool asset balance',
			);
			expect(recipientsInitialPoolAssetBalance.balance.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', 4);
			const tx = await assetTransferApi.createTransferTransaction('1000', recipientAddress, ['30'], ['10'], {
				format: 'payload',
				sendersAddr: alice.address,
				transferLiquidToken: true,
			});

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
			await polkadotAssetHub.dev.newBlock();

			const recipientsUpdatedPoolAssetBalance = (
				await polkadotAssetHub.api.query.poolAssets.account(30, recipientAddress)
			).unwrapOrDefault();

			await check(recipientsUpdatedPoolAssetBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('local assethub recipients updated pool asset balance');
			expect(recipientsUpdatedPoolAssetBalance.balance.toNumber()).toBeGreaterThan(
				recipientsInitialPoolAssetBalance.balance.toNumber(),
			);
		}, 200000);

		test('Hydration Local HDX Transfer', async () => {
			await hydration.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // HDX
					],
				},
				Tokens: {
					Accounts: [
						[[alice.address, 0], { free: '50000000000000000000000000' }], // HDX
					],
				},
			});

			const recipientInitialHDXBalance = await hydration.api.query.tokens.accounts(recipientAddress, 0);
			await check(recipientInitialHDXBalance as AccountData).toMatchSnapshot(
				'local hydration recipient initial balance',
			);
			expect((recipientInitialHDXBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', 4);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				['0'], // HDX currency ID
				['1000000000000'],
				{
					format: 'payload',
					sendersAddr: alice.address,
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();

			const recipientUpdatedHDXBalance = await hydration.api.query.tokens.accounts(recipientAddress, 0);

			await check(recipientUpdatedHDXBalance as AccountData)
				.redact({ number: 1 })
				.toMatchSnapshot('local hydration recipient updated balance');
			expect((recipientUpdatedHDXBalance as AccountData).free.toNumber()).toBeGreaterThan(
				(recipientInitialHDXBalance as AccountData).free.toNumber(),
			);
		}, 200000);
	});

	describe('XCM V3', () => {
		const xcmVersion = 3;

		test('getDestinationXcmWeightToFeeAsset should correctly return a list of xcms and their fees for a dry run execution result that is ok', async () => {
			const hydrationAssetHubUsdtAssetID = '10';

			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
						[[recipientAddress], { providers: 1, data: { free: 2 * 1e12 } }], // DOT
					],
				},
				Assets: {
					Account: [[[1984, alice.address], { balance: 75000000000000 }]],
				},
			});

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction('2034', recipientAddress, [`1984`], ['1000000'], {
				format: 'payload',
				xcmVersion,
				sendersAddr: alice.address,
				paysWithFeeOrigin: `1984`,
			});

			const dryRunResult = await assetTransferApi.dryRunCall(alice.address, tx.tx, 'payload');
			expect(dryRunResult?.asOk.executionResult.isOk).toBe(true);
			const destinationFees = await AssetTransferApi.getDestinationXcmWeightToFeeAsset(
				'hydradx',
				'wss://hydration.ibp.network',
				xcmVersion,
				dryRunResult,
				hydrationAssetHubUsdtAssetID,
			);

			expect(parseInt(destinationFees[0][1].xcmFee)).to.toBeGreaterThan(0);
			expect(destinationFees[0][1].xcmDest).to.eq('{"v4":{"parents":1,"interior":{"x1":[{"parachain":2034}]}}}');
			expect(destinationFees[0][1].xcmFeeAsset).to.eq(
				'{"V3":{"Concrete":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}}',
			);
		});

		test('getDestinationXcmWeightToFeeAsset should correctly return an empty list for a dry run execution result that is an error', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
						[[recipientAddress], { providers: 1, data: { free: 2 * 1e12 } }], // DOT
					],
				},
				ForeignAssets: {
					Account: [
						[[{ parents: '1', interior: { X1: [{ Parachain: '2011' }] } }, alice.address], { balance: 75000000000000 }],
					],
				},
			});

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				[`{"parents":"2","interior":{"X1":[{"GlobalConsensus":"Kusama"}]}}`],
				['1000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);

			const dryRunResult = await assetTransferApi.dryRunCall(alice.address, tx.tx, 'payload');
			expect(dryRunResult?.asOk.executionResult.isErr).toBe(true);
			const destinationFees = await AssetTransferApi.getDestinationXcmWeightToFeeAsset(
				'hydradx',
				'wss://hydration.ibp.network',
				xcmVersion,
				dryRunResult,
				'dot',
			);

			const expected: [VersionedXcm, XcmFeeInfo][] = [];
			expect(destinationFees.length).to.eq(expected.length);
			expect(destinationFees).toEqual(expected);
		}, 200000);

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

			const recipientsInitialDOTBalance = await polkadotAssetHub.api.query.system.account(recipientAddress);

			await check(recipientsInitialDOTBalance).toMatchSnapshot('asset hub recipients initial dot balance');
			expect(recipientsInitialDOTBalance.data.free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'1000',
				recipientAddress,
				['DOT'],
				['1000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);
			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();
			await polkadotAssetHub.dev.newBlock();

			const recipientsUpdatedDOTBalance = await polkadotAssetHub.api.query.system.account(recipientAddress);

			await check(recipientsUpdatedDOTBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('asset hub recipients updated dot balance');
			expect(recipientsUpdatedDOTBalance.data.free.toNumber()).toBeGreaterThan(
				recipientsInitialDOTBalance.data.free.toNumber(),
			);
		}, 200000);

		test('Transfer DOT From AssetHub to Hydration', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
					],
				},
			});

			const recipientsInitialDOTBalance = await hydration.api.query.tokens.accounts(recipientAddress, 5);

			await check(recipientsInitialDOTBalance as AccountData).toMatchSnapshot(
				'hydration recipients initial dot balance',
			);
			expect((recipientsInitialDOTBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				['DOT'],
				['1000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);
			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
			await polkadotAssetHub.dev.newBlock();
			await hydration.dev.newBlock();

			const recipientsUpdatedDOTBalance = await hydration.api.query.tokens.accounts(recipientAddress, 5);

			await check(recipientsUpdatedDOTBalance as AccountData)
				.redact({ number: 1 })
				.toMatchSnapshot('hydration recipients updated dot balance');
			expect((recipientsUpdatedDOTBalance as AccountData).free.toNumber()).toBeGreaterThan(
				(recipientsInitialDOTBalance as AccountData).free.toNumber(),
			);
		}, 200000);

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

			await check(recipientsInitialWETHBalance).toMatchSnapshot('asset hub recipients initial snowbridge weth balance');
			expect(recipientsInitialWETHBalance.balance.toNumber()).toEqual(0);

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
				'1000',
				recipientAddress,
				['WETH.snow'],
				['25000000000000'],
				{
					format: 'payload',
					xcmVersion,
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

			await check(recipientsUpdatedWETHBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('asset hub recipients updated snowbridge weth balance');
			expect(recipientsUpdatedWETHBalance.balance.toNumber()).toBeGreaterThan(
				recipientsInitialWETHBalance.balance.toNumber(),
			);
		}, 200000);

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

			const recipientsInitialHydrationWETHBalance = await hydration.api.query.tokens.accounts(
				recipientAddress,
				1000189,
			);

			await check(recipientsInitialHydrationWETHBalance as AccountData).toMatchSnapshot(
				'hydration recipients initial snowbridge weth balance',
			);
			expect((recipientsInitialHydrationWETHBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}},{"AccountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}`,
				],
				['25000000000000'],
				{
					format: 'payload',
					xcmVersion,
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

			await check(recipientsUpdatedWETHBalance as AccountData)
				.redact({ number: 1 })
				.toMatchSnapshot('hydration recipients updated snowbridge weth balance');
			expect((recipientsUpdatedWETHBalance as AccountData).free.toNumber()).toBeGreaterThan(
				(recipientsInitialHydrationWETHBalance as AccountData).free.toNumber(),
			);
		}, 200000);
	});

	describe('XCM V4', () => {
		const xcmVersion = 4;

		test('getDestinationXcmWeightToFeeAsset should correctly return a list of xcms and their fees for a dry run execution result that is ok', async () => {
			const hydrationAssetHubUsdtAssetID = '10';

			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
						[[recipientAddress], { providers: 1, data: { free: 2 * 1e12 } }], // DOT
					],
				},
				Assets: {
					Account: [[[1984, alice.address], { balance: 75000000000000 }]],
				},
			});

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction('2034', recipientAddress, [`1984`], ['1000000'], {
				format: 'payload',
				xcmVersion,
				sendersAddr: alice.address,
				paysWithFeeOrigin: `1984`,
			});

			const dryRunResult = await assetTransferApi.dryRunCall(alice.address, tx.tx, 'payload');

			expect(dryRunResult?.asOk.executionResult.isOk).toBe(true);

			const destinationFees = await AssetTransferApi.getDestinationXcmWeightToFeeAsset(
				'hydradx',
				'wss://hydration.ibp.network',
				xcmVersion,
				dryRunResult,
				hydrationAssetHubUsdtAssetID,
			);
			expect(parseInt(destinationFees[0][1].xcmFee)).to.toBeGreaterThan(0);
			expect(destinationFees[0][1].xcmDest).to.eq('{"v4":{"parents":1,"interior":{"x1":[{"parachain":2034}]}}}');
			expect(destinationFees[0][1].xcmFeeAsset).to.eq(
				'{"V4":{"Parents":"1","Interior":{"X3":[{"Parachain":"1000"},{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}}',
			);
		});

		test('getDestinationXcmWeightToFeeAsset should correctly return an empty list for a dry run execution result that is an error', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
						[[recipientAddress], { providers: 1, data: { free: 2 * 1e12 } }], // DOT
					],
				},
				ForeignAssets: {
					Account: [
						[[{ parents: '1', interior: { X1: [{ Parachain: '2011' }] } }, alice.address], { balance: 75000000000000 }],
					],
				},
			});

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				[`{"parents":"2","interior":{"X1":[{"GlobalConsensus":"Kusama"}]}}`, '1984'],
				['1000000', '1000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
					paysWithFeeOrigin: '1984',
					paysWithFeeDest: '1984',
				},
			);

			const dryRunResult = await assetTransferApi.dryRunCall(alice.address, tx.tx, 'payload');
			expect(dryRunResult?.asOk.executionResult.isErr).toBe(true);
			const destinationFees = await AssetTransferApi.getDestinationXcmWeightToFeeAsset(
				'hydradx',
				'wss://hydration.ibp.network',
				xcmVersion,
				dryRunResult,
				'dot',
			);

			const expected: [VersionedXcm, XcmFeeInfo][] = [];
			expect(destinationFees.length).to.eq(expected.length);
			expect(destinationFees).toEqual(expected);
		}, 200000);

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

			const recipientsInitialDOTBalance = await polkadotAssetHub.api.query.system.account(recipientAddress);

			await check(recipientsInitialDOTBalance).toMatchSnapshot('asset hub recipients initial dot balance');
			expect(recipientsInitialDOTBalance.data.free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'1000',
				recipientAddress,
				['DOT'],
				['1000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);
			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await hydration.api.tx(extrinsic).signAndSend(alice);
			await hydration.dev.newBlock();
			await polkadotAssetHub.dev.newBlock();

			const recipientsUpdatedDOTBalance = await polkadotAssetHub.api.query.system.account(recipientAddress);

			await check(recipientsUpdatedDOTBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('asset hub recipients updated dot balance');
			expect(recipientsUpdatedDOTBalance.data.free.toNumber()).toBeGreaterThan(
				recipientsInitialDOTBalance.data.free.toNumber(),
			);
		}, 200000);

		test('Transfer DOT From AssetHub to Hydration', async () => {
			await polkadotAssetHub.dev.setStorage({
				System: {
					Account: [
						[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }], // DOT
					],
				},
			});

			const recipientsInitialDOTBalance = await hydration.api.query.tokens.accounts(recipientAddress, 5);

			await check(recipientsInitialDOTBalance as AccountData).toMatchSnapshot(
				'hydration recipients initial dot balance',
			);
			expect((recipientsInitialDOTBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				['DOT'],
				['1000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alice.address,
				},
			);
			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await polkadotAssetHub.api.tx(extrinsic).signAndSend(alice);
			await polkadotAssetHub.dev.newBlock();
			await hydration.dev.newBlock();

			const recipientsUpdatedDOTBalance = await hydration.api.query.tokens.accounts(recipientAddress, 5);

			await check(recipientsUpdatedDOTBalance as AccountData)
				.redact({ number: 1 })
				.toMatchSnapshot('hydration recipients updated dot balance');
			expect((recipientsUpdatedDOTBalance as AccountData).free.toNumber()).toBeGreaterThan(
				(recipientsInitialDOTBalance as AccountData).free.toNumber(),
			);
		}, 200000);

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

			await check(recipientsInitialWETHBalance).toMatchSnapshot('asset hub recipients initial snowbridge weth balance');
			expect(recipientsInitialWETHBalance.balance.toNumber()).toEqual(0);

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
				'1000',
				recipientAddress,
				['WETH.snow'],
				['25000000000000'],
				{
					format: 'payload',
					xcmVersion,
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

			await check(recipientsUpdatedWETHBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('asset hub recipients updated snowbridge weth balance');
			expect(recipientsUpdatedWETHBalance.balance.toNumber()).toBeGreaterThan(
				recipientsInitialWETHBalance.balance.toNumber(),
			);
		}, 200000);

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

			const recipientsInitialHydrationWETHBalance = await hydration.api.query.tokens.accounts(
				recipientAddress,
				1000189,
			);

			await check(recipientsInitialHydrationWETHBalance as AccountData).toMatchSnapshot(
				'hydration recipients initial snowbridge weth balance',
			);
			expect((recipientsInitialHydrationWETHBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(polkadotAssetHub.api, 'asset-hub-polkadot', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				recipientAddress,
				[
					`{"parents":"2","interior":{"X2":[{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}},{"AccountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}`,
				],
				['25000000000000'],
				{
					format: 'payload',
					xcmVersion,
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

			await check(recipientsUpdatedWETHBalance as AccountData)
				.redact({ number: 1 })
				.toMatchSnapshot('hydration recipients updated snowbridge weth balance');
			expect((recipientsUpdatedWETHBalance as AccountData).free.toNumber()).toBeGreaterThan(
				(recipientsInitialHydrationWETHBalance as AccountData).free.toNumber(),
			);
		}, 200000);
	});
});
