import { Registry } from '../../registry';
import { mockMoonriverParachainApi } from '../../testHelpers/mockMoonriverParachainApi';
import { ParaToEthereum } from './ParaToEthereum';

describe('ParaToEthereum', () => {
	const registry = new Registry('kusama', {});
	const v2Handler = new ParaToEthereum(2);
	const v3Handler = new ParaToEthereum(3);
	const v4Handler = new ParaToEthereum(4);
	const v5Handler = new ParaToEthereum(5);

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = v2Handler.createDest('100');

			const expectedRes = {
				V2: {
					parents: 1,
					interior: {
						X1: {
							Parachain: 100,
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = v3Handler.createDest('100');

			const expectedRes = {
				V3: {
					parents: 1,
					interior: {
						X1: {
							Parachain: 100,
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V4', () => {
			const destination = v4Handler.createDest('100');

			const expectedRes = {
				V4: {
					parents: 1,
					interior: {
						X1: [
							{
								Parachain: 100,
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V5', () => {
			const destination = v5Handler.createDest('100');

			const expectedRes = {
				V5: {
					parents: 1,
					interior: {
						X1: [
							{
								Parachain: 100,
							},
						],
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
	});
	describe('Assets', () => {
		const isLiquidTokenTransfer = false;
		const isForeignAssetsTransfer = false;
		it('Should work for V2', async () => {
			const assets = await v2Handler.createAssets(
				['1000000000000', '2000000000'],
				'moonriver',
				['42259045809535163221576417993425387648', '182365888117048807484804376330534607370'],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: mockMoonriverParachainApi,
				},
			);

			const expectedRes = {
				V2: [
					{
						id: {
							Concrete: {
								parents: '1',
								interior: {
									Here: null,
								},
							},
						},
						fun: {
							Fungible: '1000000000000',
						},
					},
					{
						id: {
							Concrete: {
								parents: '1',
								interior: {
									X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '8' }],
								},
							},
						},
						fun: {
							Fungible: '2000000000',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V3', async () => {
			const assets = await v3Handler.createAssets(
				['1000000', '20000000000'],
				'moonriver',
				['182365888117048807484804376330534607370', '311091173110107856861649819128533077277'],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: mockMoonriverParachainApi,
				},
			);

			const expectedRes = {
				V3: [
					{
						id: {
							Concrete: {
								parents: '1',
								interior: {
									X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '8' }],
								},
							},
						},
						fun: {
							Fungible: '1000000',
						},
					},
					{
						id: {
							Concrete: {
								parents: '1',
								interior: {
									X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
								},
							},
						},
						fun: {
							Fungible: '20000000000',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V4', async () => {
			const assets = await v4Handler.createAssets(
				['1000000', '20000000000'],
				'moonriver',
				['182365888117048807484804376330534607370', '311091173110107856861649819128533077277'],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: mockMoonriverParachainApi,
				},
			);

			const expectedRes = {
				V4: [
					{
						id: {
							parents: '1',
							interior: {
								X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '8' }],
							},
						},
						fun: {
							Fungible: '1000000',
						},
					},
					{
						id: {
							parents: '1',
							interior: {
								X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
							},
						},
						fun: {
							Fungible: '20000000000',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
		it('Should work for V5', async () => {
			const assets = await v5Handler.createAssets(
				['1000000', '20000000000'],
				'moonriver',
				['182365888117048807484804376330534607370', '311091173110107856861649819128533077277'],
				{
					registry,
					isForeignAssetsTransfer,
					isLiquidTokenTransfer,
					api: mockMoonriverParachainApi,
				},
			);

			const expectedRes = {
				V5: [
					{
						id: {
							parents: '1',
							interior: {
								X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '8' }],
							},
						},
						fun: {
							Fungible: '1000000',
						},
					},
					{
						id: {
							parents: '1',
							interior: {
								X3: [{ Parachain: '1000' }, { PalletInstance: '50' }, { GeneralIndex: '1984' }],
							},
						},
						fun: {
							Fungible: '20000000000',
						},
					},
				],
			};

			expect(assets).toStrictEqual(expectedRes);
		});
	});
});
