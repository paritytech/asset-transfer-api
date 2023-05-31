import { MultiAsset } from '../../types';

export const dedupeMultiAssets = (multiAssets: MultiAsset[]): MultiAsset[] => {
	const dedupedAssets: MultiAsset[] = [];

	for (let i = 0; i < multiAssets.length; i++) {
		const multiAsset = multiAssets[i];

		if (i === 0) {
			dedupedAssets.push(multiAsset);
			continue;
		}

		const previousAsset = dedupedAssets[dedupedAssets.length - 1];
		if (JSON.stringify(multiAsset) === JSON.stringify(previousAsset)) {
			continue;
		}

		dedupedAssets.push(multiAsset);
	}

	return dedupedAssets;
};
