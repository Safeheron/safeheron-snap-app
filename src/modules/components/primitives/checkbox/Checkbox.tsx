import React, {FC, useEffect, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle} from 'react-native';

import colors from '../../theme/colors';
import Icon from '../icon/Icon';

interface CheckboxProps extends ViewProps {
  checked?: boolean;
  style?: ViewStyle | StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  checkView?: ViewStyle;
  container?: ViewStyle;
  pressedEffect?: boolean;
  onChange?: (value: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({
  children,
  checked,
  style,
  textStyle,
  container,
  checkView,
  pressedEffect,
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);
  return (
    <Pressable
      style={({pressed}) => [styles.container, style, container, pressedEffect && {opacity: pressed ? 0.6 : 1}]}
      hitSlop={{left: 10, top: 10, bottom: 5, right: 4}}
      onPress={() => {
        if (onChange) {
          onChange(!internalChecked);
        }
        setInternalChecked(!internalChecked);
      }}>
      <View
        style={[
          styles.checkView,
          checkView,
          internalChecked ? {backgroundColor: colors.primary, borderColor: colors.primary} : {},
        ]}>
        {internalChecked && <Icon style={styles.icon} name="checkedSolid" />}
      </View>
      {React.isValidElement(children) ? children : <Text style={{...styles.desc, ...textStyle}}>{children}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkView: {
    backgroundColor: colors.white,
    borderColor: colors.border.b2,
    borderStyle: 'solid',
    borderWidth: 1,
    width: 16,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  desc: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default Checkbox;
