import { IDirection } from '../types';
import { RelayToPara } from './RelayToPara';
import { SystemToPara } from './SystemToPara';
import { ICreateXcmType } from './types';

type ICreateXcmTypeLookup = {
	[key in IDirection]: ICreateXcmType;
};

export const createXcmTypes: ICreateXcmTypeLookup = {
	SystemToPara,
	RelayToPara,
	// TODO: Implement the following!
	SystemToRelay: {} as ICreateXcmType,
	ParaToPara: {} as ICreateXcmType,
	ParaToRelay: {} as ICreateXcmType,
	RelayToSystem: {} as ICreateXcmType,
};
