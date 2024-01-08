// Copyright 2023 Parity Technologies (UK) Ltd.
import { IBalance } from 'balance';

export const verification = (assetIds: string[], amounts: string[], destBalance: IBalance) => {
	const destInitialBalance: [string, number][] = destBalance.initial;
	const destFinalBalance: [string, number][] = destBalance.final;
	const correctlyReceived: [string, boolean][] = [];
	console.log(destInitialBalance)
	console.log(destFinalBalance)

	let check: boolean = true;
	for (let i = 0; i < assetIds.length; i++) {
		check =
			destInitialBalance[i][1] + Number(amounts[i]) ==
			destFinalBalance[i][1];
		correctlyReceived.push([destInitialBalance[i][0], check]);
	}

	return correctlyReceived;
};
