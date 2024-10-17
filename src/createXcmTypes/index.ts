// Copyright 2023 Parity Technologies (UK) Ltd.

import { Direction } from '../types.js';
import { ParaToPara } from './ParaToPara.js';
import { ParaToRelay } from './ParaToRelay.js';
import { ParaToSystem } from './ParaToSystem.js';
import { RelayToBridge } from './RelayToBridge.js';
import { RelayToPara } from './RelayToPara.js';
import { RelayToSystem } from './RelayToSystem.js';
import { SystemToBridge } from './SystemToBridge.js';
import { SystemToPara } from './SystemToPara.js';
import { SystemToRelay } from './SystemToRelay.js';
import { SystemToSystem } from './SystemToSystem.js';
import { ICreateXcmType } from './types.js';

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
	RelayToBridge,
	ParaToPara,
	ParaToRelay,
	ParaToSystem,
};
