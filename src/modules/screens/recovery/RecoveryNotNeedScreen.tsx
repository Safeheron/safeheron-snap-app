import React, {useEffect, useLayoutEffect} from 'react';
import {Button, Flex, Text} from '@/modules/components';
import {ScreenProps} from '@/types/navigation.types';
import {Image} from 'react-native';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import MPCFlowFactory from '@/service/mpc/MPCFlowFactory';

const RecoveryNotNeedScreen: React.FC<ScreenProps<'RecoveryNotNeedScreen'>> = ({navigation}) => {
  const toHome = () => navigation.popToTop();

  useEffect(() => {
    return () => {
      MPCFlowFactory.recycle();
    };
  }, []);

  useAndroidBackHandler(() => true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
      headerLeft: () => null,
    });
  });
  return (
    <Flex flex={1} px={20}>
      <Flex flex={1} justify={'center'} align={'center'}>
        <Image source={require('~/resources/images/backup-guide.png')} />
        <Text mt={24} align={'center'} lineHeight={20}>
          Your three private key shards A, B, and C are all functioning well and do not need to be recovered.
        </Text>
      </Flex>
      <Button mb={22} type={'primary'} onPress={toHome}>
        Done
      </Button>
    </Flex>
  );
};

RecoveryNotNeedScreen.title = '';

export default RecoveryNotNeedScreen;
