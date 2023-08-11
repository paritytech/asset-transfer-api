// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { assetHubWestendV9435 } from './metadata/assetHubWestendV9435';

export const mockSystemApi = createApiWithAugmentations(assetHubWestendV9435);
