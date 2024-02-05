import { AnyJson } from '@polkadot/types/types';
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/**
 * Courtesy of https://stackoverflow.com/a/32922084/13609948 for this solution.
 * Checks the equality between 2 objects.
 *
 * @param x
 * @param y
 * @returns
 */
export function deepEqual(x: AnyJson, y: AnyJson): boolean {
	const ok = Object.keys,
		tx = typeof x,
		ty = typeof y;
	return x && y && tx === 'object' && tx === ty
		? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
		: x === y;
}
