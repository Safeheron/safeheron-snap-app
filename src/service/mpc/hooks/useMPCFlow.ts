import {useEffect, useRef} from 'react';
import MPCFlowFactory from '@/service/mpc/MPCFlowFactory';
import {BaseWorkFlow, WorkFlowErrorMessage} from '@/service/mpc/flow/BaseWorkFlow';
import {toast} from '@/modules/components';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {WORKFLOW_EVENT_CANCEL, WORKFLOW_EVENT_FAIL} from '@/service/mpc/mpcEvents';
import {RTC_EVENT_DISCONNECTED} from '@/service/webrtc/RTCPeer';
import {BusinessType} from '@/service/mpc/mpcTypes';

type CancelFunc = () => void;
type FailedFunc = (message: WorkFlowErrorMessage) => void;

export default function useMPCFlow(
  navigation: NativeStackNavigationProp<any>,
  flowType: BusinessType,
): [BaseWorkFlow, CancelFunc, FailedFunc] {
  const mpcFlow = useRef<BaseWorkFlow>(MPCFlowFactory.build(flowType));

  const cancelManually = () => {
    MPCFlowFactory.cancel(flowType);
    navigation.popToTop();
  };

  const onFailed = (message: WorkFlowErrorMessage) => {
    toast.error(message?.message ?? 'Failed. Please try again', 'center', 5000);
    MPCFlowFactory.recycle();
    navigation.popToTop();
  };

  const onDisconnected = () => {
    toast.error('Connection disconnected.', 'center');
    MPCFlowFactory.recycle();
    navigation.popToTop();
  };

  const recycleAndNavigateBack = () => {
    MPCFlowFactory.recycle();
    navigation.popToTop();
  };

  useEffect(() => {
    const listener = mpcFlow.current.on(WORKFLOW_EVENT_CANCEL, recycleAndNavigateBack);
    const failedListener = mpcFlow.current.on(WORKFLOW_EVENT_FAIL, onFailed);

    MPCFlowFactory.rtcPeerConnection?.on(RTC_EVENT_DISCONNECTED, onDisconnected);

    return () => {
      listener.off(WORKFLOW_EVENT_CANCEL, recycleAndNavigateBack);
      failedListener.off(WORKFLOW_EVENT_FAIL, onFailed);

      MPCFlowFactory.rtcPeerConnection?.off(RTC_EVENT_DISCONNECTED, onDisconnected);
    };
  }, []);

  return [mpcFlow.current, cancelManually, onFailed];
}
