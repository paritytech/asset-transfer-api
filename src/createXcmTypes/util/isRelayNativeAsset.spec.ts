// Copyright 2024 Parity Technologies (UK) Ltd.

import { Registry } from '../../registry';
import { isRelayNativeAsset } from './isRelayNativeAsset';

describe('isRelayNativeAsset', () => {
	describe('RelayToSystem', () => {
		const specName = 'kusama';
		const registry = new Registry(specName, {});

		it('Should return true when an empty string is provided as the assetId', () => {
			expect(isRelayNativeAsset(registry, '')).toEqual(true);
		});
		it('Should return true when a symbol assetId matches the relay assetId', () => {
			expect(isRelayNativeAsset(registry, 'KSM')).toEqual(true);
		});
		it('Should return false when a symbol assetId does not match the relay assetId', () => {
			expect(isRelayNativeAsset(registry, 'DOT')).toEqual(false);
		});
		it('Should return true when the relay chains asset location is given as input from the perspective of the relay chain', () => {
			expect(isRelayNativeAsset(registry, '{"parents":"0","interior":{"Here":""}}')).toEqual(true);
		});
		it('Should return false when the relay chains asset location is given as input from the perspective of a child chain', () => {
			expect(isRelayNativeAsset(registry, '{"parents":"1","interior":{"Here":""}}')).toEqual(false);
		});
	});
	describe('SystemToRelay', () => {
		const specName = 'statemint';
		const registry = new Registry(specName, {});

		it('Should return true when an empty string is provided as the assetId', () => {
			expect(isRelayNativeAsset(registry, '')).toEqual(true);
		});
		it('Should return true when a symbol assetId matches the relay assetId', () => {
			expect(isRelayNativeAsset(registry, 'DOT')).toEqual(true);
		});
		it('Should return false when a symbol assetId does not match the relay assetId', () => {
			expect(isRelayNativeAsset(registry, 'KSM')).toEqual(false);
		});
		it('Should return true when the relay chains asset location is given as input from the persepect of AssetHub', () => {
			expect(isRelayNativeAsset(registry, '{"parents":"1","interior":{"Here":""}}')).toEqual(true);
		});
		it('Should return false when the relay chains asset location is given as input from the perspective of the relay chain', () => {
			expect(isRelayNativeAsset(registry, '{"parents":"0","interior":{"Here":""}}')).toEqual(false);
		});
	});
});
