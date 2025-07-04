import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { GenericExtrinsic, GenericExtrinsicPayload } from '@polkadot/types/extrinsic';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import type {
	CallDryRunEffects,
	RuntimeDispatchInfo,
	RuntimeDispatchInfoV1,
	VersionedMultiLocation,
	VersionedXcm,
	WeightV2,
	XcmDryRunApiError,
	XcmPaymentApiError,
} from '@polkadot/types/interfaces';
import type { AnyJson, AnyTuple, ISubmittableResult } from '@polkadot/types/types';
import type { Result, u128 } from '@polkadot/types-codec';

import {
	CDN_URL,
	MIN_XCM_VERSION_FOREIGN_ASSETS,
	RELAY_CHAIN_IDS,
	RELAY_CHAIN_NAMES,
	SYSTEM_PARACHAINS_NAMES,
} from './consts.js';
import * as assets from './createCalls/assets/index.js';
import * as balances from './createCalls/balances/index.js';
import * as foreignAssets from './createCalls/foreignAssets/index.js';
import * as poolAssets from './createCalls/poolAssets/index.js';
import * as tokens from './createCalls/tokens/index.js';
import {
	claimAssets,
	limitedReserveTransferAssets,
	limitedTeleportAssets,
	transferAssets,
	transferAssetsUsingTypeAndThen,
	transferMultiasset,
	transferMultiassets,
	transferMultiassetWithFee,
} from './createXcmCalls/index.js';
import { CreateXcmCallOpts } from './createXcmCalls/types.js';
import { establishXcmPallet, XcmPalletName } from './createXcmCalls/util/establishXcmPallet.js';
import { XTokensBaseArgs } from './createXcmCalls/xTokens/types.js';
import { XcmCreator, XcmMultiLocation, XcmVersionedAssetId } from './createXcmTypes/types.js';
import { assetIdIsLocation } from './createXcmTypes/util/assetIdIsLocation.js';
import { assetIdsContainRelayAsset } from './createXcmTypes/util/assetIdsContainsRelayAsset.js';
import { chainDestIsBridge } from './createXcmTypes/util/chainDestIsBridge.js';
import { chainDestIsEthereum } from './createXcmTypes/util/chainDestIsEthereum.js';
import { createXcmVersionedAssetId } from './createXcmTypes/util/createXcmVersionedAssetId.js';
import { getAssetId } from './createXcmTypes/util/getAssetId.js';
import { getGlobalConsensusSystemName } from './createXcmTypes/util/getGlobalConsensusSystemName.js';
import { getPaysWithFeeOriginAssetLocationFromRegistry } from './createXcmTypes/util/getPaysWithFeeOriginAssetLocationFromRegistry.js';
import { isParachain } from './createXcmTypes/util/isParachain.js';
import { isParachainPrimaryNativeAsset } from './createXcmTypes/util/isParachainPrimaryNativeAsset.js';
import { isRelayNativeAsset } from './createXcmTypes/util/isRelayNativeAsset.js';
import { isSystemChain } from './createXcmTypes/util/isSystemChain.js';
import { multiLocationAssetIsParachainsNativeAsset } from './createXcmTypes/util/multiLocationAssetIsParachainsNativeAsset.js';
import { parseLocationStrToLocation } from './createXcmTypes/util/parseLocationStrToLocation.js';
import { getXcmCreator } from './createXcmTypes/xcm/index.js';
import { LocalTxType } from './errors/checkLocalTxInput/types.js';
import { checkClaimAssetsInputs } from './errors/checkXcmTxInputs.js';
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
} from './errors/index.js';
import { Registry } from './registry/index.js';
import { ChainInfoKeys, ChainInfoRegistry } from './registry/types.js';
import { sanitizeAddress } from './sanitize/sanitizeAddress.js';
import {
	AssetCallType,
	AssetTransferApiOpts,
	AssetType,
	ChainOriginDestInfo,
	ConstructedFormat,
	Direction,
	Format,
	LocalMethodName,
	LocalTransferTypes,
	LocalTxChainType,
	LocalTxOpts,
	Methods,
	RegistryTypes,
	ResolvedCallInfo,
	SignedOriginCaller,
	TransferArgsOpts,
	TxResult,
	UnsignedTransaction,
	type XcmBaseArgs,
	XcmDirection,
	XcmFeeInfo,
	type XcmPalletCallSignature,
	type XcmPalletTxMethodTransactionMap,
	type XTokensCallSignature,
	type XTokensTxMethodTransactionMap,
} from './types.js';
import { callExistsInRuntime } from './util/callExistsInRuntime.js';
import { deepEqual } from './util/deepEqual.js';
import { sanitizeKeys } from './util/sanitizeKeys.js';
import { validateNumber } from './validate/index.js';

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
		const {
			format,
			paysWithFeeDest,
			paysWithFeeOrigin,
			weightLimit,
			xcmVersion,
			transferLiquidToken,
			sendersAddr,
			assetTransferType,
			remoteReserveAssetTransferTypeLocation,
			feesTransferType,
			remoteReserveFeesTransferTypeLocation,
			customXcmOnDest,
			dryRunCall,
			xcmFeeAsset,
			xcmPalletOverride,
		} = opts;

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
			isOriginRelayChain: api.query.paras ? true : false,
			isOriginSystemParachain: SYSTEM_PARACHAINS_NAMES.includes(specName.toLowerCase()),
			isOriginParachain: isParachain(originChainId),
			isDestRelayChain: destChainId === RELAY_CHAIN_IDS[0],
			isDestSystemParachain: isSystemChain(destChainId),
			isDestParachain: isParachain(destChainId),
			isDestBridge: chainDestIsBridge(destChainId),
			isDestEthereum: chainDestIsEthereum(destChainId),
		};

		/**
		 * Sanitize the address to a hex, and ensure that the passed in SS58, or publickey
		 * is validated correctly.
		 */
		const addr = sanitizeAddress(destAddr);

		const localTxChainType = this.establishLocalTxChainType(originChainId, destChainId, chainOriginDestInfo);
		const isLocalTx = localTxChainType !== LocalTxChainType.None;
		const xcmDirection = this.establishDirection(isLocalTx, chainOriginDestInfo);
		const isForeignAssetsTransfer = await this.checkContainsForeignAssets(api, assetIds);
		const isPrimaryParachainNativeAsset = isParachainPrimaryNativeAsset(registry, specName, xcmDirection, assetIds[0]);
		const xcmPallet = establishXcmPallet(api, xcmDirection, xcmPalletOverride);
		const declaredXcmVersion = xcmVersion === undefined ? safeXcmVersion : xcmVersion;
		checkXcmVersion(declaredXcmVersion); // Throws an error when the xcmVersion is not supported.
		const xcmCreator = getXcmCreator(declaredXcmVersion);

		/**
		 * Create a local asset transfer
		 */
		if (isLocalTx) {
			const LocalTxOpts = {
				...opts,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			};
			return this.createLocalTx({
				addr,
				assetIds,
				amounts,
				destChainId,
				xcmVersion: declaredXcmVersion,
				xcmDirection,
				localTxChainType,
				opts: LocalTxOpts,
			});
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
			chainOriginDestInfo,
			weightLimit,
			paysWithFeeDest,
			isLiquidTokenTransfer,
			isForeignAssetsTransfer,
			assetTransferType,
			remoteReserveAssetTransferTypeLocation,
			feesTransferType,
			remoteReserveFeesTransferTypeLocation,
			customXcmOnDest,
			dryRunCall,
			sendersAddr,
			xcmFeeAsset,
		};

		await checkXcmTxInputs(
			{ ...baseArgs, xcmPallet },
			{
				...baseOpts,
				isPrimaryParachainNativeAsset,
			},
		);

		const assetType = this.fetchAssetType(xcmDirection, isForeignAssetsTransfer);
		const assetCallType = this.fetchCallType({
			originChainId,
			destChainId,
			assetIds,
			xcmDirection,
			assetType,
			isParachainPrimaryNativeAsset: isPrimaryParachainNativeAsset,
			registry,
		});

		const [txMethod, transaction] = await this.resolveCall({
			assetIds,
			xcmPallet,
			xcmDirection,
			assetCallType,
			baseArgs,
			baseOpts,
			paysWithFeeDest,
		});

		return this.constructFormat<T>({
			tx: transaction,
			direction: xcmDirection,
			xcmCreator,
			method: txMethod,
			dest: destChainId,
			origin: specName,
			opts: {
				format,
				paysWithFeeOrigin,
				sendersAddr,
				dryRunCall,
				xcmFeeAsset,
			},
		});
	}

	/**
	 * Create a local claimAssets XCM transaction to retrieve trapped assets. This can be either locally on a systems parachain, on the relay chain or any chain that supports the pallet-xcm `claimAssets` runtime call.
	 *
	 * ```ts
	 * import { TxResult } from '@substrate/asset-transfer-api'
	 *
	 * let callInfo: TxResult<'call'>;
	 * try {
	 *   callInfo = await assetsApi.claimAssets(
	 * 	   [`{"parents":"0","interior":{"X2":[{"PalletInstance":"50"},{"GeneralIndex":"1984"}]}}`],
	 *     ['1000000000000'],
	 *     '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
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
	 * @param assetIds Array of assetId's to be claimed from the AssetTrap
	 * @param amounts Array of the amounts of each trapped asset to be claimed
	 * @param beneficiary Address of the account to receive the trapped assets
	 * @param opts Options
	 */
	public async claimAssets<T extends Format>(
		assetIds: string[],
		amounts: string[],
		beneficiary: string,
		opts: TransferArgsOpts<T>,
	): Promise<TxResult<T>> {
		const { api, specName, originChainId, registry, safeXcmVersion } = this;
		const { format, sendersAddr, transferLiquidToken: isLiquidToken, xcmVersion } = opts;
		const declaredXcmVersion = xcmVersion === undefined ? safeXcmVersion : xcmVersion;
		const isLiquidTokenTransfer = isLiquidToken ? true : false;
		const assetIdsContainLocations = this.checkContainsAssetLocations(assetIds);
		const beneficiaryAddress = sanitizeAddress(beneficiary);

		checkXcmVersion(declaredXcmVersion);
		checkBaseInputOptions(opts, specName);
		checkClaimAssetsInputs(assetIds, amounts);

		const ext = await claimAssets(
			api,
			registry,
			specName,
			assetIds,
			amounts,
			beneficiaryAddress,
			declaredXcmVersion,
			originChainId,
			{
				isForeignAssetsTransfer: assetIdsContainLocations,
				isLiquidTokenTransfer,
			},
		);

		const xcmCreator = getXcmCreator(declaredXcmVersion);
		return await this.constructFormat({
			tx: ext,
			direction: 'local',
			xcmCreator,
			method: 'claimAssets',
			dest: originChainId,
			origin: originChainId,
			opts: {
				format,
				sendersAddr,
			},
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

		const fakeSignerAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

		if (format === 'payload') {
			const extrinsicPayload = api.registry.createType('ExtrinsicPayload', tx, {
				version: EXTRINSIC_VERSION,
			});
			const ext = api.registry.createType(
				'Extrinsic',
				{ method: extrinsicPayload.method },
				{ version: EXTRINSIC_VERSION },
			);
			const u8a = await this.extToU8a(api, ext, fakeSignerAddress);

			return await api.call.transactionPaymentApi.queryInfo(u8a, u8a.length);
		} else if (format === 'call') {
			const ext = api.registry.createType('Extrinsic', { method: tx }, { version: EXTRINSIC_VERSION });
			const u8a = await this.extToU8a(api, ext, fakeSignerAddress);

			return await api.call.transactionPaymentApi.queryInfo(u8a, u8a.length);
		} else if (format === 'submittable') {
			const ext = api.registry.createType('Extrinsic', tx, {
				version: EXTRINSIC_VERSION,
			});
			const u8a = await this.extToU8a(api, ext, fakeSignerAddress);

			return await api.call.transactionPaymentApi.queryInfo(u8a, u8a.length);
		}

		return null;
	}

	/**
	 * Dry Run a call to determine its execution result
	 *
	 * ```ts
	 * const executionResult = await assetApi.dryRunCall(sendersAddr, tx, 'call');
	 * console.log(executionResult.toJSON());
	 * ```
	 * @param sendersAddr address of the account sending the transaction
	 * @param tx a payload, call or submittable
	 * @param format The format the tx is in
	 */
	public async dryRunCall<T extends Format>(
		sendersAddr: string,
		tx: ConstructedFormat<T>,
		format: T,
		xcmVersion?: number,
	): Promise<Result<CallDryRunEffects, XcmDryRunApiError> | null> {
		const { api, safeXcmVersion } = this;

		const originCaller: SignedOriginCaller = {
			System: {
				Signed: sendersAddr,
			},
		};

		let callArg;

		if (format === 'payload') {
			const extrinsicPayload = api.registry.createType('ExtrinsicPayload', tx, {
				version: EXTRINSIC_VERSION,
			});
			const call = api.registry.createType('Call', extrinsicPayload.method);
			callArg = call.toHex();
		} else if (format === 'call' || format === 'submittable') {
			callArg = tx;
		} else {
			throw new BaseError(`Unsupported format: ${format}`, BaseErrorsEnum.InvalidInput);
		}

		const declaredXcmVersion = xcmVersion === undefined ? safeXcmVersion : xcmVersion;
		return api.call.dryRunApi.dryRunCall(originCaller, callArg, declaredXcmVersion);
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

			return JSON.stringify({
				decodedPayload: { ...(extrinsicPayload.toHuman() as object) },
				decodedCall: { ...call.toHuman() },
			});
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

		const {
			isOriginRelayChain,
			isDestParachain,
			isDestRelayChain,
			isDestSystemParachain,
			isOriginParachain,
			isOriginSystemParachain,
			isDestBridge,
			isDestEthereum,
		} = chainOriginDestInfo;

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

		if (isOriginSystemParachain && isDestBridge) {
			return Direction.SystemToBridge;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (isOriginRelayChain && isDestSystemParachain) {
			return Direction.RelayToSystem;
		}

		if (isOriginRelayChain && isDestParachain) {
			return Direction.RelayToPara;
		}

		if (isOriginRelayChain && isDestBridge) {
			return Direction.RelayToBridge;
		}

		// Para To ETH
		if (isOriginParachain && isDestEthereum) {
			return Direction.ParaToEthereum;
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
	private async constructFormat<T extends Format>({
		tx,
		direction,
		xcmCreator,
		method,
		dest,
		origin,
		opts: { format, paysWithFeeOrigin, sendersAddr, dryRunCall, xcmFeeAsset },
	}: {
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
		direction: Direction | 'local';
		xcmCreator: XcmCreator;
		method: Methods;
		dest: string;
		origin: string;
		opts: {
			format?: T;
			paysWithFeeOrigin?: string;
			sendersAddr?: string;
			dryRunCall?: boolean;
			xcmFeeAsset?: string;
		};
	}): Promise<TxResult<T>> {
		const fmt = format ? format : 'payload';
		const result: TxResult<T> = {
			origin,
			dest: this.getDestinationSpecName(dest, this.registry),
			direction,
			xcmVersion: xcmCreator.xcmVersion,
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

		if (dryRunCall && sendersAddr && xcmFeeAsset) {
			let feeAssetLocation: XcmVersionedAssetId | undefined = undefined;
			if (isRelayNativeAsset(this.registry, xcmFeeAsset)) {
				const relayAssetLocation = `{"parents":"1","interior":{"Here":""}}`;
				feeAssetLocation = createXcmVersionedAssetId(relayAssetLocation, xcmCreator);
			} else {
				const feeAsset = await getAssetId({
					api: this.api,
					registry: this.registry,
					asset: xcmFeeAsset,
					specName: this.specName,
					xcmCreator,
					isForeignAssetsTransfer: false,
				});

				if (feeAsset) {
					const location = getPaysWithFeeOriginAssetLocationFromRegistry(this, feeAsset);
					if (location) {
						feeAssetLocation = createXcmVersionedAssetId(JSON.stringify(location), xcmCreator);
					}
				}
			}

			const executionResult = await this.dryRunCall(sendersAddr, result.tx, fmt, xcmCreator.xcmVersion);

			if (executionResult?.isOk) {
				result.xcmExecutionResult = executionResult.asOk.executionResult;

				if (feeAssetLocation) {
					const maybeLocalXcm = executionResult.asOk.localXcm;
					if (maybeLocalXcm.isSome) {
						const localXcm = maybeLocalXcm.unwrap();
						const localXcmWeightResult: Result<WeightV2, XcmPaymentApiError> =
							await this.api.call.xcmPaymentApi.queryXcmWeight(localXcm);

						if (localXcmWeightResult.isOk) {
							const localXcmWeight = localXcmWeightResult.asOk;
							const weightToFeeAssetResult: Result<u128, XcmPaymentApiError> =
								await this.api.call.xcmPaymentApi.queryWeightToAssetFee(localXcmWeight, feeAssetLocation);

							const weightToFee = this.getXcmWeightToFee(
								'local',
								weightToFeeAssetResult,
								localXcmWeight,
								feeAssetLocation,
							);
							result.localXcmFees = [localXcm, weightToFee];
						}
					}
				}
			} else if (executionResult?.isErr) {
				result.xcmExecutionResult = executionResult.asErr;
			}
		}

		return result;
	}

	public getXcmWeightToFee(
		destination: VersionedMultiLocation | 'local',
		weightToAssetFeeResult: Result<u128, XcmPaymentApiError>,
		weight: WeightV2,
		asset: XcmVersionedAssetId,
	): XcmFeeInfo {
		if (weightToAssetFeeResult.isOk) {
			return {
				xcmDest: JSON.stringify(destination),
				xcmFee: weightToAssetFeeResult.asOk.toString(),
				xcmFeeAsset: JSON.stringify(asset),
				xcmWeight: JSON.stringify(weight),
			};
		} else {
			throw new BaseError(
				`XcmFeeAsset Error: ${weightToAssetFeeResult.asErr.toString()} - asset: ${JSON.stringify(asset)}`,
				BaseErrorsEnum.InvalidAsset,
			);
		}
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

	private fetchCallType({
		originChainId,
		destChainId,
		assetIds,
		xcmDirection,
		assetType,
		isParachainPrimaryNativeAsset,
		registry,
	}: {
		originChainId: string;
		destChainId: string;
		assetIds: string[];
		xcmDirection: Direction;
		assetType: AssetType;
		isParachainPrimaryNativeAsset: boolean;
		registry: Registry;
	}): AssetCallType {
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

		if (assetType === AssetType.Foreign) {
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
		// system to bridge -> reserve
		if (xcmDirection === Direction.SystemToBridge) {
			return AssetCallType.Reserve;
		}

		// para to assethub to ethereum -> reserve
		if (xcmDirection === Direction.ParaToEthereum) {
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
		let assetId: AnyJson = {};

		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(this.specName.toLowerCase());

		if (paysWithFeeOrigin && isOriginSystemParachain) {
			let paysWithFeeOriginAssetLocation: string;

			if (!assetIdIsLocation(paysWithFeeOrigin)) {
				const paysWithFeeOriginLocation = getPaysWithFeeOriginAssetLocationFromRegistry(this, paysWithFeeOrigin);

				if (!paysWithFeeOriginLocation) {
					throw new BaseError(
						`assetId ${JSON.stringify(paysWithFeeOrigin)} is not a valid paysWithFeeOrigin asset location`,
						BaseErrorsEnum.NoFeeAssetLpFound,
					);
				}
				paysWithFeeOriginAssetLocation = JSON.stringify(paysWithFeeOriginLocation);
			} else {
				paysWithFeeOriginAssetLocation = paysWithFeeOrigin;
			}

			const [isValidLpToken] = await this.checkAssetLpTokenPairExists(paysWithFeeOriginAssetLocation);

			if (!isValidLpToken) {
				throw new BaseError(
					`assetId ${paysWithFeeOrigin} is not a valid liquidity pool token for ${this.specName}`,
					BaseErrorsEnum.NoFeeAssetLpFound,
				);
			}

			assetId = JSON.parse(paysWithFeeOriginAssetLocation) as AnyJson;
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
			metadataHash: null,
			method: method.toHex(),
			mode: this.api.registry.createType('u8', 0).toHex(),
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
				'CheckMetadataHash',
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

		if (chainDestIsBridge(destId)) {
			return getGlobalConsensusSystemName(destId);
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
	 * Returns if `assetIds` contains asset location values
	 *
	 * @param assetIds string[]
	 * @returns boolean
	 */
	private checkContainsAssetLocations(assetIds: string[]): boolean {
		if (assetIds.length === 0) {
			return false;
		}

		if (!assetIds[0].toLowerCase().includes('parents')) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if assetIds exclusively contain on-chain foreign asset values
	 *
	 * @param api ApiPromise
	 * @param assetIds string[]
	 * @returns boolean
	 */
	private checkContainsForeignAssets = async (api: ApiPromise, assetIds: string[]): Promise<boolean> => {
		if (!api.query.foreignAssets) {
			return false;
		}

		const foreignAssets: string[] = [];
		for (const asset of await api.query.foreignAssets.asset.entries()) {
			const storageKey = asset[0].toHuman();
			if (storageKey && Array.isArray(storageKey) && storageKey.length > 0) {
				foreignAssets.push(JSON.stringify(storageKey[0]).replace(/(\d),/g, '$1'));
			}
		}

		for (const assetId of assetIds) {
			if (foreignAssets.includes(assetId)) {
				return true;
			}
		}

		return false;
	};

	/**
	 * checks the chains state and determines whether an asset location is a part of a valid token liquidity pool pair
	 *
	 * @param paysWithFeeOrigin XcmMultiLocation
	 * @returns Promise<boolean>
	 */
	private checkAssetLpTokenPairExists = async (paysWithFeeOrigin: string): Promise<[boolean, XcmMultiLocation]> => {
		let feeAsset: XcmMultiLocation;

		try {
			feeAsset = sanitizeKeys(JSON.parse(paysWithFeeOrigin)) as XcmMultiLocation;
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
					const lpTokenLocations = lpTokens as XcmMultiLocation[];

					if (Array.isArray(lpTokenLocations[0])) {
						// convert json into locations
						const firstLpToken = parseLocationStrToLocation(
							JSON.stringify(lpTokenLocations[0][0]).replace(/(\d),/g, '$1'),
							this.safeXcmVersion,
						);
						const secondLpToken = parseLocationStrToLocation(
							JSON.stringify(lpTokenLocations[0][1]).replace(/(\d),/g, '$1'),
							this.safeXcmVersion,
						);

						// check locations match paysWithFeeOrigin feeAsset
						if (deepEqual(sanitizeKeys(firstLpToken), feeAsset) || deepEqual(sanitizeKeys(secondLpToken), feeAsset)) {
							return [true, feeAsset];
						}
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

	private async createLocalTx({
		addr,
		assetIds,
		amounts,
		destChainId,
		xcmVersion,
		xcmDirection,
		localTxChainType,
		opts,
	}: {
		addr: string;
		assetIds: string[];
		amounts: string[];
		destChainId: string;
		xcmVersion: number;
		xcmDirection: Direction;
		localTxChainType: LocalTxChainType;
		opts: LocalTxOpts;
	}) {
		const { api, specName } = this;
		const { isForeignAssetsTransfer, isLiquidTokenTransfer, keepAlive, transferAll } = opts;
		const transferKeepAlive = keepAlive ? keepAlive : false;
		let assetId = assetIds[0];
		const amount = amounts[0];
		const isValidNumber = validateNumber(assetId);
		let isNativeRelayChainAsset = false;
		if (assetIds.length === 0 || this.nativeRelayChainAsset.toLowerCase() === assetId.toLowerCase()) {
			isNativeRelayChainAsset = true;
		}

		const xcmCreator = getXcmCreator(xcmVersion);

		if (xcmDirection === Direction.SystemToSystem && !isValidNumber && !isNativeRelayChainAsset) {
			// for SystemToSystem, assetId is not the native relayChains asset and is not a number
			// check for the general index of the assetId and assign the correct value for the local tx
			// throws an error if the general index is not found
			assetId = await getAssetId({
				api: this.api,
				registry: this.registry,
				asset: assetId,
				specName: this.specName,
				xcmCreator,
				isForeignAssetsTransfer: opts.isForeignAssetsTransfer,
			});
		}
		let method: LocalMethodName;
		if (transferAll) {
			method = 'transferAll';
		} else if (keepAlive) {
			method = 'transferKeepAlive';
		} else {
			method = 'transfer';
		}
		let tx: SubmittableExtrinsic<'promise', ISubmittableResult> | undefined;

		if (localTxChainType === LocalTxChainType.System) {
			const localAssetType = await checkLocalSystemParachainInput(
				this.api,
				assetIds,
				amounts,
				this.specName,
				this.registry,
				xcmVersion,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			); // Throws an error when any of the inputs are incorrect.
			let palletMethod: LocalTransferTypes | undefined;

			if (localAssetType === LocalTxType.Balances) {
				if (method === 'transferKeepAlive') {
					tx = balances.transferKeepAlive(api, addr, amount);
				} else if (method === 'transferAll') {
					tx = balances.transferAll(api, addr, transferKeepAlive);
				} else {
					tx = balances.transfer(api, addr, amount);
				}
				palletMethod = `balances::${method}`;
			} else if (localAssetType === LocalTxType.Assets) {
				if (method === 'transferKeepAlive') {
					tx = assets.transferKeepAlive(api, addr, assetId, amount);
				} else if (method === 'transferAll') {
					tx = assets.transferAll(api, assetId, addr, transferKeepAlive);
				} else {
					tx = assets.transfer(api, addr, assetId, amount);
				}
				palletMethod = `assets::${method}`;
			} else if (localAssetType === LocalTxType.PoolAssets) {
				if (method === 'transferKeepAlive') {
					tx = poolAssets.transferKeepAlive(api, addr, assetId, amount);
				} else if (method === 'transferAll') {
					tx = poolAssets.transferAll(api, assetId, addr, transferKeepAlive);
				} else {
					tx = poolAssets.transfer(api, addr, assetId, amount);
				}
				palletMethod = `poolAssets::${method}`;
			} else if (localAssetType === LocalTxType.ForeignAssets) {
				if (xcmCreator.xcmVersion < MIN_XCM_VERSION_FOREIGN_ASSETS) {
					throw new BaseError(
						`XCM version 4 or higher is required for ForeignAsset transfers.`,
						BaseErrorsEnum.InvalidXcmVersion,
					);
				}
				const location = xcmCreator.resolveMultiLocation(JSON.parse(assetId) as AnyJson);

				if (method === 'transferKeepAlive') {
					tx = foreignAssets.transferKeepAlive(api, addr, location, amount);
				} else if (method === 'transferAll') {
					tx = foreignAssets.transferAll(api, location, addr, transferKeepAlive);
				} else {
					tx = foreignAssets.transfer(api, addr, location, amount);
				}
				palletMethod = `foreignAssets::${method}`;
			} else {
				throw new BaseError(
					'No supported pallets were found for local transfers. Supported pallets include: balances, tokens.',
					BaseErrorsEnum.PalletNotFound,
				);
			}

			return await this.constructFormat({
				tx,
				direction: 'local',
				xcmCreator,
				method: palletMethod,
				dest: destChainId,
				origin: this.specName,
				opts,
			});
		} else if (localTxChainType === LocalTxChainType.Parachain) {
			const localAssetType = checkLocalParachainInput(api, assetIds, amounts);
			/**
			 * If no asset is passed in then it's assumed that its a balance transfer.
			 * If an asset is passed in then it's a token transfer.
			 */
			if (localAssetType === LocalTxType.Balances) {
				const palletMethod: LocalTransferTypes = `balances::${method}`;
				if (method === 'transferKeepAlive') {
					tx = balances.transferKeepAlive(api, addr, amount);
				} else if (method === 'transferAll') {
					tx = balances.transferAll(api, addr, transferKeepAlive);
				} else {
					tx = balances.transfer(api, addr, amount);
				}
				return this.constructFormat({
					tx,
					direction: 'local',
					xcmCreator,
					method: palletMethod,
					dest: destChainId,
					origin: specName,
					opts,
				});
			} else if (localAssetType === LocalTxType.Tokens) {
				const palletMethod: LocalTransferTypes = `tokens::${method}`;
				if (method === 'transferKeepAlive') {
					tx = tokens.transferKeepAlive(api, addr, assetIds[0], amount);
				} else if (method === 'transferAll') {
					tx = tokens.transferAll(api, assetIds[0], addr, transferKeepAlive);
				} else {
					tx = tokens.transfer(api, addr, assetIds[0], amount);
				}
				return this.constructFormat({
					tx,
					direction: 'local',
					xcmCreator,
					method: palletMethod,
					dest: destChainId,
					origin: specName,
					opts,
				});
			} else {
				throw new BaseError(
					'No supported pallets were found for local transfers. Supported pallets include: balances, tokens.',
					BaseErrorsEnum.PalletNotFound,
				);
			}
		} else {
			checkLocalRelayInput(assetIds, amounts, this.registry);
			/**
			 * By default local transaction on a relay chain will always be from the balances pallet
			 */
			const palletMethod: LocalTransferTypes = `balances::${method}`;
			if (method === 'transferKeepAlive') {
				tx = balances.transferKeepAlive(api, addr, amount);
			} else if (method === 'transferAll') {
				tx = balances.transferAll(api, addr, transferKeepAlive);
			} else {
				tx = balances.transfer(api, addr, amount);
			}
			return this.constructFormat({
				tx,
				direction: 'local',
				xcmCreator,
				method: palletMethod,
				dest: destChainId,
				origin: specName,
				opts,
			});
		}
	}

	private async resolveCall({
		assetIds,
		xcmPallet,
		xcmDirection,
		assetCallType,
		baseArgs,
		baseOpts,
		paysWithFeeDest,
	}: {
		assetIds: string[];
		xcmPallet: XcmPalletName;
		xcmDirection: Direction;
		assetCallType: AssetCallType;
		baseArgs: XcmBaseArgs | XTokensBaseArgs;
		baseOpts: CreateXcmCallOpts;
		paysWithFeeDest?: string;
	}): Promise<ResolvedCallInfo> {
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
			} else if (paysWithFeeDest && assetIdIsLocation(paysWithFeeDest)) {
				txMethod = 'transferMultiassetWithFee';
			} else {
				txMethod = 'transferMultiassets';
			}
		} else if (api.tx[xcmPallet]) {
			if (xcmDirection === Direction.ParaToEthereum) {
				txMethod = 'transferAssetsUsingTypeAndThen';
			} else if (api.tx[xcmPallet].transferAssetsUsingTypeAndThen && baseOpts.assetTransferType) {
				txMethod = 'transferAssetsUsingTypeAndThen';
			} else if (api.tx[xcmPallet].transferAssets) {
				txMethod = 'transferAssets';
			} else if (assetCallType === AssetCallType.Reserve) {
				txMethod = 'limitedReserveTransferAssets';
			} else {
				txMethod = 'limitedTeleportAssets';
			}
		}

		if (!txMethod) {
			throw new BaseError(`Unable to resolve correct transfer call`, BaseErrorsEnum.InternalError);
		}

		if (!txMethod) {
			throw new BaseError(`Unable to resolve correct transfer call`, BaseErrorsEnum.InternalError);
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
			transferAssetsUsingTypeAndThen: [transferAssetsUsingTypeAndThen, [baseArgs, baseOpts]],
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

	private async extToU8a(api: ApiPromise, ext: GenericExtrinsic<AnyTuple>, address: string): Promise<Uint8Array> {
		const lastHeader = await api.rpc.chain.getHeader();
		const era = api.registry.createType('ExtrinsicEra', {
			current: lastHeader.number.toNumber(),
			period: 64,
		});
		const nonce = await api.rpc.system.accountNextIndex(address);
		const tx = api.tx(ext.toU8a());

		return tx
			.signFake(address, {
				runtimeVersion: api.runtimeVersion,
				blockHash: lastHeader.hash.toHex(),
				era,
				genesisHash: api.genesisHash.toHex(),
				metadataHash: undefined,
				mode: api.registry.createType('u8', 0).toHex(),
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
					'CheckMetadataHash',
				],
				tip: api.registry.createType('Compact<Balance>', 0).toHex(),
			})
			.toU8a();
	}

	/**
	 * Queries the provided chain and returns the estimated fees for forwarded xcms in an executed dry run
	 *
	 * @param specName string
	 * @param chainUrl string
	 * @param xcmVersion number
	 * @param dryRunResult Result<CallDryRunEffects, XcmDryRunApiError> | null
	 * @param xcmFeeAsset string
	 * @returns Promise<[VersionedXcm, XcmFeeInfo][]>
	 */
	public static async getDestinationXcmWeightToFeeAsset(
		specName: string,
		chainUrl: string,
		xcmVersion: number,
		dryRunResult: Result<CallDryRunEffects, XcmDryRunApiError> | null,
		xcmFeeAsset: string,
	): Promise<[VersionedXcm, XcmFeeInfo][]> {
		const forwardedXcmFees: [VersionedXcm, XcmFeeInfo][] = [];
		const xcmCreator = getXcmCreator(xcmVersion);

		if (!dryRunResult) {
			return [];
		}

		if (dryRunResult.isOk) {
			const forwardedXcms = dryRunResult.asOk.forwardedXcms;

			if (forwardedXcms.length === 0) {
				return forwardedXcmFees;
			}

			const provider = new WsProvider(chainUrl);
			const api = await ApiPromise.create({ provider });
			await api.isReady;

			if (!api.call['xcmPaymentApi']) {
				throw new BaseError(
					`Did not find the xcmPaymentApi in ${specName}'s runtime`,
					BaseErrorsEnum.RuntimeCallNotFound,
				);
			}

			const chainApi = new AssetTransferApi(api, specName, xcmVersion);

			let feeAssetLocation: XcmVersionedAssetId | undefined = undefined;

			if (isRelayNativeAsset(chainApi.registry, xcmFeeAsset)) {
				const relayAssetLocation = `{"parents":"1","interior":{"Here":""}}`;
				feeAssetLocation = createXcmVersionedAssetId(relayAssetLocation, xcmCreator);
			} else {
				const feeAsset = await getAssetId({
					api: chainApi.api,
					registry: chainApi.registry,
					asset: xcmFeeAsset,
					specName: chainApi.specName,
					xcmCreator,
					isForeignAssetsTransfer: false,
				});
				feeAssetLocation = createXcmVersionedAssetId(feeAsset, xcmCreator);
			}

			if (feeAssetLocation) {
				for (const [destination, xcms] of forwardedXcms) {
					for (const xcm of xcms) {
						const forwardedXcmWeightResult: Result<WeightV2, XcmPaymentApiError> =
							await chainApi.api.call.xcmPaymentApi.queryXcmWeight(xcm);

						if (forwardedXcmWeightResult.isOk) {
							const forwardedXcmWeight = forwardedXcmWeightResult.asOk;

							const weightToFeeAssetResult: Result<u128, XcmPaymentApiError> =
								await chainApi.api.call.xcmPaymentApi.queryWeightToAssetFee(forwardedXcmWeight, feeAssetLocation);
							const weightToFee = chainApi.getXcmWeightToFee(
								destination,
								weightToFeeAssetResult,
								forwardedXcmWeight,
								feeAssetLocation,
							);
							forwardedXcmFees.push([xcm, weightToFee]);
						}
					}
				}
			}

			await api.disconnect();
		}

		return forwardedXcmFees;
	}
}
