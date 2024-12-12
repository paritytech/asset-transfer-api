import { checkBaseInputTypes } from './checkBaseInputTypes';

describe('checkBaseInputTypes', () => {
	it('Should error when destChainId is the wrong type', () => {
		const err = () =>
			checkBaseInputTypes(
				1000 as unknown as string,
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['TST'],
				['10000000000'],
			);

		expect(err).toThrow(`'destChainId' must be a string. Received: number`);
	});
	it('Should error when destAddr is the wrong type', () => {
		const err = () => checkBaseInputTypes('1000', 10000000 as unknown as string, ['TST'], ['10000000000']);

		expect(err).toThrow(`'destAddr' must be a string. Received: number`);
	});
	it('Should error when assetIds is the wrong type', () => {
		const err = () =>
			checkBaseInputTypes(
				'1000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				'TST' as unknown as string[],
				['10000000000'],
			);

		expect(err).toThrow(`'assetIds' must be an array. Received: string`);
	});
	it('Should error when assetIds has the wrong types in the array', () => {
		const err = () =>
			checkBaseInputTypes(
				'1000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				[1] as unknown as string[],
				['10000000000'],
			);

		expect(err).toThrow(`All inputs in the 'assetIds' array must be strings: Received: a number at index 0`);
	});
	it('Should error when amounts is the wrong type', () => {
		const err = () =>
			checkBaseInputTypes(
				'1000',
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				['TST'],
				10000000000 as unknown as string[],
			);

		expect(err).toThrow(`'amounts' must be an array. Received: number`);
	});
	it('Should error when amounts has the wrong types in the array', () => {
		const err = () =>
			checkBaseInputTypes('1000', '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b', ['TST'], [
				10000000000,
			] as unknown as string[]);

		expect(err).toThrow(`All inputs in the 'amounts' array must be strings: Received: a number at index 0`);
	});
});
