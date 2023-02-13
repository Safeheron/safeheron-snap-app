import React from 'react';
import {ColorValue, StyleProp, ViewStyle} from 'react-native';

import {ISpaceStyleProps} from '../../hooks/use-space-props/types';
import useSpaceStyles from '../../hooks/use-space-props/useSpaceStyles';
import MaterialIndicator from './material-indicator/MaterialIndicator';

import colors from '../../theme/colors';

export interface ISpinnerProps extends ISpaceStyleProps {
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large' | number;
}

const Spinner: React.FC<ISpinnerProps> = ({color, size = 'small', style, ...otherProps}) => {
  const [spaceStyles] = useSpaceStyles(otherProps);
  return <MaterialIndicator color={color} size={size} style={[spaceStyles, style]} />;
};

Spinner.defaultProps = {
  color: colors.primary,
};
export default Spinner;
