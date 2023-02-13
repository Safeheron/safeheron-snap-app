import {TransactionObject, LegacyParams, Eip1559Params, TransactionBaseParams} from '@safeheron/mpcsnap-types';

export type {LegacyParams, Eip1559Params, TransactionBaseParams};

/**
 * The numerical value related to the unit is uniformly recognized as wei,
 * decimal wei or hex-decimal wei is prohibited
 */
export type TransactionParams = TransactionObject;
