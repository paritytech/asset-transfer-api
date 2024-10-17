import { deepEqual } from './deepEqual.js';

describe('deepEqual', () => {
	it('Should return true for 2 equal objects that are out of order', () => {
		const a = { x: { y: 'z' }, z: ['1', '2', '3'] };
		const b = { z: ['1', '2', '3'], x: { y: 'z' } };
		expect(deepEqual(a, b)).toEqual(true);
	});
	it('Should return false with 2 unequal objects', () => {
		const a = { x: { y: 'z' }, z: ['1', '2', '3'] };
		const b = { w: { y: 'z' }, z: ['1', '2', '3'] };
		expect(deepEqual(a, b)).toEqual(false);
	});
});
