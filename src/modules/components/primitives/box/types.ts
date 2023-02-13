import {ColorValue, ViewProps} from 'react-native';
import {ISpaceStyleProps} from '../../hooks/use-space-props/types';

export interface IBoxProps extends ViewProps, ISpaceStyleProps {
  bg?: ColorValue;
  radius?: number | boolean;
  border?: boolean;
}
