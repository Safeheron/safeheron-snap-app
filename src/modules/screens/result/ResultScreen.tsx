import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {Button, Flex, Text} from '@/modules/components';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {Image, Pressable} from 'react-native';
import useBottomSpace from '@/modules/components/hooks/useBottomSpace';
import useStore from '@/service/store/useStore';

const ResultScreen: FC<ScreenProps<'ResultScreen'>> = ({navigation, route}) => {
  const {flowType} = route.params;

  const [description, setDescription] = useState('');
  const [nextHint, setNextHint] = useState('');
  const [laterHint, setLaterHint] = useState('');
  const bottomSpace = useBottomSpace();
  let [wallet] = useStore();

  useAndroidBackHandler(() => {
    return true;
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => null,
      gestureEnabled: false,
    });
  });

  useEffect(() => {
    switch (flowType) {
      case 'keygen':
        setDescription('Success');
        setNextHint('Backup My Wallet Now');
        setLaterHint('Backup Later');
        break;
      case 'sign':
      case 'recover':
        setDescription('Success');
        setNextHint('Done');
        break;
    }
  }, []);

  const onSkip = async () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'BackupGuide'}],
    });
  };
  const onNext = async () => {
    switch (flowType) {
      case 'sign':
      case 'recover':
        const isBackup = wallet?.isBackup;
        navigation.reset({
          index: 1,
          routes: isBackup ? [{name: 'WalletScreen'}] : [{name: 'BackupGuide'}],
        });
        break;
      case 'keygen':
        navigation.navigate('BackupTip', {type: {type: 'backup'}});
        break;
    }
  };
  return (
    <>
      <Flex flex={1} align={'center'} justify={'center'}>
        <Image source={require('~/resources/images/success.png')} style={{width: 136, height: 136}} />
        <Text mt={56}>{description}</Text>
      </Flex>
      <Button mx={20} onPress={onNext} mb={bottomSpace === 0 && !laterHint ? 30 : 0}>
        {nextHint}
      </Button>
      {laterHint && (
        <Pressable onPress={onSkip}>
          <Text align={'center'} fontSize={16} color={'second'} py={30} pb={bottomSpace === 0 ? 30 : 10}>
            {laterHint}
          </Text>
        </Pressable>
      )}
    </>
  );
};

export default ResultScreen;
