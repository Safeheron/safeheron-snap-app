import {useRef} from 'react';
import {RTCPeer} from '@/service/webrtc/RTCPeer';
import webRTCManager from '@/service/webrtc/WebRTCManager';

export default function useWebRTC(): [RTCPeer, () => void] {
  const webrtc = useRef<RTCPeer>(webRTCManager.getConnection());

  const releaseConnection = () => {
    webRTCManager.destroyConnection();
  };

  return [webrtc.current, releaseConnection];
}
