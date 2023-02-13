import React, {FC, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {ScreenProps} from '@/types/navigation.types';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import {Pressable} from 'react-native';
import {Text} from '@/modules/components';
import MPCFlowFactory from '@/service/mpc/MPCFlowFactory';
import MpcLoading from '@/modules/components/composites/mpc-loading/Index';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import useMPCFlow from '@/service/mpc/hooks/useMPCFlow';
import {WORKFLOW_EVENT_PROGRESS, WORKFLOW_EVENT_SUCCESS} from '@/service/mpc/mpcEvents';

import {BusinessType} from '@/service/mpc/mpcTypes';

const titleMap: Record<BusinessType, string> = {
  keygen: 'Creating Wallet',
  sign: 'Signing in Progress',
  recover: 'Recover',
};

export const MPCLoadingScreen: FC<ScreenProps<'MPCLoadingScreen'>> = ({navigation, route}) => {
  const {flowType} = route.params;

  useKeepAwake();
  useAndroidBackHandler(() => true);

  const [workFlow, manuallyCancel] = useMPCFlow(navigation, flowType);

  const [progress, setProgress] = useState<number>(workFlow.currentProgress);

  const title = useMemo(() => titleMap[flowType], [flowType]);

  const onSuccess = () => navigation.replace('ResultScreen', {flowType});

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
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

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  });

  useEffect(() => {
    const progressListener = workFlow.on(WORKFLOW_EVENT_PROGRESS, setProgress);
    const successListener = workFlow.on(WORKFLOW_EVENT_SUCCESS, onSuccess);

    return () => {
      progressListener.off(WORKFLOW_EVENT_PROGRESS, setProgress);
      successListener.off(WORKFLOW_EVENT_SUCCESS, onSuccess);
      MPCFlowFactory.recycle();
    };
  }, []);

  return <MpcLoading flowType={flowType} progress={progress.toString()} />;
};
export default MPCLoadingScreen;
