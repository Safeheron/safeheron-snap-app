import {configLoggerType, logger} from 'react-native-logs';
import app from '@/service/app/App';

const config: configLoggerType = {
  levels: {
    debug: 0,
    trace: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  severity: app.debug ? 'debug' : 'error',
  dateFormat: date => {
    return `${app.deviceId} | ${date.toLocaleTimeString()} |`;
  },
  transportOptions: {
    colors: {
      debug: 'grey',
      info: 'greenBright',
      warn: 'yellowBright',
      error: 'redBright',
      trace: 'cyan',
    },
  },
};

const baseLog = logger.createLogger(config);

class Logger {
  readonly base;
  readonly mpc;
  readonly wallet;
  readonly webrtc;
  readonly screen;
  readonly mpcTask;

  constructor() {
    this.base = this.extend('base');
    this.mpc = this.extend('mpc');
    this.mpcTask = this.extend('mpcTask');
    this.wallet = this.extend('wallet');
    this.webrtc = this.extend('webrtc');
    this.screen = this.extend('screen');
  }

  private extend = (tag: string) => {
    const instance = baseLog.extend(tag);
    return {
      debug: (...msgs: any[]) => {
        instance.debug(...msgs);
      },
      info: (...msgs: any[]) => {
        instance.info(...msgs);
      },
      warn: (...msgs: any[]) => {
        instance.warn(...msgs);
      },
      error: (message: string, error?: any) => {
        instance.error(message, error);
      },
      trace: (...msgs: any[]) => {
        instance.trace(...msgs);
      },
    };
  };
}

const log = new Logger();

export default log;
