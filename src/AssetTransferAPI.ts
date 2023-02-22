import { ApiPromise } from '@polkadot/api';
import { Bytes, Option, u32 } from '@polkadot/types';
import { MultiLocation } from '@polkadot/types/interfaces';

interface ITransferArgsOpts {
	/**
	 * Signing Payload vs Call
	 */
	format?: 'payload' | 'call'; // Give a polkadot-js option.
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
	readonly _info: Promise<IChainInfo>;

	constructor(api: ApiPromise) {
		this._api = api;
		this._info = this.fetchChainInfo(api);
	}

	/**
	 * TBD
	 *
	 * @param destChainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetId ID of the asset to be transferred (‘0’ for DOT)
	 * @param amount Amount of the token to transfer
	 * @param opts Options
	 */
	public async createTransferTransaction(
		destChainId: string | number,
		destAddr: string,
		assetId: string,
		amount: string | number,
		opts?: ITransferArgsOpts
	) {
		const { _api, _info } = this;
		const { specName, specVersion } = await _info;
		console.log(
			destChainId,
			destAddr,
			assetId,
			amount,
			opts,
			specName,
			specVersion
		);
		/**
		 * `api.tx.xcmPallets` methods to support inlcude:
		 *	 'teleportAssets',
		 *	 'reserveTransferAssets',
		 *	 'limitedReserveTransferAssets',
		 *	 'limitedTeleportAssets'
		 */
		console.log(Object.keys(_api.tx.xcmPallet));
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
			specVersion: specVersion.toString(),
		};
	}

	/**
	 * TODO: When we are actively using this change it over to `private`.
	 * Fetch the xcmVersion to use for a given chain. If the supported version doesn't for
	 * a given destination we use the on storage safe version.
	 *
	 * @param xcmVersion The version we want to see is supported
	 * @param multiLocation Destination multilocation
	 */
	public async fetchXcmVersion(
		xcmVersion: number,
		multiLocation: MultiLocation,
		fallbackVersion: number
	): Promise<number | u32> {
		const { _api } = this;

		const supportedVersion = await _api.query.polkadotXcm.supportedVersion<
			Option<u32>
		>(xcmVersion, multiLocation);

		if (supportedVersion.isNone) {
			const safeVersion = await _api.query.polkadotXcm.safeXcmVersion<
				Option<u32>
			>();
			const version = safeVersion.isSome
				? safeVersion.unwrap()
				: fallbackVersion;
			return version;
		}

		return supportedVersion.unwrap();
	}
}
