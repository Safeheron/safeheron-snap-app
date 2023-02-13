import {ViewStyle} from 'react-native';
import {
  ISpaceStyleProps,
  SPACE_PROP_KEYS,
  SpacePropKeys,
  spacePropMap,
} from '@/modules/components/hooks/use-space-props/types';
import {extractInObject, margin, padding} from '@/modules/components/utils';

function useSpaceStyles(props: ISpaceStyleProps): [ViewStyle, Record<string, any>] {
  let resolvedSpaceStyles: ViewStyle = {};

  let [incomeSpaceProps, otherProps] = extractInObject(props, SPACE_PROP_KEYS);

  // exclude margin and padding
  (Object.keys(incomeSpaceProps) as SpacePropKeys[]).forEach((key: SpacePropKeys) => {
    if (key in spacePropMap) {
      // @ts-ignore
      const newKey = spacePropMap[key];
      // @ts-ignore
      resolvedSpaceStyles[newKey] = incomeSpaceProps[key];
    }
  });

  const incomeMarginValue = incomeSpaceProps.margin;
  const incomePaddingValue = incomeSpaceProps.padding;

  resolvedSpaceStyles = {
    ...resolvedSpaceStyles,
    ...margin(incomeMarginValue),
  };

  resolvedSpaceStyles = {
    ...resolvedSpaceStyles,
    ...padding(incomePaddingValue),
  };

  return [resolvedSpaceStyles, otherProps];
}

export default useSpaceStyles;
