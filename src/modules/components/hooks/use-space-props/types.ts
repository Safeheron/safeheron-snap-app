import {ViewStyle} from 'react-native';

interface SpaceStyleProps {
  padding: number | Array<number>;
  px: number;
  py: number;
  pt: number;
  pb: number;
  pl: number;
  pr: number;
  margin: number | Array<number>;
  mx: number;
  my: number;
  mt: number;
  mb: number;
  ml: number;
  mr: number;
}

export type SpacePropKeys = keyof SpaceStyleProps;
type SpaceKeys = keyof ViewStyle;

export const spacePropMap: {
  [key in Exclude<SpacePropKeys, 'padding' | 'margin'>]: SpaceKeys;
} = {
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  mt: 'marginTop',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
};

export const SPACE_PROP_KEYS = Object.keys(spacePropMap).concat(['margin', 'padding']);

export type ISpaceStyleProps = Partial<SpaceStyleProps>;
