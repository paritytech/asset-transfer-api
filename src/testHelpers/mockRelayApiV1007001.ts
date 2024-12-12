// Copyright 2024 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { westendV1007001 } from './metadata/westendV1007001';

export const mockRelayApiV1007001 = createApiWithAugmentations(westendV1007001);
