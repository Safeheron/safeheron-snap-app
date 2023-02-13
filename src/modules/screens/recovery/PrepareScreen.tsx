import React, {useLayoutEffect} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {Flex, Text} from '@/modules/components';
import {Image} from 'react-native';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import useMPCFlow from '@/service/mpc/hooks/useMPCFlow';

export const PrepareScreen: React.FC<ScreenProps<'PrepareScreen'>> = ({navigation}) => {
  useKeepAwake();
  useAndroidBackHandler(() => true);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      gestureEnabled: false,
      headerLeft: () => null,
    });
  });

  // Navigate back when rtc peer disconnected
  useMPCFlow(navigation, 'recover');

  return (
    <Flex flex={1} align={'center'}>
      <Image
        style={{width: 192, height: 247, marginTop: 95}}
        source={require('~/resources/images/party-prepare.png')}
      />
      <Text color={'primary'} align={'center'} px={20}>
        {'Please follow the instructions on the\n webpage to connect your second phone.'}
      </Text>
    </Flex>
  );
};
export default PrepareScreen;
