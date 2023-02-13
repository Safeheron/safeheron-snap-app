import {RTCPeerConnection, RTCSessionDescription} from 'react-native-webrtc';
import RTCDataChannel from 'react-native-webrtc/lib/typescript/RTCDataChannel';
import {Buffer} from 'buffer';
import app from '@/service/app/App';
import {EventEmitter2} from 'eventemitter2';
import logger from '@/service/logger/logger';
import {BusinessType} from '@/service/mpc/mpcTypes';

export interface SignalingDataLocal {
  sdp: any;
  candidates: any[];
  name: string;
  connectPairId: string;
}

export interface SignalingDataFromWeb {
  sdp: string;
  candidates: any[];
  businessType: BusinessType;
  connectPairId: string;
}

// ----------------------------------
//  RTC Connection EVENTS
export const RTC_EVENT_DISCONNECTED = 'onDisconnected';
export const RTC_EVENT_ONMESSAGE = 'onMessage';
export const RTC_EVENT_ICE_READY_EVENT = 'onIceGatheringComplete';

class RTCPeer extends EventEmitter2 {
  private pc?: RTCPeerConnection;
  private dc?: RTCDataChannel;
  private sdpICE: SignalingDataLocal = {
    sdp: '',
    candidates: [],
    name: app.deviceId,
    connectPairId: '',
  };

  private readonly bufferThreshold = 64 * 1024;

  private readonly pcEvents = new Map<string, Function>(
    Object.entries({
      icecandidate: this.onIceCandidate,
      datachannel: this.onDataChannel,
      icegatheringstatechange: this.onIcegatheringstatechange,
      connectionstatechange: this.onConnectionStateChange,
      icecandidateerror: this.onIceCandidateError,
      iceconnectionstatechange: this.onIceConnectionStateChange,
      signalingstatechange: this.onSignalingStateChange,
    }),
  );

  private readonly dcEvents = new Map<string, Function>(
    Object.entries({
      open: this.onChannelOpen,
      message: this.onChannelMessage,
      close: this.onChannelClosed,
    }),
  );

  constructor() {
    super();
    logger.webrtc.info('create RTC Peer instance.');
  }

  createPeerConnection() {
    logger.webrtc.debug('createPeerConnection start...');

    if (['connecting', 'connected'].includes(this.pc?.connectionState ?? '')) {
      return;
    }
    this.pc = new RTCPeerConnection({
      iceCandidatePoolSize: 10,
    });
    this.pcEvents.forEach((listener, type) => {
      this.pc?.addEventListener(type, listener.bind(this));
    });
    logger.webrtc.debug('createPeerConnection end....');
  }

  onDataChannel(event: any) {
    if (event && event.channel) {
      this.dc = event.channel;
      this.dc!.binaryType = 'arrayBuffer';
      this.dc!.bufferedAmountLowThreshold = this.bufferThreshold;
      this.dcEvents.forEach((listener, type) => {
        this.dc?.addEventListener(type, listener.bind(this));
      });
    }
    logger.webrtc.debug('dataChannel created.');
  }

  private onChannelOpen() {
    logger.webrtc.debug('data channel opened.');
  }

  private receiveBuffer: Buffer = Buffer.alloc(0);
  private offset = 0;
  private totalLength = 0;

  onChannelMessage(event: any) {
    try {
      const data = event.data;
      if (data instanceof ArrayBuffer) {
        Buffer.from(data).copy(this.receiveBuffer, this.offset);
        this.offset += data.byteLength;
        if (this.offset === this.totalLength) {
          const message = this.receiveBuffer.toString();
          this.emit(RTC_EVENT_ONMESSAGE, message);
          this.offset = 0;
          this.receiveBuffer = Buffer.alloc(0);
        }
      } else if (typeof data === 'string') {
        const metaInfo = JSON.parse(data);
        this.totalLength = metaInfo.size;
        this.receiveBuffer = Buffer.alloc(this.totalLength);
      }
    } catch (e) {
      logger.webrtc.error('receive channel message error: ', e);
    }
  }

  onIcegatheringstatechange(_: any) {
    if (this.pc?.iceGatheringState === 'complete') {
      logger.webrtc.debug('IceGatheringComplete: ', this.sdpICE);
      this.emit(RTC_EVENT_ICE_READY_EVENT, this.sdpICE);
    }
  }

  sendMessage(data: any) {
    try {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      const buffer = Buffer.from(data);
      const bufferLength = buffer.length;
      this.dc?.send(JSON.stringify({size: bufferLength}));
      let start = 0;
      while (start < bufferLength) {
        const end = Math.min(start + this.bufferThreshold, bufferLength);
        const chunk = buffer.slice(start, end);
        this.dc?.send(chunk);
        start = end;
      }
    } catch (e) {
      logger.webrtc.error('send message error: ', e);
      throw e;
    }
  }

  disconnect() {
    logger.webrtc.debug('close webrtc connection...');
    this.sdpICE.sdp = '';
    this.sdpICE.candidates = [];
    this.dc?.close();
    this.pc?.close();
    this.removeAllListeners();
  }

  onChannelClosed() {
    logger.webrtc.debug('data channel closed.');
  }

  getState() {
    let iceConnectionState = this.pc?.iceConnectionState;
    let iceGatheringState = this.pc?.iceGatheringState;
    logger.webrtc.debug('iceConnectionState: ', iceConnectionState, '\niceGatheringState:', iceGatheringState);
  }

  async receiverSDPAndICE(info: SignalingDataFromWeb) {
    logger.webrtc.debug('received remote signaling data: ', info);
    this.sdpICE.connectPairId = info.connectPairId;
    await this.receiveOffer(info.sdp);
    await this.receiveIceCandidate(info.candidates);
  }

  private async receiveOffer(offer: any) {
    await this.pc?.setRemoteDescription(new RTCSessionDescription(offer));
    await this.createAnswer();
  }

  private async createAnswer() {
    let answer = await this.pc?.createAnswer();
    console.log('start to set local description: ', answer);
    await this.pc?.setLocalDescription(new RTCSessionDescription(answer));
    this.sdpICE.sdp = answer;
    logger.webrtc.debug('create answer result: ', answer);
  }

  private async receiveIceCandidate(candidate: any[]) {
    await Promise.all(candidate.map(v => this.pc?.addIceCandidate(v)));
  }

  onIceCandidate(event: any) {
    if (!event.candidate) {
      return;
    }
    this.sdpICE.candidates.push(event.candidate);
    logger.webrtc.debug('candidate emit: ', event.candidate);
  }

  onConnectionStateChange() {
    const connectionState = this.pc?.connectionState;
    if (connectionState === 'failed' || connectionState === 'closed') {
      this.emit(RTC_EVENT_DISCONNECTED);
    }
    logger.webrtc.debug('peer connection state change: ', connectionState);
  }

  onSignalingStateChange() {
    logger.webrtc.debug('signaling state change: ', this.pc?.signalingState);
  }

  onIceCandidateError() {
    logger.webrtc.error('candidate error: ');
  }

  onIceConnectionStateChange() {
    logger.webrtc.debug('ice connection state  : ', this.pc?.iceConnectionState);
  }
}

export {RTCPeer};
