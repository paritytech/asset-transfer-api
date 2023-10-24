import { AnyObj } from '../types';

const isPlainObject = (input: unknown) => {
    return input && !Array.isArray(input) && typeof input === 'object';
}

/**
 * Set all keys in an object with the first key being capitalized
 * 
 * @param xcmObj 
 */
export const sanitizeKeys = <T extends AnyObj>(
    xcmObj: T 
): T => {
    const final = {};
   
    // Iterate over key-value pairs of the root object 'obj'
    for (const [key, value] of Object.entries(xcmObj)) {
        if (Array.isArray(value)) {
            final[key[0].toUpperCase() + key.slice(1).toLowerCase()] = value.map(sanitizeKeys);
        } else if (!isPlainObject(value)) {
            final[key[0].toUpperCase() + key.slice(1).toLowerCase()] = value;
        } else {
            final[key[0].toUpperCase() + key.slice(1).toLowerCase()] = sanitizeKeys(value as AnyObj) 
        }
    }

    return final as T;
}
