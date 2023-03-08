import { createApiWithAugmentations } from './createApiWithAugmentations';
import { statemintV9370 } from './metadata/statemintV9370';

export const mockSystemApi = createApiWithAugmentations(statemintV9370);
