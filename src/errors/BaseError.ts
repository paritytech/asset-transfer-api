// Copyright 2023 Parity Technologies (UK) Ltd.

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
	 * The inputted multilocation is incorrect.
	 */
	InvalidMultiLocationAsset = 'InvalidMultiLocationAsset',
	/**
	 * Multiple assets have been found for a single token symbol.
	 */
	MultipleAssetsFound = 'MultipleAssetsFound',
	/**
	 * Not able to find the pertinent registry to gather certain information. This can refer to xcAssets.
	 */
	RegistryNotFound = 'RegistryNotFound',
	/**
	 * The xcm version is invalid.
	 */
	InvalidXcmVersion = 'InvalidXcmVersion',
}

export class BaseError extends Error {
	constructor(message: string, error?: BaseErrorsEnum) {
		super(message);
		this.name = error || this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
