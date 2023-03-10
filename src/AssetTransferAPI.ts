import '@polkadot/api-augment';

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { Bytes } from '@polkadot/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { SYSTEM_PARACHAINS_IDS, SYSTEM_PARACHAINS_NAMES } from './consts';
import {
	limitedReserveTransferAssets,
	reserveTransferAssets,
} from './createXcmCalls';
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
	 * Create an XCM transaction to transfer Assets, or native tokens from one
	 * chain to another.
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
		amounts: string[],
		opts?: ITransferArgsOpts
	) {
		const { _api, _info } = this;
		const { specName } = await _info;

		/**
		 * Lengths should match, and indicies between both the amounts and assetIds should match.
		 */
		if (assetIds.length !== amounts.length) {
			console.warn(
				'`assetId` length should match `amount` length, unless sending assets from a relay chain to parachain'
			);
		}

		/**
		 * Establish the Transaction Direction
		 */
		const xcmDirection = this.establishDirection(destChainId, specName);

		let transaction: SubmittableExtrinsic<'promise', ISubmittableResult>;
		if (opts?.isLimited) {
			transaction = limitedReserveTransferAssets(
				_api,
				xcmDirection,
				destAddr,
				assetIds,
				amounts,
				destChainId,
				DEFAULT_XCM_VERSION,
				opts?.weightLimit
			);
		} else {
			transaction = reserveTransferAssets(
				_api,
				xcmDirection,
				destAddr,
				assetIds,
				amounts,
				destChainId,
				DEFAULT_XCM_VERSION
			);
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
			throw Error('SystemToRelay is not yet implemented');

			return IDirection.SystemToRelay;
		}

		if (isSystemParachain && destChainId !== '0') {
			return IDirection.SystemToPara;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (_api.query.paras && isDestIdSystemPara) {
			throw Error('RelayToSystem is not yet implemented');

			return IDirection.RelayToSystem;
		}

		if (_api.query.paras && !isDestIdSystemPara) {
			return IDirection.RelayToPara;
		}

		/**
		 * Check if the origin is a Parachain or Parathread
		 */
		if (_api.query.polkadotXcm && !isDestIdSystemPara) {
			throw Error('ParaToRelay is not yet implemented');

			return IDirection.ParaToRelay;
		}

		if (_api.query.polkadotXcm) {
			throw Error('ParaToPara is not yet implemented');

			return IDirection.ParaToPara;
		}

		throw Error('Could not establish a xcm transaction direction');
	}
}
