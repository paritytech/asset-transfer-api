// Copyright 2023 Parity Technologies (UK) Ltd.

import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { u32 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { ChainInfoRegistry } from './registry/types';

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> &
			Partial<Record<Exclude<Keys, K>, undefined>>;
	}[Keys];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

export enum Direction {
	SystemToPara = 'SystemToPara',
	SystemToRelay = 'SystemToRelay',
	ParaToPara = 'ParaToPara',
	ParaToRelay = 'ParaToRelay',
	ParaToSystem = 'ParaToSystem',
	RelayToSystem = 'RelayToSystem',
	RelayToPara = 'RelayToPara',
}

export enum AssetType {
	Native = 'Native',
	Foreign = 'Foreign',
}

/**
 * AssetTransferApi supports three formats to be returned:
 * - payload: This returns a Polkadot-js `ExtrinsicPayload` as a hex.
 * - call: This returns a Polkadot-js `Call` as a hex.
 * - submittable: This returns a Polkadot-js `SubmittableExtrinsic`.
 */
export type Format = 'payload' | 'call' | 'submittable';

export type ConstructedFormat<T> = T extends 'payload'
	? `0x${string}`
	: T extends 'call'
	? `0x${string}`
	: T extends 'submittable'
	? SubmittableExtrinsic<'promise', ISubmittableResult>
	: never;

export type LocalTransferTypes =
	| 'assets::transfer'
	| 'assets::transferKeepAlive'
	| 'balances::transfer'
	| 'balances::transferKeepAlive';

export type Methods =
	| LocalTransferTypes
	| 'reserveTransferAssets'
	| 'limitedReserveTransferAssets'
	| 'teleportAssets'
	| 'limitedTeleportAssets';

export type AssetsTransferApiOpts = {
	injectedRegistry?: RequireAtLeastOne<ChainInfoRegistry>;
};

/**
 * The TxResult is the result of constructing a transaction.
 * T extends Format in the context of the options passed in for the Format the user expects.
 */
export interface TxResult<T> {
	format: string;
	xcmVersion: number | null;
	direction: Direction | 'local';
	method: Methods;
	tx: ConstructedFormat<T>;
}

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
	 * Statemint: default DOT
	 * Statemine: default KSM
	 */
	paysWithFeeOrigin?: string;
	/**
	 * AssetId to pay fee's on the destination parachain.
	 */
	paysWithFeeDest?: string;
	/**
	 * Boolean to declare if this will be with limited XCM transfers.
	 * Deafult is unlimited.
	 */
	isLimited?: boolean;
	/**
	 * When isLimited is true, the option for applying a weightLimit is possible.
	 * If not inputted it will default to `Unlimited`.
	 */
	weightLimit?: string;
	/**
	 * Set the xcmVersion for message construction. If this is not present a supported version
	 * will be queried, and if there is no supported version a safe version will be queried.
	 */
	xcmVersion?: number;
	/**
	 * For creating local asset transfers, this will allow for a `transferKeepAlive` as oppose
	 * to a `transfer`.
	 */
	keepAlive?: boolean;
}

export interface ChainInfo {
	specName: string;
	specVersion: string;
}

export type NonRelayNativeInterior = {
	X2: [{ PalletInstance: string }, { GeneralIndex: string }];
};

export type RelayNativeInterior = {
	Here: string;
};

export type MultiAssetInterior = NonRelayNativeInterior | RelayNativeInterior;

export type MultiAsset = {
	fun: {
		Fungible: string;
	};
	id: {
		Concrete: {
			interior: MultiAssetInterior;
			parents: number;
		};
	};
};

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
	 * @description The encoded method (with arguments) in hex
	 */
	method: string;
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
 */
export interface UnsignedTransaction extends SignerPayloadJSON {
	/**
	 * The assetId used in ChargeAssetTxPayment
	 *
	 * @default 0
	 */
	assetId?: number;
}

export interface Dest {
	id: string;
}

export interface Args {
	dest: Dest;
	value: u32;
}

export interface Method {
	args: Args;
	method: string;
	section: string;
}
export interface SubmittableMethodData {
	isSigned: boolean;
	method: Method;
}
