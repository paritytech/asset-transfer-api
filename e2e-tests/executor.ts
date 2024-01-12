// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
// import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { delay } from '../scripts/util';
import { constructApiPromise } from '../src';
import { balanceTracker, IBalance } from './balance';
import { KUSAMA_ASSET_HUB_WS_URL, MOONRIVER_WS_URL, ROCOCO_ALICE_WS_URL, TRAPPIST_WS_URL } from './consts';
import { startProgressBar, startTestLogger, terminateProgressBar, testResultLogger, updateProgressBar } from './logger';
import { assetTests, foreignAssetsTests, IndividualTest, liquidPoolsTests, localTests, tests } from './tests';
import { verification } from './verification';

const executor = async (testCase: string) => {
	let originWsUrl = '';
	let destWsUrl = '';

	let testData: IndividualTest[] = [];

	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });

	switch (testCase) {
		case '--foreign-assets':
			testData = tests.foreignAssets;
			break;
		case '--liquidity-assets':
			testData = tests.liquidPools;
			break;
		case '--local':
			testData = tests.local;
			break;
		case '--assets':
			testData = tests.assets;
			break;
	}

	let n: { [K: string]: Function } = {};

	switch (testCase) {
		case '--foreign-assets':
			n = foreignAssetsTests;
			break;
		case '--liquidity-assets':
			n = liquidPoolsTests;
			break;
		case '--local':
			n = localTests;
			break;
		case '--assets':
			n = assetTests;
			break;
	}

	let originChainId = '';
	let destChainId = '';
	let originAddr = '';
	let destAddr = '';
	let assetIds: string[] = [];
	let amounts: string[] = [];
	let opts: object = {};
	let counter: number = 0;

	startTestLogger(testCase);

	const progressBar = startProgressBar(testData, testCase);

	const results: [string, string, string, boolean][] = [];

	for (const t of testData) {
		originChainId = t.args[0];
		destChainId = t.args[1];
		originAddr = t.args[2];
		destAddr = t.args[3];
		assetIds = t.args[4].slice(1, -1).split(',');
		amounts = t.args[5].slice(1, -1).split(',');
		opts = JSON.parse(t.args[6], (key: string, value: string) => {
			return key === 'paysWithFeeOrigin' ? JSON.stringify(value) : value;
		}) as object;
		let chainName: string = '';

		switch (originChainId) {
			case '0':
				originWsUrl = ROCOCO_ALICE_WS_URL;
				chainName = 'Rococo';
				break;
			case '1000':
				originWsUrl = KUSAMA_ASSET_HUB_WS_URL;
				chainName = 'Kusama Asset Hub';
				break;
			case '1836':
				originWsUrl = TRAPPIST_WS_URL;
				chainName = 'Trappist';
				break;
			case '4000':
				originWsUrl = MOONRIVER_WS_URL;
				chainName = 'Moonriver';
				break;
		}
		if (originChainId == destChainId) {
			destWsUrl = originWsUrl;
		} else {
			switch (destChainId) {
				case '0':
					destWsUrl = ROCOCO_ALICE_WS_URL;
					chainName = 'Rococo';
					break;
				case '1000':
					destWsUrl = KUSAMA_ASSET_HUB_WS_URL;
					chainName = 'Kusama Asset Hub';
					break;
				case '1836':
					destWsUrl = TRAPPIST_WS_URL;
					chainName = 'Trappist';
					break;
				case '4000':
					destWsUrl = MOONRIVER_WS_URL;
					chainName = 'Moonriver';
					break;
			}
		}

		const { api, specName, safeXcmVersion } = await constructApiPromise(originWsUrl);

		await api.isReady;

		const originApi = api;
		const destinationApi =
			originChainId == destChainId
				? originApi
				: await ApiPromise.create({
						provider: new WsProvider(destWsUrl),
						noInitWarn: true,
				  });

		await destinationApi.isReady;
		const destInitialBalance: IBalance = await balanceTracker(destinationApi, testCase, destAddr, assetIds);
		const originKeyring = keyring.addFromUri(originAddr);

		//eslint-disable-next-line @typescript-eslint/no-unsafe-call
		await n[t.test](originKeyring, destChainId, destAddr, assetIds, amounts, opts, api, specName, safeXcmVersion);

		await delay(24000);

		const destFinalBalance: IBalance = await balanceTracker(
			destinationApi,
			testCase,
			destAddr,
			assetIds,
			destInitialBalance,
		);

		const correctlyReceived = verification(assetIds, amounts, destFinalBalance);

		await delay(12000);

		await originApi.disconnect();
		await destinationApi.disconnect();

		counter += 1;

		updateProgressBar(counter, progressBar);

		for (let i = 0; i < assetIds.length; i++) {
			results.push([t.test, assetIds[i], chainName, correctlyReceived[i][1]]);
		}
	}

	for (let i = 0; i < results.length; i++) {
		testResultLogger(results[i][0], results[i][1], results[i][2], results[i][3]);
	}

	terminateProgressBar(progressBar, testCase);
};

executor(process.argv[2])
	.catch((err) => console.error(err))
	.finally(() => process.exit());
