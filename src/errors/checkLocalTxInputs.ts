// Copyright 2023 Parity Technologies (UK) Ltd.

import { SYSTEM_PARACHAINS_IDS } from '../consts';
import { findRelayChain } from '../registry/findRelayChain';
import type { ChainInfoRegistry } from '../registry/types';
import { BaseError } from './BaseError';

enum LocalTxType {
	Assets = 'Assets',
	Balances = 'Balances',
}

/**
 * Check a local transactions inputs to ensure they are correct.
 * If there is an issue it will throw a descriptive message.
 *
 * @param assetIds
 * @param amounts
 */
export const checkLocalTxInput = (
	assetIds: string[],
	amounts: string[],
	specName: string,
	registry: ChainInfoRegistry
): LocalTxType => {
	const relayChain = findRelayChain(specName, registry);
	const relayChainInfo = registry[relayChain];
	const systemParachainInfo = relayChainInfo[SYSTEM_PARACHAINS_IDS[0]];

	// Ensure the lengths in assetIds and amounts is correct
	if (assetIds.length > 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1'
		);
	}

	/**
	 * We assume when the assetId's input is empty that the native token is to be transferred.
	 */
	if (assetIds.length === 0) {
		return LocalTxType.Balances;
	}

	const isNativeToken = relayChainInfo[
		SYSTEM_PARACHAINS_IDS[0]
	].tokens.includes(assetIds[0]);
	if (isNativeToken) {
		return LocalTxType.Balances;
	} else {
		const isInvalidAssetId = Number.isNaN(parseInt(assetIds[0]));
		if (isInvalidAssetId) {
			throw new BaseError(
				`The assetId passed in is not a valid number: ${assetIds[0]}`
			);
		}

		const isAssetAvailable = Object.keys(
			systemParachainInfo.assetsInfo
		).includes(assetIds[0]);
		if (!isAssetAvailable) {
			throw new BaseError(
				`The assetId ${assetIds[0]} does not exist in the registry.`
			);
		}

		return LocalTxType.Assets;
	}
};
