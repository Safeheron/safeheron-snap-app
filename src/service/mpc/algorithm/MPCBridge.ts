import WebView from 'react-native-webview';
import React from 'react';

import MPC from '@safeheron/mpc-wasm-sdk/lib/mpc-webview-client';

export const webViewRef = React.createRef<WebView>();

let mpcInstance: MPC;

export function setupMPCInstance() {
  mpcInstance = MPC.init(webViewRef.current);
}

export {mpcInstance};

export async function onMessage(data: string) {
  mpcInstance.onMessageCallback(data);
}

export async function waitForMPCInstance(): Promise<MPC> {
  return new Promise(resolve => {
    if (mpcInstance) {
      resolve(mpcInstance);
    } else {
      const interval = setInterval(() => {
        if (mpcInstance) {
          clearInterval(interval);
          resolve(mpcInstance);
        }
      }, 100);
    }
  });
}
