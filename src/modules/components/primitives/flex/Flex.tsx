import React from 'react';
import {View, ViewStyle} from 'react-native';

import {IFlexProps} from './types';
import useSpaceStyles from '@/modules/components/hooks/use-space-props/useSpaceStyles';
const Flex: React.FC<IFlexProps> = props => {
  const {direction, wrap, align, justify, basis, grow, shrink, flex, row, children, ...otherProps} = props;

  const [resolvedStyles, passedProps] = useSpaceStyles(otherProps);

  const styled: ViewStyle = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink,
    ...resolvedStyles,
  };

  if (typeof wrap === 'boolean') {
    styled.flexWrap = wrap ? 'wrap' : 'nowrap';
  } else {
    styled.flexWrap = wrap;
  }

  if (row) {
    styled.flexDirection = 'row';
    styled.alignItems = align || 'center';
  }

  if (typeof flex === 'number') {
    styled.flex = flex;
  }

  const passedStyle = passedProps.style;

  return (
    <View {...passedProps} style={[styled, passedStyle]}>
      {children}
    </View>
  );
};

export default Flex;
