/**
 * Create an Xcm WeightLimit structured type.
 *
 * @param opts Options that are used for WeightLimit.
 */
import { CreateWeightLimitOpts, XcmWeight } from '../types.js';

export const createWeightLimit = (opts: CreateWeightLimitOpts): XcmWeight => {
	return opts.weightLimit?.refTime && opts.weightLimit?.proofSize
		? {
				Limited: {
					refTime: opts.weightLimit?.refTime,
					proofSize: opts.weightLimit?.proofSize,
				},
			}
		: { Unlimited: null };
};
