import React from 'react';
import {Pressable, StyleProp, ViewStyle} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

import layerStyles from './styles';

interface ILayerProps {
  layerStyle?: StyleProp<ViewStyle>;
  overlay?: Animated.SharedValue<number>;
  onPressLayer?: () => void;
}

const Layer: React.FC<ILayerProps> = ({layerStyle, overlay, onPressLayer}) => {
  const opacity = useAnimatedStyle(() => {
    if (overlay === undefined) {
      return {opacity: 1};
    }
    return {
      opacity: overlay.value,
    };
  });

  return (
    <Animated.View style={layerStyles.overlay} pointerEvents={'box-none'}>
      <Pressable style={{flex: 1}} onPress={onPressLayer}>
        <Animated.View style={[layerStyles.overlay__background, layerStyle, opacity]} pointerEvents={'box-none'} />
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(Layer);
