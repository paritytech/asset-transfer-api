// Copyright 2023 Parity Technologies (UK) Ltd.

import { JS_ENV } from '../consts.js';

/**
 * Errors that may be returned by the API.
 */
export enum BaseErrorsEnum {
	/**
	 * An input or lack of input to any public facing function by the user is incorrect, and or invalid.
	 * This may include using options incorrectly.
	 */
	InvalidInput = 'InvalidInput',
	/**
	 * The inputted asset is incorrect or invalid, and does not exist given the surrounding specs.
	 * This exlcudes MultiLocation assets which are handled using `InvalidMultiLocationAsset`.
	 */
	InvalidAsset = 'InvalidAsset',
	/**
	 * Not able to find the asset.
	 */
	AssetNotFound = 'AssetNotFound',
	/**
	 * The following pallet does not support the method to be used.
	 */
	InvalidPallet = 'InvalidPallet',
	/**
	 * The following pallet is not found.
	 */
	PalletNotFound = 'PalletNotFound',
	/**
	 * The specName was not provided when injecting a new chain in the registry.
	 */
	SpecNameNotProvided = 'SpecNameNotProvided',
	/**
	 * The tokens were not provided when injecting a new chain in the registry.
	 */
	TokensNotProvided = 'TokensNotProvided',
	/**
	 * The direction in which these assets are going to be sent is incorrect.
	 */
	InvalidDirection = 'InvalidDirection',
	/**
	 * The inputted multilocation is incorrect.
	 */
	InvalidMultiLocationAsset = 'InvalidMultiLocationAsset',
	/**
	 * Multiple assets have been found for a single token symbol.
	 */
	MultipleNonUniqueAssetsFound = 'MultipleNonUniqueAssetsFound',
	/**
	 * Not able to find the pertinent registry to gather certain information. This can refer to xcAssets.
	 */
	RegistryNotFound = 'RegistryNotFound',
	/**
	 * The xcm version is invalid.
	 */
	InvalidXcmVersion = 'InvalidXcmVersion',
	/**
	 * Not Implemented yet.
	 */
	NotImplemented = 'NotImplemented',
	/**
	 * An issue has happened internally.
	 */
	InternalError = 'InternalError',
	/**
	 * The inputted address is invalid.
	 */
	InvalidAddress = 'InvalidAddress',
	/**
	 * The following option is disabled given the inputs.
	 */
	DisabledOption = 'DisabledOption',
	/**
	 * The provided paysWithFeeOrigin asset has no liquidity pool.
	 */
	NoFeeAssetLpFound = 'NoFeeAssetLpFound',
	/**
	 * The provided JS environment is not supported, and the api will not run.
	 */
	UnsupportedEnvironment = 'UnsupportedEnvironment',
	/**
	 * Did not find the correct call in the current runtime.
	 */
	RuntimeCallNotFound = 'RuntimeCallNotFound',
	/**
	 * Did not find a known consensus system for bridge transaction.
	 */
	UnknownConsensusSystem = 'UnknownConsensusSystem',
}

export class BaseError extends Error {
	constructor(message: string, error?: BaseErrorsEnum) {
		super(message);
		this.name = error || this.constructor.name;
		// Only runtimes built on v8 will have `Error.captureStackTrace`.
		if (JS_ENV === 'node') {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
