// Copyright 2024 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { westendV1014000 } from './metadata/westendV1014000';

export const mockRelayApiV1014000 = createApiWithAugmentations(westendV1014000);
