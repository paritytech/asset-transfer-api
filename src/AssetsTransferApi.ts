// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { Option, u32 } from '@polkadot/types';
import type {
	RuntimeDispatchInfo,
	RuntimeDispatchInfoV1,
} from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import {
	DEFAULT_XCM_VERSION,
	RELAY_CHAIN_NAMES,
	SYSTEM_PARACHAINS_IDS,
	SYSTEM_PARACHAINS_NAMES,
} from './consts';
import * as assets from './createCalls/assets';
import * as balances from './createCalls/balances';
import {
	limitedReserveTransferAssets,
	limitedTeleportAssets,
	reserveTransferAssets,
	teleportAssets,
} from './createXcmCalls';
import { establishXcmPallet } from './createXcmCalls/util/establishXcmPallet';
import { checkLocalTxInput, checkXcmTxInputs, checkXcmVersion } from './errors';
import { findRelayChain } from './registry/findRelayChain';
import { parseRegistry } from './registry/parseRegistry';
import type { ChainInfoRegistry } from './registry/types';
import { sanitizeAddress } from './sanitize/sanitizeAddress';
import {
	AssetsTransferApiOpts,
	AssetType,
	ChainInfo,
	ConstructedFormat,
	Direction,
	Format,
	LocalTransferTypes,
	Methods,
	TransferArgsOpts,
	TxResult,
} from './types';

/**
 * Holds open an api connection to a specified chain within the ApiPromise in order to help
 * construct transactions for assets and estimating fees. The main public functions this
 * will expose are:
 * - createTransferTransaction
 * - fetchFeeInfo
 *
 * @constructor api ApiPromise provided by Polkadot-js
 * @constructor opts AssetsTransferApiOpts
 */
export class AssetsTransferApi {
	readonly _api: ApiPromise;
	readonly _opts: AssetsTransferApiOpts;
	readonly _info: Promise<ChainInfo>;
	readonly _safeXcmVersion: Promise<u32>;
	readonly _registry: ChainInfoRegistry;

	constructor(api: ApiPromise, opts: AssetsTransferApiOpts = {}) {
		this._api = api;
		this._opts = opts;
		this._info = this.fetchChainInfo();
		this._safeXcmVersion = this.fetchSafeXcmVersion();
		this._registry = parseRegistry(opts);
	}

	/**
	 * Create an asset transfer transaction. This can be either locally on a systems parachain or relay chain,
	 * or between chains using xcm.
	 *
	 * @param destChainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetIds Array of assetId's to be transferred
	 * @param amounts Array of the amounts of each token to transfer
	 * @param opts Options
	 */
	public async createTransferTransaction<T extends Format>(
		destChainId: string,
		destAddr: string,
		assetIds: string[],
		amounts: string[],
		opts?: TransferArgsOpts<T>
	): Promise<TxResult<T>> {
		const { _api, _info, _safeXcmVersion, _registry } = this;
		const { specName } = await _info;
		const safeXcmVersion = await _safeXcmVersion;
		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			specName.toLowerCase()
		);
		const isDestSystemParachain = SYSTEM_PARACHAINS_IDS.includes(destChainId);

