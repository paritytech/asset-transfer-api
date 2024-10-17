import type { XcmBaseArgs } from '../../types.js';
import type { XcmPalletName } from '../util/establishXcmPallet.js';

export interface XTokensBaseArgs extends XcmBaseArgs {
	xcmPallet: XcmPalletName;
}
