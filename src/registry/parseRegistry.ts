// Copyright 2023-2024 Parity Technologies (UK) Ltd.
import { AnyJson } from '@polkadot/types/types';

import { ASSET_HUB_CHAIN_ID } from '../consts';
import { BaseError, BaseErrorsEnum } from '../errors';
import type { AssetTransferApiOpts } from '../types';
import { deepEqual } from '../util/deepEqual';
import type {
	ChainInfo,
	ChainInfoKeys,
	ChainInfoRegistry,
	InjectedChainInfoKeys,
	SanitizedXcAssetsData,
} from './types';

/**
 * Function to iterate over the properties of an object in order to check whether
 * the information is already present in the registry, and if it's not, to update
 * the registry with the new data. If override is false or undefined, it only adds
 * data, and ignores changes to the `specName`. If override is true, it overrides
 * existing data and adds data not already present in the registry, it also enables
 * updating the `specName`.
 *
 * @param input object over which to iterate
 * @param chain registry entry of the relay chain corresponding to the object we are iterating
 * @param id specName of the relay chain
 * @param property optional name of the property we are passing to the function a an object
 * @param override optional boolean to define if we aim to override the existing registry
 */
const propertyIterator = (
	input: object,
	chain: ChainInfo<ChainInfoKeys>,
	id: string,
	property?: string,
	override?: boolean,
) => {
	const tokenBuffer = [];
	const xcAssetsBuffer: SanitizedXcAssetsData[] = [];
	if (property === 'specName' && override) {
		chain[id]['specName'] = input as unknown as string;
	}
	for (const [key, value] of Object.entries(input)) {
		if (!property) {
			propertyIterator(value as object, chain, id, key, override);
		} else if (property === 'tokens' && chain[id][property] && typeof value === 'string') {
			if (override) {
				tokenBuffer.push(value);
			}
			if (!override && !chain[id]['tokens'].includes(value)) {
				chain[id]['tokens'].push(value);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		} else if (property === 'xcAssetsData') {
			if (!chain[id]['xcAssetsData'] || override) {
				xcAssetsBuffer.push(value as SanitizedXcAssetsData);
				Object.assign(chain[id], { xcAssetsData: xcAssetsBuffer });
			} else {
				let hit = false;
				for (const chainObj of (chain[id]['xcAssetsData'] as SanitizedXcAssetsData[]).values()) {
					if (deepEqual(value as AnyJson, chainObj as AnyJson)) {
						hit = true;
					}
				}
				if (!hit) chain[id]['xcAssetsData']?.push(value as SanitizedXcAssetsData);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		} else if (property !== 'specName' && chain[id][property] && !chain[id][property][key]) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			chain[id][property][key] = value as object;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		} else if (property !== 'specName' && chain[id][property] && chain[id][property][key] && override) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			chain[id][property][key] = value as object;
		}
	}
	if (tokenBuffer.length !== 0) {
		chain[id]['tokens'] = tokenBuffer;
	}
};

/**
 * Function to update the current chain registry with injected information. It
 * errors out when adding a new chain without defining a specName
 *
 * @param injectedChain chain information to add to the registry
 * @param registry current chain registry
 * @param registryChain chain information currently present on the registry
 * @param override boolean to define whether we want to override the current registry
 */
const updateRegistry = (
	injectedChain: ChainInfo<InjectedChainInfoKeys>,
	registry: ChainInfoRegistry<ChainInfoKeys>,
	registryChain: string,
	override?: boolean,
) => {
	const chain = registry[registryChain] as unknown as ChainInfo<ChainInfoKeys>;
	const buffer: ChainInfoKeys = {
		tokens: [],
		assetsInfo: {},
		foreignAssetsInfo: {},
		poolPairsInfo: {},
		specName: '',
	};
	for (const id of Object.keys(injectedChain)) {
		if (!chain[id] && !injectedChain[id].specName) {
			throw new BaseError('A specName must be provided when adding a new chain', BaseErrorsEnum.SpecNameNotProvided);
		} else if (!chain[id]) {
			Object.assign(buffer, injectedChain[id]);
			Object.assign(injectedChain[id], buffer);
			Object.assign(chain, injectedChain);
		}
		propertyIterator(injectedChain[id], chain, id, undefined, override);
	}
};

export const parseRegistry = (
	registry: ChainInfoRegistry<ChainInfoKeys>,
	assetsOpts: AssetTransferApiOpts<InjectedChainInfoKeys>,
): ChainInfoRegistry<ChainInfoKeys> => {
	if (assetsOpts.injectedRegistry) {
		const { injectedRegistry } = assetsOpts;
		const polkadot = injectedRegistry.polkadot;
		const kusama = injectedRegistry.kusama;
		const westend = injectedRegistry.westend;
		const rococo = injectedRegistry.rococo;

		if (polkadot) updateRegistry(polkadot, registry, 'polkadot');
		if (kusama) updateRegistry(kusama, registry, 'kusama');
		if (westend) updateRegistry(westend, registry, 'westend');
		if (rococo) updateRegistry(rococo, registry, 'rococo');
	}
	if (assetsOpts.overridingRegistry) {
		const { overridingRegistry } = assetsOpts;
		const polkadot = overridingRegistry.polkadot;
		const kusama = overridingRegistry.kusama;
		const westend = overridingRegistry.westend;
		const rococo = overridingRegistry.rococo;

		if (polkadot) updateRegistry(polkadot, registry, 'polkadot', true);
		if (kusama) updateRegistry(kusama, registry, 'kusama', true);
		if (westend) updateRegistry(westend, registry, 'westend', true);
		if (rococo) updateRegistry(rococo, registry, 'rococo', true);
	}

	/**
	 * This is a temporary overwrite to ensure the statemine specName is not shared between
	 * kusama and rococo for their asset-hub chains.
	 */
	registry.rococo[ASSET_HUB_CHAIN_ID].specName = 'asset-hub-rococo';

	return registry;
};
