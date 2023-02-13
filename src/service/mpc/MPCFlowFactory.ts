import {KeyRecoveryFlow} from '@/service/mpc/recovery/KeyRecoveryFlow';
import {MessageChannel} from '@/service/webrtc/MessageChannel';
import KeygenFlow from '@/service/mpc/keygen/KeygenFlow';
import SignFlow from '@/service/mpc/sign/SignFlow';
import {BaseWorkFlow} from '@/service/mpc/flow/BaseWorkFlow';
import webRTCManager from '@/service/webrtc/WebRTCManager';
import {RTCPeer} from '@/service/webrtc/RTCPeer';
import logger from '@/service/logger/logger';
import {BusinessType} from '@/service/mpc/mpcTypes';

class MPCFlowFactory {
  private _keygenFlow?: KeygenFlow;
  private _signFlow?: SignFlow;
  private _recoverFlow?: KeyRecoveryFlow;

  private rtcPeer?: RTCPeer;

  get rtcPeerConnection() {
    return this.rtcPeer;
  }

  _messageChannel: MessageChannel = {
    onMessage: (callback: (message: any) => Promise<void>) => {
      this.rtcPeer?.addListener('onMessage', callback);
    },
    sendMessage: (message: object) => {
      logger.mpcTask.debug('Send message: ', JSON.stringify(message));
      this.rtcPeer?.sendMessage(message);
    },
  };

  build(type: BusinessType): BaseWorkFlow {
    this.rtcPeer = webRTCManager.getConnection();

    switch (type) {
      case 'keygen':
        if (!this._keygenFlow) {
          this._keygenFlow = new KeygenFlow(this._messageChannel);
        }
        return this._keygenFlow;
      case 'sign':
        if (!this._signFlow) {
          this._signFlow = new SignFlow(this._messageChannel);
        }
        return this._signFlow;
      case 'recover':
        if (!this._recoverFlow) {
          this._recoverFlow = new KeyRecoveryFlow(this._messageChannel);
        }
        return this._recoverFlow;
      default:
        throw 'Supported type: ' + type;
    }
  }

  getFlowInstance(businessType: BusinessType): BaseWorkFlow | undefined {
    switch (businessType) {
      case 'keygen':
        return this._keygenFlow;
      case 'sign':
        return this._signFlow;
      case 'recover':
        return this._recoverFlow;
      default:
        throw `Unknown businessType: ${businessType}`;
    }
  }

  cancel(businessType: BusinessType) {
    this.getFlowInstance(businessType)?.cancelFlow();
    this.recycle();
  }

  recycle() {
    logger.mpcTask.debug('MPC Flow Factory recycle start.');

    this.cleanup();

    webRTCManager.destroyConnection();
    this.rtcPeer = undefined;

    logger.mpcTask.debug('MPC Flow Factory recycle finish.');
  }

  cleanup() {
    this._keygenFlow = undefined;
    this._signFlow = undefined;
    this._recoverFlow = undefined;
  }
}

export default new MPCFlowFactory();
