import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

// TODO accept the right type for options.
export const constructApiPromise = async (
	wsUrl: string,
	opts: object
): Promise<ApiPromise> => {
	return await ApiPromise.create({
		provider: new WsProvider(wsUrl),
		noInitWarn: true,
		...opts,
	});
};
