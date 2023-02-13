import * as React from 'react';

export default function useControlledState<T, R = T>(
  defaultStateValue: T | (() => T),
  propsValue?: T,
): [R, (value: T) => void] {
  const [innerValue, setInnerValue] = React.useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue;
    }
    return typeof defaultStateValue === 'function' ? (defaultStateValue as any)() : defaultStateValue;
  });

  let mergedValue = propsValue !== undefined ? propsValue : innerValue;

  const triggerChange = React.useCallback((newValue: T) => {
    setInnerValue(newValue);
  }, []);

  // Effect of reset value to `undefined`
  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (propsValue === undefined) {
      // @ts-ignore
      setInnerValue(propsValue);
    }
  }, [propsValue]);

  return [mergedValue as unknown as R, triggerChange];
}
