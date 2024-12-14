import { setupNetworks, testingPairs } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { AccountData } from '@polkadot/types/interfaces';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';

describe('Moonbeam <> Hydration', () => {
	let hydration: NetworkContext;
	let moonbeam: NetworkContext;
	const hydrationRecipientAddress = '15McF4S5ZsoAJGzdXE3FwSFVjSPoz1Cd7Xj7VQZCb7HULcjx';
	const hdxMoonbeamAssetID = '69606720909260275826784788104880799692';

	const { alice, alith } = testingPairs();

	beforeEach(async () => {
		const { hydration1, moonbeam1 } = await setupNetworks({
			hydration1: {
				endpoint: 'wss://rpc.hydradx.cloud',
				db: './db.sqlite',
				port: 8000,
			},
			moonbeam1: {
				endpoint: 'wss://moonbeam-rpc.dwellir.com',
				db: './db.sqlite',
				port: 8001,
			},
		});

		hydration = hydration1;
		moonbeam = moonbeam1;
	}, 500000);

	afterEach(async () => {
		await moonbeam.teardown();
		await hydration.teardown();
	}, 500000);

	test('Transfer GLMR from Moonbeam to Hydration', async () => {
		await moonbeam.dev.setStorage({
			System: {
				Account: [
					[[alith.address], { providers: 1, data: { free: '100000000000000000000000' } }], // GLMR
				],
			},
		});

		const recipientInitialGLMRBalance = await hydration.api.query.tokens.accounts(hydrationRecipientAddress, 16);
		expect((recipientInitialGLMRBalance as AccountData).free.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(moonbeam.api, 'moonbeam', 4);
		const tx = await assetTransferApi.createTransferTransaction(
			'2034',
			hydrationRecipientAddress,
			['GLMR'],
			['10000000000000000000'],
			{
				format: 'payload',
				xcmVersion: 4,
				sendersAddr: alith.address,
			},
		);

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await moonbeam.api.tx(extrinsic).signAndSend(alith);
		await moonbeam.dev.newBlock();

		await hydration.dev.newBlock();

		const recipientUpdatedGLMRBalance = await hydration.api.query.tokens.accounts(hydrationRecipientAddress, 16);

		expect((recipientUpdatedGLMRBalance as AccountData).free.toBigInt()).toBeGreaterThan(
			(recipientInitialGLMRBalance as AccountData).free.toBigInt(),
		);
	}, 100000);

	test('Transfer HDX from Hydration to Moonbeam', async () => {
		await hydration.dev.setStorage({
			System: {
				Account: [
					[[alice.address], { providers: 1, data: { free: '50000000000000000000000000' } }], // HDX
				],
			},
			Tokens: {
				Accounts: [
					[[alice.address, 0], { free: '50000000000000000000000000' }], // HDX
				],
			},
		});

		const recipientInitialHDXBalance = (
			await moonbeam.api.query.assets.account(hdxMoonbeamAssetID, alith.address)
		).unwrapOrDefault();
		expect(recipientInitialHDXBalance.balance.toNumber()).toEqual(0);

		const assetTransferApi = new AssetTransferApi(hydration.api, 'hydradx', 4);
		const tx = await assetTransferApi.createTransferTransaction('2004', alith.address, ['HDX'], ['10000000000000000'], {
			format: 'payload',
			xcmVersion: 4,
			sendersAddr: alice.address,
		});

		const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

		await hydration.api.tx(extrinsic).signAndSend(alice);
		await hydration.dev.newBlock();

		await moonbeam.dev.newBlock();

		const recipientUpdatedHDXBalance = (
			await moonbeam.api.query.assets.account(hdxMoonbeamAssetID, alith.address)
		).unwrapOrDefault();
		expect(recipientUpdatedHDXBalance.balance.toBigInt()).toBeGreaterThan(
			recipientInitialHDXBalance.balance.toBigInt(),
		);
	}, 100000);
});
