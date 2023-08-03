// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { statemineV9430 } from './metadata/statemineV9430';

export const mockSystemApi = createApiWithAugmentations(statemineV9430);
