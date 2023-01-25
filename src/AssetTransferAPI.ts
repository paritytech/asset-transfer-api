import { ApiPromise } from '@polkadot/api';

interface ITransferArgsOpts {
	/**
	 * TODO: We should set this to a set amount of accepted values.
	 * Signing Payload vs Call
	 */
	format?: string;
	/**
	 * AssetId to pay fee's on the current common good parachain.
	 * Statemint: default DOT
	 * Statemine: default KSM
	 */
	payFeeWith?: string;
	/**
	 * AssetId to pay fee's on the destination parachain.
	 */
	payFeeWithTo?: string;
	/**
	 * Boolean to declare if this will be with limited XCM transfers.
	 * Deafult is unlimited.
	 */
	isLimited?: boolean;
}

export class AssetsTransferAPI {
	readonly _api: ApiPromise;

	constructor(api: ApiPromise) {
		this._api = api;
	}

	/**
	 * @param chainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetId ID of the asset to be transferred (‘0’ for DOT)
	 * @param amount Amount of the token to transfer
	 * @param opts Options
	 *
	 */
	public createTransferTransaction(
		chainId: string | number,
		destAddr: string,
		assetId: string,
		amount: string | number,
		opts?: ITransferArgsOpts
	) {
		console.log(chainId, destAddr, assetId, amount, opts);
	}

	public estimateFee() {
		console.log('estimate fee');
	}
}
