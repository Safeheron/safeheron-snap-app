import {ScreenProps} from '@/types/navigation.types';
import React, {FC, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {Pressable} from 'react-native';
import {Box, colors, Text} from '@/modules/components';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {WorkFlowPrepareParams} from '@/service/mpc/flow/BaseWorkFlow';
import logger from '@/service/logger/logger';
import app from '@/service/app/App';
import Flex from '../../components/primitives/flex/Flex';
import DynamicQRCode from '@/modules/components/primitives/qrcode/DynamicQRCode';
import useMPCFlow from '@/service/mpc/hooks/useMPCFlow';
import useWebRTC from '@/service/webrtc/useWebRTC';
import {RTC_EVENT_CHANNEL_OPENED} from '@/service/webrtc/RTCPeer';
import Spinner from '@/modules/components/primitives/spinner/Spinner';

export const QRCodeDisplayScreen: FC<ScreenProps<'QRCodeDisplayScreen'>> = ({navigation, route}) => {
  const {sdpICE, flowType} = route.params;
  useAndroidBackHandler(() => true);
  useKeepAwake();
  let [rtcPeer] = useWebRTC();
  const [rtcConnected, setRtcConnected] = useState(false);

  const [mpcFlow, manuallyCancel, _] = useMPCFlow(navigation, flowType);

  const qrCodeData = useMemo(() => {
    return JSON.stringify({
      ...sdpICE,
      businessType: flowType,
      version: app.version,
    });
  }, [sdpICE, flowType]);

  const onPrepare = (arg: WorkFlowPrepareParams) => {
    logger.screen.debug('receive prepare params: ', arg);
    switch (arg.event) {
      case 'CreateWallet':
        navigation.replace('MPCLoadingScreen', {
          flowType,
        });
        break;
      case 'Sign':
        navigation.replace('SignConfirmScreen', {...arg.data});
        break;
      case 'RecoveryNotNeed':
        navigation.replace('RecoveryNotNeedScreen');
        break;
      case 'RecoverReady':
        navigation.navigate('PrepareScreen');
        break;
      case 'DisplayMnemonic':
        navigation.replace('MnemonicPartyReview', {mnemonic: arg.data.split(' ')});
        break;
      case 'MnemonicInput':
        navigation.replace('MnemonicInputScreen', {partyId: arg.data});
        break;
    }
  };

  const onRtcChannelOpened = () => setRtcConnected(true);

  useEffect(() => {
    const rtcChannelOpenListener = rtcPeer.on(RTC_EVENT_CHANNEL_OPENED, onRtcChannelOpened);
    const prepareListener = mpcFlow.on('prepare', onPrepare);

    // bind message handler
    mpcFlow.start();

    return () => {
      rtcChannelOpenListener.off(RTC_EVENT_CHANNEL_OPENED, onRtcChannelOpened);
      prepareListener.off('prepare', onPrepare);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Connect to Website',
      gestureEnabled: false,
      headerLeft: () => null,
      headerRight: () => (
        <Pressable onPress={manuallyCancel}>
          <Text color={'second'} pr={20} pl={10}>
            Cancel
          </Text>
        </Pressable>
      ),
    });
  });

  return (
    <Flex align={'center'} px={46}>
      {rtcConnected && (
        <Box border={false} padding={[130, 0, 0, 0]}>
          <Spinner size={'large'} />
          <Text mt={20} fontSize={16}>
            Connecting
          </Text>
        </Box>
      )}
      {!rtcConnected && (
        <>
          <Text mt={57} mb={40} blod align={'center'} lineHeight={25} fontSize={16}>
            Place the QR code in front of {'\n'} your desktop’s camera
          </Text>
          <Flex
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 249,
              height: 249,
              borderWidth: 1,
              borderColor: colors.board.primary,
            }}>
            <DynamicQRCode value={qrCodeData} size={222} />
          </Flex>
          <Text fontSize={14} mt={30} lineHeight={20} align={'center'}>
            No centralized server, peer-to-peer connection between mobile phone and website.
          </Text>
        </>
      )}
    </Flex>
  );
};

export default QRCodeDisplayScreen;
