import { normalizeArrToStr } from './normalizeArrToStr';

describe('normalizeAccounts', () => {
	it('Should handle an array with both strings and numbers', () => {
		const vals = ['100', 100];

		expect(normalizeArrToStr(vals)).toEqual(['100', '100']);
	});

	it('Should handle just string correctly', () => {
		const vals = ['100', '100'];

		expect(normalizeArrToStr(vals)).toEqual(['100', '100']);
	});

	it('Should handle just numbers correctly', () => {
		const vals = [100, 100];

		expect(normalizeArrToStr(vals)).toEqual(['100', '100']);
	});
});
