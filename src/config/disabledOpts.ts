// Copyright 2023 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../errors/BaseError';
import { Format, TransferArgsOpts } from '../types';

interface DisabledOptionsInfo {
	disabled: boolean;
	chains: string[];
	error: (opts: string, chain: string) => never;
}

export type MappedOpts = Extract<keyof TransferArgsOpts<Format>, string>;

type DisabledOptions = {
	[key in MappedOpts]: DisabledOptionsInfo;
};

const callError = (opt: string, chain: string) => {
	throw new BaseError(`${opt} is disbaled for ${chain}.`, BaseErrorsEnum.DisabledOption);
};

export const disabledOpts: DisabledOptions = {
	format: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	paysWithFeeOrigin: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	paysWithFeeDest: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	sendersAddr: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	weightLimit: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	xcmVersion: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	keepAlive: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	transferAll: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	transferLiquidToken: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	assetTransferType: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	remoteReserveAssetTransferTypeLocation: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	feesTransferType: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	remoteReserveFeesTransferTypeLocation: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	customXcmOnDest: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	dryRunCall: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
	xcmFeeAsset: {
		disabled: false,
		chains: [],
		error: (opt: string, chain: string) => callError(opt, chain),
	},
};