		/**
		 * Sanitize the address to a hex, and ensure that the passed in SS58, or publickey
		 * is validated correctly.
		 */
		const addr = sanitizeAddress(destAddr);
		const isLocalSystemTx = isDestSystemParachain && isOriginSystemParachain;
		const isLocalRelayTx =
			destChainId === '0' && RELAY_CHAIN_NAMES.includes(specName.toLowerCase());
		/**
		 * Create a local asset transfer on a system parachain
		 */
		if (isLocalSystemTx || isLocalRelayTx) {
			/**
			 * This will throw a BaseError if the inputs are incorrect and don't
			 * fit the constraints for creating a local asset transfer.
			 */
			const localAssetType = checkLocalTxInput(
				assetIds,
				amounts,
				specName,
				this._registry
			); // Throws an error when any of the inputs are incorrect.
			const method = opts?.keepAlive ? 'transferKeepAlive' : 'transfer';
			if (isLocalSystemTx) {
				let tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
				let palletMethod: LocalTransferTypes;
				/**
				 *
				 */
				if (localAssetType === 'Balances') {
					tx =
						method === 'transferKeepAlive'
							? balances.transferKeepAlive(_api, addr, amounts[0])
							: balances.transfer(_api, addr, amounts[0]);
					palletMethod = `balances::${method}`;
				} else {
					tx =
						method === 'transferKeepAlive'
							? assets.transferKeepAlive(_api, addr, assetIds[0], amounts[0])
							: assets.transfer(_api, addr, assetIds[0], amounts[0]);
					palletMethod = `assets::${method}`;
				}
				return this.constructFormat(
					tx,
					'local',
					null,
					palletMethod,
					opts?.format
				);
			} else {
				/**
				 * By default local transaction on a relay chain will always be from the balances pallet
				 */
				const palletMethod: LocalTransferTypes = `balances::${method}`;
				const tx =
					method === 'transferKeepAlive'
						? balances.transferKeepAlive(_api, addr, amounts[0])
						: balances.transfer(_api, addr, amounts[0]);
				return this.constructFormat(
					tx,
					'local',
					null,
					palletMethod,
					opts?.format
				);
			}
		}

		const xcmDirection = this.establishDirection(destChainId, specName);
		const xcmVersion =
			opts?.xcmVersion === undefined
				? safeXcmVersion.toNumber()
				: opts.xcmVersion;
		checkXcmVersion(xcmVersion); // Throws an error when the xcmVersion is not supported.
		checkXcmTxInputs(
			assetIds,
			amounts,
			xcmDirection,
			destChainId,
			specName,
			_registry
		);

		const assetType = this.fetchAssetType(
			specName,
			destChainId,
			assetIds,
			xcmDirection
		);

