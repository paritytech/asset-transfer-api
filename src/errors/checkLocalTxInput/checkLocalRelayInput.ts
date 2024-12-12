// Copyright 2024 Parity Technologies (UK) Ltd.

import { RELAY_CHAIN_IDS, RELAY_CHAINS_NATIVE_ASSET_LOCATION } from '../../consts';
import { isRelayNativeAsset } from '../../createXcmTypes/util/isRelayNativeAsset';
import { Registry } from '../../registry';
import { BaseError, BaseErrorsEnum } from '../BaseError';
import { LocalTxType } from './types';

export const checkLocalRelayInput = (assetIds: string[], amounts: string[], registry: Registry): LocalTxType => {
	if (assetIds.length > 1 || amounts.length !== 1) {
		throw new BaseError(
			'Local transactions must have the `assetIds` input be a length of 1 or 0, and the `amounts` input be a length of 1',
			BaseErrorsEnum.InvalidInput,
		);
	}
	const relayChainId = RELAY_CHAIN_IDS[0];
	const relayChain = registry.currentRelayRegistry[relayChainId];
	const relayChainNativeAsset = relayChain.tokens[0];

	const assetIsRelayNativeAsset = assetIds.length === 0 ? true : isRelayNativeAsset(registry, assetIds[0]);
	if (!assetIsRelayNativeAsset) {
		throw new BaseError(
			`AssetId ${assetIds[0]} is not the native asset of ${relayChain.specName} relay chain. Expected an assetId of ${relayChainNativeAsset} or asset location ${RELAY_CHAINS_NATIVE_ASSET_LOCATION}`,
		);
	}

	return LocalTxType.Balances;
};
