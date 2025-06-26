import {
	KUSAMA_ASSET_HUB_SPEC_NAMES,
	PASEO_ASSET_HUB_SPEC_NAME,
	POLKADOT_ASSET_HUB_SPEC_NAMES,
	WESTEND_ASSET_HUB_SPEC_NAMES,
} from '../consts.js';
import { BaseError, BaseErrorsEnum } from '../errors/index.js';
import type { ChainInfoKeys, ChainInfoRegistry, RelayChains } from './types.js';
/**
 * Finds the name of the relay chain of a given specName. If the chain does not exist within the registry
 * an error will be thrown.
 *
 * @param specName SpecName of the given chain
 * @param registry The registry to search
 * @param chainName optional chain name for cases where more than one chain share a specName
 */
export const findRelayChain = (specName: string, registry: ChainInfoRegistry<ChainInfoKeys>): RelayChains => {
	const polkadotChains = Object.keys(registry.polkadot).map((val) => registry.polkadot[val].specName);
	if (polkadotChains.includes(specName.toLowerCase()) || POLKADOT_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()))
		return 'polkadot';

	const paseoChains = Object.keys(registry.paseo).map((val) => registry.paseo[val].specName);
	if (paseoChains.includes(specName.toLowerCase()) || PASEO_ASSET_HUB_SPEC_NAME.includes(specName.toLowerCase())) {
		return 'paseo';
	}

	const kusamaChains = Object.keys(registry.kusama).map((val) => registry.kusama[val].specName);
	if (kusamaChains.includes(specName.toLowerCase()) || KUSAMA_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()))
		return 'kusama';

	const westendChains = Object.keys(registry.westend).map((val) => registry.westend[val].specName);
	if (westendChains.includes(specName.toLowerCase()) || WESTEND_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()))
		return 'westend';

	throw new BaseError(`Cannot find the relay chain for specName: ${specName}`, BaseErrorsEnum.InternalError);
};
