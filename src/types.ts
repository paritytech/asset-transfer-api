// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { GenericExtrinsicPayload } from '@polkadot/types/extrinsic';
import type {
	DispatchResultWithPostInfo,
	InteriorMultiLocation,
	VersionedXcm,
	XcmDryRunApiError,
} from '@polkadot/types/interfaces';
import type { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import BN from 'bn.js';

import { CreateXcmCallOpts } from './createXcmCalls/types';
import { XcmPalletName } from './createXcmCalls/util/establishXcmPallet';
import { XTokensBaseArgs } from './createXcmCalls/xTokens/types';
import { UnionXcmMultiLocation } from './createXcmTypes/types';
import type { Registry } from './registry';
import type { ChainInfoKeys, ChainInfoRegistry, InjectedChainInfoKeys } from './registry/types';

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
	}[Keys];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

export type AnyObj = { [x: string]: unknown };

/**
 * Represents all possible tx directions
 */
export enum Direction {
	/**
	 * Local tx
	 */
	Local = 'Local',
	/**
	 * System parachain to Parachain.
	 */
	SystemToPara = 'SystemToPara',
	/**
	 * System parachain to Relay chain.
	 */
	SystemToRelay = 'SystemToRelay',
	/**
	 * System parachain to System parachain chain.
	 */
	SystemToSystem = 'SystemToSystem',
	/**
	 * System parachain to an external `GlobalConsensus` chain.
	 */
	SystemToBridge = 'SystemToBridge',
	/**
	 * Parachain to Parachain.
	 */
	ParaToPara = 'ParaToPara',
	/**
	 * Parachain to Relay chain.
	 */
	ParaToRelay = 'ParaToRelay',
	/**
	 * Parachain to System parachain.
	 */
	ParaToSystem = 'ParaToSystem',
	/**
	 * Parachain to Ethereum.
	 */
	ParaToEthereum = 'ParaToEthereum',
	/**
	 * Relay to System Parachain.
	 */
	RelayToSystem = 'RelayToSystem',
	/**
	 * Relay chain to Parachain.
	 */
	RelayToPara = 'RelayToPara',
	/**
	 * Relay chain to an external `GlobalConsensus` chain.
	 */
	RelayToBridge = 'RelayToBridge',
}

/**
 *  The direction of the cross chain transfer. This only concerns XCM transactions.
 */
export type XcmDirection = Exclude<Direction, 'Local'>;

export enum AssetType {
	Native = 'Native',
	Foreign = 'Foreign',
}

export enum AssetCallType {
	Reserve = 'Reserve',
	Teleport = 'Teleport',
}

export enum LocalTxChainType {
	Parachain = 'Parachain',
	System = 'System',
	Relay = 'Relay',
	None = 'None',
}

export interface ChainOriginDestInfo {
	isOriginRelayChain: boolean;
	isOriginSystemParachain: boolean;
	isOriginParachain: boolean;
	isDestRelayChain: boolean;
	isDestSystemParachain: boolean;
	isDestParachain: boolean;
	isDestBridge: boolean;
	isDestEthereum: boolean;
}

export interface LocalTxOpts extends TransferArgsOpts<Format> {
	isForeignAssetsTransfer: boolean;
	isLiquidTokenTransfer: boolean;
}

/**
 * AssetTransferApi supports three formats to be returned:
 * - payload: This returns a Polkadot-js `ExtrinsicPayload` as a hex.
 * - call: This returns a Polkadot-js `Call` as a hex.
 * - submittable: This returns a Polkadot-js `SubmittableExtrinsic`.
 */
export type Format = 'payload' | 'call' | 'submittable';

/**
 * The Format types possible for a constructed transaction.
 */
export type ConstructedFormat<T> = T extends 'payload'
	? GenericExtrinsicPayload
	: T extends 'call'
		? `0x${string}`
		: T extends 'submittable'
			? SubmittableExtrinsic<'promise', ISubmittableResult>
			: never;

/**
 * The types of local transactions the api can construct.
 */
export type LocalTransferTypes =
	| 'assets::transfer'
	| 'assets::transferKeepAlive'
	| 'assets::transferAll'
	| 'foreignAssets::transfer'
	| 'foreignAssets::transferKeepAlive'
	| 'foreignAssets::transferAll'
	| 'balances::transfer'
	| 'balances::transferKeepAlive'
	| 'balances::transferAll'
	| 'poolAssets::transfer'
	| 'poolAssets::transferKeepAlive'
	| 'poolAssets::transferAll'
	| 'tokens::transfer'
	| 'tokens::transferKeepAlive'
	| 'tokens::transferAll';

export type LocalMethodName = 'transfer' | 'transferKeepAlive' | 'transferAll';

/**
 * The Methods are the collections of methods the API will use to construct a transaction.
 */
export type Methods =
	| LocalTransferTypes
	| 'transferAssets'
	| 'transferAssetsUsingTypeAndThen'
	| 'limitedReserveTransferAssets'
	| 'limitedTeleportAssets'
	| 'transferMultiasset'
	| 'transferMultiassets'
	| 'transferMultiassetWithFee'
	| 'claimAssets';

