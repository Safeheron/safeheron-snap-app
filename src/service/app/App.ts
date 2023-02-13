import deviceInfoModule from 'react-native-device-info';

class App {
  protected _deviceId = '';
  protected _deviceName = '';

  get deviceId() {
    return this._deviceId;
  }

  get debug() {
    return __DEV__;
  }

  get deviceName() {
    return this._deviceName;
  }

  get version() {
    return deviceInfoModule.getVersion();
  }

  constructor() {
    this.setup();
  }

  setup() {
    const deviceId = deviceInfoModule.getUniqueId();
    this._deviceName = deviceInfoModule.getDeviceNameSync();
    this._deviceId = deviceId;
  }
}

export default new App();
