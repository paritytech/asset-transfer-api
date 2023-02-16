import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

/**
 * This script is intended to be run after zombienet is running.
 * It uses the hard coded values given in `zombienet.toml`.
 */

const WS_URL = 'ws://127.0.0.1:9040';

const main = async () => {
	await cryptoWaitReady();

	const keyring = new Keyring();
	const ferdie = keyring.addFromUri('//Ferdie', { name: 'Ferdie' }, 'sr25519');
	console.log(ferdie.publicKey);

	const api = await ApiPromise.create({
		provider: new WsProvider(WS_URL),
		noInitWarn: true,
	});

	await api.isReady;
};

main()
	.catch(console.error)
	.finally(() => process.exit());
