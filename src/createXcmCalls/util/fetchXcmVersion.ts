import type { ApiPromise } from '@polkadot/api';
import type { Option, u32 } from '@polkadot/types';
import type { MultiLocation } from '@polkadot/types/interfaces';

/**
 * TODO: When we are actively using this change it over to `private`.
 * TODO: Should this be moved because we wont have the MultiLocation until we pass this
 * into the typecreation.
 *
 * Fetch the xcmVersion to use for a given chain. If the supported version doesn't for
 * a given destination we use the on storage safe version.
 *
 * @param xcmVersion The version we want to see is supported
 * @param multiLocation Destination multilocation
 */
export const fetchXcmVersion = async (
	api: ApiPromise,
	xcmVersion: number,
	multiLocation: MultiLocation,
	fallbackVersion: number
): Promise<number | u32> => {
	const supportedVersion = await api.query.polkadotXcm.supportedVersion<
		Option<u32>
	>(xcmVersion, multiLocation);

	if (supportedVersion.isNone) {
		const safeVersion = await api.query.polkadotXcm.safeXcmVersion<
			Option<u32>
		>();
		const version = safeVersion.isSome ? safeVersion.unwrap() : fallbackVersion;
		return version;
	}

	return supportedVersion.unwrap();
};
