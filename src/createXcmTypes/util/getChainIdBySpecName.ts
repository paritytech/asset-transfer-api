// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from "../../registry";

/**
 * returns a chains ID based on its relay chain and specName
 * 
 * @param registry Registry
 * @param specName string
 * @returns 
 */
export const getChainIdBySpecName = (registry: Registry, specName: string): string => {
	let result = '';

	Object.entries(registry.currentRelayRegistry).forEach((chainInfo) => {
		if (chainInfo[1].specName.toLowerCase() === specName.toLowerCase()) {
			result = chainInfo[0];
		}
	});

	return result;
}