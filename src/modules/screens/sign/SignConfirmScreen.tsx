import React, {FC, useEffect, useLayoutEffect} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {Alert, Button, colors, Flex, Text} from '@/modules/components';
import {ScrollView} from 'react-native';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import AlertDialog from '@/modules/components/primitives/alert-dialog';
import MPCFlowFactory from '@/service/mpc/MPCFlowFactory';
import SignFlow from '@/service/mpc/sign/SignFlow';

import SendNativeAssert from '@/modules/screens/sign/transaction/SendNativeAssert';
import SignMessage from '@/modules/screens/sign/message/SignMessage';
import {TransactionObject} from '@safeheron/mpcsnap-types';
import useStore from '@/service/store/useStore';
import useMPCFlow from '@/service/mpc/hooks/useMPCFlow';
import {BusinessType} from '@/service/mpc/mpcTypes';

const SignConfirmScreen: FC<ScreenProps<'SignConfirmScreen'>> = ({route, navigation}) => {
  const flowType: BusinessType = 'sign';

  const [__, manuallyCancel] = useMPCFlow(navigation, flowType);
  const [wallet, _] = useStore();

  const signFlow = MPCFlowFactory.getFlowInstance(flowType) as SignFlow;

  const {method, params, commonParams, walletId: remoteWalletId} = route.params;

  const isSignTx = method === 'eth_signTransaction';

  useAndroidBackHandler(() => {
    return true;
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      title: 'Confirm',
      gestureEnabled: false,
    });
  });

  const confirmOrder = async () => {
    await signFlow.confirmSign();
    navigation.navigate('MPCLoadingScreen', {flowType: 'sign'});
  };

  const reject = () => {
    const alert = AlertDialog.confirm(
      {
        onOk: async () => {
          manuallyCancel();
          await alert.close();
        },
        plain: true,
        okText: 'Confirm',
        cancelText: 'Cancel',
      },
      <Text fontSize={16} blod align={'center'} pt={60}>
        Confirm to reject the transaction?
      </Text>,
    );
  };

  const detectWallet = () => {
    const thisWalletId = wallet?.id;

    if (thisWalletId !== remoteWalletId) {
      const alert = Alert.alert(
        {
          plain: true,
          onOk: () => {
            alert.close();
            manuallyCancel();
          },
        },
        <Text>
          Wallet not matched, current wallet id is <Text blod>{thisWalletId}</Text> and remote wallet id is{' '}
          <Text blod>{remoteWalletId}</Text>
        </Text>,
      );
    }
  };

  useEffect(() => {
    detectWallet();
  }, []);

  return (
    <Flex flex={1} style={{backgroundColor: colors.bg.white}}>
      <ScrollView style={{backgroundColor: colors.bg.bg1, flex: 1}}>
        {isSignTx ? (
          <SendNativeAssert tx={params as TransactionObject} commonParams={commonParams} />
        ) : (
          <SignMessage method={method} params={params} commonParams={commonParams} />
        )}
      </ScrollView>
      <Flex row my={22} justify={'space-between'} px={20}>
        <Button mr={8} style={{flex: 1}} type={'solid'} onPress={reject}>
          Reject
        </Button>
        <Button ml={8} style={{flex: 1}} onPress={confirmOrder}>
          Confirm
        </Button>
      </Flex>
    </Flex>
  );
};

export default SignConfirmScreen;

SignConfirmScreen.title = 'Confirm';
