import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {Alert, Text} from '@/modules/components';
import semver from 'semver';
import log from '@/service/logger/logger';
import {waitForMPCInstance} from '@/service/mpc/algorithm/MPCBridge';

const SUPPORTED_IOS_VERSION = '14.5.0';

const Tips: Record<typeof Platform.OS, string> = {
  ios: 'Your device system version is too low to support Safeheron Snap App.Please upgrade your device system version (iOS 14.5 and above) before returning to Safeheron Snap App.',
  android:
    'Your device system version is too low to support Safeheron Snap App. Please upgrade to the latest device system version before returning to Safeheron Snap App.',
  macos: 'Not supported device type: macos',
  windows: 'Not supported device type: windows',
  web: 'Not supported device type: web',
};

function iosVersionToSemVer(iosVersion: string) {
  const parts = iosVersion.split('.');
  const major = parseInt(parts[0]);
  const minor = parts.length > 1 ? parseInt(parts[1]) : 0;
  const patch = parts.length > 2 ? parseInt(parts[2]) : 0;

  return `${major}.${minor}.${patch}`;
}

const systemVersion = Platform.Version;

export default function useDeviceDetect(): [boolean, Function] {
  const [compatible, setCompatible] = useState(true);

  const showVersionTip = () => {
    const os = Platform.OS;
    Alert.alert(
      {plain: true},
      <Text align={'center'} lineHeight={24}>
        {Tips[os]}
      </Text>,
    );
  };

  const detectDevice = async () => {
    if (Platform.OS === 'ios') {
      if (semver.lt(iosVersionToSemVer('' + systemVersion), SUPPORTED_IOS_VERSION)) {
        setCompatible(false);
        showVersionTip();
      }
    } else if (Platform.OS === 'android') {
      const mpcInstance = await waitForMPCInstance();
      const res = await mpcInstance.detectCompatibility();
      log.mpc.info('detect compatibility result: ', res);
      if (!res.state) {
        setCompatible(false);
        showVersionTip();
      }
    }
  };

  useEffect(() => {
    detectDevice();
  }, []);

  return [compatible, showVersionTip];
}
