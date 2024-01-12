// Copyright 2023 Parity Technologies (UK) Ltd.
import colors from 'ansi-colors';
import chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import { IndividualTest } from 'tests';

const defineTest = (testCase: string): string => {
	let test: string = '';

	switch (testCase) {
		case '--foreign-assets':
			test = 'Foreign Assets Transfers';
			break;
		case '--liquidity-assets':
			test = 'Liqudity Tokens Transfers';
			break;
		case '--local':
			test = 'Native Token Transfers';
			break;
		case '--assets':
			test = 'Local Assets Transfers';
			break;
	}
	return test;
};

export const startTestLogger = (testCase: string) => {
	const test = defineTest(testCase);

	console.log(chalk.yellow(`Initializing tests for ${test}\n`));
};

export const startProgressBar = (testData: IndividualTest[], testCase: string): cliProgress.SingleBar => {
	const test = defineTest(testCase);

	const coverage: number = testData.length;

	const progressBar = new cliProgress.SingleBar({
		format:
			`\n${test} Test Suite Progress |` + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} tests covered \n',
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	});

	progressBar.start(coverage, 0);

	return progressBar;
};

export const updateProgressBar = (counter: number, progressBar: cliProgress.SingleBar) => {
	process.stdout.moveCursor(0, -2);

	process.stdout.clearLine(0);

	progressBar.increment(counter);
};

export const terminateProgressBar = (progressBar: cliProgress.SingleBar, testCase: string) => {
	const test = defineTest(testCase);
	console.log(chalk.yellow(`Test Suite for ${test} completed.\n`));

	progressBar.stop();
	console.log('\n');
};

export const testResultLogger = (testName: string, assetId: string, chainName: string, passed: boolean) => {
	const tokenId = assetId === '' ? 'native asset' : `asset ${assetId}`;
	if (passed) {
		console.log(chalk.green(`Test ${testName} passed for ${chainName}'s ${tokenId} \u2705\n`));
	} else {
		console.log(chalk.red(`Test ${testName} failed for ${chainName}'s ${tokenId} \u274E\n`));
	}
};
