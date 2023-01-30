import { ApiPromise } from '@polkadot/api';
import { Bytes } from '@polkadot/types';

interface ITransferArgsOpts {
	/**
	 * Signing Payload vs Call
	 */
	format?: 'payload' | 'call';
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
	 * TBD
	 *
	 * @param chainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetId ID of the asset to be transferred (‘0’ for DOT)
	 * @param amount Amount of the token to transfer
	 * @param opts Options
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

	/**
	 * Return a partialFee of the
	 *
	 * @param tx Transaction to estimate the fee for
	 */
	public estimateFee(tx: Bytes | string) {
		console.log(tx);
	}
}
