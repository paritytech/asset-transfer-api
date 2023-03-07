import { ICreateXcmType } from './types';

import { SystemToPara } from './SystemToPara';
import { RelayToPara } from './RelayToPara';

interface ICreateXcmTypeLookup {
    SystemToPara: ICreateXcmType;
    RelayToPara: ICreateXcmType;
}

export const createXcmTypes: ICreateXcmTypeLookup = {
    SystemToPara,
    RelayToPara,
}
