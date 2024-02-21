// Copyright 2023 Parity Technologies (UK) Ltd.

import { detectJsEnv } from './util/detectJsEvn';

/**
 * List of all known relay chains.
 */
export const RELAY_CHAIN_NAMES = ['kusama', 'polkadot', 'westend', 'rococo'];

/**
 * As of now all the known relay chains have an ID of 0.
 */
export const RELAY_CHAIN_IDS = ['0'];

/**
 * AssetHub chains have an ID of 1000;
 */
export const ASSET_HUB_CHAIN_ID = '1000';

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
	'asset-hub-rococo',
	'bridge-hub-kusama',
	'bridge-hub-polkadot',
	'encointer-parachain',
	'collectives',
];
export const POLKADOT_ASSET_HUB_SPEC_NAMES = ['statemint', 'asset-hub-polkadot'];
export const KUSAMA_ASSET_HUB_SPEC_NAMES = ['statemine', 'asset-hub-kusama'];
export const WESTEND_ASSET_HUB_SPEC_NAMES = ['westmint', 'asset-hub-westend'];
export const ROCOCO_ASSET_HUB_SPEC_NAME = ['asset-hub-rococo'];

/**
 * The default xcm version to construct a xcm message.
 */
export const DEFAULT_XCM_VERSION = 2;
/**
 * There should only ever be two supported versions.
 * Therefore supported xcm versions should have a fixed length of 2
 */
export const SUPPORTED_XCM_VERSIONS: [number, number, number] = [2, 3, 4];
/**
 * The current maximum number of assets that can be transferred in an extrinsic
 * https://github.com/paritytech/polkadot/blob/e0ed7e862c8c8b6c75eda1731c449543642176ef/xcm/pallet-xcm/src/lib.rs#L1131
 */
export const MAX_ASSETS_FOR_TRANSFER = 2;

/**
 * This is the max length for a number before we need to use BigInt.
 */
export const MAX_NUM_LENGTH = Number.MAX_SAFE_INTEGER.toString().length;

/**
 * URL to reach the CDN endpoint.
 */
export const CDN_URL = 'https://paritytech.github.io/asset-transfer-api-registry/registry.json';

/**
 * May result in either: `node` or `browser`.
 */
export const JS_ENV = detectJsEnv();
