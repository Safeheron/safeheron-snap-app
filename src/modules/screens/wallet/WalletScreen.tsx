import React, {FC, useLayoutEffect, useState} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {Alert, Button, colors, Flex, Text, toast} from '@/modules/components';
import Icon from '@/modules/components/primitives/icon/Icon';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Box from '@/modules/components/primitives/box/Box';
import Animated, {SlideInLeft, SlideOutLeft} from 'react-native-reanimated';
import {WEBSITE_URL} from '@/service/utils/configs';
import useStore from '@/service/store/useStore';
import Store from '@/service/store/Store';
import Logo from '@/modules/components/composites/Logo';

const WalletScreen: FC<ScreenProps<'WalletScreen'>> = ({navigation}) => {
  useAndroidBackHandler(() => true);

  let [wallet, store] = useStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const showMenu = () => {
    setMenuModalVisible(true);
    setMenuVisible(true);
  };

  const hideMenu = async () => {
    return new Promise(resolve => {
      setMenuVisible(false);
      setTimeout(() => {
        setMenuModalVisible(false);
        resolve(true);
      }, 350);
    });
  };

  const toCheckKeyShard = async () => {
    await hideMenu();
    if (store.isDecrypted) {
      navigation.navigate('CheckKeyShard');
    } else {
      navigation.navigate('VerifyPasswordScreen', {
        type: 'check',
      });
    }
  };

  const toRecovery = async () => {
    await hideMenu();
    if (store.isDecrypted) {
      navigation.navigate('ScanDynamicQRCodeScreen', {
        flowType: 'recover',
      });
    } else {
      navigation.navigate('VerifyPasswordScreen', {type: 'recovery'});
    }
  };

  const handleResetWallet = async () => {
    await hideMenu();
    const alert = Alert.confirm(
      {
        plain: true,
        okDelay: 5,
        onOk: () => {
          alert.close();
          // TODO 跳转到验证密码的页面
          Store.get().resetWallet();
          navigation.replace('HomeScreen');
        },
      },
      <Flex>
        <Text blod align={'center'} mb={12}>
          Confirm to reset Wallet?
        </Text>
        <Text lineHeight={20}>
          Before resetting the wallet, please make sure you have backed up all 3 private key shards, otherwise you will
          permanently lose your assets.
        </Text>
      </Flex>,
    );
  };

  const toMpcSign = async () => {
    if (store.isDecrypted) {
      navigation.navigate('ScanDynamicQRCodeScreen', {flowType: 'sign'});
    } else {
      navigation.navigate('VerifyPasswordScreen', {type: 'sign'});
    }
  };

  const doCopy = () => {
    if (wallet?.address) {
      Clipboard.setString(wallet?.address);
      toast.show('Copied');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      gestureEnabled: false,
      headerLeft: () => (
        <TouchableOpacity style={{paddingLeft: 20}} activeOpacity={0.8} onPress={showMenu}>
          <Image source={require('~/resources/images/menu.png')} />
        </TouchableOpacity>
      ),
      headerTitle: () => <Logo />,
    });
  }, [navigation]);

  return (
    <Flex flex={1}>
      <ScrollView style={{flex: 1}}>
        <Flex px={20} flex={1}>
          <Text fontSize={14} blod mb={20} mt={110} align={'center'}>
            {wallet?.name}
          </Text>
          <Box
            padding={0}
            radius={8}
            bg={colors.bg.bg2}
            style={{
              borderWidth: 1,
              borderColor: colors.board.primary,
            }}>
            <Flex row py={10} pl={16} pr={30}>
              <Text blod pr={20} lineHeight={20}>
                {wallet?.address}
              </Text>
              <Pressable onPress={doCopy}>
                <Icon name={'copy'} />
              </Pressable>
            </Flex>
          </Box>
          <Flex mt={28} ml={16}>
            <Text mb={20}>Use Safeheron Snap in MetaMask:</Text>
            <Flex row mb={5} align={'flex-start'}>
              <Text lineHeight={20} mr={4}>
                1.
              </Text>
              <Text lineHeight={20} style={{flex: 1}}>
                Select the Safeheron Snap account in the MetaMask Extension.
              </Text>
            </Flex>
            <Flex row mb={5} align={'flex-start'}>
              <Text lineHeight={20} mr={4}>
                2.
              </Text>
              <Text lineHeight={20} style={{flex: 1}}>
                Submit the signature request in the MetaMask Extension.
              </Text>
            </Flex>
            <Flex row mb={5} align={'flex-start'}>
              <Text lineHeight={20} mr={4}>
                3.
              </Text>
              <Text lineHeight={20} style={{flex: 1}}>
                Process the signature request on the Safeheron Snap website(
                <Text color={colors.text.link} selectable>
                  {WEBSITE_URL}
                </Text>
                ).
              </Text>
            </Flex>
            <Flex row mb={5} align={'flex-start'}>
              <Text lineHeight={20} mr={4}>
                4.
              </Text>
              <Text lineHeight={20} style={{flex: 1}}>
                Follow the instructions to complete the MPC Sign in the Safeheron Snap App.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>

      <Button mx={20} mb={22} onPress={toMpcSign}>
        MPC Sign
      </Button>

      <Modal visible={menuModalVisible} transparent animationType={'fade'} statusBarTranslucent={true}>
        <Flex style={styles.modalContainer}>
          {menuVisible && (
            <Animated.View entering={SlideInLeft} exiting={SlideOutLeft} style={styles.menuContainer}>
              <Pressable onPress={toCheckKeyShard}>
                <Text style={styles.menuText}>View Key Shard {wallet?.partyId}</Text>
              </Pressable>
              <Pressable onPress={toRecovery}>
                <Text style={styles.menuText}>Recover Other Device</Text>
              </Pressable>
              <Pressable onPress={handleResetWallet}>
                <Text style={styles.menuText}>Reset Wallet</Text>
              </Pressable>
            </Animated.View>
          )}
          <Pressable style={styles.placeholder} onPress={hideMenu}>
            <Flex />
          </Pressable>
        </Flex>
      </Modal>
    </Flex>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',
    flexDirection: 'row',
  },
  menuContainer: {
    backgroundColor: '#000000E6',
    paddingTop: 88,
    paddingLeft: 20,
    paddingRight: 30,
    flex: 0,
  },
  placeholder: {
    flex: 1,
    backgroundColor: 'transparent',
    height: '100%',
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
});

export default WalletScreen;
