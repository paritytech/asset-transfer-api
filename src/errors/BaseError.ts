// Copyright 2023 Parity Technologies (UK) Ltd.

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
}

export class BaseError extends Error {
	constructor(message: string, error?: BaseErrorsEnum) {
		super(message);
		this.name = error || this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
