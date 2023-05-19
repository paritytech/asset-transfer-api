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
 * List of all known system parachains.
 */
export const SYSTEM_PARACHAINS_NAMES = ['statemine', 'statemint', 'westmint'];
/**
 * As of now all the known system parachains have an ID of 1000.
 */
export const SYSTEM_PARACHAINS_IDS = ['1000'];
/**
 * The default xcm version to construct a xcm message.
 */
export const DEFAULT_XCM_VERSION = 2;
/**
 * There should only ever be two supported versions.
 * Therefore supported xcm versions should have a fixed length of 2
 */
export const SUPPORTED_XCM_VERSIONS: [number, number] = [2, 3];