		let txMethod: Methods;
		let transaction: SubmittableExtrinsic<'promise', ISubmittableResult>;
		if (assetType === AssetType.Foreign) {
			if (opts?.isLimited) {
				txMethod = 'limitedReserveTransferAssets';
				transaction = limitedReserveTransferAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					specName,
					opts?.weightLimit
					opts?.paysWithFeeOrigin
				);
			} else {
				txMethod = 'reserveTransferAssets';
				transaction = reserveTransferAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					specName
				);
			}
		} else {
			if (opts?.isLimited) {
				txMethod = 'limitedTeleportAssets';
				transaction = limitedTeleportAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					specName,
					opts?.weightLimit
				);
			} else {
				txMethod = 'teleportAssets';
				transaction = teleportAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					specName
				);
			}
		}

		return this.constructFormat<T>(
			transaction,
			xcmDirection,
			xcmVersion,
			txMethod,
			opts?.format
		);
	}
	/**
	 * Fetch estimated fee information for an extrinsic
	 *
	 * @param tx A polkadot-js submittable extrinsic
	 * @param format The format the tx is in
	 */
	public async fetchFeeInfo<T extends Format>(
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		format?: T
	): Promise<RuntimeDispatchInfo | RuntimeDispatchInfoV1 | null> {
		const { _api } = this;
		const fmt = format ? format : 'payload';

		if (fmt === 'payload') {
			const payload = _api.registry
				.createType('ExtrinsicPayload', tx, {
					version: tx.version,
				})
				.toHex();

			return _api.call.transactionPaymentApi.queryInfo(payload, payload.length);
		} else if (fmt === 'call') {
			const call = _api.registry
				.createType('Call', {
					callIndex: tx.callIndex,
					args: tx.args,
				})
				.toHex();

			return _api.call.transactionPaymentApi.queryInfo(call, call.length);
		} else if (fmt === 'submittable') {
			const ext = _api.registry.createType('Extrinsic', tx);
			const u8a = ext.toU8a();

			return _api.call.transactionPaymentApi.queryInfo(u8a, u8a.length);
		}

		return null;
	}

	/**
	 * Fetch runtime information based on the connected chain.
	 *
	 * @param api ApiPromise
	 */
	private async fetchChainInfo(): Promise<ChainInfo> {
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
	private establishDirection(destChainId: string, specName: string): Direction {
		const { _api } = this;
		const isSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			specName.toLowerCase()
		);
		const isDestIdSystemPara = SYSTEM_PARACHAINS_IDS.includes(destChainId);

		/**
		 * Check if the origin is a System Parachain
		 */
		if (isSystemParachain && destChainId === '0') {
			return Direction.SystemToRelay;
		}

		if (isSystemParachain && destChainId !== '0') {
			return Direction.SystemToPara;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (_api.query.paras && isDestIdSystemPara) {
			return Direction.RelayToSystem;
		}

		if (_api.query.paras && !isDestIdSystemPara) {
			return Direction.RelayToPara;
		}

		/**
		 * Check if the origin is a Parachain or Parathread
		 */
		if (_api.query.polkadotXcm && !isDestIdSystemPara) {
			throw Error('ParaToRelay is not yet implemented');

			return Direction.ParaToRelay;
		}

		if (_api.query.polkadotXcm) {
			throw Error('ParaToPara is not yet implemented');

			return Direction.ParaToPara;
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
		direction: Direction | 'local',
		xcmVersion: number | null = null,
		method: Methods,
		format?: T
	): TxResult<T> {
		const { _api } = this;
		const fmt = format ? format : 'payload';
		const result: TxResult<T> = {
			direction,
			xcmVersion,
			method,
			format: fmt as Format | 'local',
			tx: '' as ConstructedFormat<T>,
		};

		if (fmt === 'call') {
			result.tx = _api.registry
				.createType('Call', {
					callIndex: tx.callIndex,
					args: tx.args,
				})
				.toHex() as ConstructedFormat<T>;
		}

		if (fmt === 'submittable') {
			result.tx = tx as ConstructedFormat<T>;
		}

		if (fmt === 'payload') {
			result.tx = _api.registry
				.createType('ExtrinsicPayload', tx, {
					version: tx.version,
				})
				.toHex() as ConstructedFormat<T>;
		}

		return result;
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

	private fetchAssetType(
		specName: string,
		destChainId: string,
		assets: string[],
		xcmDirection: Direction
	): AssetType {
		if (xcmDirection === 'RelayToSystem' || xcmDirection === 'SystemToRelay') {
			return AssetType.Native;
		}

		if (xcmDirection === 'RelayToPara') {
			return AssetType.Foreign;
		}

		const relayChainName = findRelayChain(specName, this._registry);
		const relayChainInfo = this._registry[relayChainName];

		/**
		 * We can assume all the assets in `assets` are either foreign or native since we check
		 * all possible cases in `checkXcmTxInputs`.
		 */
		const { assetsInfo, tokens } = relayChainInfo[destChainId];
		const assetIdsAsStr = Object.keys(assetsInfo).map((num) => num.toString());

		if (assetIdsAsStr.includes(assets[0]) || tokens.includes(assets[0])) {
			return AssetType.Native;
		} else {
			return AssetType.Foreign;
		}
	}
	/**
	 * Decodes the hex of an extrinsic into a string readable format
	 *
	 * @param encodedTransaction the hex of an extrinsic tx
	 * @param format The format the tx is in
	 */
	public decodeExtrinsic<T extends Format>(
		encodedTransaction: string,
		format: T
	): string {
		const { _api } = this;
		const fmt = format ? format : 'payload';

		if (fmt === 'payload') {
			const extrinsicPayload = _api.registry.createType(
				'ExtrinsicPayload',
				encodedTransaction,
				{
					version: 4,
				}
			);

			const extrinsicMethodInfo = extrinsicPayload.method.toHuman()?.toString();

			if (extrinsicMethodInfo) {
				return extrinsicMethodInfo;
			}
		} else if (fmt === 'call') {
			const call = _api.registry.createType('Call', encodedTransaction);

			return call.toString();
		} else if (fmt === 'submittable') {
			const extrinsic = _api.registry.createType(
				'Extrinsic',
				encodedTransaction
			);

			return extrinsic.method.toString();
		}

		return '';
	}
}
