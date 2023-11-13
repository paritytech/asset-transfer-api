// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import type { RuntimeDispatchInfo, RuntimeDispatchInfoV1 } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import BN from 'bn.js';

import { RELAY_CHAIN_IDS, RELAY_CHAIN_NAMES, SYSTEM_PARACHAINS_NAMES } from './consts';
import * as assets from './createCalls/assets';
import * as balances from './createCalls/balances';
import * as foreignAssets from './createCalls/foreignAssets';
import * as poolAssets from './createCalls/poolAssets';
import {
	limitedReserveTransferAssets,
	limitedTeleportAssets,
	reserveTransferAssets,
	teleportAssets,
	transferMultiAsset,
	transferMultiAssets,
	transferMultiAssetWithFee,
} from './createXcmCalls';
import { establishXcmPallet, XcmPalletName } from './createXcmCalls/util/establishXcmPallet';
import { assetIdsContainRelayAsset } from './createXcmTypes/util/assetIdsContainsRelayAsset';
import { getAssetId } from './createXcmTypes/util/getAssetId';
import { isParachain } from './createXcmTypes/util/isParachain';
import { isParachainPrimaryNativeAsset } from './createXcmTypes/util/isParachainPrimaryNativeAsset';
import { isSystemChain } from './createXcmTypes/util/isSystemChain';
import { multiLocationAssetIsParachainsNativeAsset } from './createXcmTypes/util/multiLocationAssetIsParachainsNativeAsset';
import {
	BaseError,
	BaseErrorsEnum,
	checkBaseInputOptions,
	checkBaseInputTypes,
	checkLocalTxInput,
	checkXcmTxInputs,
	checkXcmVersion,
} from './errors';
import { Registry } from './registry';
import { sanitizeAddress } from './sanitize/sanitizeAddress';
import {
	AssetCallType,
	AssetTransferApiOpts,
	AssetType,
	ConstructedFormat,
	Direction,
	Format,
	LocalTransferTypes,
	Methods,
	TransferArgsOpts,
	TxResult,
	UnsignedTransaction,
	XcmDirection,
} from './types';
import { resolveMultiLocation } from './util/resolveMultiLocation';
import { validateNumber } from './validate';

/**
 * Holds open an api connection to a specified chain within the ApiPromise in order to help
 * construct transactions for assets and estimating fees.
 *
 * ```ts
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 *
 * const main = () => {
 *   const { api, specName, safeXcmVersion } = await constructApiPromise('wss://some_ws_url');
 *   const assetsApi = new AssetTransferApi(api, specName, safeXcmVersion);
 * }
 * ```
 *
 * @constructor api ApiPromise provided by Polkadot-js
 * @constructor specName The specName of the provided chains api
 * @constructor safeXcmVersion The safeXcmVersion of the chain.
 * @constructor opts AssetTransferApiOpts
 */
export class AssetTransferApi {
	readonly _api: ApiPromise;
	readonly _opts: AssetTransferApiOpts;
	readonly _specName: string;
	readonly _safeXcmVersion: number;
	readonly registry: Registry;

	constructor(api: ApiPromise, specName: string, safeXcmVersion: number, opts: AssetTransferApiOpts = {}) {
		this._api = api;
		this._opts = opts;
		this._specName = specName;
		this._safeXcmVersion = safeXcmVersion;
		this.registry = new Registry(specName, this._opts);
	}

