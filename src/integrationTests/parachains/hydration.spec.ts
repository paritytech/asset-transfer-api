import { AssetTransferApi } from '../../AssetTransferApi';
import { adjustedmockHydrationParachainApi } from '../../testHelpers/adjustedMockHydrationParachainApi';

const hydrationATA = new AssetTransferApi(adjustedmockHydrationParachainApi, 'hydradx', 3, {
	registryType: 'NPM',
	injectedRegistry: {
		polkadot: {
			2034: {
				xcAssetsData: [
					{
						symbol: 'WETH.snow',
						xcmV1MultiLocation:
							'{"v1":{"parents":2,"interior":{"x2":[{"globalConsensus":{"ethereum":{"chainId":1}}},{"accountKey20":{"network":null,"key":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]}}}',
					},
				],
			},
		},
	},
});

describe('Hydration', () => {
	describe('ParaToEthereum', () => {
		describe('transferAssetsUsingTypeAndThen', () => {
			describe('XCM V3', () => {
				it('Should correctly construct a transferAssetsUsingTypeAndThen call from Hydration to Ethereum', async () => {
					const result = await hydrationATA.createTransferTransaction(
						`{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`,
						'0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
						['DOT', 'WETH.snow'],
						['10000000000000', '95000000000000'],
						{
							sendersAddr: '7KqMfyEXGMAgkNGxiTf3PNgKqSH1WNghbAGLKezYyLLW4Zp1',
							format: 'payload',
							xcmVersion: 3,
							paysWithFeeDest: 'DOT',
						},
					);
					const expected =
						'0x31046b0d03010100a10f0308000100000b00a0724e18090002020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000b00f040e96656020300010002030c16040d01000001010062fecf9c60d8d49d400bd86804558401ec7151fecd440041ca6bf5fd578251771001010002020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20002010907040c130000010300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20004000d010204000103006e733286c3dc52c67b8dadfdd634ed9c3fb05b5b2c00000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000000004502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300';

					expect(result.tx.toHex()).toEqual(expected);
				});
			});
			describe('XCM V4', () => {
				it('Should correctly construct a transferAssetsUsingTypeAndThen call from Hydration to Ethereum paying destination fees with DOT', async () => {
					const result = await hydrationATA.createTransferTransaction(
						`{"parents":"2","interior":{"X1":{"GlobalConsensus":{"Ethereum":{"chainId":"1"}}}}}`,
						'0x6E733286C3Dc52C67b8DAdFDd634eD9c3Fb05B5B',
						['DOT', 'WETH.snow'],
						['10000000000000', '10000000000000'],
						{
							sendersAddr: '7KqMfyEXGMAgkNGxiTf3PNgKqSH1WNghbAGLKezYyLLW4Zp1',
							format: 'payload',
							xcmVersion: 4,
							paysWithFeeDest: 'DOT',
						},
					);
					const expected =
						'0x1d046b0d04010100a10f04080100000b00a0724e180902020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000b00a0724e18090204010002040c16040d01000001010062fecf9c60d8d49d400bd86804558401ec7151fecd440041ca6bf5fd5782517710010102020907040300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20002010907040c1300010300c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20004000d010204000103006e733286c3dc52c67b8dadfdd634ed9c3fb05b5b2c00000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000000004502280000fe080000040000000000000000000000000000000000000000000000000000000000000000000000be2554aa8a0151eb4d706308c47d16996af391e4c5e499c7cbef24259b7d450300';

					expect(result.tx.toHex()).toEqual(expected);
				});
			});
		});
	});
});
