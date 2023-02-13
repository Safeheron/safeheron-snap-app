import {RTCPeer} from '@/service/webrtc/RTCPeer';
import logger from '@/service/logger/logger';

class WebRTCManager {
  private connection?: RTCPeer;

  constructor() {}

  getConnection() {
    if (!this.connection) {
      this.connection = new RTCPeer();
    }
    return this.connection;
  }

  destroyConnection() {
    logger.webrtc.info('destroy connection');
    this.connection?.disconnect();
    this.connection = undefined;
  }
}

export default new WebRTCManager();
