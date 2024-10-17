// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations.js';
import { moonriverV2302 } from './metadata/moonriverV2302.js';

export const mockMoonriverParachainApi = createApiWithAugmentations(moonriverV2302);
