import React, {useEffect} from 'react';
import {AppState} from 'react-native';
import {AppStateStatus} from 'react-native/Libraries/AppState/AppState';
import logger from '@/service/logger/logger';
import {navigate, navigationRef} from '@/service/navigation/RootNavigation';
import Store from '@/service/store/Store';
import {useGetState} from 'ahooks';

interface AuthContextProp {
  locked: boolean;
  unlock: () => void;
}

const AuthContext = React.createContext<AuthContextProp>({
  locked: false,
  unlock: () => {},
});

const UNLOCK_SCREEN = 'UnlockScreen';

const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [locked, setLocked, getLocked] = useGetState(true);

  const unlock = () => setLocked(false);

  const contextValue = {locked, unlock};

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    logger.base.debug('app state change: ', nextAppState);

    if (nextAppState === 'background') {
      if (Store.get().walletExist) {
        setLocked(true);
      }
    }

    if (nextAppState === 'active') {
      // wallet not create, skip auth
      if (!Store.get().walletExist || !getLocked()) {
        return;
      }

      const currentFocusRoute = navigationRef.current?.getCurrentRoute();
      const currentFocusName = currentFocusRoute?.name;

      if (currentFocusName !== UNLOCK_SCREEN) {
        navigate(UNLOCK_SCREEN);
      }
    }
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    return () => appStateListener.remove();
  }, []);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export {AuthContextProvider, AuthContext};
