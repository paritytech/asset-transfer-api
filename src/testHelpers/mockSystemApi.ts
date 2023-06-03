// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { statemineV9420 } from './metadata/statemineV9420';

export const mockSystemApi = createApiWithAugmentations(statemineV9420);
