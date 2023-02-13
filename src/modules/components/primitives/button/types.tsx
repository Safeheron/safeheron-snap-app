import {ColorValue, GestureResponderEvent, StyleProp, ViewStyle} from 'react-native';
import {ISpaceStyleProps} from '@/modules/components/hooks/use-space-props/types';
import {ITextColor} from '@/modules/components/primitives/text/types';

export type IButtonType = 'primary' | 'solid' | 'dark' | 'danger';

export interface IButtonProps extends ISpaceStyleProps {
  type?: IButtonType;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  color?: ITextColor | ColorValue;
}

export interface InputProps {
  maxLength?: number | undefined;
  secureTextEntry?: boolean | undefined;
}
