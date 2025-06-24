import { Direction } from '../types.js';
import { ParaToEthereum } from './handlers/ParaToEthereum.js';
import { ParaToPara } from './handlers/ParaToPara.js';
import { ParaToRelay } from './handlers/ParaToRelay.js';
import { ParaToSystem } from './handlers/ParaToSystem.js';
import { RelayToBridge } from './handlers/RelayToBridge.js';
import { RelayToPara } from './handlers/RelayToPara.js';
import { RelayToSystem } from './handlers/RelayToSystem.js';
import { SystemToBridge } from './handlers/SystemToBridge.js';
import { SystemToPara } from './handlers/SystemToPara.js';
import { SystemToRelay } from './handlers/SystemToRelay.js';
import { SystemToSystem } from './handlers/SystemToSystem.js';
import { ICreateXcmType, ICreateXcmTypeConstructor } from './types.js';

type ValidDirection = Exclude<Direction, Direction.Local>;
type ICreateXcmTypeLookup = {
	[key in ValidDirection]: ICreateXcmTypeConstructor;
};

const createXcmTypes: ICreateXcmTypeLookup = {
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
	ParaToEthereum,
};

export const getTypeCreator = (direction: ValidDirection, xcmVersion: number): ICreateXcmType => {
	const constructor = createXcmTypes[direction];
	return new constructor(xcmVersion);
};
