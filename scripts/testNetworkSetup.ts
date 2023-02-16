import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { DispatchError } from '@polkadot/types/interfaces';
import { cryptoWaitReady } from '@polkadot/util-crypto';

/**
 * This script is intended to be run after zombienet is running.
 * It uses the hard coded values given in `zombienet.toml`.
 */

const WS_URL = 'ws://127.0.0.1:9040';

const main = async () => {
	await cryptoWaitReady();

	const keyring = new Keyring();
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');

	const api = await ApiPromise.create({
		provider: new WsProvider(WS_URL),
		noInitWarn: true,
	});

	await api.isReady;

	const { nonce } = await api.query.system.account(alice.address);

	const assetInfo = {
		assetId: 1,
		assetName: 'Test',
		assetSymbol: 'TST',
		assetDecimals: 10,
	};
	const txs = [
		api.tx.assets.create(assetInfo.assetId, alice.address, 1000),
		api.tx.assets.setMetadata(
			assetInfo.assetId,
			assetInfo.assetName,
			assetInfo.assetSymbol,
			assetInfo.assetDecimals
		),
		api.tx.assets.mint(assetInfo.assetId, alice.address, 1000 * 120000000),
	];
	const batch = api.tx.utility.batchAll(txs);
	await batch.signAndSend(alice, { nonce }, ({ status, events }) => {
		if (status.isInBlock || status.isFinalized) {
			events
				// find/filter for failed events
				.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
				// we know that data for system.ExtrinsicFailed is
				// (DispatchError, DispatchInfo)
				.forEach(
					({
						event: {
							data: [error],
						},
					}) => {
						if ((error as DispatchError).isModule) {
							// for module errors, we have the section indexed, lookup
							const decoded = api.registry.findMetaError(
								(error as DispatchError).asModule
							);
							const { docs, method, section } = decoded;

							console.log(`${section}.${method}: ${docs.join(' ')}`);
						} else {
							// Other, CannotLookup, BadOrigin, no extra info
							console.log(error.toString());
						}
					}
				);
		}
	});
};

main()
	.catch(console.error)
	.finally(() => process.exit());
