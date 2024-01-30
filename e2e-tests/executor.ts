// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
// import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { delay } from '../scripts/util';
import { constructApiPromise } from '../src';
import { balanceTracker, IBalance } from './balance';
import { KUSAMA_ASSET_HUB_WS_URL, ROCOCO_ALICE_WS_URL, TRAPPIST_WS_URL } from './consts';
import { startProgressBar, startTestLogger, terminateProgressBar, testResultLogger, updateProgressBar } from './logger';
import { assetTests, foreignAssetsTests, IndividualTest, liquidPoolsTests, localTests, tests } from './tests';
import { verification } from './verification';

const executor = async (testCase: string) => {
	let originWsUrl = '';
	let destWsUrl = '';
	let testData: IndividualTest[] = [];

	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });
	let n: { [K: string]: Function } = {};

	switch (testCase) {
		case '--foreign-assets':
			testData = tests.foreignAssets;
			n = foreignAssetsTests;
			break;
		case '--liquidity-assets':
			testData = tests.liquidPools;
			n = liquidPoolsTests;
			break;
		case '--local':
			testData = tests.local;
			n = localTests;
			break;
		case '--assets':
			testData = tests.assets;
			n = assetTests;
			break;
	}

	let counter: number = 0;

	startTestLogger(testCase);

	const progressBar = startProgressBar(testData, testCase);

	const results: [string, string, string, boolean][] = [];

	for (const t of testData) {
		const originChainId: string = t.args[0];
		const destChainId: string = t.args[1];
		const originAddr: string = t.args[2];
		const destAddr: string = t.args[3];
		const assetIds: string[] = t.args[4].slice(1, -1).split(',');
		const amounts: string[] = t.args[5].slice(1, -1).split(',');
		const opts: object = JSON.parse(t.args[6], (key: string, value: string) => {
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

		const verificationAssetIds: string[] = t.verification[0].slice(1, -1).split(',');
		const verificationAmounts: string[] = t.verification[1].slice(1, -1).split(',');

		const correctlyReceived = verification(verificationAssetIds, verificationAmounts, destFinalBalance);

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
