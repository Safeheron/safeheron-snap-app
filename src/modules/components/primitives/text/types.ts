import {ColorValue, TextProps, TextStyle} from 'react-native';
import colors from '../../theme/colors';
import {ISpaceStyleProps} from '@/modules/components/hooks/use-space-props/types';

export type ITextColor = keyof Pick<typeof colors, 'text'>['text'];

export interface ITextProps extends TextProps, ISpaceStyleProps {
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  color?: ITextColor | ColorValue;
  blod?: boolean;
  /**
   * line-through style
   */
  deleteStyle?: boolean;
  align?: Pick<TextStyle, 'textAlign'>['textAlign'];
  numberOfLines?: number | undefined;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
}

export interface II18nTextProps extends ITextProps {
  text: string;
  stub: {[key: string]: {value: string | number; props?: ITextProps}};
}
