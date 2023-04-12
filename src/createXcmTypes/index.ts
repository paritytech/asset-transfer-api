// Copyright 2023 Parity Technologies (UK) Ltd.

import { IDirection } from '../types';
import { RelayToPara } from './RelayToPara';
import { RelayToSystem } from './RelayToSystem';
import { SystemToPara } from './SystemToPara';
import { SystemToRelay } from './SystemToRelay';
import { ICreateXcmType } from './types';

type ICreateXcmTypeLookup = {
	[key in IDirection]: ICreateXcmType;
};

export const createXcmTypes: ICreateXcmTypeLookup = {
	SystemToPara,
	RelayToPara,
	SystemToRelay,
	RelayToSystem,
	ParaToPara: {} as ICreateXcmType,
	ParaToRelay: {} as ICreateXcmType,
};
