/**
 * generate margin/padding shorthand in React Native
 * @param style
 * @param values
 */
const getShortHand = (style: string, values?: number | Array<number>) => {
  if (values === undefined) {
    return {};
  }

  if (typeof values === 'number') {
    return {[style]: values};
  }
  const _genCss = (...values: Array<number | string>) => ({
    [style + 'Top']: values[0],
    [style + 'Right']: values[1],
    [style + 'Bottom']: values[2],
    [style + 'Left']: values[3],
  });
  if (values.length === 2) {
    return _genCss(values[0], values[1], values[0], values[1]);
  }
  if (values.length === 3) {
    return _genCss(values[0], values[1], values[2], values[1]);
  }
  return _genCss(values[0], values[1], values[2], values[3]);
};

export const padding = (values?: Array<number> | number) => getShortHand('padding', values);
export const margin = (values?: Array<number> | number) => getShortHand('margin', values);
