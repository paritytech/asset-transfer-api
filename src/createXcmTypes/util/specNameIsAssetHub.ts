// Copyright 2023 Parity Technologies (UK) Ltd.

import { 
    POLKADOT_ASSET_HUB_SPEC_NAMES,
    KUSAMA_ASSET_HUB_SPEC_NAMES,
    WESTEND_ASSET_HUB_SPEC_NAMES
 } from "../../consts";

export const specNameIsAssetHub = (specName: string): boolean => {
    if (
        POLKADOT_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
        KUSAMA_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase()) ||
        WESTEND_ASSET_HUB_SPEC_NAMES.includes(specName.toLowerCase())
    ) {
        return true;
    }

    return false;
}