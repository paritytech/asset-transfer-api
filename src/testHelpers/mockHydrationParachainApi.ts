// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { hydrationV3100 } from './metadata/hydrationV3100';

export const mockHydrationParachainApi = createApiWithAugmentations(hydrationV3100);
