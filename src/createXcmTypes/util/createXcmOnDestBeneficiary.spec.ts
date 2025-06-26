// import { UnionXcmMultiLocation } from "../types";
import { createXcmOnDestBeneficiary } from './createXcmOnDestBeneficiary';

describe('createXcmOnDestBeneficiary hello', () => {
	it('Should correctly construct the beneficiary for XCM V3 using an Ethereum address', () => {
		const xcmVersion = 3;
		const accountId = '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B';

		const expected = {
			parents: 0,
			interior: {
				X1: {
					AccountKey20: { key: accountId },
				},
			},
		};

		expect(createXcmOnDestBeneficiary(accountId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct the beneficiary for XCM V3 using a Substrate address', () => {
		const xcmVersion = 3;
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const expected = {
			parents: 0,
			interior: {
				X1: {
					AccountId32: { id: accountId },
				},
			},
		};

		expect(createXcmOnDestBeneficiary(accountId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct the beneficiary for XCM V4 using an Ethereum address', () => {
		const xcmVersion = 4;
		const accountId = '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B';

		const expected = {
			parents: 0,
			interior: {
				X1: [{ AccountKey20: { key: accountId } }],
			},
		};

		expect(createXcmOnDestBeneficiary(accountId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct the beneficiary for XCM V5 using an Ethereum address', () => {
		const xcmVersion = 5;
		const accountId = '0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B';

		const expected = {
			parents: 0,
			interior: {
				X1: [{ AccountKey20: { key: accountId } }],
			},
		};

		expect(createXcmOnDestBeneficiary(accountId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct the beneficiary for XCM V4 using a Substrate address', () => {
		const xcmVersion = 4;
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const expected = {
			parents: 0,
			interior: {
				X1: [{ AccountId32: { id: accountId } }],
			},
		};

		expect(createXcmOnDestBeneficiary(accountId, xcmVersion)).toEqual(expected);
	});
	it('Should correctly construct the beneficiary for XCM V5 using a Substrate address', () => {
		const xcmVersion = 5;
		const accountId = '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b';

		const expected = {
			parents: 0,
			interior: {
				X1: [{ AccountId32: { id: accountId } }],
			},
		};

		expect(createXcmOnDestBeneficiary(accountId, xcmVersion)).toEqual(expected);
	});
});
