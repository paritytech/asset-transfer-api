// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { moonriverV2302 } from './metadata/moonriverV2302';

export const mockMoonriverParachainApi = createApiWithAugmentations(moonriverV2302);
