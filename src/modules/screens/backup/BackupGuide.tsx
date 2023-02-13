import {Image, TouchableWithoutFeedback} from 'react-native';
import React, {FC} from 'react';
import {Button, colors, Flex, Text} from '@/modules/components';
import {ScreenProps} from '@/types/navigation.types';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import useBottomSpace from '@/modules/components/hooks/useBottomSpace';
import useStore from '@/service/store/useStore';

const BackupGuide: FC<ScreenProps<'BackupGuide'>> = ({navigation}) => {
  const [wallet, store] = useStore();

  const toBackup = async () => {
    if (store.passwordSettled) {
      navigation.navigate('BackupTip', {type: {type: 'backup'}});
    } else {
      navigation.navigate('VerifyPasswordScreen', {
        type: 'backup',
      });
    }
  };

  useAndroidBackHandler(() => true);

  const bottomSpace = useBottomSpace();

  return (
    <Flex flex={1}>
      <Flex flex={1} align={'center'} justify={'center'}>
        <Image source={require('~/resources/images/backup-guide.png')} />
        <Text px={20} mt={80} mb={20} fontSize={16} blod>
          {wallet?.name} MPC Wallet
        </Text>
        <Text px={46} fontSize={14} lineHeight={20} align={'center'}>
          Your wallet has not been backed up yet. Please{' '}
          <TouchableWithoutFeedback onPress={toBackup}>
            <Text color={colors.text.link}>complete the backup</Text>
          </TouchableWithoutFeedback>{' '}
          timely to ensure asset security.
        </Text>
      </Flex>
      <Button type={'primary'} mx={20} mb={bottomSpace === 0 ? 50 : 20} onPress={toBackup}>
        Backup the Wallet
      </Button>
    </Flex>
  );
};

BackupGuide.options = {
  headerShown: false,
  gestureEnabled: false,
};

export default BackupGuide;
