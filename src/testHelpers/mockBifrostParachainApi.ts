// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { bifrostKusamaV984 } from './metadata/bifrostKusamaV984';

export const mockBifrostParachainApi = createApiWithAugmentations(bifrostKusamaV984);
