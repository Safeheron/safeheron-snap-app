import React from 'react';
import {Image, View, ViewProps} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import Text from '../text/Text';

import toastStyles from './styles';
import styles from './styles';
import {IToastItemProps} from './types';

interface IToastContainerProps {
  toasts: IToastItemProps[];
}

const ToastContainer: React.FC<IToastContainerProps> = props => {
  const {toasts} = props;

  return (
    <View style={toastStyles.wrap} pointerEvents={'box-none'}>
      {toasts.map((t, index) => (
        <ToastItem key={index} type={t.type} text={t.text} />
      ))}
    </View>
  );
};

const ToastItem: React.FC<IToastItemProps & ViewProps> = props => {
  const {text, type} = props;

  const withIcon = !!type;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={withIcon ? toastStyles.containerWithIcon : toastStyles.centerContainer}>
      {type === 'success' && <Image style={styles.iconStyle} source={require('~/resources/images/checked.png')} />}
      {type === 'error' && <Image style={styles.iconStyle} source={require('~/resources/images/forbiden.png')} />}
      <Text color={'#fff'} align={'center'} blod>
        {text}
      </Text>
    </Animated.View>
  );
};

export default ToastContainer;
