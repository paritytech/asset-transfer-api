/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetsTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { AssetsTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example, we are creating a `SubmittableExtrinsic` and showing how one may sign and send it over
 * a network. Since it is the `SubmittableExtrinsic`, there are a plethora of attached methods to use such as:
 *
 * `sign`, `signAsync`, `dryRun`, `addSignature`, `paymentInfo`, etc.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('ws://127.0.0.1:9944');
	const assetApi = new AssetsTransferApi(api, specName, safeXcmVersion);

	// When declaring this type it will ensure that the inputted `format` matches it or the type checker will error.
	let callInfo: TxResult<'submittable'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000',
			'EGP7XztdTosm1EmaATZVMjSWujGEj9nNidhjqA2zZtttkFg',
			['KSM'],
			['1000000000000'],
			{
				format: 'submittable',
				isLimited: true,
				xcmVersion: 2,
			}
		);

		console.log(
			`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(callInfo, null, 4)}${RESET}`
		);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	await cryptoWaitReady();
	// Create a new keyring, and add an "Alice" account
	const keyring = new Keyring();
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');

	await callInfo.tx.signAndSend(alice);
};

main().finally(() => process.exit());
