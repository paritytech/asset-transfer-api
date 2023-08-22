// Copyright 2023 Parity Technologies (UK) Ltd.

export enum BaseErrorsEnum {
	/**
	 * An input or lack of input to any public facing function by the user is incorrect, and or invalid.
	 */
	InvalidInput = 'InvalidInput',
	/**
	 * The inputted asset is incorrect or invalid, and does not exist given the surrounding specs.
	 * This exlcudes MultiLocation assets which are handled using `InvalidMultiLocationAsset`.
	 */
	InvalidAsset = 'InvalidAsset',
	/**
	 * The following pallet does not support the method to be used.
	 */
	InvalidPallet = 'InvalidPallet',
	/**
	 * The inputted multilocation is
	 */
	InvalidMultiLocationAsset = 'InvalidMultiLocationAsset',
}

export class BaseError extends Error {
	constructor(message: string, error?: BaseErrorsEnum) {
		super(message);
		this.name = error || this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
