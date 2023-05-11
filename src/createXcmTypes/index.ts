// Copyright 2023 Parity Technologies (UK) Ltd.

import { Direction } from '../types';
import { RelayToPara } from './RelayToPara';
import { RelayToSystem } from './RelayToSystem';
import { SystemToPara } from './SystemToPara';
import { SystemToRelay } from './SystemToRelay';
import { ICreateXcmType } from './types';

type ICreateXcmTypeLookup = {
	[key in Direction]: ICreateXcmType;
};

export const createXcmTypes: ICreateXcmTypeLookup = {
	SystemToPara,
	RelayToPara,
	SystemToRelay,
	RelayToSystem,
	ParaToPara: {} as ICreateXcmType,
	ParaToRelay: {} as ICreateXcmType,
};
