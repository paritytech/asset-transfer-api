import { validateNumber } from './validateNumber.js';

describe('validateNumber', () => {
	it('Should correctly validate a number as a string with a length less than 16', () => {
		const res = validateNumber('123456789000000');

		expect(res).toEqual(true);
	});
	it('Should return false on an invalid number as a string with a length less than 16', () => {
		const res = validateNumber('test');

		expect(res).toEqual(false);
	});
	it('Should correctly validate a number as a string with a length greater than 16', () => {
		const res = validateNumber('123456789000000123456789');

		expect(res).toEqual(true);
	});
	it('Should return false on an invalid number as a string with a length greater than 16', () => {
		const res = validateNumber('thisisatestthissisatestthisisatest');

		expect(res).toEqual(false);
	});
});