/**
 * Options that are appplied at initialization of the `AssetTransferApi`.
 */
export type AssetTransferApiOpts<T extends ChainInfoKeys | InjectedChainInfoKeys> = {
	/**
	 * Option to inject chain information into the registry.
	 */
	injectedRegistry?: RequireAtLeastOne<ChainInfoRegistry<T> | ChainInfoRegistry<InjectedChainInfoKeys>>;
	/**
	 * Option to override the registry with the supplied chain information.
	 */
	overrideRegistry?: RequireAtLeastOne<ChainInfoRegistry<InjectedChainInfoKeys>>;
	/**
	 * Whether or not to apply the registry from the npm package `asset-transfer-api-registry`,
	 * or the hosted CDN which updates frequently.
	 */
	registryType?: RegistryTypes;
	/**
	 * Chain name of the chain which the api is connected to.
	 */
	chainName?: string;
};

/**
 * Types that the registry can be initialized as.
 *
 * CDN - The registry will be initialized with the up to date version given the CDN
 * NPM - The registry will be initialized with the NPM version which is updated less frequently.
 */
export type RegistryTypes = 'CDN' | 'NPM';

/**
 * The TxResult is the result of constructing a transaction.
 * T extends Format in the context of the options passed in for the Format the user expects.
 */
export interface TxResult<T> {
	/**
	 * @description The destination specName of the transaction
	 */
	dest: string;
	/**
	 * @description The origin specName of the transaction
	 */
	origin: string;
	/**
	 * @description The format type the tx is ouputted in.
	 */
	format: Format | 'local';
	/**
	 * @description The xcm version that was used to construct the tx.
	 */
	xcmVersion: number | null;
	/**
	 * @description The direction of the cross chain transfer.
	 */
	direction: Direction | 'local';
	/**
	 * @description The method used in the transaction.
	 */
	method: Methods;
	/**
	 * @description The constructed transaction.
	 */
	tx: ConstructedFormat<T>;

	/**
	 * @description The result of xcm execution.
	 */
	xcmExecutionResult?: DispatchResultWithPostInfo | XcmDryRunApiError;
	/**
	 * @description Weight needed to execute the local segment of a provided XCM.
	 */
	localXcmFees?: [VersionedXcm, XcmFee];
	/**
	 * @description List of forwarded xcms and the weights needed to execute them.
	 */
	forwardedXcmFees?: [VersionedXcm, XcmFee][];
}

export type XcmFee = {
	xcmFee: string;
};

export type SignedOriginCaller = {
	System: {
		Signed: string;
	};
};
/**
 * The TransferArgsOpts are the options passed into createTransferTransaction.
 */
export interface TransferArgsOpts<T extends Format> {
	/**
	 * Option that specifies the format in which to return a transaction.
	 * It can either be a `payload`, `call`, or `submittable`.
	 *
	 * Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
	 * a `payload` or `call` will return a hex.
	 */
	format?: T;
	/**
	 * AssetId to pay fee's on the current common good parachain.
	 * Polkadot AssetHub: default DOT
	 * Kusama AssetHub: default KSM
	 */
	paysWithFeeOrigin?: string;
	/**
	 * AssetId to pay fee's on the destination parachain.
	 */
	paysWithFeeDest?: string;
	/**
	 * The SS58 Address the tx will be sent from. This is specifically used for the format `payload`.
	 * It is necessary because the `payload` will need information such as the `nonce`.
	 */
	sendersAddr?: string;
	/**
	 * Option for applying a custom `weightLimit`.
	 * If not inputted it will default to `Unlimited`.
	 */
	weightLimit?: {
		/**
		 * Provided when creating limited txs, represents the allowed amount of computation time
		 * the tx can use
		 */
		refTime?: string;

		/**
		 * Provided when creating limited txs, represents the amount of storage in bytes that can be used
		 * by the tx
		 */
		proofSize?: string;
	};
	/**
	 * Set the xcmVersion for message construction. If this is not present a supported version
	 * will be queried, and if there is no supported version a safe version will be queried.
	 */
	xcmVersion?: number;
	/**
	 * For creating local asset transfers, this will allow for a `transferKeepAlive` as opposed
	 * to a `transfer`.
	 */
	keepAlive?: boolean;
	/**
	 * For creating local asset transfers, this will allow for a `transferAll` call as opposed
	 * to a `transfer` call.
	 */
	transferAll?: boolean;
	/**
	 * Boolean to declare if this will transfer liquidity tokens.
	 * Default is false.
	 */
	transferLiquidToken?: boolean;
	/**
	 * The XCM `TransferType` used to transfer assets.
	 * Provided to construct `transferAssetsUsingTypeAndThen` transactions.
	 */
	assetTransferType?: string;
	/**
	 * The RemoteReserve location for an XCM transfer.
	 * Should be provided when specifying an `assetTransferType` of `RemoteReserve`.
	 */
	remoteReserveAssetTransferTypeLocation?: string;
	/**
	 * The XCM `TransferType` used to pay fees for an XCM transfer.
	 * Provided to construct `transferAssetsUsingTypeAndThen` transactions.
	 */
	feesTransferType?: string;
	/**
	 * The RemoteReserve location for an XCM transfers' fees.
	 * Should be provided when specfying a `feesTransferType` of RemoteReserve.
	 */
	remoteReserveFeesTransferTypeLocation?: string;
	/**
	 * Optional custom XCM message to be executed on destination chain.
	 * Should be provided if a custom xcm message is needed after transfering assets.
	 * Defaults to `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`
	 */
	customXcmOnDest?: string;
	/**
	 * Optionally allows for dry running the constructed tx in order get the estimated fees and execution result.
	 */
	dryRunCall?: boolean;

