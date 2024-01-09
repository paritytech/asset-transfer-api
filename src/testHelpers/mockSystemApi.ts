// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { assetHubWestendV1004000 } from './metadata/assetHubWestendV1004000';

export const mockSystemApi = createApiWithAugmentations(assetHubWestendV1004000);
