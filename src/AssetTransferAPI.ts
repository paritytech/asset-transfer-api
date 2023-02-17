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

interface IXcmInfo {
	version: number | u32;
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
	 * @param chainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetId ID of the asset to be transferred (‘0’ for DOT)
	 * @param amount Amount of the token to transfer
	 * @param opts Options
	 */
	public async createTransferTransaction(
		chainId: string | number,
		destAddr: string,
		assetId: string,
		amount: string | number,
		opts?: ITransferArgsOpts
	) {
		const { _api, _info } = this;
		const { specName, specVersion } = await _info;
		console.log(
			chainId,
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
	): Promise<IXcmInfo> {
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
			return {
				version,
			};
		}

		return {
			version: supportedVersion.unwrap(),
		};
	}
}
