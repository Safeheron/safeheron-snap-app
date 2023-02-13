import React, {FC, useLayoutEffect} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {Box, colors, Flex, Text} from '@/modules/components';
import {Pressable, StyleSheet} from 'react-native';
import useDeviceDetect from '@/modules/hooks/useDeviceDetect';
import {WEBSITE_URL} from '@/service/utils/configs';
import useStore from '@/service/store/useStore';
import Logo from '@/modules/components/composites/Logo';

const HomeScreen: FC<ScreenProps<'HomeScreen'>> = ({navigation}) => {
  const [compatible, showVersionTip] = useDeviceDetect();
  let [_, store] = useStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
      headerTitle: () => <Logo />,
    });
  }, [navigation]);

  const createWallet = async () => {
    if (!compatible) {
      showVersionTip();
      return;
    }
    navigation.navigate('SetPasswordScreen', {action: 'createWallet'});
  };

  const recoveryWallet = async () => {
    if (!compatible) {
      showVersionTip();
      return;
    }

    if (store.isDecrypted) {
      navigation.navigate('ScanDynamicQRCodeScreen', {
        flowType: 'recover',
      });
    } else {
      navigation.navigate('SetPasswordScreen', {action: 'recoveryWallet'});
    }
  };

  return (
    <Flex flex={1} px={52} direction={'column'}>
      <Flex flex={1} justify={'center'}>
        <Pressable onPress={createWallet}>
          <Box style={styles.box}>
            <Flex flex={1} justify={'center'} align={'center'}>
              <Text blod fontSize={16} color={'white'} align={'center'}>
                Create a new MPC wallet
              </Text>
            </Flex>
          </Box>
        </Pressable>

        <Pressable onPress={recoveryWallet}>
          <Box style={styles.box} mt={60}>
            <Flex flex={1} justify={'center'} align={'center'}>
              <Text blod fontSize={16} color={'white'} align={'center'}>
                Recover my MPC wallet
              </Text>
            </Flex>
          </Box>
        </Pressable>
      </Flex>

      <Text fontSize={14} lineHeight={20} pb={16}>
        Please visit the Safeheron Snap Website{' '}
        <Text color={colors.text.link} selectable>
          {WEBSITE_URL}
        </Text>{' '}
        to create or recover your wallet.
      </Text>
    </Flex>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#496CE9',
    borderColor: '#496CE9',
    borderWidth: 2,
    borderRadius: 9,
    padding: 0,
    height: 86,
  },
});

HomeScreen.title = '';

export default HomeScreen;
