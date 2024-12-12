// Copyright 2024 Parity Technologies (UK) Ltd.

import { BaseError, BaseErrorsEnum } from '../errors';

/**
 * Returns the specific environment the api is running in.
 * It will throw an error when the environment is not supported.
 */
export const detectJsEnv = (): string => {
	const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
	const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

	if (isNode) return 'node';
	if (isBrowser) return 'browser';

	throw new BaseError(
		'The following JS environment is not supported. Currently only the browser, and NodeJS have support.',
		BaseErrorsEnum.UnsupportedEnvironment,
	);
};
