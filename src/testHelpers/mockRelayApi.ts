// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { polkadotV9380 } from './metadata/polkadotV9380';

export const mockRelayApi = createApiWithAugmentations(polkadotV9380);
