import type { AnyJson } from '@polkadot/types/types';

import type { UnionXcmMultiLocation, XcmCreator } from '../createXcmTypes/types.js';

/**
 * This ensures that the given multiLocation does not have certain junctions depending on the xcm version.
 *
 * @param multiLocation
 * @param xcmCreator
 * @returns
 */
export const resolveMultiLocation = (multiLocation: AnyJson, xcmCreator: XcmCreator): UnionXcmMultiLocation => {
	return xcmCreator.resolveMultiLocation(multiLocation);
};
