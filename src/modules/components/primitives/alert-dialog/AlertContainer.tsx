import React, {PropsWithChildren, useEffect, useState} from 'react';
import {BackHandler, NativeEventSubscription, View} from 'react-native';
import Animated, {interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';

import AlertFooter from './AlertFooter';
import {AlertContext} from './Context';
import LoadingContent from './LoadingContent';
import {IAlertContainerProps} from './types';

import colors from '../../theme/colors';
import Box from '../box/Box';
import Flex from '../flex/Flex';
import Layer from '../layer/Layer';
import AlertCloseButton from './AlertCloseButton';
import AlertContent from './AlertContent';
import alertStyles from './alertStyles';

const AlertContainer: React.FC<PropsWithChildren<IAlertContainerProps>> = ({
  contentStyle,
  children,
  closeable,
  onClose,
  visible = false,
  afterClose,
  onBackButtonPress,
  ...otherProps
}) => {
  const animValue = useSharedValue(0);
  const [innerVisble, setInnerVisible] = useState(false);
  const backButtonListenerRef = React.useRef<NativeEventSubscription>(null);

  const handleBackPress = () => {
    if (onBackButtonPress) {
      return onBackButtonPress();
    } else {
      handleClose();
    }
    return true;
  };

  const animateOpen = () => {
    setInnerVisible(true);
    (backButtonListenerRef as any).current = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    animValue.value = withSpring(1, {overshootClamping: true});
  };

  const animateClose = () => {
    if (!innerVisble) {
      return;
    }
    backButtonListenerRef.current?.remove();
    animValue.value = withSpring(0, {overshootClamping: true}, () => {
      'worklet';
      if (afterClose) {
        runOnJS(afterClose)();
      }
      runOnJS(setInnerVisible)(false);
    });
  };

  const handleClose = () => {
    onClose && onClose();
  };

  const contextValue = {handleClose};

  // @ts-ignore
  const slideAndFade = useAnimatedStyle(() => {
    return {
      opacity: animValue.value,
      transform: [
        {
          translateY: interpolate(animValue.value, [0, 1], [20, 0]),
        },
      ],
    };
  });

  useEffect(() => {
    if (visible) {
      animateOpen();
    } else {
      animateClose();
    }
    return () => {};
  }, [visible]);

  const renderContent = () => {
    if (otherProps.custom) {
      return <>{children}</>;
    }
    if (otherProps.type === 'loading') {
      return <LoadingContent />;
    } else {
      return (
        <>
          <Box radius={8} mx={32} padding={0} bg={colors.white} style={{overflow: 'hidden'}}>
            <AlertContent contentStyle={contentStyle}>{children}</AlertContent>
            <AlertFooter {...otherProps} />
          </Box>
          {closeable && (
            <Flex pointerEvents={'box-none'} style={alertStyles.closeButtonWrapper}>
              <AlertCloseButton onClose={handleClose} />
            </Flex>
          )}
        </>
      );
    }
  };

  if (!innerVisble) {
    return null;
  }

  return (
    <AlertContext.Provider value={contextValue}>
      <View style={alertStyles.alertContainer}>
        <Layer overlay={animValue} />
        <Animated.View style={[alertStyles.alertWrapper, slideAndFade]}>{renderContent()}</Animated.View>
      </View>
    </AlertContext.Provider>
  );
};

export default AlertContainer;
