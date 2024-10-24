import { AnyObj } from '../types';

enum MultiLocationJunctionTypeKeys {
	'parachain' = 'Parachain',
	'accountid32' = 'AccountId32',
	'accountindex64' = 'AccountIndex64',
	'accountkey20' = 'AccountKey20',
	'palletinstance' = 'PalletInstance',
	'generalindex' = 'GeneralIndex',
	'generalkey' = 'GeneralKey',
	'onlychild' = 'OnlyChild',
	'plurality' = 'Plurality',
	'globalconsensus' = 'GlobalConsensus',
}

const isPlainObject = (input: unknown) => {
	return input && !Array.isArray(input) && typeof input === 'object';
};

/**
 * Set all keys in an object with the first key being capitalized.
 * When a keys value is an integer it will convert that integer into a string.
 *
 * @param xcmObj
 */
export const sanitizeKeys = <T extends AnyObj>(xcmObj: T): T => {
	const final = {} as AnyObj;

	// Iterate over key-value pairs of the root object 'obj'
	for (const [key, value] of Object.entries(xcmObj)) {
		if (Array.isArray(value)) {
			final[mapKey(key)] = value.map(sanitizeKeys);
		} else if (!isPlainObject(value)) {
			// Ensure when the value is an integer that it is sanitized to a string.
			const sanitizedValue = Number.isInteger(value) ? Number(value).toString() : value;
			final[mapKey(key)] = sanitizedValue;
		} else {
			final[mapKey(key)] = sanitizeKeys(value as AnyObj);
		}
	}

	return final as T;
};

const mapKey = (key: string): string => {
	const lowerKey = key.toLowerCase() as keyof typeof MultiLocationJunctionTypeKeys;
	if (MultiLocationJunctionTypeKeys[lowerKey]) {
		return MultiLocationJunctionTypeKeys[lowerKey] as string;
	}
	return key[0].toUpperCase() + key.slice(1).toLowerCase();
};
