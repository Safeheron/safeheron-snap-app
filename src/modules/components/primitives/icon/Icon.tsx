import React from 'react';
import {Svg, Path, G} from 'react-native-svg';
import icons, {IIconDescProps} from './icons';
import {IIconProps} from './types';

const Icon: React.FC<IIconProps> = (props: IIconProps) => {
  const {name, color, fillColor, strokeColor, ...initProps} = props;
  const iconSvgDesc: IIconDescProps = icons[name];

  const {width, height, d, path} = iconSvgDesc;

  // simple graph
  if (d && path === undefined) {
    return (
      <Svg {...initProps} viewBox={'0 0 ' + width + ' ' + height} width={width} height={height}>
        <Path fill={color} strokeWidth={1} d={d} />
      </Svg>
    );
  }

  // composites graph
  return (
    <Svg {...initProps} viewBox={'0 0 ' + width + ' ' + height} width={width} height={height}>
      <G fill={fillColor} stroke={strokeColor}>
        {path}
      </G>
    </Svg>
  );
};

Icon.defaultProps = {
  color: '#40464A',
  strokeColor: 'none',
  fillColor: 'none',
};

export default React.memo(Icon);
