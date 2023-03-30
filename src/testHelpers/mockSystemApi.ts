// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { statemintV9380 } from './metadata/statemintV9380';

export const mockSystemApi = createApiWithAugmentations(statemintV9380);
