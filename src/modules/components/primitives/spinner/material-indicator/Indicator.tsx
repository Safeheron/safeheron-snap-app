import React from 'react';
import {ColorValue, StyleSheet} from 'react-native';
import Animated, {Easing, Extrapolation, interpolate, useAnimatedStyle} from 'react-native-reanimated';

type IndicatorProps = {
  size: number;
  animValue: Animated.SharedValue<number>;
  index: number;
  color: string | ColorValue;
};

const DURATION = 2400;
const frames = (60 * DURATION) / 1000;

const bezierEasingFactory = Easing.bezier(0.4, 0.0, 0.7, 1.0).factory();

const Indicator: React.FC<IndicatorProps> = ({size, animValue, index, color}) => {
  const containerStyle = {
    width: size,
    height: size / 2,
    overflow: 'hidden' as const,
  };

  const offsetStyle = index ? {top: size / 2} : null;

  const lineStyle = {
    width: size,
    height: size,
    borderColor: color,
    borderWidth: size / 10,
    borderRadius: size / 2,
  };

  // @ts-ignore
  const layerStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animValue.value, [0, 1], [30 + 15, 2 * 360 + 30 + 15], Extrapolation.CLAMP);
    return {
      width: size,
      height: size,
      transform: [{rotate: `${rotate}deg`}],
    };
  });

  // @ts-ignore
  const viewportStyle = useAnimatedStyle(() => {
    const inputRange = Array.from(new Array(frames), (_, frameIndex) => frameIndex / (frames - 1));
    const outputRange = Array.from(new Array(frames), (_, frameIndex) => {
      let progress = (2 * frameIndex) / (frames - 1);
      const rotation = index ? +(360 - 15) : -(180 - 15);
      if (progress > 1.0) {
        progress = 2.0 - progress;
      }
      const direction = index ? -1 : +1;
      return direction * (180 - 30) * bezierEasingFactory(progress) + rotation;
    });

    const rotate = interpolate(animValue.value, inputRange, outputRange, Extrapolation.CLAMP);
    return {
      width: size,
      height: size,
      transform: [
        {
          translateY: index ? -size / 2 : 0,
        },
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.layer]}>
      <Animated.View style={layerStyle}>
        <Animated.View style={[containerStyle, offsetStyle]} collapsable={false}>
          <Animated.View style={viewportStyle}>
            <Animated.View style={containerStyle} collapsable={false}>
              <Animated.View style={lineStyle} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Indicator;
