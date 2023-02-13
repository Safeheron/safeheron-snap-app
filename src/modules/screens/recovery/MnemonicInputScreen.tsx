import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {Box, Button, colors, Flex, Text} from '@/modules/components';
import {Pressable, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback} from 'react-native';
import {ScreenProps} from '@/types/navigation.types';
import Clipboard from '@react-native-clipboard/clipboard';
import {KeyRecoveryFlow} from '@/service/mpc/recovery/KeyRecoveryFlow';
import {english} from '@/service/bip39/english';
import AlertDialog from '@/modules/components/primitives/alert-dialog';
import BackButton from '@/modules/components/navigation/BackButton';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {DISABLE_SKIP_EVENT} from '@/service/mpc/recovery/KeyRecoveryFlow';
import useMPCFlow from '@/service/mpc/hooks/useMPCFlow';
import {BusinessType} from '@/service/mpc/mpcTypes';

let bip39Map: {[key: string]: string[]} = {};

function initBip39EnMap() {
  for (let start = 97; start <= 122; start++) {
    bip39Map[String.fromCharCode(start)] = [];
  }

  english.forEach(w => {
    const firstLetter = w.charAt(0);
    bip39Map[firstLetter].push(w);
  });
}

function getSuggestWord(letter: string) {
  const first = letter.charAt(0);
  const bipArray = bip39Map[first] || [];
  return bipArray.filter(w => w.indexOf(letter) === 0).sort();
}

function checkValid(value: string[]): boolean {
  if (!value || value.length !== 24) {
    return false;
  }
  return checkLexicon(value);
}

function checkLexicon(value: string[]) {
  let flag = true;
  for (let index in value) {
    const word = value[index];
    const matchedWord = getSuggestWord(word);
    if (!matchedWord || !matchedWord.includes(word)) {
      flag = false;
      break;
    }
  }
  return flag;
}

function normalizedMnemonicStr(str: string) {
  return str.trim().split(/\s+/g).join(' ');
}

const MnemonicInputScreen: React.FC<ScreenProps<'MnemonicInputScreen'>> = ({navigation, route}) => {
  const {partyId} = route.params;

  const [wordStr, setWordStr] = useState<string>('');
  const [supportSkip, setSupportSkip] = useState(true);

  const wordList = useMemo(() => wordStr.trim().split(/\s+/g), [wordStr]);

  const invalidWords = useMemo(() => checkValid(wordList), [wordList]);

  const [recoverFlow, manuallyCancel] = useMPCFlow(navigation, 'recover');

  const flowType: BusinessType = 'recover';

  const doPaste = async () => {
    const str = await Clipboard.getString();
    setWordStr(str);
  };

  const doSkip = async () => {
    if (supportSkip) {
      const confirm = AlertDialog.confirm(
        {
          onOk: async () => {
            await confirm.close();
            await (recoverFlow as KeyRecoveryFlow).skip();
            navigation.replace('MPCLoadingScreen', {
              flowType,
            });
          },
          plain: true,
          okText: 'Confirm',
          cancelText: 'Cancel',
        },
        <Text fontSize={16} blod align={'left'} pt={30} pl={20}>
          The wallet address will remain the same, but remember to back up the recovered private key shard before using
          the wallet.
        </Text>,
      );
    } else {
      const alert = AlertDialog.alert(
        {
          plain: true,
          onOk: () => alert.close(),
        },
        <Text fontSize={16} blod align={'left'} pt={30} pl={15}>
          Please follow the prompts in the Safeheron Snap App on each phone, and tap 'Continue' in the mobile app after
          completing the operation.
        </Text>,
      );
    }
  };

  const toNext = async () => {
    (recoverFlow as KeyRecoveryFlow).setInputMnemonic(normalizedMnemonicStr(wordStr));
    (recoverFlow as KeyRecoveryFlow).recoveryContinue();
    navigation.replace('MPCLoadingScreen', {flowType});
  };

  const onDisableSkip = () => setSupportSkip(false);

  useAndroidBackHandler(() => {
    manuallyCancel();
    return true;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => <BackButton onPress={manuallyCancel} />,
      headerRight: () => null,
    });
  });

  useEffect(() => {
    initBip39EnMap();

    const listener = recoverFlow.on(DISABLE_SKIP_EVENT, onDisableSkip);

    return () => {
      listener.off(DISABLE_SKIP_EVENT, onDisableSkip);
    };
  }, []);

  return (
    <Flex flex={1} px={20}>
      <ScrollView style={{flex: 1}} keyboardDismissMode={'on-drag'} keyboardShouldPersistTaps={'handled'}>
        <Text mt={20} mb={8} blod>
          Please enter the mnemonic phrase for private key shard {partyId}, and ensure no other devices have used this
          mnemonic phrase.
        </Text>
        <Box radius={8} padding={0} style={styles.inputContainer}>
          <Flex flex={1} padding={16}>
            <TextInput
              value={wordStr}
              onChangeText={setWordStr}
              style={styles.input}
              multiline={true}
              textAlignVertical={'top'}
              autoComplete={'off'}
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'done'}
              autoFocus={false}
              clearButtonMode={'never'}
              underlineColorAndroid={'transparent'}
              placeholder={'Please enter 24 words separated by spaces'}
            />
            <Pressable onPress={doPaste}>
              <Text align={'right'} mt={16} color={colors.text.link}>
                Paste
              </Text>
            </Pressable>
          </Flex>
        </Box>
        {!invalidWords && (
          <Text color={'danger'} pt={6} fontSize={13}>
            Incorrect mnemonic phrase. Please check and enter again.
          </Text>
        )}
      </ScrollView>
      <Flex>
        <Text fontSize={12} lineHeight={62} align={'center'}>
          The mnemonic phrase is lost.{' '}
          <TouchableWithoutFeedback onPress={doSkip}>
            <Text color={colors.text.link}>Skip it</Text>
          </TouchableWithoutFeedback>
        </Text>
        <Button type={'primary'} mb={22} onPress={toNext} disabled={!invalidWords}>
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 223,
  },
  input: {
    flex: 1,
    verticalAlign: 'top',
    fontSize: 14,
  },
});

MnemonicInputScreen.title = 'Recover';

export default MnemonicInputScreen;
