// Copyright 2023 Parity Technologies (UK) Ltd.

export const normalizeArrToStr = (arr: (string | number)[]): string[] => {
	return arr.map((val) => {
		if (typeof val === 'string') {
			return val;
		}

		if (typeof val === 'number') {
			return val.toString();
		}

		// Should never hit this, this exists to make the typescript compiler happy.
		return val;
	});
};
