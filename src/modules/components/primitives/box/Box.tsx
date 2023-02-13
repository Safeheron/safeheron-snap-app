import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import useSpaceStyles from '../../hooks/use-space-props/useSpaceStyles';

import {IBoxProps} from './types';

const Box: React.FC<IBoxProps> = props => {
  const {bg, radius, border, children, ...otherProps} = props;

  const [resolvedSpaceStyles, passedProps] = useSpaceStyles(otherProps);

  const styled: ViewStyle = {
    backgroundColor: bg,
    ...resolvedSpaceStyles,
  };

  if (border) {
    styled.borderWidth = StyleSheet.hairlineWidth;
    styled.borderColor = '#DCE1EB';
  }

  if (typeof radius === 'number') {
    styled.borderRadius = radius;
  } else if (radius === true) {
    styled.borderRadius = 10;
  }

  const passedStyle = passedProps?.style;

  return (
    <View {...passedProps} style={[styled, passedStyle]}>
      {children}
    </View>
  );
};

Box.defaultProps = {
  bg: '#fff',
  padding: [20, 16],
  radius: false,
};

export default Box;
