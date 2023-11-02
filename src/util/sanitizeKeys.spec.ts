import { sanitizeKeys } from './sanitizeKeys';

describe('sanitizeKeys', () => {
	it('Should correctly update all keys in plain objects', () => {
		const obj = { key1: { key2: { key3: '', key4: '' } }, key5: '' };
		const exp = { Key1: { Key2: { Key3: '', Key4: '' } }, Key5: '' };
		expect(sanitizeKeys(obj)).toStrictEqual(exp);
	});
	it('Should correctly update all keys in objects with arrays', () => {
		const obj = { key1: { key2: { key3: [{ key6: null, key7: null }, { key8: null }], key4: '' } }, key5: '' };
		const exp = { Key1: { Key2: { Key3: [{ Key6: null, Key7: null }, { Key8: null }], Key4: '' } }, Key5: '' };
		expect(sanitizeKeys(obj)).toStrictEqual(exp);
	});
	it('Should correctly sanitize all keys that are relevant to an xcm junction', () => {
		const obj = { onlyChild: { palletinstance: '' }, Globalconsensus: { key1: '' } };
		const exp = { OnlyChild: { PalletInstance: '' }, GlobalConsensus: { Key1: '' } };
		expect(sanitizeKeys(obj)).toStrictEqual(exp);
	});
});
