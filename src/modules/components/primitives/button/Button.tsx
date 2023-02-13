import React, {FC} from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, ViewStyle} from 'react-native';

import colors from '../../theme/colors';
import {IButtonProps, IButtonType} from './types';
import useSpaceStyles from '@/modules/components/hooks/use-space-props/useSpaceStyles';
import {PropsWithChildren} from '@/types/react';
import {Text} from '@/modules/components';

// @ts-ignore
const Button: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  loading,
  type = 'primary',
  onPress,
  disabled = false,
  style,
  color,
  ...otherProps
}) => {
  const [spaceStyles] = useSpaceStyles(otherProps);

  const handlePress = (e: GestureResponderEvent) => {
    if (!disabled && !loading && onPress) {
      onPress(e);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        spaceStyles,
        getTypeStyle(type),
        {
          backgroundColor: disabled ? colors.disable : getTypeStyle(type).backgroundColor,
        },
        style,
      ]}
      disabled={disabled}>
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text
          color={color}
          style={[
            styles.text,
            {color: type === 'solid' ? colors.text.primary : colors.white},
            disabled && {color: colors.white},
          ]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};

function getTypeStyle(type: IButtonType): ViewStyle {
  if (type === 'solid') {
    return {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.board.primary,
    };
  }
  if (type === 'dark') {
    return {
      backgroundColor: '#15343D',
    };
  }

  if (type === 'danger') {
    return {
      backgroundColor: colors.danger,
    };
  }
  return {
    backgroundColor: colors.primary,
  };
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'System',
  },
  spinner: {
    marginLeft: 10,
  },
});

export default Button;
