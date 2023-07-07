// Copyright 2023 Parity Technologies (UK) Ltd.

import { Direction } from '../types';
import { ParaToSystem } from './ParaToSystem';
import { RelayToPara } from './RelayToPara';
import { RelayToSystem } from './RelayToSystem';
import { SystemToPara } from './SystemToPara';
import { SystemToRelay } from './SystemToRelay';
import { SystemToSystem } from './SystemToSystem';
import { ICreateXcmType } from './types';

type ICreateXcmTypeLookup = {
	[key in Direction]: ICreateXcmType;
};

export const createXcmTypes: ICreateXcmTypeLookup = {
	SystemToSystem,
	SystemToPara,
	RelayToPara,
	SystemToRelay,
	RelayToSystem,
	ParaToPara: {} as ICreateXcmType,
	ParaToRelay: {} as ICreateXcmType,
	ParaToSystem,
};
