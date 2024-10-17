// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations.js';
import { assetHubWestendV1016000 } from './metadata/assetHubWestendV1016000.js';

export const mockSystemApi = createApiWithAugmentations(assetHubWestendV1016000);
