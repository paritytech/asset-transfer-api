// This is not meant to be extensive.
// If a desired network is missing, please add it here.

import { connectParachains, connectVertical } from '@acala-network/chopsticks';
import { NetworkContext, setupContext, SetupOption } from '@acala-network/chopsticks-testing';

const runtimeLogLevel = 0;

export const configs = {
	polkadot: {
		endpoint: 'wss://rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-polkadot`,
		port: 8004,
		runtimeLogLevel,
	},
	polkadotAssetHub: {
		endpoint: 'wss://polkadot-asset-hub-rpc.polkadot.io',
		db: `./chopsticks-db/db.sqlite-polkadot-asset-hub`,
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

export const setupNetworksWithRelay = async (
	relayChainConfig: SetupOption,
	parachainConfigs: SetupOption[],
): Promise<[NetworkContext, NetworkContext[]]> => {
	const parachains = await Promise.all(parachainConfigs.map(setupContext));

	await connectParachains(
		parachains.map(({ chain }) => chain),
		true,
	);

	const relayChain = await setupContext(relayChainConfig);
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
