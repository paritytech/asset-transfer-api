// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { GenericExtrinsicPayload } from '@polkadot/types/extrinsic';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import type { RuntimeDispatchInfo, RuntimeDispatchInfoV1 } from '@polkadot/types/interfaces';
import type { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import BN from 'bn.js';

import { CDN_URL, RELAY_CHAIN_IDS, RELAY_CHAIN_NAMES, SYSTEM_PARACHAINS_NAMES } from './consts';
import * as assets from './createCalls/assets';
import * as balances from './createCalls/balances';
import * as foreignAssets from './createCalls/foreignAssets';
import * as poolAssets from './createCalls/poolAssets';
import * as tokens from './createCalls/tokens';
import {
	limitedReserveTransferAssets,
	limitedTeleportAssets,
	transferAssets,
	transferMultiasset,
	transferMultiassets,
	transferMultiassetWithFee,
} from './createXcmCalls';
import { CreateXcmCallOpts } from './createXcmCalls/types';
import { establishXcmPallet, XcmPalletName } from './createXcmCalls/util/establishXcmPallet';
import { XTokensBaseArgs } from './createXcmCalls/xTokens/types';
import { UnionXcmMultiLocation } from './createXcmTypes/types';
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
	checkLocalParachainInput,
	checkLocalRelayInput,
	checkLocalSystemParachainInput,
	checkXcmTxInputs,
	checkXcmVersion,
} from './errors';
import { LocalTxType } from './errors/checkLocalTxInput/types';
import { Registry } from './registry';
import { ChainInfoKeys, ChainInfoRegistry } from './registry/types';
import { sanitizeAddress } from './sanitize/sanitizeAddress';
import {
	AssetCallType,
	AssetTransferApiOpts,
	AssetType,
	ChainOriginDestInfo,
	ConstructedFormat,
	Direction,
	Format,
	LocalTransferTypes,
	LocalTxChainType,
	LocalTxOpts,
	Methods,
	RegistryTypes,
	ResolvedCallInfo,
	TransferArgsOpts,
	TxResult,
	UnsignedTransaction,
	type XcmBaseArgs,
	XcmDirection,
	type XcmPalletCallSignature,
	type XcmPalletTxMethodTransactionMap,
	type XTokensCallSignature,
	type XTokensTxMethodTransactionMap,
} from './types';
import { callExistsInRuntime } from './util/callExistsInRuntime';
import { deepEqual } from './util/deepEqual';
import { resolveMultiLocation } from './util/resolveMultiLocation';
import { sanitizeKeys } from './util/sanitizeKeys';
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
	readonly api: ApiPromise;
	readonly opts: AssetTransferApiOpts<ChainInfoKeys>;
	readonly specName: string;
	readonly safeXcmVersion: number;
	readonly nativeRelayChainAsset: string;
	readonly originChainId: string;
	private registryConfig: {
		registryInitialized: boolean;
		registryType: RegistryTypes;
	};
	public registry: Registry;

	constructor(
		api: ApiPromise,
		specName: string,
		safeXcmVersion: number,
		opts: AssetTransferApiOpts<ChainInfoKeys> = {},
	) {
		this.api = api;
		this.opts = opts;
		this.specName = specName;
		this.safeXcmVersion = safeXcmVersion;
		this.registry = new Registry(specName, opts);
		this.registryConfig = {
			registryInitialized: false,
			registryType: opts.registryType ? opts.registryType : 'CDN',
		};
		this.nativeRelayChainAsset = this.registry.currentRelayRegistry[RELAY_CHAIN_IDS[0]].tokens[0];
		this.originChainId = this.registry.lookupChainIdBySpecName(this.specName);
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
		opts: TransferArgsOpts<T> = {},
	): Promise<TxResult<T>> {
		const { format, paysWithFeeDest, paysWithFeeOrigin, weightLimit, xcmVersion, transferLiquidToken, sendersAddr } =
			opts;

		if (!this.registryConfig.registryInitialized) {
			await this.initializeRegistry();
		}

		/**
		 * Ensure that the options passed in are compatible with eachother.
		 * It will throw an error if any are incorrect.
		 */
		checkBaseInputOptions(opts, this.specName);
		/**
		 * Ensure all the inputs are the corrects primitive and or object types.
		 * It will throw an error if any are incorrect.
		 */
		checkBaseInputTypes(destChainId, destAddr, assetIds, amounts);

		const { api, specName, safeXcmVersion, originChainId, registry } = this;
		const isLiquidTokenTransfer = transferLiquidToken === true;
		const chainOriginDestInfo = {
			isOriginSystemParachain: SYSTEM_PARACHAINS_NAMES.includes(specName.toLowerCase()),
			isOriginParachain: isParachain(originChainId),
			isDestRelayChain: destChainId === RELAY_CHAIN_IDS[0],
			isDestSystemParachain: isSystemChain(destChainId),
			isDestParachain: isParachain(destChainId),
		};

		/**
		 * Sanitize the address to a hex, and ensure that the passed in SS58, or publickey
		 * is validated correctly.
		 */
		const addr = sanitizeAddress(destAddr);

		const localTxChainType = this.establishLocalTxChainType(originChainId, destChainId, chainOriginDestInfo);
		const isLocalTx = localTxChainType !== LocalTxChainType.None;
		const xcmDirection = this.establishDirection(isLocalTx, chainOriginDestInfo);
		const isForeignAssetsTransfer: boolean = this.checkIsForeignAssetTransfer(assetIds);
		const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(registry, specName, xcmDirection, assetIds[0]);
		const xcmPallet = establishXcmPallet(api, xcmDirection);
		const declaredXcmVersion = xcmVersion === undefined ? safeXcmVersion : xcmVersion;
		checkXcmVersion(declaredXcmVersion); // Throws an error when the xcmVersion is not supported.

		/**
		 * Create a local asset transfer
		 */
		if (isLocalTx) {
			const LocalTxOpts = {
				...opts,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			};
			return this.createLocalTx(
				addr,
				assetIds,
				amounts,
				destChainId,
				declaredXcmVersion,
				xcmDirection,
				localTxChainType,
				LocalTxOpts,
			);
		}

		const baseArgs: XcmBaseArgs = {
			api: api,
			direction: xcmDirection as XcmDirection,
			destAddr: addr,
			assetIds,
			amounts,
			destChainId,
			xcmVersion: declaredXcmVersion,
			specName: specName,
			registry: this.registry,
		};

		const baseOpts = {
			weightLimit,
			paysWithFeeDest,
			isLiquidTokenTransfer,
			isForeignAssetsTransfer,
		};

		await checkXcmTxInputs(
			{ ...baseArgs, xcmPallet },
			{
				...baseOpts,
				isPrimaryParachainNativeAsset,
			},
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
			registry,
		);

		const [txMethod, transaction] = await this.resolveCall(
			assetIds,
			xcmPallet,
			xcmDirection,
			assetCallType,
			baseArgs,
			baseOpts,
			paysWithFeeDest,
		);

		return this.constructFormat<T>(transaction, xcmDirection, declaredXcmVersion, txMethod, destChainId, specName, {
			format,
			paysWithFeeOrigin,
			sendersAddr,
		});
	}

	/**
	 * Initialize the registry. This will only activate the registry for the CDN.
	 * If the `registryType` is `NPM` the initalization will exit since the AssetTransferApi
	 * initializes with the reigstry from the NPM package.
	 */
	public async initializeRegistry() {
		// Before any initialization the registry is already set to NPM type,
		// therefore we don't need to do any initialization.
		if (this.registryConfig.registryType === 'NPM') {
			this.registryConfig.registryInitialized = true;
			return;
		}
		let data;
		try {
			data = await fetch(CDN_URL);
		} catch (e) {
			throw new BaseError(
				'Failed fetching the registry from the CDN. If the issue persists, you may set the registryType to `NPM`',
				BaseErrorsEnum.InternalError,
			);
		}
		const fetchedRegistry = (await data.json()) as ChainInfoRegistry<ChainInfoKeys>;
		this.registry.setRegistry = fetchedRegistry;

		this.registryConfig.registryInitialized = true;
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
		format: T,
	): Promise<RuntimeDispatchInfo | RuntimeDispatchInfoV1 | null> {
		const { api } = this;

		if (format === 'payload') {
			const extrinsicPayload = api.registry.createType('ExtrinsicPayload', tx, {
				version: EXTRINSIC_VERSION,
			});

			const ext = api.registry.createType(
				'Extrinsic',
				{ method: extrinsicPayload.method },
				{ version: EXTRINSIC_VERSION },
			);
			const u8a = ext.toU8a();

			return await api.call.transactionPaymentApi.queryInfo(ext, u8a.length);
		} else if (format === 'call') {
			const ext = api.registry.createType('Extrinsic', { method: tx }, { version: EXTRINSIC_VERSION });
			const u8a = ext.toU8a();

			return await api.call.transactionPaymentApi.queryInfo(ext, u8a.length);
		} else if (format === 'submittable') {
			const ext = api.registry.createType('Extrinsic', tx, {
				version: EXTRINSIC_VERSION,
			});
			const u8a = ext.toU8a();

			return await api.call.transactionPaymentApi.queryInfo(ext, u8a.length);
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
		const { api } = this;
		const fmt = format ? format : 'payload';

		if (fmt === 'payload') {
			const extrinsicPayload = api.registry.createType('ExtrinsicPayload', encodedTransaction, {
				version: EXTRINSIC_VERSION,
			});

			const call = api.registry.createType('Call', extrinsicPayload.method);
			const decodedMethodInfo = JSON.stringify(call.toHuman());

			return decodedMethodInfo;
		} else if (fmt === 'call') {
			const call = api.registry.createType('Call', encodedTransaction);

			const decodedMethodInfo = JSON.stringify(call.toHuman());

			return decodedMethodInfo;
		} else if (fmt === 'submittable') {
			const extrinsic = api.registry.createType('Extrinsic', encodedTransaction);

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
	private establishDirection(isLocal: boolean, chainOriginDestInfo: ChainOriginDestInfo): Direction {
		if (isLocal) return Direction.Local;

		const { api } = this;
		const { isDestParachain, isDestRelayChain, isDestSystemParachain, isOriginParachain, isOriginSystemParachain } =
			chainOriginDestInfo;

		/**
		 * Check if the origin is a System Parachain
		 */
		if (isOriginSystemParachain && isDestRelayChain) {
			return Direction.SystemToRelay;
		}

		if (isOriginSystemParachain && isDestSystemParachain) {
			return Direction.SystemToSystem;
		}

		if (isOriginSystemParachain && isDestParachain) {
			return Direction.SystemToPara;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (api.query.paras && isDestSystemParachain) {
			return Direction.RelayToSystem;
		}

		if (api.query.paras && isDestParachain) {
			return Direction.RelayToPara;
		}

		/**
		 * Check if the origin is a Parachain or Parathread
		 */
		if (isOriginParachain && isDestRelayChain) {
			return Direction.ParaToRelay;
		}

		/**
		 * Check if the origin is a parachain, and the destination is a system parachain.
		 */
		if (isOriginParachain && isDestSystemParachain) {
			return Direction.ParaToSystem;
		}

		if (isOriginParachain && isDestParachain) {
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
		opts: { format?: T; paysWithFeeOrigin?: string; sendersAddr?: string },
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
		registry: Registry,
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
		opts: { paysWithFeeOrigin?: string; sendersAddr: string },
	): Promise<GenericExtrinsicPayload> => {
		const { paysWithFeeOrigin, sendersAddr } = opts;
		let assetId: BN | AnyJson = new BN(0);

		// if a paysWithFeeOrigin is provided and the chain is of system origin
		// we assign the assetId to the value of paysWithFeeOrigin
		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(this.specName.toLowerCase());

		if (paysWithFeeOrigin && isOriginSystemParachain) {
			const isValidInt = validateNumber(paysWithFeeOrigin);

			if (isValidInt) {
				assetId = new BN(paysWithFeeOrigin);
				const isSufficient = await this.checkAssetIsSufficient(assetId);

				if (!isSufficient) {
					throw new BaseError(
						`asset with assetId ${assetId.toString()} is not a sufficient asset to pay for fees`,
						BaseErrorsEnum.InvalidAsset,
					);
				}
			} else {
				const [isValidLpToken, feeAsset] = await this.checkAssetLpTokenPairExists(paysWithFeeOrigin);

				if (!isValidLpToken) {
					throw new BaseError(
						`assetId ${JSON.stringify(feeAsset)} is not a valid liquidity pool token for ${this.specName}`,
						BaseErrorsEnum.NoFeeAssetLpFound,
					);
				}

				assetId = JSON.parse(paysWithFeeOrigin) as AnyJson;
			}
		}

		const lastHeader = await this.api.rpc.chain.getHeader();
		const blockNumber = this.api.registry.createType('BlockNumber', lastHeader.number.toNumber());
		const method = tx.method;
		const era = this.api.registry.createType('ExtrinsicEra', {
			current: lastHeader.number.toNumber(),
			period: 64,
		});

		const nonce = await this.api.rpc.system.accountNextIndex(sendersAddr);
		const unsignedPayload: UnsignedTransaction = {
			specVersion: this.api.runtimeVersion.specVersion.toHex(),
			transactionVersion: this.api.runtimeVersion.transactionVersion.toHex(),
			assetId,
			address: sendersAddr,
			blockHash: lastHeader.hash.toHex(),
			blockNumber: blockNumber.toHex(),
			era: era.toHex(),
			genesisHash: this.api.genesisHash.toHex(),
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
				'ChargeAssetTxPayment',
			],
			tip: this.api.registry.createType('Compact<Balance>', 0).toHex(),
			version: tx.version,
		};

		const extrinsicPayload = this.api.registry.createType('ExtrinsicPayload', unsignedPayload, {
			version: unsignedPayload.version,
		});

		return extrinsicPayload;
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
			const asset = (await this.api.query.assets.asset(assetId)).unwrap();

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
				BaseErrorsEnum.InvalidInput,
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

	/**
	 * checks the chains state and determines whether an asset location is a part of a valid token liquidity pool pair
	 *
	 * @param paysWithFeeOrigin UnionXcmMultiLocation
	 * @returns Promise<boolean>
	 */
	private checkAssetLpTokenPairExists = async (
		paysWithFeeOrigin: string,
	): Promise<[boolean, UnionXcmMultiLocation]> => {
		let feeAsset: UnionXcmMultiLocation;

		try {
			feeAsset = sanitizeKeys(JSON.parse(paysWithFeeOrigin)) as UnionXcmMultiLocation;
		} catch (err: unknown) {
			throw new BaseError(
				`paysWithFeeOrigin value must be a valid asset location. Received: ${paysWithFeeOrigin}`,
				BaseErrorsEnum.InvalidInput,
			);
		}

		if (this.api.query.assetConversion !== undefined) {
			try {
				const liquidityPools = await this.api.query.assetConversion.pools.entries();

				for (const poolPairsData of liquidityPools) {
					const lpTokens = poolPairsData[0].toHuman(); // get asset location tuple
					const lpTokenLocations = lpTokens as UnionXcmMultiLocation[];

					// convert json into locations
					const firstLpToken = JSON.parse(
						JSON.stringify(lpTokenLocations[0][0]).replace(/(\d),/g, '$1'),
					) as UnionXcmMultiLocation;
					const secondLpToken = JSON.parse(
						JSON.stringify(lpTokenLocations[0][1]).replace(/(\d),/g, '$1'),
					) as UnionXcmMultiLocation;

					// check locations match paysWithFeeOrigin feeAsset
					if (deepEqual(sanitizeKeys(firstLpToken), feeAsset) || deepEqual(sanitizeKeys(secondLpToken), feeAsset)) {
						return [true, feeAsset];
					}
				}
			} catch (e) {
				throw new BaseError(
					`error querying ${this.specName} liquidity token pool assets: ${e as string}`,
					BaseErrorsEnum.InternalError,
				);
			}
		}

		return [false, feeAsset];
	};

	private establishLocalTxChainType(
		originChainId: string,
		destChainId: string,
		chainOriginDestInfo: ChainOriginDestInfo,
	): LocalTxChainType {
		const { isDestParachain, isDestSystemParachain, isOriginParachain, isOriginSystemParachain } = chainOriginDestInfo;

		if (isOriginSystemParachain && isDestSystemParachain && originChainId === destChainId) {
			return LocalTxChainType.System;
		} else if (destChainId === '0' && RELAY_CHAIN_NAMES.includes(this.specName.toLowerCase())) {
			return LocalTxChainType.Relay;
		} else if (isOriginParachain && isDestParachain && originChainId === destChainId) {
			return LocalTxChainType.Parachain;
		}

		return LocalTxChainType.None;
	}

	private async createLocalTx(
		addr: string,
		assetIds: string[],
		amounts: string[],
		destChainId: string,
		declaredXcmVersion: number,
		xcmDirection: Direction,
		localTxChainType: LocalTxChainType,
		opts: LocalTxOpts,
	) {
		const { api, specName } = this;
		let assetId = assetIds[0];
		const amount = amounts[0];
		const isValidNumber = validateNumber(assetId);
		let isNativeRelayChainAsset = false;
		if (assetIds.length === 0 || this.nativeRelayChainAsset.toLowerCase() === assetId.toLowerCase()) {
			isNativeRelayChainAsset = true;
		}

		if (xcmDirection === Direction.SystemToSystem && !isValidNumber && !isNativeRelayChainAsset) {
			// for SystemToSystem, assetId is not the native relayChains asset and is not a number
			// check for the general index of the assetId and assign the correct value for the local tx
			// throws an error if the general index is not found
			assetId = await getAssetId(
				this.api,
				this.registry,
				assetId,
				this.specName,
				declaredXcmVersion,
				opts.isForeignAssetsTransfer,
			);
		}
		const method = opts.keepAlive ? 'transferKeepAlive' : 'transfer';

		if (localTxChainType === LocalTxChainType.System) {
			const localAssetType = await checkLocalSystemParachainInput(
				this.api,
				assetIds,
				amounts,
				this.specName,
				this.registry,
				declaredXcmVersion,
				opts.isForeignAssetsTransfer,
				opts.isLiquidTokenTransfer,
			); // Throws an error when any of the inputs are incorrect.
			let tx: SubmittableExtrinsic<'promise', ISubmittableResult> | undefined;
			let palletMethod: LocalTransferTypes | undefined;

			if (localAssetType === LocalTxType.Balances) {
				tx =
					method === 'transferKeepAlive'
						? balances.transferKeepAlive(api, addr, amount)
						: balances.transfer(api, addr, amount);
				palletMethod = `balances::${method}`;
			} else if (localAssetType === LocalTxType.Assets) {
				tx =
					method === 'transferKeepAlive'
						? assets.transferKeepAlive(api, addr, assetId, amount)
						: assets.transfer(api, addr, assetId, amount);
				palletMethod = `assets::${method}`;
			} else if (localAssetType === LocalTxType.PoolAssets) {
				tx =
					method === 'transferKeepAlive'
						? poolAssets.transferKeepAlive(api, addr, assetId, amount)
						: poolAssets.transfer(api, addr, assetId, amount);
				palletMethod = `poolAssets::${method}`;
			} else if (localAssetType === LocalTxType.ForeignAssets) {
				const multiLocation = resolveMultiLocation(assetId, declaredXcmVersion);
				tx =
					method === 'transferKeepAlive'
						? foreignAssets.transferKeepAlive(api, addr, multiLocation, amount)
						: foreignAssets.transfer(api, addr, multiLocation, amount);
				palletMethod = `foreignAssets::${method}`;
			} else {
				throw new BaseError(
					'No supported pallets were found for local transfers. Supported pallets include: balances, tokens.',
					BaseErrorsEnum.PalletNotFound,
				);
			}

			return await this.constructFormat(tx, 'local', null, palletMethod, destChainId, this.specName, {
				...opts,
			});
		} else if (localTxChainType === LocalTxChainType.Parachain) {
			const localAssetType = checkLocalParachainInput(api, assetIds, amounts);
			/**
			 * If no asset is passed in then it's assumed that its a balance transfer.
			 * If an asset is passed in then it's a token transfer.
			 */
			if (localAssetType === LocalTxType.Balances) {
				const palletMethod: LocalTransferTypes = `balances::${method}`;
				const tx =
					method === 'transferKeepAlive'
						? balances.transferKeepAlive(api, addr, amount)
						: balances.transfer(api, addr, amount);
				return this.constructFormat(tx, 'local', null, palletMethod, destChainId, specName, {
					...opts,
				});
			} else if (localAssetType === LocalTxType.Tokens) {
				const palletMethod: LocalTransferTypes = `tokens::${method}`;
				const tx =
					method === 'transferKeepAlive'
						? tokens.transferKeepAlive(api, addr, assetIds[0], amount)
						: tokens.transfer(api, addr, assetIds[0], amount);
				return this.constructFormat(tx, 'local', null, palletMethod, destChainId, specName, {
					...opts,
				});
			} else {
				throw new BaseError(
					'No supported pallets were found for local transfers. Supported pallets include: balances, tokens.',
					BaseErrorsEnum.PalletNotFound,
				);
			}
		} else {
			checkLocalRelayInput(assetIds, amounts);
			/**
			 * By default local transaction on a relay chain will always be from the balances pallet
			 */
			const palletMethod: LocalTransferTypes = `balances::${method}`;
			const tx =
				method === 'transferKeepAlive'
					? balances.transferKeepAlive(api, addr, amount)
					: balances.transfer(api, addr, amount);
			return this.constructFormat(tx, 'local', null, palletMethod, destChainId, specName, {
				...opts,
			});
		}
	}

	private async resolveCall(
		assetIds: string[],
		xcmPallet: XcmPalletName,
		xcmDirection: Direction,
		assetCallType: AssetCallType,
		baseArgs: XcmBaseArgs | XTokensBaseArgs,
		baseOpts: CreateXcmCallOpts,
		paysWithFeeDest?: string,
	): Promise<ResolvedCallInfo> {
		const { api } = baseArgs;

		let txMethod: Methods | undefined = undefined;

		const isXtokensPallet = xcmPallet === XcmPalletName.xTokens || xcmPallet === XcmPalletName.xtokens;
		const isValidXtokensXCMDirection =
			xcmDirection === Direction.ParaToSystem ||
			xcmDirection === Direction.ParaToPara ||
			xcmDirection === Direction.ParaToRelay;

		if (isXtokensPallet && isValidXtokensXCMDirection) {
			// This ensures paraToRelay always uses `transferMultiAsset`.
			if (xcmDirection === Direction.ParaToRelay || (!paysWithFeeDest && assetIds.length < 2)) {
				txMethod = 'transferMultiasset';
			} else if (paysWithFeeDest && paysWithFeeDest.includes('parents')) {
				txMethod = 'transferMultiassetWithFee';
			} else {
				txMethod = 'transferMultiassets';
			}
		} else if (api.tx[xcmPallet] && api.tx[xcmPallet].transferAssets) {
			txMethod = 'transferAssets';
		} else if (assetCallType === AssetCallType.Reserve) {
			txMethod = 'limitedReserveTransferAssets';
		} else {
			txMethod = 'limitedTeleportAssets';
		}

		if (!callExistsInRuntime(api, txMethod, xcmPallet)) {
			throw new BaseError(
				`Did not find ${txMethod} from pallet ${xcmPallet} in the current runtime`,
				BaseErrorsEnum.RuntimeCallNotFound,
			);
		}

		const xTokensTxMethodToTransaction: XTokensTxMethodTransactionMap = {
			transferMultiasset: [transferMultiasset, [baseArgs, baseOpts]],
			transferMultiassetWithFee: [transferMultiassetWithFee, [baseArgs, baseOpts]],
			transferMultiassets: [transferMultiassets, [baseArgs, baseOpts]],
		};

		const xcmPalletTxMethodToTransaction: XcmPalletTxMethodTransactionMap = {
			limitedReserveTransferAssets: [limitedReserveTransferAssets, [baseArgs, baseOpts]],
			limitedTeleportAssets: [limitedTeleportAssets, [baseArgs, baseOpts]],
			transferAssets: [transferAssets, [baseArgs, baseOpts]],
		};

		let call: XTokensCallSignature | XcmPalletCallSignature;
		let args: XTokensBaseArgs | XcmBaseArgs;
		let opts: CreateXcmCallOpts;
		let transaction: SubmittableExtrinsic<'promise', ISubmittableResult>;

		if (isXtokensPallet) {
			[call, [args, opts]] = xTokensTxMethodToTransaction[txMethod];
			transaction = await call({ ...args, xcmPallet } as XTokensBaseArgs, opts);
		} else {
			[call, [args, opts]] = xcmPalletTxMethodToTransaction[txMethod];
			transaction = await (call as XcmPalletCallSignature)(args as XcmBaseArgs, opts);
		}

		return [txMethod, transaction];
	}
}
