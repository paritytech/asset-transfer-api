// Copyright 2024 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations.js';
import { westendV1016000 } from './metadata/westendV1016000.js';

export const mockRelayApiV1016000 = createApiWithAugmentations(westendV1016000);
