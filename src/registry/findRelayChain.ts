import { BaseError } from '../errors';
import type { ChainInfoRegistry, RelayChains } from './types';

/**
 * Finds the name of the relay chain of a given specName. If the chain does not exist within the registry
 * an error will be thrown.
 *
 * @param specName SpecName of the given chain
 * @param registry The registry to search
 */
export const findRelayChain = (
	specName: string,
	registry: ChainInfoRegistry
): RelayChains => {
	const polkadotChains = Object.keys(registry.polkadot).map(
		(val) => registry.polkadot[val].specName
	);
	if (polkadotChains.includes(specName.toLowerCase())) return 'polkadot';

	const kusamaChains = Object.keys(registry.kusama).map(
		(val) => registry.kusama[val].specName
	);
	if (kusamaChains.includes(specName.toLowerCase())) return 'kusama';

	const westendChains = Object.keys(registry.westend).map(
		(val) => registry.westend[val].specName
	);
	if (westendChains.includes(specName.toLowerCase())) return 'westend';

	throw new BaseError(`Cannot find the relay chain for specName: ${specName}`);
};
