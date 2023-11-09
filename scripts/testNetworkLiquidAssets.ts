// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import chalk from 'chalk';

import { KUSAMA_ASSET_HUB_WS_URL, ROCOCO_ALICE_WS_URL } from './consts';
import { awaitBlockProduction, awaitEpochChange, delay, logWithDate } from './util';

const ASSET_ID = 1;
const ASSET_NAME = 'Testy';
const ASSET_TICKER = 'TSTY';
const ASSET_DECIMALS = 12;
const ASSET_MIN = 1;

const asset = {
	parents: 0,
	interior: {
		X2: [{ palletInstance: 50 }, { generalIndex: ASSET_ID }],
	},
};

const native = {
	parents: 1,
	interior: {
		Here: '',
	},
};

const createAssetCall = (api: ApiPromise, admin: KeyringPair) => {
	return api.tx.assets.create(ASSET_ID, admin.address, ASSET_MIN);
};

const setMetadataCall = (api: ApiPromise) => {
	return api.tx.assets.setMetadata(ASSET_ID, ASSET_NAME, ASSET_TICKER, ASSET_DECIMALS);
};

const mintCall = (api: ApiPromise, to: KeyringPair, amount: number) => {
	return api.tx.assets.mint(ASSET_ID, to.address, amount);
};

const createLiquidityPoolCall = (api: ApiPromise) => {
	// For now, we have to override the types of the Assets until PJS is updated
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	return api.tx.assetConversion.createPool(<any>native, <any>asset);
};

const addLiquidityCall = (api: ApiPromise, amountNative: number, amountAsset: number, to: KeyringPair) => {
	// For now, we have to override the types of the Assets until PJS is updated
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	return api.tx.assetConversion.addLiquidity(<any>native, <any>asset, amountNative, amountAsset, 0, 0, to.address);
};

const transferLPTokensCall = (api: ApiPromise, token: number, amount: number, to: KeyringPair) => {
	return api.tx.poolAssets.transferKeepAlive(token, to.address, amount);
};

const openHrmpChannels = (api: ApiPromise, sender: number, receiver: number) => {
	return api.tx.hrmp.forceOpenHrmpChannel(sender, receiver, Number(8), Number(512));
};

const main = async () => {
	logWithDate(chalk.yellow('Initializing script to create a liquidity pool on Kusama Asset Hub'));
	await cryptoWaitReady();

	const keyring = new Keyring({ type: 'sr25519' });
	const alice = keyring.addFromUri('//Alice');
	const bob = keyring.addFromUri('//Bob');

	const relayApi = await ApiPromise.create({
		provider: new WsProvider(ROCOCO_ALICE_WS_URL),
		noInitWarn: true,
	});

	await relayApi.isReady;

	logWithDate(chalk.blue('Opening HRMP Channels'));

	const hrmpChannelCalls = [];

	hrmpChannelCalls.push(openHrmpChannels(relayApi, Number(1000), Number(1836)));
	hrmpChannelCalls.push(openHrmpChannels(relayApi, Number(1836), Number(1000)));

	await relayApi.tx.sudo.sudo(relayApi.tx.utility.batchAll(hrmpChannelCalls)).signAndSend(alice);

	await awaitEpochChange(relayApi);
	logWithDate(chalk.magenta('HRMP channels open'));

	const api = await ApiPromise.create({
		provider: new WsProvider(KUSAMA_ASSET_HUB_WS_URL),
		noInitWarn: true,
	});

	await api.isReady;

	logWithDate(chalk.green('Created a connection to Kusama AssetHub'));

	const txs = [];
	const create = createAssetCall(api, alice);
	const setMetadata = setMetadataCall(api);
	const mint = mintCall(api, alice, 10000000000000);
	const createPool = createLiquidityPoolCall(api);
	const addLiquidity = addLiquidityCall(api, 10000000000000, 10000000000000, alice);

	txs.push(create);
	txs.push(setMetadata);
	txs.push(mint);
	txs.push(createPool);
	txs.push(addLiquidity);

	await api.tx.utility.batch(txs).signAndSend(alice, { nonce: -1 });

	await delay(24000);

	const nextLpToken = await api.query.assetConversion.nextPoolAssetId();

	const lpToken = Number(nextLpToken) - 1;

	logWithDate(chalk.yellow('Asset and Liquidity Pool created'));

	logWithDate(chalk.green(`Liquidity Pool Token ID: ${lpToken}`));

	const startingBalances = await api.query.poolAssets.account.entries(lpToken);

	startingBalances.slice(1).forEach(
		([
			{
				args: [lpToken, address],
			},
			value,
		]) => {
			logWithDate(
				chalk.blue(
					`LP Token: ${Number(lpToken)}, Account: ${address.toString()}, Starting liquidty token balance: ${value
						.unwrap()
						.balance.toHuman()}`
				)
			);
		}
	);

	await delay(24000);

	logWithDate(chalk.magenta('Sending 1,000,000,000,000 lpTokens from Alice to Bob on Kusama Asset Hub'));

	await transferLPTokensCall(api, 0, 1000000000000, bob).signAndSend(alice, { nonce: -1 });

	await delay(24000);

	const newBalances = await api.query.poolAssets.account.entries(lpToken);
	newBalances.slice(1).forEach(
		([
			{
				args: [lpToken, address],
			},
			value,
		]) => {
			logWithDate(
				chalk.blue(
					`LP Token: ${Number(lpToken)}, Account: ${address.toString()}, New liquidty token balance: ${value
						.unwrap()
						.balance.toHuman()}`
				)
			);
		}
	);

	await api.disconnect().then(() => {
		logWithDate(chalk.yellow('Polkadot-js successfully disconnected from asset-hub'));
	});
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
awaitBlockProduction(KUSAMA_ASSET_HUB_WS_URL).then(async () => {
	await main()
		.catch(console.error)
		.finally(() => process.exit());
});
