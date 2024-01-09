// Copyright 2023 Parity Technologies (UK) Ltd.
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
// import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { delay } from '../scripts/util';
import { constructApiPromise } from '../src';
import { balanceTracker, IBalance } from './balance';
import { KUSAMA_ASSET_HUB_WS_URL, MOONRIVER_WS_URL, ROCOCO_ALICE_WS_URL, TRAPPIST_WS_URL } from './consts';
import { assetTests, foreignAssetsTests, IndividualTest, liquidPoolsTests, localTests, tests } from './tests';
import { verification } from './verification';

const executor = async (testCase: string) => {
	let originWsUrl = '';
	let destWsUrl = '';

	let testData: IndividualTest[] = [];
	console.log(testCase)

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
	console.log(n);

	let originChainId = '';
	let destChainId = '';
	let originAddr = '';
	let destAddr = '';
	let assetIds: string[] = [];
	let amounts: string[] = [];
	let opts: object = {};

	for (const t of testData) {
		originChainId = t.args[0];
		destChainId = t.args[1];
		originAddr = t.args[2];
		destAddr = t.args[3];
		assetIds = t.args[4].slice(1, -1).split(',');
		amounts = t.args[5].slice(1, -1).split(',');
		opts = JSON.parse(t.args[6]) as object;

		switch (originChainId) {
			case '0':
				originWsUrl = ROCOCO_ALICE_WS_URL;
				break;
			case '1000':
				originWsUrl = KUSAMA_ASSET_HUB_WS_URL;
				break;
			case '1836':
				originWsUrl = TRAPPIST_WS_URL;
				break;
			case '4000':
				originWsUrl = MOONRIVER_WS_URL;
				break;
		}

		if (originChainId == destChainId) {
			destWsUrl = originWsUrl;
		} else {
			switch (destChainId) {
				case '0':
					destWsUrl = ROCOCO_ALICE_WS_URL;
					break;
				case '1000':
					destWsUrl = KUSAMA_ASSET_HUB_WS_URL;
					break;
				case '1836':
					destWsUrl = TRAPPIST_WS_URL;
					break;
				case '4000':
					destWsUrl = MOONRIVER_WS_URL;
					break;
			}
		}
		const { api, specName, safeXcmVersion } = await constructApiPromise(originWsUrl);

		let sanitizedSpecName = originChainId === '1836' ? 'asset-hub-rococo' : specName;
		console.log(sanitizedSpecName)
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
		await n[t.test](originKeyring, destChainId, destAddr, assetIds, amounts, opts, api, sanitizedSpecName, safeXcmVersion);

		await delay(24000);

		const destFinalBalance: IBalance = await balanceTracker(
			destinationApi,
			testCase,
			destAddr,
			assetIds,
			destInitialBalance,
		);

		const correctlyReceived = verification(assetIds, amounts, destFinalBalance);

		for (let i = 0; i < assetIds.length; i++) {
			if (correctlyReceived[i][1]) {
				console.log('all good');
			} else {
				console.log('badd');
			}
		}

		await delay(12000);

		await originApi.disconnect();
		await destinationApi.disconnect();
	}
};

executor(process.argv[2])
	.catch((err) => console.error(err))
	.finally(() => process.exit());
