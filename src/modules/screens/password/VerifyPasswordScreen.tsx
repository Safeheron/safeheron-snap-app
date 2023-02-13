import React, {FC, useState} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import DefaultInput from '@/modules/components/primitives/input/DefaultInput';
import {ScrollView} from 'react-native';
import {Button} from '@/modules/components';
import Toast from '@/modules/components/primitives/toast/Toast';
import useStore from '@/service/store/useStore';

const VerifyPasswordScreen: FC<ScreenProps<'VerifyPasswordScreen'>> = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  let [_, store] = useStore();

  const verifyPassword = async () => {
    setLoading(true);
    try {
      await store.setPassword(password);
    } catch (e) {
      Toast.show('Verification failed');
      return;
    } finally {
      setLoading(false);
    }

    const type = route.params.type;
    switch (type) {
      case 'sign':
        navigation.replace('ScanDynamicQRCodeScreen', {
          flowType: 'sign',
        });
        break;
      case 'check':
        navigation.replace('BackupTip', {type: {type: 'check'}});
        break;
      case 'recovery':
        navigation.navigate('ScanDynamicQRCodeScreen', {
          flowType: 'recover',
        });
        break;
      case 'backup':
        navigation.replace('BackupTip', {type: {type: 'backup'}});
        break;
    }
  };

  return (
    <>
      <ScrollView
        style={{padding: 20}}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}>
        <DefaultInput
          secureTextEntry={true}
          maxLength={32}
          text={password}
          title={'Enter Password'}
          hint={'6-32 Characters'}
          onChangeText={(v: string) => setPassword(v?.trim())}
        />
      </ScrollView>
      <Button mx={20} mb={22} loading={loading} onPress={verifyPassword} disabled={password.length < 6}>
        Continue
      </Button>
    </>
  );
};

export default VerifyPasswordScreen;
VerifyPasswordScreen.title = 'Verify Password';
