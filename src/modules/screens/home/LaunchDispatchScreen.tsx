import React, {useEffect} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import Store from '@/service/store/Store';

const LaunchDispatchScreen: React.FC<ScreenProps<'LaunchDispatch'>> = ({navigation}) => {
  const setupWallet = () => {
    // setup store
    Store.setup().then(store => {
      const walletExist = store.walletExist;
      const isBackup = store.isBackup;
      if (walletExist) {
        const initialScreen = isBackup ? 'WalletScreen' : 'BackupGuide';
        navigation.replace('UnlockScreen', {nextScreen: initialScreen});
      } else {
        navigation.replace('HomeScreen');
      }
    });
  };

  useEffect(() => {
    setupWallet();
  }, []);

  return <></>;
};

LaunchDispatchScreen.title = '';

export default LaunchDispatchScreen;
