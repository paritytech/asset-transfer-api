import { ApiPromise } from '@polkadot/api';
import { Bytes } from '@polkadot/types';
import { constructApiPromise } from './constructApiPromise';

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

interface IChainInfo {
	specName: string;
	specVersion: string;
}

export class AssetsTransferAPI {
	readonly _api: ApiPromise;
	readonly _info: {};

	constructor(api: ApiPromise) {
		this._api = api;
		this._info = this.fetchChainInfo(this._api);
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
	public async createTransferTransaction (
		chainId: string | number,
		destAddr: string,
		assetId: string,
		amount: string | number,
		opts?: ITransferArgsOpts
	) {
		console.log(chainId, destAddr, assetId, amount, opts);
		const { _api } = this;

		/**
		 * `api.tx.xcmPallets` methods inlcude:
		 *   'send',
		 *	 'teleportAssets',
		 *	 'reserveTransferAssets',
		 *	 'execute',
		 *   'forceXcmVersion',
		 *	 'forceDefaultXcmVersion',
		 *	 'forceSubscribeVersionNotify',
		 *	 'forceUnsubscribeVersionNotify',
		 *	 'limitedReserveTransferAssets',
		 *	 'limitedTeleportAssets'
		 */
		console.log(Object.keys(_api.tx.xcmPallet))
	}

	/**
	 * Return a partialFee of the
	 *
	 * @param tx Transaction to estimate the fee for
	 */
	public estimateFee(tx: Bytes | string) {
		console.log(tx);
	}

	/**
	 * Fetch runtime information based on the connected chain.
	 * 
	 * @param api ApiPromise
	 */
	private async fetchChainInfo(api: ApiPromise): Promise<IChainInfo> {
		const { specName, specVersion } = await api.rpc.state.getRuntimeVersion();
		return {
			specName: specName.toString(),
			specVersion: specVersion.toString()
		}
	}
}
