import React, {FC, useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, TextInput} from 'react-native';
import {colors, Flex, Icon, Text, useToast} from '@/modules/components';
import {chunk} from 'lodash';
import {IFlexProps} from '@/modules/components/primitives/flex/types';
import Box from '@/modules/components/primitives/box/Box';
import {ISpaceStyleProps} from '@/modules/components/hooks/use-space-props/types';
import {getRandomArray} from '../util';
import Clipboard from '@react-native-clipboard/clipboard';
import {PartyId} from '@/service/mpc/util';

interface MnemonicsProps {
  partyId?: PartyId;
  words: string[];
  mode: 'preview' | 'partyPreview' | 'partyVerify';
  randomNum?: number;
  containerProps?: IFlexProps;
  onVerifySuccess?: (result: boolean) => void;
}

const Mnemonics: React.FC<MnemonicsProps> = ({
  partyId,
  words,
  containerProps,
  randomNum,
  mode = 'preview',
  onVerifySuccess,
}) => {
  let toast = useToast();
  const chunkedWords = chunk(words, 3);

  const verifyRef = useRef<{[key in string]: boolean}>({});

  const handleVerify = (word: string, result: boolean) => {
    verifyRef.current[word] = result;
    const verifyResult = Object.values(verifyRef.current);
    const verifiedAll = verifyResult.length === randomNum && verifyResult.every(Boolean);
    onVerifySuccess && onVerifySuccess(verifiedAll);
  };

  const doCopy = () => {
    const str = words?.join(' ');
    if (str) {
      Clipboard.setString(`Key shard ${partyId}: \n${str}`);
      toast.show('Copied!');
    }
  };

  const [randomArr, setRandomArr] = useState<number[]>([]);

  const renderRow = (key: string | number, order: number, word: string) => {
    if (mode === 'preview') {
      return <MnemonicWord key={key} mr={10} keyNme={key} orderNum={order} word={word} />;
    }
    if (mode === 'partyPreview') {
      return (
        <MnemonicWord key={key} mask={!randomArr.includes(order)} mr={10} keyNme={key} orderNum={order} word={word} />
      );
    }
    if (mode === 'partyVerify') {
      return randomArr.includes(order) ? (
        <MnemonicInput
          key={key}
          mr={10}
          keyNme={key}
          orderNum={order}
          word={word}
          onVerifySuccess={result => {
            handleVerify(word, result);
          }}
        />
      ) : (
        <MnemonicWord key={key} mr={10} keyNme={key} orderNum={order} word={word} />
      );
    }
  };

  useEffect(() => {
    if (mode === 'partyVerify' || mode === 'partyPreview') {
      const randomArray = getRandomArray(randomNum ?? 1, 1, words.length);
      setRandomArr(randomArray);
    }
  }, [mode, randomNum, words]);

  return (
    <>
      <Flex {...containerProps}>
        {chunkedWords.map((row, rowIndex) => {
          return (
            <Flex row key={rowIndex} mb={10}>
              {row.map((item, itemIndex) => {
                const order = rowIndex * 3 + itemIndex + 1;
                return renderRow(rowIndex + '_' + itemIndex, order, item);
              })}
            </Flex>
          );
        })}
      </Flex>
      {mode === 'preview' && (
        <Flex mt={10}>
          <Pressable onPress={doCopy}>
            <Flex row justify={'center'} align={'center'}>
              <Icon name={'copy'} />
              <Text ml={5} color={colors.text.link}>
                Copy
              </Text>
            </Flex>
          </Pressable>
        </Flex>
      )}
    </>
  );
};

interface MnemonicWordProps extends ISpaceStyleProps {
  orderNum: number;
  word: string;
  keyNme: number | string;
  mask?: boolean;
}

const MnemonicWord: FC<MnemonicWordProps> = ({orderNum, word, mask, keyNme, ...spaceProps}) => {
  return (
    <Box padding={0} bg={'#F8F8F8'} radius={3} style={{flex: 1, marginRight: 12}}>
      <Flex row align={'center'} key={keyNme} style={{height: 30}} {...spaceProps}>
        <OrderText orderNum={orderNum} />
        <Text fontSize={14}>{mask ? '*****' : word}</Text>
      </Flex>
    </Box>
  );
};

interface MnemonicInputProps extends MnemonicWordProps {
  onVerifySuccess?: (result: boolean) => void;
}

const MnemonicInput: React.FC<MnemonicInputProps> = ({keyNme, orderNum, word, onVerifySuccess, ...spaceProps}) => {
  const [inputWord, setInputWord] = useState('');

  const showError = !!inputWord && word !== inputWord;

  const handleInputWord = (w: string) => {
    const trimW = w.trim();
    setInputWord(trimW);
    if (trimW === word) {
      onVerifySuccess && onVerifySuccess(true);
    } else {
      onVerifySuccess && onVerifySuccess(false);
    }
  };

  return (
    <Box
      key={keyNme}
      padding={[0, 0]}
      radius={3}
      style={[{flex: 1, borderColor: '#CBD5E1', borderWidth: 1}, showError && styles.errorInputContainer]}
      {...spaceProps}>
      <Flex row align={'center'} style={{height: 30}}>
        <OrderText orderNum={orderNum} />
        <TextInput
          value={inputWord}
          onChangeText={handleInputWord}
          selectionColor={colors.primary}
          autoCapitalize={'none'}
          clearTextOnFocus={false}
          clearButtonMode={'never'}
          blurOnSubmit={false}
          underlineColorAndroid={'transparent'}
          style={{flex: 1, fontSize: 12, paddingVertical: 0, color: '#262832'}}
        />
      </Flex>
    </Box>
  );
};

const OrderText: React.FC<{orderNum: number}> = ({orderNum}) => {
  return (
    <Text color="#6B6D7C" fontSize={10} ml={5} mr={8}>
      {orderNum}
    </Text>
  );
};

const styles = StyleSheet.create({
  errorInputContainer: {
    borderColor: '#D21313',
  },
});

export default Mnemonics;
