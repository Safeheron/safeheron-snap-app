import React, {FC, useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Button, colors, Flex, Text} from '@/modules/components';
import {Image} from 'react-native';
import DefaultInput from '@/modules/components/primitives/input/DefaultInput';
import {ScreenProps} from '@/types/navigation.types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useStore from '@/service/store/useStore';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {AuthContext} from '@/service/auth/AuthContext';
import {authWithBiometrics, isSupportBiometrics} from '@/service/auth';
import logger from '@/service/logger/logger';

const UnlockScreen: FC<ScreenProps<'UnlockScreen'>> = ({navigation, route}) => {
  const {nextScreen} = route.params || {};

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [_, store] = useStore();
  const [errorTips, setErrorTips] = useState('');
  const {unlock} = useContext(AuthContext);

  useAndroidBackHandler(() => false);

  const verifyPassword = async () => {
    setLoading(true);
    try {
      await store.setPassword(password);
      unlockTheWallet();
    } catch (e) {
      setErrorTips('Incorrect password, please check.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const tryToUseBiometrics = async () => {
    if (!(await isSupportBiometrics())) {
      logger.base.debug('App cannot use biometrics now, fallback to password verify.');
    } else {
      const authResult = await authWithBiometrics();
      logger.base.debug('auth with biometrics result: ', authResult);
      if (authResult) {
        unlockTheWallet();
      }
    }
  };

  const unlockTheWallet = () => {
    unlock();
    setTimeout(() => {
      if (nextScreen) {
        navigation.replace(nextScreen);
      } else {
        navigation.goBack();
      }
    }, 200);
  };

  useEffect(() => {
    tryToUseBiometrics();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => null,
      headerRight: () => null,
      title: '',
    });
  }, []);

  return (
    <Flex flex={1}>
      <KeyboardAwareScrollView style={{flex: 1, paddingHorizontal: 32}} resetScrollToCoords={{x: 0, y: 0}}>
        <Flex mt={100}>
          <Flex justify={'center'} align={'center'}>
            <Image source={require('~/resources/images/logo.png')} />
          </Flex>
          <Text fontSize={30} mt={20} mb={20} align={'center'} blod>
            Welcome Back!
          </Text>
          <DefaultInput
            secureTextEntry={true}
            maxLength={32}
            text={password}
            title={'Enter Password'}
            hint={'6-32 Characters'}
            onChangeText={(v: string) => setPassword(v?.trim())}
          />
          <Text mt={5} fontSize={12} color={colors.text.danger}>
            {errorTips}
          </Text>
          <Button mt={50} mb={22} loading={loading} onPress={verifyPassword} disabled={password.length < 6}>
            Unlock Wallet
          </Button>
        </Flex>
      </KeyboardAwareScrollView>
    </Flex>
  );
};

export default UnlockScreen;
