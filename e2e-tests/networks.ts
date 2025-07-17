// This is not meant to be extensive.
// If a desired network is missing, please add it here.

import { connectParachains, connectVertical } from '@acala-network/chopsticks';
import { NetworkContext, setupContext, SetupOption } from '@acala-network/chopsticks-testing';

// https://docs.rs/log/latest/log/enum.Level.html
// pub enum Level {
//     Error = 1,
//     Warn = 2,
//     Info = 3,
//     Debug = 4,
//     Trace = 5,
// }
const runtimeLogLevel = 5;

/**
 * SetupOptions for networks on Chopsticks
 *
 * Iff an identifier is given during network setup:
 * Ports will be overwritten
 * DB will be edited with the new port appended
 */
export const configs = {
	astar: {
		endpoint: 'wss://astar.public.blastapi.io',
		db: './chopsticks-db/db.sqlite-astar',
		port: 8000,
		runtimeLogLevel,
	},
	hydration: {
		endpoint: 'wss://hydration.dotters.network',
		db: `./chopsticks-db/db.sqlite-hydration`,
		port: 8001,
		runtimeLogLevel,
	},
	moonbeam: {
		endpoint: 'wss://moonbeam.public.blastapi.io',
		db: `./chopsticks-db/db.sqlite-moonbeam`,
		port: 8002,
		runtimeLogLevel,
	},
	polkadot: {
		endpoint: 'wss://rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-polkadot`,
		port: 8003,
		runtimeLogLevel,
	},
	polkadotAssetHub: {
		endpoint: 'wss://polkadot-asset-hub-rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-polkadot-asset-hub`,
		port: 8004,
		runtimeLogLevel,
	},
	polkadotBridgeHub: {
		endpoint: 'wss://polkadot-bridge-hub-rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-polkadot-bridge-hub`,
		port: 8005,
		runtimeLogLevel,
	},
	westend: {
		endpoint: 'wss://westend-rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-westend`,
		port: 8006,
		runtimeLogLevel,
	},
	westendAssetHub: {
		endpoint: 'wss://westend-asset-hub-rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-westend-asset-hub`,
		port: 8007,
		runtimeLogLevel,
	},
};

/**
 * Set up a relaychain with connected parachains for testing.
 *
 * @param relayChainConfig
 * @param parachainConfigs
 * @param id - Optional identifier used to ensure unique ports and dbs
 * @returns
 */
export const setupParachainsWithRelay = async (
	relayChainConfig: SetupOption,
	parachainConfigs: SetupOption[],
	id?: string,
): Promise<[NetworkContext, NetworkContext[]]> => {
	const parachains = await setupParachains(parachainConfigs, id);

	const relayChain = await setupContext(modifyConfig(relayChainConfig, id));
	for (const parachain of parachains) {
		await connectVertical(relayChain.chain, parachain.chain);
	}

	await relayChain.dev.setStorage({
		ParasDisputes: {
			// these can makes block building super slow
			$removePrefix: ['disputes'],
		},
		Dmp: {
			// clear existing dmp to avoid impacting test result
			$removePrefix: ['downwardMessageQueues'],
		},
	});

	return [relayChain, parachains];
};

/**
 * Set up a connected parachains for testing.
 *
 * @param parachainConfigs
 * @param id  - Optional identifier used to ensure unique ports and dbs
 * @returns
 */
export const setupParachains = async (parachainConfigs: SetupOption[], id?: string): Promise<NetworkContext[]> => {
	const modifiedParachainConfigs = parachainConfigs.map((config) => modifyConfig(config, id));
	const parachains = await Promise.all(modifiedParachainConfigs.map(setupContext));

	await connectParachains(
		parachains.map(({ chain }) => chain),
		true,
	);

	return parachains;
};

/**
 * Utility function to convert a string into an unregistered port.
 *
 * Ports 49152 - 65535 cannot be registered with IANA.
 * Using DJB2
 *
 * WARN: not secure cryptographically and just to get unique ports
 * that are consistent between tests.
 *
 * @param str
 * @returns
 */
const hashToPort = (str: string): number => {
	let hash = 5381; // using DJB2
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) + hash + str.charCodeAt(i);
	}

	hash = hash >>> 0;

	const min = 49152;
	const max = 65535;
	const range = max - min + 1;
	return (hash % range) + min;
};

/**
 * Update a network config with a port and db path
 * @param config
 * @param id
 * @returns
 */
const modifyConfig = (config: SetupOption, id?: string): SetupOption => {
	if (id === undefined) {
		return config;
	}
	const endpoint = Array.isArray(config.endpoint) ? config.endpoint[0] : config.endpoint;
	const port = hashToPort(`${endpoint}:${id}`);
	const modifiedConfig = {
		...config,
		port,
		db: `${config.db}-${port}`,
	};
	return modifiedConfig;
};