	/**
	 * Create an asset transfer transaction. This can be either locally on a systems parachain or relay chain,
	 * or between chains using xcm.
	 *
	 * ```ts
	 * import { TxResult } from '@substrate/asset-transfer-api'
	 *
	 * let callInfo: TxResult<'call'>;
	 * try {
	 *   callInfo = await assetsApi.createTransferTransaction(
	 *     '1000',
	 *     '5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
	 *     ['WND'],
	 *     ['1000000000000'],
	 *     {
	 *       format: 'call',
	 *       isLimited: true,
	 *       xcmVersion: 2,
	 *     }
	 *   )
	 * } catch (e) {
	 *   console.error(e);
	 *   throw Error(e);
	 * }
	 * ```
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
		opts: TransferArgsOpts<T> = {}
	): Promise<TxResult<T>> {
		const {
			format,
			paysWithFeeDest,
			paysWithFeeOrigin,
			isLimited,
			weightLimit,
			xcmVersion,
			keepAlive,
			transferLiquidToken,
			sendersAddr,
		} = opts;
		/**
		 * Ensure that the options passed in are compatible with eachother.
		 * It will throw an error if any are incorrect.
		 */
		checkBaseInputOptions(opts, this._specName);
		/**
		 * Ensure all the inputs are the corrects primitive and or object types.
		 * It will throw an error if any are incorrect.
		 */
		checkBaseInputTypes(destChainId, destAddr, assetIds, amounts);

		const { _api, _specName, _safeXcmVersion, registry } = this;
		const originChainId = registry.lookupChainIdBySpecName(_specName);
		const relayChainID = RELAY_CHAIN_IDS[0];
		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(_specName.toLowerCase());
		const isOriginParachain = isParachain(originChainId);
		const isDestRelayChain = destChainId === relayChainID;
		const isDestSystemParachain = isSystemChain(destChainId);
		const isDestParachain = isParachain(destChainId);
		const isLiquidTokenTransfer = transferLiquidToken === true;

		/**
		 * Sanitize the address to a hex, and ensure that the passed in SS58, or publickey
		 * is validated correctly.
		 */
		const addr = sanitizeAddress(destAddr);

		const isLocalSystemTx = isOriginSystemParachain && isDestSystemParachain && originChainId === destChainId;
		const isLocalRelayTx = destChainId === '0' && RELAY_CHAIN_NAMES.includes(_specName.toLowerCase());
		const isLocalTx = isLocalRelayTx || isLocalSystemTx;
		const nativeRelayChainAsset = registry.currentRelayRegistry[relayChainID].tokens[0];
		const xcmDirection = this.establishDirection(
			isLocalTx,
			isDestRelayChain,
			isDestSystemParachain,
			isDestParachain,
			isOriginSystemParachain,
			isOriginParachain
		);
		const isForeignAssetsTransfer: boolean = this.checkIsForeignAssetTransfer(assetIds);
		const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(registry, _specName, xcmDirection, assetIds[0]);
		const xcmPallet = establishXcmPallet(_api, xcmDirection, isForeignAssetsTransfer, isPrimaryParachainNativeAsset);
		const declaredXcmVersion = xcmVersion === undefined ? _safeXcmVersion : xcmVersion;
		checkXcmVersion(declaredXcmVersion); // Throws an error when the xcmVersion is not supported.

