import {ColorValue, ViewProps} from 'react-native';
import {IconMap} from './icons';

type IIconName = keyof IconMap;

interface IIconProps extends ViewProps {
  name: IIconName;
  color?: ColorValue; // fill color in "path" property for simple graph

  // fillColor and strokeColor in "G" property for composites graph
  strokeColor?: string;
  fillColor?: string;
}

export type {IIconName, IIconProps};
