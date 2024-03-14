// Copyright 2024 Parity Technologies (UK) Ltd.

import { KNOWN_GLOBAL_CONSENSUS_SYSTEM_NAMES } from "../../consts";
import { BaseError, BaseErrorsEnum } from "../../errors";

export const getGlobalConsensusSystemName = (destLocation: string): string => {
    for (const systemName of KNOWN_GLOBAL_CONSENSUS_SYSTEM_NAMES) {
        if (destLocation.toLowerCase().includes(systemName)) {
            return systemName;
        }
    }

    throw new BaseError(
        `No known consensus system found for location ${destLocation}`,
        BaseErrorsEnum.UnknownConsensusSystem
    );
}