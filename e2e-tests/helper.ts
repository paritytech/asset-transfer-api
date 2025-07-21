import { NetworkContext } from '@acala-network/chopsticks-utils';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { DispatchError } from '@polkadot/types/interfaces';
import BN from 'bn.js';
import { expect } from 'vitest';

import { TxResult } from '../src/types';

export class NetworkHelper {
	api: ApiPromise;
	context: NetworkContext;
	chainId?: string;
	assetIds?: { [key: string]: string };

	constructor(context: NetworkContext, chainId?: string, assetIds?: { [key: string]: string }) {
		this.context = context;
		this.api = context.api;
		this.chainId = chainId;
		this.assetIds = assetIds;
	}

	async getNativeBalance(address: string): Promise<BN> {
		const account = await this.api.query.system.account(address);
		return new BN(account.data.free);
	}

	async getAssetBalance(assetName: string, address: string): Promise<BN> {
		if (!this.assetIds) {
			throw new Error('No asset ids are set.');
		}
		const assetId = this.assetIds[assetName];
		const account = await this.api.query.assets.account(assetId, address);
		expect(account.isSome).toBe(true);
		return new BN(account.unwrap().balance);
	}

	async expectAssetBalance(assetName: string, address: string, amount: number | BN, msg: string) {
		const balance = await this.getAssetBalance(assetName, address);
		const expected = new BN(amount);
		const diff = expected.sub(balance);
		expect(
			balance.eq(expected),
			`${msg} { value: ${balance.toLocaleString()}; expected: ${amount.toLocaleString()}; diff: ${diff.toLocaleString()} }`,
		).toBe(true);
	}

	async expectNativeBalance(address: string, amount: number | BN, msg: string) {
		const balance = await this.getNativeBalance(address);
		const expected = new BN(amount);
		const diff = expected.sub(balance);

		expect(
			balance.eq(expected),
			`${msg} { value: ${balance.toLocaleString()}; expected: ${expected.toLocaleString()}; diff: ${diff.toLocaleString()} }`,
		).toBe(true);
	}

	async signAndSend(txResult: TxResult<'submittable'>, sender: KeyringPair) {
		await txResult.tx.signAndSend(sender, (result) => {
			console.log(`Tx status: ${result.status.toString()}`);

			if (result.status.isInBlock) {
				console.log(`✅ Included at blockHash: ${result.status.asInBlock.toString()}`);
			}

			if (result.status.isFinalized) {
				console.log(`✅ Finalized at blockHash: ${result.status.asFinalized.toString()}`);

				result.events.forEach(({ event: { section, method, data } }) => {
					console.log(`→ Event: ${section}.${method}`, JSON.stringify(data.toHuman(), null, 2));
					if (section === 'system' && method === 'ExtrinsicFailed') {
						const [dispatchError] = data;
						if ((dispatchError as DispatchError).isModule) {
							const decoded = this.api.registry.findMetaError((dispatchError as DispatchError).asModule);
							console.log(`❌ ${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`);
						} else {
							console.log(`❌ Non-module error: ${dispatchError.toString()}`);
						}
					}
				});
			}
		});
	}
}
