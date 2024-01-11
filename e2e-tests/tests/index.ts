// Copyright 2023 Parity Technologies (UK) Ltd.

export { assetTests } from './assets';
export { foreignAssetsTests } from './foreignAssets';
export { liquidPoolsTests } from './liquidPools';
export { localTests } from './local';
import { BOB_ADDR, FERDE_ADDR } from '../consts';

export interface IndividualTest {
	test: string;
	args: string[];
	verification: string[];
}

export interface TestGroups {
	foreignAssets: IndividualTest[];
	liquidPools: IndividualTest[];
	assets: IndividualTest[];
	local: IndividualTest[];
}

export const tests: TestGroups = {
	foreignAssets: [
		{
			// This will declare the call to use
			test: 'createTransferTransactionCall',
			// This will be all the args for the above call
			args: [
				'1836',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[{ "parents": "1", "interior": { "X2": [{ "Parachain": "1836" }, { "GeneralIndex": "0" }]}}]',
				'[200000000000]',
				'{ "format": "submittable", "xcmVersion": 3 }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['<dest_addr>', '<dest_chain_id>'],
		},
	],
	liquidPools: [
		{
			// This will declare the call to use
			test: 'createLocalTransferTransaction',
			// This will be all the args for the above call
			args: [
				'1000',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[0]',
				'[20000]',
				'{ "format": "submittable", "transferLiquidToken": true }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['[0]', '[2000]'],
		},
		{
			// This will declare the call to use
			test: 'createPayFeesTransaction',
			// This will be all the args for the above call
			args: [
				'1000',
				'1000',
				'//Bob',
				FERDE_ADDR,
				'[0]',
				'[3000000]',
				'{ "format": "payload", "xcmVersion": 3, "transferLiquidToken": true, "paysWithFeeOrigin": { "parents": "0", "interior": { "X2": [{"PalletInstance": "50"}, { "GeneralIndex": "1" }]}}, "sendersAddr": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['[0]', '[3000000]'],
		},
	],
	local: [
		{
			// This will declare the call to use
			test: 'createLocalTransferTransaction',
			// This will be all the args for the above call
			args: [
				'1000',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[]',
				'[100000000000]',
				'{ "format": "submittable", "keepAlive": true }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['[0]', '[10000000000000]'],
		},
		{
			// This will declare the call to use
			test: 'createLocalTransferTransaction',
			// This will be all the args for the above call
			args: [
				'0',
				'0',
				'//Alice',
				BOB_ADDR,
				'[]',
				'[100000000000000000]',
				'{ "format": "submittable", "keepAlive": true }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['[0]', '[10000000000000]'],
		},
	],
	assets: [
		{
			// This will declare the call to use
			test: 'createLocalSystemAssetsTransferTransaction',
			// This will be all the args for the above call
			args: [
				'1000',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[1]',
				'[3000000000000]',
				'{ "format": "submittable", "keepAlive": true }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['[1]', '[30000]'],
		},
		{
			// This will declare the call to use
			test: 'createPayFeesTransaction',
			// This will be all the args for the above call
			args: [
				'1000',
				'1000',
				'//Bob',
				FERDE_ADDR,
				'[1]',
				'[200000000000]',
				'{ "format": "submittable", "keepAlive": true }',
			],
			// This will be a tuple that will allow us to verify if the xcm message
			// succesfully went through on the other end
			verification: ['[1]', '[2000]'],
		},
	],
};
