// Copyright 2023 Parity Technologies (UK) Ltd.

import { Format, TransferArgsOpts } from '../types';

interface DisabledOptionsInfo {
	disabled: boolean;
	chains: string[];
}

type MappedOpts = Extract<keyof TransferArgsOpts<Format>, string>;

type DisabledOptions = {
	[key in MappedOpts]: DisabledOptionsInfo;
};

export const disabledOpts: DisabledOptions = {
	format: {
		disabled: false,
		chains: [],
	},
	paysWithFeeOrigin: {
		disabled: true,
		chains: ['westend', 'westmint'],
	},
	paysWithFeeDest: {
		disabled: false,
		chains: [],
	},
	sendersAddr: {
		disabled: false,
		chains: [],
	},
	isLimited: {
		disabled: false,
		chains: [],
	},
	weightLimit: {
		disabled: false,
		chains: [],
	},
	xcmVersion: {
		disabled: false,
		chains: [],
	},
	keepAlive: {
		disabled: false,
		chains: [],
	},
	transferLiquidToken: {
		disabled: false,
		chains: [],
	},
};
