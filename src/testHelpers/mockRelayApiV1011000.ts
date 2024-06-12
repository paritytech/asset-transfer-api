// Copyright 2024 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { westendV1011000 } from './metadata/westendV1011000';

export const mockRelayApiV1011000 = createApiWithAugmentations(westendV1011000);
