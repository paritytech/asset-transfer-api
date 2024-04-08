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
			test: 'createForeignTransferTransaction',
			args: [
				'1000',
				'1836',
				'//Alice',
				BOB_ADDR,
				'[{ "parents": "1", "interior": { "X2": [{ "Parachain": "1836" }, { "GeneralIndex": "0" }]}}]',
				'[200000000]',
				'{ "format": "payload", "xcmVersion": 3, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }',
			],
			verification: [
				'[{ "parents": "1", "interior": { "X2": [{ "Parachain": "1836" }, { "GeneralIndex": "0" }]}}]',
				'[200000000]',
			],
		},
		{
			test: 'createLocalForeignTransferTransaction',
			args: [
				'1000',
				'1000',
				'//Alice',
				FERDE_ADDR,
				'[{ "parents": "1", "interior": { "X2": [{ "Parachain": "1836" }, { "GeneralIndex": "0" }]}}]',
				'[200000000000]',
				'{ "format": "payload", "xcmVersion": 3, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }',
			],
			verification: [
				'[{ "parents": "1", "interior": { "X2": [{ "Parachain": "1836" }, { "GeneralIndex": "0" }]}}]',
				'[200000000000]',
			],
		},
	],
	liquidPools: [
		{
			test: 'createLocalTransferTransaction',
			args: [
				'1000',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[0]',
				'[20000]',
				'{ "format": "payload", "keepAlive": true, "transferLiquidToken": true, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }',
			],
			verification: ['[0]', '[20000]'],
		},
		{
			test: 'createPayFeesTransaction',
			args: [
				'1000',
				'1000',
				'//Bob',
				FERDE_ADDR,
				'[0]',
				'[3000000]',
				'{ "format": "payload", "keepAlive": true, "transferLiquidToken": true, "paysWithFeeOrigin": { "parents": "0", "interior": { "X2": [{"PalletInstance": "50"}, { "GeneralIndex": "1" }]}}, "sendersAddr": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" }',
			],
			verification: ['[0]', '[3000000]'],
		},
	],
	local: [
		{
			test: 'createLocalTransferTransaction',
			args: [
				'1000',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[]',
				'[100000000000]',
				'{ "format": "payload", "keepAlive": true, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }',
			],
			verification: ['[]', '[100000000000]'],
		},
		{
			test: 'createLocalTransferTransactionWithFees',
			args: [
				'0',
				'0',
				'//Alice',
				BOB_ADDR,
				'[]',
				'[100000000000000000]',
				'{ "format": "payload", "keepAlive": true, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "paysWithFeeOrigin": { "parents": "0", "interior": { "X2": [{"PalletInstance": "50"}, { "GeneralIndex": "1" }]}} }',
			],
			verification: ['[]', '[10000000000000]'],
		},
		{
			test: 'createLimitedNativeTransferToRelay',
			args: [
				'1000',
				'0',
				'//Alice',
				BOB_ADDR,
				'[]',
				'[1000000000000000]',
				'{ "format": "payload", "keepAlive": true, "xcmVersion": 3, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "paysWithFeeOrigin": { "parents": "0", "interior": { "X2": [{"PalletInstance": "50"}, { "GeneralIndex": "1" }]}} }',
			],
			verification: ['[]', '[1000000000000000]'],
		},
		{
			test: 'createLimitedNativeTransferToSystem',
			args: [
				'0',
				'1000',
				'//Bob',
				FERDE_ADDR,
				'[]',
				'[210000000000000]',
				'{ "format": "payload", "keepAlive": true, "xcmVersion": 3, "weightLimit": {"refTime": "10000" , "proofSize": "3000"}, "sendersAddr": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "paysWithFeeOrigin": { "parents": "0", "interior": { "X2": [{"PalletInstance": "50"}, { "GeneralIndex": "1" }]}} }',
			],
			verification: ['[]', '[210000000000000]'],
		},
	],
	assets: [
		{
			test: 'createLocalSystemAssetsTransferTransaction',
			args: [
				'1000',
				'1000',
				'//Alice',
				BOB_ADDR,
				'[1]',
				'[3000000000000]',
				'{ "format": "payload", "keepAlive": true, "sendersAddr": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }',
			],
			verification: ['[1]', '[3000000000000]'],
		},
		{
			test: 'createPayFeesTransaction',
			args: [
				'1000',
				'1000',
				'//Bob',
				FERDE_ADDR,
				'[1]',
				'[200000000000]',
				'{ "format": "payload", "keepAlive": false, "sendersAddr": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "paysWithFeeOrigin": { "parents": "0", "interior": { "X2": [{"PalletInstance": "50"}, { "GeneralIndex": "1" }]}} }',
			],
			verification: ['[1]', '[200000000000]'],
		},
	],
};
