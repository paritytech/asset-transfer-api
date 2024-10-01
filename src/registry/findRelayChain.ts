// Copyright 2023 Parity Technologies (UK) Ltd.

import {
	KUSAMA_ASSET_HUB_SPEC_NAMES,
	POLKADOT_ASSET_HUB_SPEC_NAMES,
	ROCOCO_ASSET_HUB_SPEC_NAME,
	PASEO_ASSET_HUB_SPEC_NAME,
	WESTEND_ASSET_HUB_SPEC_NAMES,
} from '../consts';
import { BaseError, BaseErrorsEnum } from '../errors';
import type { ChainInfoKeys, ChainInfoRegistry, RelayChains } from './types';
/**
 * Finds the name of the relay chain of a given specName. If the chain does not exist within the registry
 * an error will be thrown.
 *
 * @param specName SpecName of the given chain
 * @param registry The registry to search
 * @param chainName optional chain name for cases where more than one chain share a specName
 */
export const findRelayChain = (
	specName: string,
	registry: ChainInfoRegistry<ChainInfoKeys>,
	chainName?: string,
): RelayChains => {
	const polkadotChains = Object.keys(registry.polkadot).map((val) => registry.polkadot[val].specName);
	if (polkadotChains.includes(specName.toLowerCase()) || POLKADOT_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()))
		return 'polkadot';

	// check rococo first due to Kusama `statemine` specName collision
	const rococoChains = Object.keys(registry.rococo).map((val) => registry.rococo[val].specName);
	if (
		rococoChains.includes(specName.toLowerCase()) ||
		ROCOCO_ASSET_HUB_SPEC_NAME.includes(specName.toLowerCase()) ||
		(specName.toLowerCase() === 'statemine' && chainName && chainName.toLowerCase().includes('rococo'))
	) {
		return 'rococo';
	}

	const paseoChains = Object.keys(registry.paseo).map((val) => registry.paseo[val].specName);
	if (
		paseoChains.includes(specName.toLowerCase()) ||
		PASEO_ASSET_HUB_SPEC_NAME.includes(specName.toLowerCase())
	) {
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
