import { MAX_NUM_LENGTH } from '../consts';

export const validateNumber = (val: string): boolean => {
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
