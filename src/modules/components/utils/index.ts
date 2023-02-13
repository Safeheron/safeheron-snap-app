import {isNil, omit, omitBy, pick} from 'lodash';

export {padding, margin} from './getMarginShotHand';

export {isJSX} from './tsUtils';

/**
 *
 * @param parent The object from which data needs to extracted
 * @param values Keys which needs to be extracted
 * @returns [extractedProps, remainingProps]
 */
export function extractInObject(parent: any, values: Array<string>) {
  return [omitUndefined(pick(parent, values)), omitUndefined(omit(parent, values))];
}

export function omitUndefined(obj: any) {
  return omitBy(obj, isNil);
}