	/**
	 * Optional assetId that will be used to pay for fees. Used with the `dryRunCall` option to determine fees in the specified asset.
	 */
	xcmFeeAsset?: string;

	/**
	 * Optionally sets the pallet to be used for the current tx.
	 */
	xcmPalletOverride?: XcmPallet;
}

export type XcmPallet = 'xcmPallet' | 'polkadotXcm' | 'xtokens' | 'xTokens';

export interface ChainInfo {
	specName: string;
	specVersion: string;
}

/**
 * @hidden
 */
export interface SignerPayloadJSON {
	/**
	 * @description The ss-58 encoded address
	 */
	address: string;
	/**
	 * @description The checkpoint hash of the block, in hex
	 */
	blockHash: string;
	/**
	 * @description The checkpoint block number, in hex
	 */
	blockNumber: string;
	/**
	 * @description The era for this transaction, in hex
	 */
	era: string;
	/**
	 * @description The genesis hash of the chain, in hex
	 */
	genesisHash: string;
	/**
	 * @description The merkeleized metadata
	 */
	metadataHash: string | null;
	/**
	 * @description The encoded method (with arguments) in hex
	 */
	method: string;
	/**
	 * @description The mode for the CheckMetadataHash SignedExtension
	 */
	mode: string;
	/**
	 * @description The nonce for this transaction, in hex
	 */
	nonce: string;
	/**
	 * @description The current spec version for the runtime
	 */
	specVersion: string;
	/**
	 * @description The tip for this transaction, in hex
	 */
	tip: string;
	/**
	 * @description The current transaction version for the runtime
	 */
	transactionVersion: string;
	/**
	 * @description The applicable signed extensions for this runtime
	 */
	signedExtensions: string[];
	/**
	 * @description The version of the extrinsic we are dealing with
	 */
	version: number;
}

/**
 * JSON format for an unsigned transaction.
 *
 * @hidden
 */
export interface UnsignedTransaction extends SignerPayloadJSON {
	/**
	 * The assetId used in ChargeAssetTxPayment
	 *
	 * @default 0
	 */
	assetId: BN | AnyJson;
}

export interface XcmBaseArgs {
	api: ApiPromise;
	direction: XcmDirection;
	destAddr: string;
	assetIds: string[];
	amounts: string[];
	destChainId: string;
	xcmVersion: number;
	specName: string;
	registry: Registry;
}

export interface XcmBaseArgsWithPallet extends XcmBaseArgs {
	xcmPallet: XcmPalletName;
}

export interface LocalDest {
	Id: string;
}

export interface LocalTarget {
	Id: string;
}

export type AssetInfo = {
	id: string;
	symbol: string;
};

export type ForeignAssetMultiLocation = {
	parents: string;
	interior: InteriorMultiLocation;
};

export type AssetMetadata = {
	deposit: string;
	name: string;
	symbol: string;
	decimals: string;
	isFrozen: boolean;
};

export type ResolvedCallInfo = [Methods, SubmittableExtrinsic<'promise', ISubmittableResult>];

export type XTokensCallSignature = (
	baseArgs: XTokensBaseArgs,
	opts: CreateXcmCallOpts,
) => Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
export type XcmPalletCallSignature = (
	baseArgs: XcmBaseArgs,
	opts: CreateXcmCallOpts,
) => Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
export type CallArgs = [XcmBaseArgs | XTokensBaseArgs, CreateXcmCallOpts];

export type XTokensTxMethodTransactionMap = {
	[x: string]: [XTokensCallSignature, CallArgs];
};
export type XcmPalletTxMethodTransactionMap = {
	[x: string]: [XcmPalletCallSignature, CallArgs];
};

export type RemoteReserveV3 = {
	RemoteReserve: {
		V3: UnionXcmMultiLocation;
	};
};
export type RemoteReserveV4 = {
	RemoteReserve: {
		V4: UnionXcmMultiLocation;
	};
};
export type RemoteReserve = RemoteReserveV3 | RemoteReserveV4;
export type LocalReserve = {
	LocalReserve: 'null';
};
export type DestinationReserve = {
	DestinationReserve: 'null';
};
export type Teleport = {
	Teleport: 'null';
};

export type AssetTransferType = LocalReserve | DestinationReserve | Teleport | RemoteReserve;
