import { MAX_NUM_LENGTH } from '../consts';

/**
 * Check if a given string input is a valid integer.
 *
 * @param val
 */
export const validateNumber = (val: string): boolean => {
	if (!val) return false;

	if (val.length < MAX_NUM_LENGTH) {
		const isNum = Number.parseInt(val);

		return !Number.isNaN(isNum);
	}

	try {
		BigInt(val);
	} catch {
		return false;
	}

	return true;
};
