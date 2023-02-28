import { ApiPromise } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types';

import { polkadotV9380 } from './metadata/polkadotV9380';

const registry = new TypeRegistry();
const metadata = registry.createType('Metadata', polkadotV9380);
registry.setMetadata(metadata);

export const mockApi = {
	registry,
} as unknown as ApiPromise;
