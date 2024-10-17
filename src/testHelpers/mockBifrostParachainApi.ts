// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations.js';
import { bifrostKusamaV13000 } from './metadata/bifrostKusamaV13000.js';

export const mockBifrostParachainApi = createApiWithAugmentations(bifrostKusamaV13000);
