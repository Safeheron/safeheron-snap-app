import React, {FC, useEffect, useLayoutEffect} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import ScanDynamicQRCode from '@/modules/components/primitives/qrcode/ScanDynamicQRCode';
import {StatusBar} from 'react-native';
import {
  RTC_EVENT_DISCONNECTED,
  RTC_EVENT_ICE_READY_EVENT,
  SignalingDataFromWeb,
  SignalingDataLocal,
} from '@/service/webrtc/RTCPeer';
import {Alert, Text, toast} from '@/modules/components';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import BackButton from '@/modules/components/navigation/BackButton';
import useWebRTC from '@/service/webrtc/useWebRTC';
import logger from '@/service/logger/logger';
import MPCFlowFactory from '@/service/mpc/MPCFlowFactory';

const ScanDynamicQRCodeScreen: FC<ScreenProps<'ScanDynamicQRCodeScreen'>> = ({navigation, route}) => {
  const {flowType} = route.params;
  let [rtcPeer, destroy] = useWebRTC();

  const onIceGatheringComplete = (sdpICE: SignalingDataLocal) => {
    navigation.replace('QRCodeDisplayScreen', {sdpICE, flowType});
  };

  const onRTCConnectionFailed = (message?: string) => {
    if (message && typeof message === 'string') {
      toast.error(message);
    }
    destroy();
    navigation.goBack();
  };

  const onScanError = () => {
    toast.error('Scan qrcode occur an error, please check the qrcode content.');
  };

  useEffect(() => {
    MPCFlowFactory.cleanup();

    StatusBar.setBarStyle('light-content');

    const l1 = rtcPeer.on(RTC_EVENT_ICE_READY_EVENT, onIceGatheringComplete);
    const l2 = rtcPeer.on(RTC_EVENT_DISCONNECTED, onRTCConnectionFailed);
    rtcPeer.createPeerConnection();

    return () => {
      l1.off(RTC_EVENT_ICE_READY_EVENT, onIceGatheringComplete);
      l2.off(RTC_EVENT_DISCONNECTED, onRTCConnectionFailed);
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  useAndroidBackHandler(() => {
    destroy();
    return false;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => <BackButton onPress={onRTCConnectionFailed} />,
      headerRight: () => null,
    });
  });

  const onComplete = async (signalingInfo: string) => {
    try {
      const sdpICE = JSON.parse(signalingInfo) as SignalingDataFromWeb;
      const businessType = sdpICE.businessType;

      if (businessType !== flowType) {
        const warnText = `Operation type not match, web's operation type is [${
          businessType ?? 'unknown'
        }] and phone's operation type is [${flowType}]`;
        Alert.alert({plain: true}, <Text fontSize={16}>{warnText}</Text>);

        onRTCConnectionFailed();
      } else {
        await rtcPeer.receiverSDPAndICE(sdpICE);
      }
    } catch (e) {
      logger.screen.error('cannot connect with web page, please check the app and web are in same LAN', e);
      onRTCConnectionFailed('cannot connect with web page, please check the app and web are in same LAN');
    }
  };

  return <ScanDynamicQRCode onError={onScanError} onComplete={onComplete} />;
};

export default ScanDynamicQRCodeScreen;
ScanDynamicQRCodeScreen.options = {
  headerTransparent: true,
  headerTintColor: '#FFFFFF',
};

ScanDynamicQRCodeScreen.title = () => 'Connect to Website';
ScanDynamicQRCodeScreen.useSafearea = false;
