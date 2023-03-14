import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Bytes } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import {
	DEFAULT_XCM_VERSION,
	SYSTEM_PARACHAINS_IDS,
	SYSTEM_PARACHAINS_NAMES,
} from './consts';
import {
	limitedReserveTransferAssets,
	reserveTransferAssets,
} from './createXcmCalls';
import {
	ConstructedFormat,
	Format,
	IChainInfo,
	IDirection,
	ITransferArgsOpts,
} from './types';

export class AssetsTransferAPI {
	readonly _api: ApiPromise;
	readonly _info: Promise<IChainInfo>;

	constructor(api: ApiPromise) {
		this._api = api;
		this._info = this.fetchChainInfo();
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
	): Promise<ConstructedFormat> {
		const { _api, _info } = this;
		const { specName } = await _info;
		/**
		 * Establish the Transaction Direction
		 */
		const xcmDirection = this.establishDirection(destChainId, specName);
		const xcmVersion =
			opts?.xcmVersion === undefined ? DEFAULT_XCM_VERSION : opts.xcmVersion;
		const isRelayDirection = xcmDirection.toLowerCase().includes('relay');

		/**
		 * Lengths should match, and indicies between both the amounts and assetIds should match.
		 */
		if (assetIds.length !== amounts.length && !isRelayDirection) {
			throw Error(
				'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain.'
			);
		}

		let transaction: SubmittableExtrinsic<'promise', ISubmittableResult>;
		if (opts?.isLimited) {
			transaction = limitedReserveTransferAssets(
				_api,
				xcmDirection,
				destAddr,
				assetIds,
				amounts,
				destChainId,
				xcmVersion,
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
				xcmVersion
			);
		}

		return this.constructFormat(transaction, opts?.format);
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
	private async fetchChainInfo(): Promise<IChainInfo> {
		const { _api } = this;
		const { specName, specVersion } = await _api.rpc.state.getRuntimeVersion();
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
		const isSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			specName.toLowerCase()
		);
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

	/**
	 * Construct the correct format for the transaction.
	 * If nothing is passed in, the format will default to a signing payload.
	 *
	 * @param tx A polkadot-js submittable extrinsic
	 * @param format The format to return the tx in. Defaults to a signing payload.
	 */
	private constructFormat(
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		format: Format = 'payload'
	): ConstructedFormat {
		const { _api } = this;
		if (format === 'call') {
			return _api.registry
				.createType('Call', {
					callIndex: tx.callIndex,
					args: tx.args,
				})
				.toHex();
		}

		if (format === 'payload') {
			return _api.registry
				.createType('ExtrinsicPayload', tx, {
					version: tx.version,
				})
				.toHex();
		}

		// Returns a SubmittableExtrinsic
		return tx;
	}
}