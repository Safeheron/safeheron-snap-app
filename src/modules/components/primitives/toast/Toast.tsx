import React from 'react';
import RootSiblings from 'react-native-root-siblings';

import ToastContainer from './ToastContainer';
import {IToastItemProps} from './types';

const DURATION = 2500;

class Toast {
  instance: RootSiblings | null = null;
  toastQueue: IToastItemProps[] = [];

  show(text: string, type?: 'success' | 'error', position?: 'top' | 'center', duration?: number) {
    const toastDuration = duration ? duration : DURATION;
    this.toastQueue = [{text, type}];
    if (this.instance) {
      this.updateToastWrap();
    } else {
      this.instance = new RootSiblings(<ToastContainer toasts={this.toastQueue} />);
    }
    this.startCloseTimeOut(toastDuration);
  }

  _timer?: NodeJS.Timeout;
  startCloseTimeOut(duration: number) {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this.destroy();
    }, duration);
  }

  success(text: string, position?: 'top' | 'center', duration?: number) {
    this.show(text, 'success', position, duration);
  }

  error(text: string, position?: 'top' | 'center', duration?: number) {
    this.show(text, 'error', position, duration);
  }

  updateToastWrap() {
    this.instance?.update(<ToastContainer toasts={this.toastQueue} />);
  }

  destroy() {
    this.instance?.destroy();
    this.instance = null;
  }
}

export default new Toast();
