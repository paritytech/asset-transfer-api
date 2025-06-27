import { Registry } from '../../registry';
import { mockSystemApi } from '../../testHelpers/mockSystemApi';
import { SystemToRelay } from './SystemToRelay';

describe('SystemToRelay XcmVersioned Generation', () => {
	const v2Handler = new SystemToRelay(2);
	const v3Handler = new SystemToRelay(3);
	const v4Handler = new SystemToRelay(4);
	const v5Handler = new SystemToRelay(5);
	const registry = new Registry('statemine', {});

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = v2Handler.createDest('0');

			const expectedRes = {
				V2: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = v3Handler.createDest('0');

			const expectedRes = {
				V3: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V4', () => {
			const destination = v4Handler.createDest('0');

			const expectedRes = {
				V4: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V5', () => {
			const destination = v5Handler.createDest('0');

			const expectedRes = {
				V5: {
					parents: 1,
					interior: {
						Here: null,
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		const isForeignAssetsTransfer = false;
		const isLiquidTokenTransfer = false;
		it('Should work for V2', async () => {
			const assets = await v2Handler.createAssets(['100'], '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V2: [
					{
						id: {
							Concrete: {
								parents: 1,
								interior: {
									Here: '',
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await v3Handler.createAssets(['100'], '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V3: [
					{
						id: {
							Concrete: {
								parents: 1,
								interior: {
									Here: '',
								},
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await v4Handler.createAssets(['100'], '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V4: [
					{
						id: {
							parents: 1,
							interior: {
								Here: '',
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V5', async () => {
			const assets = await v5Handler.createAssets(['100'], '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockSystemApi,
			});

			const expectedRes = {
				V5: [
					{
						id: {
							parents: 1,
							interior: {
								Here: '',
							},
						},
						fun: {
							Fungible: '100',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
	});
});
