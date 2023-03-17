import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Option, u32 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import {
	DEFAULT_XCM_VERSION,
	SYSTEM_PARACHAINS_IDS,
	SYSTEM_PARACHAINS_NAMES,
} from './consts';
import { transfer, transferKeepAlive } from './createCalls';
import {
	limitedReserveTransferAssets,
	reserveTransferAssets,
} from './createXcmCalls';
import { establishXcmPallet } from './createXcmCalls/util/establishXcmPallet';
import {
	ConstructedFormat,
	Format,
	IChainInfo,
	IDirection,
	ITransferArgsOpts,
} from './types';

export class AssetsTransferApi {
	readonly _api: ApiPromise;
	readonly _info: Promise<IChainInfo>;
	readonly _safeXcmVersion: Promise<u32>;

	constructor(api: ApiPromise) {
		this._api = api;
		this._info = this.fetchChainInfo();
		this._safeXcmVersion = this.fetchSafeXcmVersion();
	}

	/**
	 * Create an asset transfer transaction. This can be either locally on a systems parachain,
	 * or between chains using xcm.
	 *
	 * @param destChainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetIds Array of assetId's to be transferred (‘0’ for Native Relay Token)
	 * @param amounts Array of the amounts of each token to transfer
	 * @param opts Options
	 */
	public async createTransferTransaction<T extends Format>(
		destChainId: string,
		destAddr: string,
		assetIds: string[],
		amounts: string[],
		opts?: ITransferArgsOpts<T>
	): Promise<ConstructedFormat<T>> {
		const { _api, _info, _safeXcmVersion } = this;
		const { specName } = await _info;
		const safeXcmVersion = await _safeXcmVersion;
		/**
		 * Establish the Transaction Direction
		 */
		const xcmDirection = this.establishDirection(destChainId, specName);
		const xcmVersion =
			opts?.xcmVersion === undefined
				? safeXcmVersion.toNumber()
				: opts.xcmVersion;
		const isRelayDirection = xcmDirection.toLowerCase().includes('relay');
		const isSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			specName.toLowerCase()
		);

		/**
		 * Lengths should match, and indicies between both the amounts and assetIds should match.
		 */
		if (assetIds.length !== amounts.length && !isRelayDirection) {
			throw Error(
				'`amounts`, and `assetIds` fields should match in length when constructing a tx from a parachain to a parachain or locally on a system parachain.'
			);
		}

		/**
		 * Create a local asset transfer.
		 */
		if (SYSTEM_PARACHAINS_IDS.includes(destChainId) && isSystemParachain) {
			const tx = opts?.keepAlive
				? transferKeepAlive(_api, destAddr, assetIds[0], amounts[0])
				: transfer(_api, destAddr, assetIds[0], amounts[0]);

			return this.constructFormat(tx, opts?.format);
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

		return this.constructFormat<T>(transaction, opts?.format);
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
	 * @param format The format to return the tx in.
	 */
	private constructFormat<T extends Format>(
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		format?: T
	): ConstructedFormat<T> {
		const { _api } = this;
		if (format === 'call') {
			return _api.registry
				.createType('Call', {
					callIndex: tx.callIndex,
					args: tx.args,
				})
				.toHex() as ConstructedFormat<T>;
		}

		if (format === 'submittable') {
			return tx as ConstructedFormat<T>;
		}

		return _api.registry
			.createType('ExtrinsicPayload', tx, {
				version: tx.version,
			})
			.toHex() as ConstructedFormat<T>;
	}

	/**
	 * Fetch for a safe Xcm Version from the chain, if none exists the
	 * in app default version will be used.
	 */
	private async fetchSafeXcmVersion(): Promise<u32> {
		const { _api } = this;
		const pallet = establishXcmPallet(_api);
		const safeVersion = await _api.query[pallet].safeXcmVersion<Option<u32>>();
		const version = safeVersion.isSome
			? safeVersion.unwrap()
			: _api.registry.createType('u32', DEFAULT_XCM_VERSION);

		return version;
	}
}
