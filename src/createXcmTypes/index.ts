// Copyright 2023 Parity Technologies (UK) Ltd.

import { Direction } from '../types';
import { ParaToPara } from './ParaToPara';
import { ParaToRelay } from './ParaToRelay';
import { ParaToSystem } from './ParaToSystem';
import { RelayToPara } from './RelayToPara';
import { RelayToSystem } from './RelayToSystem';
import { SystemToPara } from './SystemToPara';
import { SystemToRelay } from './SystemToRelay';
import { SystemToSystem } from './SystemToSystem';
import { SystemToBridge } from './SystemToBridge';
import { ICreateXcmType } from './types';

type ICreateXcmTypeLookup = {
	[key in Exclude<Direction, Direction.Local>]: ICreateXcmType;
};

export const createXcmTypes: ICreateXcmTypeLookup = {
	SystemToSystem,
	SystemToPara,
	SystemToRelay,
	SystemToBridge,
	RelayToPara,
	RelayToSystem,
	ParaToPara,
	ParaToRelay,
	ParaToSystem,
};
