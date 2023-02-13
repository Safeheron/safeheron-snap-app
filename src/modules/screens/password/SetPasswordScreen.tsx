import React, {FC, useState} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {Button, Checkbox, colors, Flex, Text} from '@/modules/components';
import DefaultInput from '@/modules/components/primitives/input/DefaultInput';
import {Linking, ScrollView} from 'react-native';
import Toast from '@/modules/components/primitives/toast/Toast';
import {AGREEMENT_URL} from '@/service/utils/configs';
import useStore from '@/service/store/useStore';

export interface SetPasswordScreenProps {
  action: 'createWallet' | 'recoveryWallet';
}

const SetPasswordScreen: FC<ScreenProps<'SetPasswordScreen'>> = ({navigation, route}) => {
  const {action} = route.params;
  let [_, store] = useStore();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const savePassword = async () => {
    if (!password || password === '') {
      Toast.show('Please enter the password');
      return;
    }
    if (!repeatPassword || repeatPassword === '') {
      Toast.show('Please reconfirm the password');
      return;
    }
    const charLen = password.length;
    if (charLen < 6) {
      Toast.show('The password length needs to be greater than 6');
      return;
    }
    if (password !== repeatPassword) {
      Toast.show('Two passwords do not match');
      return;
    }

    await store.setPassword(password);

    // TODO 优化这里
    switch (action) {
      case 'createWallet':
        navigation.replace('ScanDynamicQRCodeScreen', {
          flowType: 'keygen',
        });
        break;
      case 'recoveryWallet':
        navigation.replace('ScanDynamicQRCodeScreen', {
          flowType: 'recover',
        });
        break;
    }
  };

  const toAgreement = () => {
    Linking.openURL(AGREEMENT_URL);
  };

  return (
    <Flex flex={1} mx={20}>
      <ScrollView keyboardShouldPersistTaps={'handled'} scrollEnabled={false} showsVerticalScrollIndicator={false}>
        <DefaultInput
          mt={20}
          secureTextEntry={true}
          maxLength={32}
          title={'Enter Password'}
          hint={'6-32 Characters'}
          onChangeText={(v: string) => {
            setPassword(v.trim());
          }}
        />
        <DefaultInput
          mt={30}
          maxLength={32}
          secureTextEntry={true}
          title={'Reconfirm Password'}
          hint={'6-32 Characters'}
          onChangeText={(v: string) => {
            setRepeatPassword(v.trim());
          }}
        />

        <Flex mt={30} row align={'center'}>
          <Checkbox checked={agree} onChange={setAgree} />
          <Text>
            I agree to the{' '}
            <Text color={colors.text.link} onPress={toAgreement}>
              User and Privacy Agreement.
            </Text>
          </Text>
        </Flex>
      </ScrollView>
      <Flex>
        <Text lineHeight={16} fontSize={12} pb={20} color={'second'}>
          Your wallet password protects your key shards. Safeheron Snap neither stores nor can recover it if it's lost.
          Please keep it safe.
        </Text>
        <Button onPress={savePassword} mb={22} disabled={!agree}>
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};

export default SetPasswordScreen;

SetPasswordScreen.title = 'Set Password';
