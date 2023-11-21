import type { PolkadotXcmBaseArgs } from '../polkadotXcm/types';
import type { XcmPalletName } from '../util/establishXcmPallet';

export interface XTokensBaseArgs extends PolkadotXcmBaseArgs {
	xcmPallet: XcmPalletName;
}
