export enum IDirection {
	SystemToPara = 'SystemToPara',
	SystemToRelay = 'SystemToRelay',
	ParaToPara = 'ParaToPara',
	ParaToRelay = 'ParaToRelay',
	RelayToSystem = 'RelayToSystem',
	RelayToPara = 'RelayToPara',
}

export interface ITransferArgsOpts {
	/**
	 * Signing Payload vs Call
	 */
	format?: 'payload' | 'call'; // Give a polkadot-js option.
	/**
	 * AssetId to pay fee's on the current common good parachain.
	 * Statemint: default DOT
	 * Statemine: default KSM
	 */
	payFeeWith?: string;
	/**
	 * AssetId to pay fee's on the destination parachain.
	 */
	payFeeWithTo?: string;
	/**
	 * Boolean to declare if this will be with limited XCM transfers.
	 * Deafult is unlimited.
	 */
	isLimited?: boolean;
}

export interface IChainInfo {
	specName: string;
	specVersion: string;
}
