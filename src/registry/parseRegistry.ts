// Copyright 2023 Parity Technologies (UK) Ltd.

import registry from './registry.json';
import type { ChainInfoRegistry } from './types';

export const parseRegistry = (): ChainInfoRegistry => {
	return registry;
};
