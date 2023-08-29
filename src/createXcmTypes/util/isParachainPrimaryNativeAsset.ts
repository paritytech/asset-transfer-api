// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from "../../registry";
import { getChainIdBySpecName } from "./getChainIdBySpecName";

export const isParachainPrimaryNativeAsset = (assetId: string, registry: Registry, specName: string) => {
        // assume empty assetId to be the relay chains primary native asset
        if (!assetId) {
            return true;
            
        }
        // if assetId is an empty string
        // treat is as the parachains primary native asset
        if (assetId === '') {
            return true;
        }

        const currentChainId = getChainIdBySpecName(registry, specName);
        const { tokens } = registry.currentRelayRegistry[currentChainId];
        const primaryParachainNativeAsset = tokens[0];
        if (primaryParachainNativeAsset.toLowerCase() === assetId.toLowerCase()) {
            return true;
        }

    return false;
}