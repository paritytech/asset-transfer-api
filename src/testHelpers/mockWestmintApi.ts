// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { westmint9425 } from './metadata/westmintV9425';

export const mockWestmintApi = createApiWithAugmentations(westmint9425);