		/**
		 * Create a local asset transfer on a system parachain
		 */
		if (isLocalSystemTx || isLocalRelayTx) {
			let assetId = assetIds[0];
			const amount = amounts[0];
			const isValidNumber = validateNumber(assetId);
			let isNativeRelayChainAsset = false;
			if (assetIds.length === 0 || nativeRelayChainAsset.toLowerCase() === assetId.toLowerCase()) {
				isNativeRelayChainAsset = true;
			}

			if (xcmDirection === Direction.SystemToSystem && !isValidNumber && !isNativeRelayChainAsset) {
				// for SystemToSystem, assetId is not the native relayChains asset and is not a number
				// check for the general index of the assetId and assign the correct value for the local tx
				// throws an error if the general index is not found
				assetId = await getAssetId(_api, registry, assetId, _specName, declaredXcmVersion, isForeignAssetsTransfer);
			}

			/**
			 * This will throw a BaseError if the inputs are incorrect and don't
			 * fit the constraints for creating a local asset transfer.
			 */
			const localAssetType = await checkLocalTxInput(
				_api,
				assetIds,
				amounts,
				_specName,
				registry,
				declaredXcmVersion,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer
			); // Throws an error when any of the inputs are incorrect.
			const method = keepAlive ? 'transferKeepAlive' : 'transfer';

			if (isLocalSystemTx) {
				let tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
				let palletMethod: LocalTransferTypes;

				if (localAssetType === 'Balances') {
					tx =
						method === 'transferKeepAlive'
							? balances.transferKeepAlive(_api, addr, amount)
							: balances.transfer(_api, addr, amount);
					palletMethod = `balances::${method}`;
				} else if (localAssetType === 'Assets') {
					tx =
						method === 'transferKeepAlive'
							? assets.transferKeepAlive(_api, addr, assetId, amount)
							: assets.transfer(_api, addr, assetId, amount);
					palletMethod = `assets::${method}`;
				} else if (localAssetType === 'PoolAssets') {
					tx =
						method === 'transferKeepAlive'
							? poolAssets.transferKeepAlive(_api, addr, assetId, amount)
							: poolAssets.transfer(_api, addr, assetId, amount);
					palletMethod = `poolAssets::${method}`;
				} else {
					const multiLocation = resolveMultiLocation(assetId, declaredXcmVersion);
					tx =
						method === 'transferKeepAlive'
							? foreignAssets.transferKeepAlive(_api, addr, multiLocation, amount)
							: foreignAssets.transfer(_api, addr, multiLocation, amount);
					palletMethod = `foreignAssets::${method}`;
				}

				return await this.constructFormat(tx, 'local', null, palletMethod, destChainId, _specName, {
					format,
					paysWithFeeOrigin,
				});
			} else {
				/**
				 * By default local transaction on a relay chain will always be from the balances pallet
				 */
				const palletMethod: LocalTransferTypes = `balances::${method}`;
				const tx =
					method === 'transferKeepAlive'
						? balances.transferKeepAlive(_api, addr, amount)
						: balances.transfer(_api, addr, amount);
				return this.constructFormat(tx, 'local', null, palletMethod, destChainId, _specName, {
					format,
					paysWithFeeOrigin,
				});
			}
		}

		await checkXcmTxInputs(
			_api,
			destChainId,
			assetIds,
			amounts,
			xcmDirection,
			xcmPallet,
			_specName,
			registry,
			isForeignAssetsTransfer,
			isLiquidTokenTransfer,
			isPrimaryParachainNativeAsset,
			{
				xcmVersion: declaredXcmVersion,
				paysWithFeeDest,
				isLimited,
				weightLimit,
			}
		);

		const assetType = this.fetchAssetType(xcmDirection, isForeignAssetsTransfer);
		const assetCallType = this.fetchCallType(
			originChainId,
			destChainId,
			assetIds,
			xcmDirection,
			assetType,
			isForeignAssetsTransfer,
			isPrimaryParachainNativeAsset,
			registry
		);

