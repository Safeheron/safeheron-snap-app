import React from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';
import SkeletonScreen from '@/modules/skeleton/SkeletonScreen';
import ScreenLoader from '@/modules/skeleton/ScreenLoader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import {Platform} from 'react-native';

// @ts-ignore
import {IOS_SENTRY_DSN, ANDROID_SENTRY_DSN} from '@env';

Sentry.init({
  dsn: Platform.select({
    ios: IOS_SENTRY_DSN,
    android: ANDROID_SENTRY_DSN,
  }),
  autoSessionTracking: true,
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'debug' : 'release',
  autoInitializeNativeSdk: false,
  defaultIntegrations: false,
});

const App = () => {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <SkeletonScreen {...ScreenLoader()} />
      </SafeAreaProvider>
    </RootSiblingParent>
  );
};

export default App;
