import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { GenericCall, GenericExtrinsicPayload } from '@polkadot/types';
import type { AnyTuple } from '@polkadot/types/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export enum IDirection {
	SystemToPara = 'SystemToPara',
	SystemToRelay = 'SystemToRelay',
	ParaToPara = 'ParaToPara',
	ParaToRelay = 'ParaToRelay',
	RelayToSystem = 'RelayToSystem',
	RelayToPara = 'RelayToPara',
}

export type Format = 'payload' | 'call' | 'submittable';

export type ConstructedFormat =
	| GenericCall<AnyTuple>
	| SubmittableExtrinsic<'promise', ISubmittableResult>
	| GenericExtrinsicPayload;

export interface ITransferArgsOpts {
	/**
	 * Signing Payload vs Call
	 */
	format?: Format;
	/**
	 * AssetId to pay fee's on the current common good parachain.
	 * Statemint: default DOT
	 * Statemine: default KSM
	 */
	payFeeWith?: string;
	/**
	 * AssetId to pay fee's on the destination parachain.
	 */
	payFeeWithTo?: string;
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
}

export interface IChainInfo {
	specName: string;
	specVersion: string;
}
