import { createApiWithAugmentations } from './createApiWithAugmentations';
import { assetHubWestendV1016000 } from './metadata/assetHubWestendV1016000';

export const mockSystemApi = createApiWithAugmentations(assetHubWestendV1016000);
