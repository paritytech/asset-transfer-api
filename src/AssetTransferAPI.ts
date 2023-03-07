import '@polkadot/api-augment';

import { ApiPromise } from '@polkadot/api';
import { Bytes, Option, u32 } from '@polkadot/types';
import { MultiLocation } from '@polkadot/types/interfaces';

import { SYSTEM_PARACHAINS_IDS, SYSTEM_PARACHAINS_NAMES } from './consts';
import { limitedReserveTransferAssets } from './createXcmCalls';
import { IChainInfo, IDirection, ITransferArgsOpts } from './types';

const DEFAULT_XCM_VERSION = 1;

export class AssetsTransferAPI {
	readonly _api: ApiPromise;
	readonly _info: Promise<IChainInfo>;

	constructor(api: ApiPromise) {
		this._api = api;
		this._info = this.fetchChainInfo(api);
	}

	/**
	 * TBD
	 * TODO: Should assetId also take in numbers as well.
	 *
	 * @param destChainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetIds Array of assetId's to be transferred (‘0’ for Native Relay Token)
	 * @param amounts Array of the amounts of each token to transfer
	 * @param opts Options
	 */
	public async createTransferTransaction(
		destChainId: string,
		destAddr: string,
		assetIds: string[],
		amounts: string[] | number[],
		opts?: ITransferArgsOpts
	) {
		const { _api, _info } = this;
		const { specName } = await _info;

		/**
		 * Lengths should match, and indicies between both the amounts and assetIds should match.
		 */
		if (assetIds.length !== amounts.length) {
			throw Error('`assetId` length should match `amount` length');
		}

		/**
		 * Establish the Transaction Direction
		 */
		const xcmDirection = this.establishDirection(destChainId, specName);

		let transaction;
		if (opts?.isLimited) {
			transaction = limitedReserveTransferAssets(
				_api,
				xcmDirection,
				destAddr,
				assetIds,
				amounts,
				destChainId,
				DEFAULT_XCM_VERSION
			);
		} else {
			throw Error('ReserveTransferAssets is not yet implemented');
		}

		console.log(transaction);
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
	 * TODO: Should this be moved because we wont have the MultiLocation until we pass this
	 * into the typecreation.
	 * 
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

	/**
	 * Declare the direction of the xcm message.
	 *
	 * @param destChainId
	 * @param specName
	 */
	private establishDirection(
		destChainId: string,
		specName: string
	): IDirection {
		const { _api } = this;
		const isSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(specName);
		const isDestIdSystemPara = SYSTEM_PARACHAINS_IDS.includes(destChainId);

		/**
		 * Check if the origin is a System Parachain
		 */
		if (isSystemParachain && destChainId === '0') {
			return IDirection.SystemToRelay;
		}

		if (isSystemParachain && destChainId !== '0') {
			return IDirection.SystemToPara;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (_api.query.paras && isDestIdSystemPara) {
			return IDirection.RelayToSystem;
		}

		if (_api.query.paras && !isDestIdSystemPara) {
			return IDirection.RelayToPara;
		}

		/**
		 * Check if the origin is a Parachain or Parathread
		 */
		if (_api.query.polkadotXcm && !isDestIdSystemPara) {
			return IDirection.RelayToPara;
		}

		if (_api.query.polkadotXcm) {
			return IDirection.ParaToPara;
		}

		throw Error('Could not establish a xcm transaction direction');
	}
}
