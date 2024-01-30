// Copyright 2023 Parity Technologies (UK) Ltd.
import { IBalance } from './balance';

/**
 * This function verifies whether the test transaction impacted the destination's
 * account balance
 * @param assetIds assets to be queried
 * @param amounts expected final balance
 * @param destBalance stored queried balance
 * @returns whetere the balance was modified as expected or not
 */
export const verification = (assetIds: string[], amounts: string[], destBalance: IBalance) => {
	const destInitialBalance: [string, number][] = destBalance.initial;
	const destFinalBalance: [string, number][] = destBalance.final;
	const correctlyReceived: [string, boolean][] = [];

	let check = true;
	for (let i = 0; i < assetIds.length; i++) {
		check = destInitialBalance[i][1] + Number(amounts[i]) == destFinalBalance[i][1];
		correctlyReceived.push([destInitialBalance[i][0], check]);
	}

	return correctlyReceived;
};
