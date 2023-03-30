// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { westendV9400 } from './metadata/westendV9400';

export const mockRelayApi = createApiWithAugmentations(westendV9400);