		let txMethod: Methods;
		let transaction: SubmittableExtrinsic<'promise', ISubmittableResult>;
		if (
			(xcmPallet === XcmPalletName.xTokens || xcmPallet === XcmPalletName.xtokens) &&
			(xcmDirection === Direction.ParaToSystem ||
				xcmDirection === Direction.ParaToPara ||
				xcmDirection === Direction.ParaToRelay)
		) {
			// This ensures paraToRelay always uses `transferMultiAsset`.
			if (xcmDirection === Direction.ParaToRelay || (!paysWithFeeDest && assetIds.length < 2)) {
				txMethod = 'transferMultiAsset';
				transaction = await transferMultiAsset(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					xcmPallet,
					{
						isLimited,
						weightLimit,
						paysWithFeeDest,
						isForeignAssetsTransfer,
						isLiquidTokenTransfer,
					}
				);
			} else if (paysWithFeeDest && paysWithFeeDest.includes('parents')) {
				txMethod = 'transferMultiAssetWithFee';
				transaction = await transferMultiAssetWithFee(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					xcmPallet,
					{
						isLimited,
						weightLimit,
						paysWithFeeDest,
						isForeignAssetsTransfer,
						isLiquidTokenTransfer,
					}
				);
			} else {
				txMethod = 'transferMultiAssets';
				transaction = await transferMultiAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					xcmPallet,
					{
						isLimited,
						weightLimit,
						paysWithFeeDest,
						isForeignAssetsTransfer,
						isLiquidTokenTransfer,
					}
				);
			}
		} else if (assetCallType === AssetCallType.Reserve) {
			if (isLimited) {
				txMethod = 'limitedReserveTransferAssets';
				transaction = await limitedReserveTransferAssets(
					_api,
					xcmDirection as XcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					{
						isLimited,
						weightLimit,
						paysWithFeeDest,
						isLiquidTokenTransfer,
						isForeignAssetsTransfer,
					}
				);
			} else {
				txMethod = 'reserveTransferAssets';
				transaction = await reserveTransferAssets(
					_api,
					xcmDirection as XcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					{
						paysWithFeeDest,
						isLiquidTokenTransfer,
						isForeignAssetsTransfer,
					}
				);
			}
		} else {
			if (isLimited) {
				txMethod = 'limitedTeleportAssets';
				transaction = await limitedTeleportAssets(
					_api,
					xcmDirection as XcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					{
						isLimited,
						weightLimit,
						paysWithFeeDest,
						isForeignAssetsTransfer,
						isLiquidTokenTransfer: false,
					}
				);
			} else {
				txMethod = 'teleportAssets';
				transaction = await teleportAssets(
					_api,
					xcmDirection as XcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					declaredXcmVersion,
					_specName,
					this.registry,
					{
						paysWithFeeDest,
						isForeignAssetsTransfer,
						isLiquidTokenTransfer: false,
					}
				);
			}
		}

		return this.constructFormat<T>(transaction, xcmDirection, declaredXcmVersion, txMethod, destChainId, _specName, {
			format,
			paysWithFeeOrigin,
			sendersAddr,
		});
	}
	/**
	 * Fetch estimated fee information for an extrinsic
	 *
	 * ```ts
	 * const feeInfo = assetApi.fetchFeeInfo(tx, 'call');
	 * console.log(feeInfo.toJSON());
	 * ```
	 *
	 * @param tx a payload, call or submittable
	 * @param format The format the tx is in
	 */
	public async fetchFeeInfo<T extends Format>(
		tx: ConstructedFormat<T>,
		format: T
	): Promise<RuntimeDispatchInfo | RuntimeDispatchInfoV1 | null> {
		const { _api } = this;

		if (format === 'payload') {
			const extrinsicPayload = _api.registry.createType('ExtrinsicPayload', tx, {
				version: EXTRINSIC_VERSION,
			});

			const ext = _api.registry.createType(
				'Extrinsic',
				{ method: extrinsicPayload.method },
				{ version: EXTRINSIC_VERSION }
			);
			const u8a = ext.toU8a();

			return await _api.call.transactionPaymentApi.queryInfo(ext, u8a.length);
		} else if (format === 'call') {
			const ext = _api.registry.createType('Extrinsic', { method: tx }, { version: EXTRINSIC_VERSION });
			const u8a = ext.toU8a();

			return await _api.call.transactionPaymentApi.queryInfo(ext, u8a.length);
		} else if (format === 'submittable') {
			const ext = _api.registry.createType('Extrinsic', tx, {
				version: EXTRINSIC_VERSION,
			});
			const u8a = ext.toU8a();

			return await _api.call.transactionPaymentApi.queryInfo(ext, u8a.length);
		}

		return null;
	}
	/**
	 * Decodes the hex of an extrinsic into a string readable format.
	 *
	 * ```ts
	 * const decodedExt = assetsApi.decodeExtrinsic(tx, 'call');
	 * console.log(JSON.parse(decodedExt));
	 * ```
	 *
	 * @param encodedTransaction the hex of an extrinsic tx
	 * @param format The format the tx is in
	 */
	public decodeExtrinsic<T extends Format>(encodedTransaction: string, format: T): string {
		const { _api } = this;
		const fmt = format ? format : 'payload';

		if (fmt === 'payload') {
			const extrinsicPayload = _api.registry.createType('ExtrinsicPayload', encodedTransaction, {
				version: EXTRINSIC_VERSION,
			});

			const call = _api.registry.createType('Call', extrinsicPayload.method);
			const decodedMethodInfo = JSON.stringify(call.toHuman());

			return decodedMethodInfo;
		} else if (fmt === 'call') {
			const call = _api.registry.createType('Call', encodedTransaction);

			const decodedMethodInfo = JSON.stringify(call.toHuman());

			return decodedMethodInfo;
		} else if (fmt === 'submittable') {
			const extrinsic = _api.registry.createType('Extrinsic', encodedTransaction);

			const decodedMethodInfo = JSON.stringify(extrinsic.method.toHuman());

			return decodedMethodInfo;
		}

		return '';
	}
	/**
	 * Declare the direction of the xcm message.
	 *
	 * @param destChainId
	 * @param specName
	 */
	private establishDirection(
		isLocal: boolean,
		destIsRelayChain: boolean,
		destIsSystemParachain: boolean,
		destIsParachain: boolean,
		originIsSystemParachain: boolean,
		originIsParachain: boolean
	): Direction {
		if (isLocal) {
			return Direction.Local;
		}

		const { _api } = this;

		/**
		 * Check if the origin is a System Parachain
		 */
		if (originIsSystemParachain && destIsRelayChain) {
			return Direction.SystemToRelay;
		}

		if (originIsSystemParachain && destIsSystemParachain) {
			return Direction.SystemToSystem;
		}

		if (originIsSystemParachain && destIsParachain) {
			return Direction.SystemToPara;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (_api.query.paras && destIsSystemParachain) {
			return Direction.RelayToSystem;
		}

		if (_api.query.paras && destIsParachain) {
			return Direction.RelayToPara;
		}

		/**
		 * Check if the origin is a Parachain or Parathread
		 */
		if (originIsParachain && destIsRelayChain) {
			return Direction.ParaToRelay;
		}

		/**
		 * Check if the origin is a parachain, and the destination is a system parachain.
		 */
		if (originIsParachain && destIsSystemParachain) {
			return Direction.ParaToSystem;
		}

		if (originIsParachain && destIsParachain) {
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
	private async constructFormat<T extends Format>(
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		direction: Direction | 'local',
		xcmVersion: number | null = null,
		method: Methods,
		dest: string,
		origin: string,
		opts: { format?: T; paysWithFeeOrigin?: string; sendersAddr?: string }
	): Promise<TxResult<T>> {
		const { format, paysWithFeeOrigin, sendersAddr } = opts;
		const fmt = format ? format : 'payload';
		const result: TxResult<T> = {
			origin,
			dest: this.getDestinationSpecName(dest, this.registry),
			direction,
			xcmVersion,
			method,
			format: fmt as Format | 'local',
			tx: '' as ConstructedFormat<T>,
		};

		if (fmt === 'call') {
			result.tx = tx.method.toHex() as ConstructedFormat<T>;
		}

		if (fmt === 'submittable') {
			result.tx = tx as ConstructedFormat<T>;
		}

		if (fmt === 'payload') {
			// We can type cast here since the api will ensure if the format is a paylaod that the
			// sendersAddr must be present.
			const addr = sendersAddr as string;
			result.tx = (await this.createPayload(tx, {
				paysWithFeeOrigin,
				sendersAddr: addr,
			})) as ConstructedFormat<T>;
		}

		return result;
	}

	private fetchAssetType(xcmDirection: Direction, isForeignAssetsTransfer?: boolean): AssetType {
		if (
			xcmDirection === Direction.RelayToSystem ||
			xcmDirection === Direction.SystemToRelay ||
			(xcmDirection === Direction.SystemToSystem && !isForeignAssetsTransfer)
		) {
			return AssetType.Native;
		}

		/**
		 * When MultiLocation of System parachains are stored for trusted assets across
		 * parachains then this logic will change. But for now all assets, and native tokens
		 * transferred from a System parachain to a parachain it should use a reserve transfer.
		 */
		if (xcmDirection === Direction.RelayToPara || xcmDirection === Direction.SystemToPara) {
			return AssetType.Foreign;
		}

		return AssetType.Foreign;
	}

	private fetchCallType(
		originChainId: string,
		destChainId: string,
		assetIds: string[],
		xcmDirection: Direction,
		assetType: AssetType,
		isForeignAssetsTransfer: boolean,
		isParachainPrimaryNativeAsset: boolean,
		registry: Registry
	): AssetCallType {
		// relay to system -> teleport
		// system to relay -> teleport
		if (xcmDirection === Direction.RelayToSystem || xcmDirection === Direction.SystemToRelay) {
			return AssetCallType.Teleport;
		}

		// relay to para -> reserve
		if (xcmDirection === Direction.RelayToPara) {
			return AssetCallType.Reserve;
		}

		let originIsMultiLocationsNativeChain = false;
		let destIsMultiLocationsNativeChain = false;

		if (isForeignAssetsTransfer) {
			if (xcmDirection === Direction.ParaToSystem) {
				// check if the asset(s) are native to the origin chain
				for (const assetId of assetIds) {
					if (multiLocationAssetIsParachainsNativeAsset(originChainId, assetId)) {
						originIsMultiLocationsNativeChain = true;
						break;
					}
				}
			}
			// check if the asset(s) are going to origin chain
			// if so we return a teleport
			for (const assetId of assetIds) {
				if (multiLocationAssetIsParachainsNativeAsset(destChainId, assetId)) {
					destIsMultiLocationsNativeChain = true;
					break;
				}
			}
		}

		// system to system native asset -> teleport
		if (assetType === AssetType.Native && xcmDirection === Direction.SystemToSystem) {
			return AssetCallType.Teleport;
		}

		// system to system foreign asset -> not allowed
		if (assetType === AssetType.Foreign && xcmDirection === Direction.SystemToSystem) {
			throw new BaseError(
				`Unable to send foreign assets in direction ${xcmDirection}`,
				BaseErrorsEnum.InvalidDirection
			);
		}

		// system to para native asset -> reserve
		if (assetType === AssetType.Native && xcmDirection === Direction.SystemToPara) {
			return AssetCallType.Reserve;
		}

		// system to para foreign asset (non native to destination) -> reserve
		if (
			assetType === AssetType.Foreign &&
			xcmDirection === Direction.SystemToPara &&
			!destIsMultiLocationsNativeChain
		) {
			return AssetCallType.Reserve;
		}

		// system to para foreign asset (native to destination) -> teleport
		if (assetType === AssetType.Foreign && xcmDirection === Direction.SystemToPara && destIsMultiLocationsNativeChain) {
			return AssetCallType.Teleport;
		}

		// para to para -> reserve
		if (xcmDirection === Direction.ParaToPara) {
			return AssetCallType.Reserve;
		}

		// para to system only when the assets are native to origin -> teleport
		if (
			(xcmDirection === Direction.ParaToSystem &&
				!assetIdsContainRelayAsset(assetIds, registry) &&
				originIsMultiLocationsNativeChain) ||
			isParachainPrimaryNativeAsset
		) {
			return AssetCallType.Teleport;
		}

		// para to system when assets contain the relay asset or the assets arent native to the origin -> reserve
		if (
			(xcmDirection === Direction.ParaToSystem && assetIdsContainRelayAsset(assetIds, registry)) ||
			!originIsMultiLocationsNativeChain
		) {
			return AssetCallType.Reserve;
		}

		// para to relay -> reserve
		if (xcmDirection === Direction.ParaToRelay) {
			return AssetCallType.Reserve;
		}

		return AssetCallType.Reserve;
	}
	/**
	 * returns an ExtrinsicPayload
	 *
	 * @param tx SubmittableExtrinsic<'promise', ISubmittableResult>
	 * @param paysWithFeeOrigin string
	 */
	private createPayload = async (
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		opts: { paysWithFeeOrigin?: string; sendersAddr: string }
	): Promise<`0x${string}`> => {
		const { paysWithFeeOrigin, sendersAddr } = opts;
		let assetId = new BN(0);

		// if a paysWithFeeOrigin is provided and the chain is of system origin
		// we assign the assetId to the value of paysWithFeeOrigin
		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(this._specName.toLowerCase());

		if (paysWithFeeOrigin && isOriginSystemParachain) {
			const isValidInt = validateNumber(paysWithFeeOrigin);

			if (!isValidInt) {
				throw new BaseError(
					`paysWithFeeOrigin value must be a valid number. Received: ${paysWithFeeOrigin}`,
					BaseErrorsEnum.InvalidInput
				);
			}

			assetId = new BN(paysWithFeeOrigin);
			const isSufficient = await this.checkAssetIsSufficient(assetId);

			if (!isSufficient) {
				throw new BaseError(
					`asset with assetId ${assetId.toString()} is not a sufficient asset to pay for fees`,
					BaseErrorsEnum.InvalidAsset
				);
			}
		}

		const lastHeader = await this._api.rpc.chain.getHeader();
		const blockNumber = this._api.registry.createType('BlockNumber', lastHeader.number.toNumber());
		const method = tx.method;
		const era = this._api.registry.createType('ExtrinsicEra', {
			current: lastHeader.number.toNumber(),
			period: 64,
		});

		const nonce = await this._api.rpc.system.accountNextIndex(sendersAddr);
		const unsignedPayload: UnsignedTransaction = {
			specVersion: this._api.runtimeVersion.specVersion.toHex(),
			transactionVersion: this._api.runtimeVersion.transactionVersion.toHex(),
			assetId,
			address: sendersAddr,
			blockHash: lastHeader.hash.toHex(),
			blockNumber: blockNumber.toHex(),
			era: era.toHex(),
			genesisHash: this._api.genesisHash.toHex(),
			method: method.toHex(),
			nonce: nonce.toHex(),
			signedExtensions: [
				'CheckNonZeroSender',
				'CheckSpecVersion',
				'CheckTxVersion',
				'CheckGenesis',
				'CheckMortality',
				'CheckNonce',
				'CheckWeight',
				'ChargeTransactionPayment',
			],
			tip: this._api.registry.createType('Compact<Balance>', 0).toHex(),
			version: tx.version,
		};

		const extrinsicPayload = this._api.registry.createType('ExtrinsicPayload', unsignedPayload, {
			version: unsignedPayload.version,
		});

		return extrinsicPayload.toHex();
	};

	/**
	 * checks the chains state to determine whether an asset is valid
	 * if it is valid, it returns whether it is marked as sufficient for paying fees
	 *
	 * @param assetId number
	 * @returns Promise<boolean>
	 */
	private checkAssetIsSufficient = async (assetId: BN): Promise<boolean> => {
		try {
			const asset = (await this._api.query.assets.asset(assetId)).unwrap();

			if (asset.isSufficient.toString().toLowerCase() === 'true') {
				return true;
			}

			return false;
		} catch (err: unknown) {
			throw new BaseError(`assetId ${assetId.toString()} does not match a valid asset`, BaseErrorsEnum.InvalidAsset);
		}
	};

	/**
	 * Return the specName of the destination chainId
	 *
	 * @param destChainId string
	 * @param registry Registry
	 * @returns string
	 */
	private getDestinationSpecName(destId: string, registry: Registry): string {
		if (destId === '0') {
			return registry.relayChain;
		}

		const lookup = registry.lookupParachainInfo(destId);
		if (lookup.length === 0) {
			throw new BaseError(
				`Could not find any parachain information given the destId: ${destId}`,
				BaseErrorsEnum.InvalidInput
			);
		}

		return lookup[0].specName;
	}

	/**
	 * Returns if assetIds contains a values for a foreign asset transfer
	 *
	 * @param assetIds string[]
	 * @returns boolean
	 */
	private checkIsForeignAssetTransfer(assetIds: string[]): boolean {
		// if assetIds is empty it is not a multilocation foreign asset transfer
		if (assetIds.length === 0) {
			return false;
		}

		if (!assetIds[0].toLowerCase().includes('parents')) {
			return false;
		}

		return true;
	}
}
