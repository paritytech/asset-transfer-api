import { Registry } from '../../registry';
import { mockRelayApiV9420 } from '../../testHelpers/mockRelayApiV9420';
import { RelayToSystem } from './RelayToSystem';

describe('RelayToSystem XcmVersioned Generation', () => {
	const v2Handler = new RelayToSystem(2);
	const v3Handler = new RelayToSystem(3);
	const v4Handler = new RelayToSystem(4);
	const v5Handler = new RelayToSystem(5);
	const registry = new Registry('kusama', {});

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = v2Handler.createDest('100', 2);

			const expectedRes = {
				V2: {
					parents: 0,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = v3Handler.createDest('100', 3);

			const expectedRes = {
				V3: {
					parents: 0,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V4', () => {
			const destination = v4Handler.createDest('100', 4);

			const expectedRes = {
				V4: {
					parents: 0,
					interior: {
						X1: [
							{
								Parachain: '100',
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V5', () => {
			const destination = v5Handler.createDest('100', 5);

			const expectedRes = {
				V5: {
					parents: 0,
					interior: {
						X1: [
							{
								Parachain: '100',
							},
						],
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
			const assets = await v2Handler.createAssets(['100'], 2, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V2: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							Concrete: {
								interior: {
									Here: '',
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await v3Handler.createAssets(['100'], 3, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V3: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							Concrete: {
								interior: {
									Here: '',
								},
								parents: 0,
							},
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await v4Handler.createAssets(['100'], 4, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V4: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 0,
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V5', async () => {
			const assets = await v5Handler.createAssets(['100'], 5, '', [], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
				api: mockRelayApiV9420,
			});

			const expectedRes = {
				V5: [
					{
						fun: {
							Fungible: '100',
						},
						id: {
							interior: {
								Here: '',
							},
							parents: 0,
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
	});
});
