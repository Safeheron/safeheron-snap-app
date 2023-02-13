import React from 'react';
import {StyleProp, Text as RNText, TextStyle} from 'react-native';

import colors from '../../theme/colors';
import {ITextProps} from './types';
import useSpaceStyles from '@/modules/components/hooks/use-space-props/useSpaceStyles';
import fontWeight from '@/modules/components/theme/fontWeight';

const Text = (props: ITextProps) => {
  const {fontSize, letterSpacing, lineHeight, color, blod, deleteStyle, align, children, ...otherProps} = props;

  const [spaceStyles, passedProps] = useSpaceStyles(otherProps);

  const resolvedStyle: StyleProp<TextStyle> = {
    fontSize,
    letterSpacing,
    lineHeight,
    color: color || colors.text.primary,
    fontWeight: blod ? fontWeight.medium : undefined,
    textAlign: align,
    textDecorationLine: deleteStyle ? 'line-through' : 'none',
    ...spaceStyles,
  };

  if (typeof color === 'string' && Object.prototype.hasOwnProperty.call(colors.text, color as string)) {
    // @ts-ignore
    resolvedStyle.color = colors.text[color as string];
  }

  // merge style
  const passedStyle = passedProps?.style;

  return (
    <RNText {...passedProps} style={[resolvedStyle, passedStyle]}>
      {children}
    </RNText>
  );
};

Text.defaultProps = {
  fontSize: 14,
  allowFontScaling: false,
};

export default Text;
