// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { assetHubWestendV1014000 } from './metadata/assetHubWestendV1014000';

export const mockSystemApiV1014000 = createApiWithAugmentations(assetHubWestendV1014000);
