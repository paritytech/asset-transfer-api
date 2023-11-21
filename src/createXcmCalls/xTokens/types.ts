import type { XcmBaseArgs } from '../../types';
import type { XcmPalletName } from '../util/establishXcmPallet';

export interface XTokensBaseArgs extends XcmBaseArgs {
	xcmPallet: XcmPalletName;
}
