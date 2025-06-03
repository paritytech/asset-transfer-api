import { testingPairs, withExpect } from '@acala-network/chopsticks-testing';
import { NetworkContext } from '@acala-network/chopsticks-utils';
import { AccountData } from '@polkadot/types/interfaces';
import { afterEach, beforeEach, expect, test } from 'vitest';

import { AssetTransferApi } from '../src/AssetTransferApi';
import { configs, setupParachains } from './networks.js';

const { check } = withExpect(expect);

describe('Moonbeam <> Hydration', () => {
	let hydration: NetworkContext;
	let moonbeam: NetworkContext;
	const hydrationRecipientAddress = '15McF4S5ZsoAJGzdXE3FwSFVjSPoz1Cd7Xj7VQZCb7HULcjx';

	const { alith } = testingPairs();

	beforeEach(async () => {
		[hydration, moonbeam] = await setupParachains([configs.hydration, configs.moonbeam], __filename);
	}, 1000000);

	afterEach(async () => {
		await moonbeam.teardown();
		await hydration.teardown();
	}, 1000000);

	describe('XCM V3', () => {
		const xcmVersion = 3;

		test('Transfer GLMR from Moonbeam to Hydration', async () => {
			await moonbeam.dev.setStorage({
				System: {
					Account: [
						[[alith.address], { providers: 1, data: { free: '100000000000000000000000' } }], // GLMR
					],
				},
			});

			const recipientInitialGLMRBalance = await hydration.api.query.tokens.accounts(hydrationRecipientAddress, 16);

			await check(recipientInitialGLMRBalance as AccountData).toMatchSnapshot(
				'hydration recipients initial glmr balance',
			);
			expect((recipientInitialGLMRBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(moonbeam.api, 'moonbeam', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				hydrationRecipientAddress,
				['GLMR'],
				['10000000000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alith.address,
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await moonbeam.api.tx(extrinsic).signAndSend(alith);
			await moonbeam.dev.newBlock();

			await hydration.dev.newBlock();

			const recipientUpdatedGLMRBalance = await hydration.api.query.tokens.accounts(hydrationRecipientAddress, 16);

			await check(recipientUpdatedGLMRBalance as AccountData)
				.redact({ number: 1 })
				.toMatchSnapshot('hydration recipients updated glmr balance');
			expect((recipientUpdatedGLMRBalance as AccountData).free.toBigInt()).toBeGreaterThan(
				(recipientInitialGLMRBalance as AccountData).free.toBigInt(),
			);
		}, 200000);
	});

	describe('XCM V4', () => {
		const xcmVersion = 4;

		test('Transfer GLMR from Moonbeam to Hydration', async () => {
			await moonbeam.dev.setStorage({
				System: {
					Account: [
						[[alith.address], { providers: 1, data: { free: '100000000000000000000000' } }], // GLMR
					],
				},
			});

			const recipientInitialGLMRBalance = await hydration.api.query.tokens.accounts(hydrationRecipientAddress, 16);

			await check(recipientInitialGLMRBalance).toMatchSnapshot('hydration recipients initial glmr balance');
			expect((recipientInitialGLMRBalance as AccountData).free.toNumber()).toEqual(0);

			const assetTransferApi = new AssetTransferApi(moonbeam.api, 'moonbeam', xcmVersion);
			const tx = await assetTransferApi.createTransferTransaction(
				'2034',
				hydrationRecipientAddress,
				['GLMR'],
				['10000000000000000000'],
				{
					format: 'payload',
					xcmVersion,
					sendersAddr: alith.address,
				},
			);

			const extrinsic = assetTransferApi.api.registry.createType('Extrinsic', { method: tx.tx.method }, { version: 4 });

			await moonbeam.api.tx(extrinsic).signAndSend(alith);
			await moonbeam.dev.newBlock();

			await hydration.dev.newBlock();

			const recipientUpdatedGLMRBalance = await hydration.api.query.tokens.accounts(hydrationRecipientAddress, 16);

			await check(recipientUpdatedGLMRBalance)
				.redact({ number: 1 })
				.toMatchSnapshot('hydration recipients updated glmr balance');
			expect((recipientUpdatedGLMRBalance as AccountData).free.toBigInt()).toBeGreaterThan(
				(recipientInitialGLMRBalance as AccountData).free.toBigInt(),
			);
		}, 200000);
	});
});
