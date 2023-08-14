// Copyright 2023 Parity Technologies (UK) Ltd.

/**
 * List of all known relay chains.
 */
export const RELAY_CHAIN_NAMES = ['kusama', 'polkadot', 'westend'];
/**
 * As of now all the known relay chains have an ID of 0.
 */
export const RELAY_CHAIN_IDS = ['0'];
/**
 * As of now all the known AssetHub chains have an ID of 1000.
 */
export const ASSET_HUB_IDS = ['1000'];

/**
 * List of all known system parachains.
 */
export const SYSTEM_PARACHAINS_NAMES = [
	'statemine',
	'statemint',
	'westmint',
	'asset-hub-kusama',
	'asset-hub-polkadot',
	'asset-hub-westend',
	'bridge-hub-kusama',
	'bridge-hub-polkadot',
	'encointer-parachain',
	'collectives',
];
export const POLKADOT_ASSET_HUB_SPEC_NAMES = [
	'statemint',
	'asset-hub-polkadot',
];
export const KUSAMA_ASSET_HUB_SPEC_NAMES = ['statemine', 'asset-hub-kusama'];
export const WESTEND_ASSET_HUB_SPEC_NAMES = ['westmint', 'asset-hub-westend'];
/**
 * List of IDs for assets and bridge hub system parachains.
 */
export const SYSTEM_PARACHAINS_IDS = ['1000', '1001', '1002'];
/**
 * The default xcm version to construct a xcm message.
 */
export const DEFAULT_XCM_VERSION = 2;
/**
 * There should only ever be two supported versions.
 * Therefore supported xcm versions should have a fixed length of 2
 */
export const SUPPORTED_XCM_VERSIONS: [number, number] = [2, 3];
/**
 * The current maximum number of assets that can be transferred in an extrinsic
 * https://github.com/paritytech/polkadot/blob/e0ed7e862c8c8b6c75eda1731c449543642176ef/xcm/pallet-xcm/src/lib.rs#L1131
 */
export const MAX_ASSETS_FOR_TRANSFER = 2;

export const POLKADOT_ASSET_HUB_SPEC_NAMES = [
	'statemint',
	'asset-hub-polkadot',
];
export const KUSAMA_ASSET_HUB_SPEC_NAMES = ['statemine', 'asset-hub-kusama'];
export const WESTEND_ASSET_HUB_SPEC_NAMES = ['westmint', 'asset-hub-westend'];
