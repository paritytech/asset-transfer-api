// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { bifrostKusamaV13000 } from './metadata/bifrostKusamaV13000';

export const mockBifrostParachainApi = createApiWithAugmentations(bifrostKusamaV13000);
