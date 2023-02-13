import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import colors from '../../theme/colors';
import {IDividerProps} from './types';
import useSpaceStyles from '@/modules/components/hooks/use-space-props/useSpaceStyles';

const Divider: React.FC<IDividerProps> = ({bgColor, col, h, w, opacity, ...otherProps}) => {
  const [spaceStyles] = useSpaceStyles(otherProps);

  const resolvedStyle: ViewStyle = {
    backgroundColor: bgColor,
    ...spaceStyles,
  };

  if (col) {
    resolvedStyle.width = w || StyleSheet.hairlineWidth;
    resolvedStyle.height = h || 20;
  } else {
    resolvedStyle.height = h || StyleSheet.hairlineWidth;
  }

  if (opacity && typeof opacity === 'number') {
    resolvedStyle.opacity = opacity;
  }

  return <View style={resolvedStyle} />;
};

Divider.defaultProps = {
  bgColor: colors.divider.primary,
  col: false,
};

export default Divider;
