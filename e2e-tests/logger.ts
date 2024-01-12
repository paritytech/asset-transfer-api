// Copyright 2023 Parity Technologies (UK) Ltd.
import colors from 'ansi-colors';
import chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import { IndividualTest } from 'tests';

/**
 *
 * @param testCase a string containing the test option selected
 * @returns a prettified version of the testCase
 */
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

/**
 * Calls defineTest and prints a message signaling the begining of the tests
 * @param testCase a string containing the test option selected
 */
export const startTestLogger = (testCase: string) => {
	const test = defineTest(testCase);

	console.log(chalk.yellow(`Initializing tests for ${test}\n`));
};

/**
 * This creates and starts an instance of cliProgress containing a SingleBar to
 * display the test suite's progress
 *
 * @param testData an array containing the individual tests for the test suite
 * selected
 * @param testCase the test suite selected
 * @returns an instance of the cliProgress that will be used to track the progress
 * of the tests
 */
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

/**
 * Clears the progress bar in place and prints an updated version
 * @param counter current test number
 * @param progressBar instance of the cliProgress
 */
export const updateProgressBar = (counter: number, progressBar: cliProgress.SingleBar) => {
	process.stdout.moveCursor(0, -2);

	process.stdout.clearLine(0);

	progressBar.increment(counter);
};

/**
 * Terminates the cliProgess instance. It's called after the test suite is over
 * @param progressBar instance of cliProgress to be terminated
 * @param testCase
 */
export const terminateProgressBar = (progressBar: cliProgress.SingleBar, testCase: string) => {
	const test = defineTest(testCase);
	console.log(chalk.yellow(`Test Suite for ${test} completed.\n`));

	progressBar.stop();
	console.log('\n');
};

/**
 *
 * @param testName current test's name
 * @param assetId Id of the asset tested against
 * @param chainName Name of the chain against the test ran
 * @param passed whether the test passed or failed
 */
export const testResultLogger = (testName: string, assetId: string, chainName: string, passed: boolean) => {
	const tokenId = assetId === '' ? 'native asset' : `asset ${assetId}`;
	if (passed) {
		console.log(chalk.green(`Test ${testName} passed for ${chainName}'s ${tokenId} \u2705\n`));
	} else {
		console.log(chalk.red(`Test ${testName} failed for ${chainName}'s ${tokenId} \u274E\n`));
	}
};
