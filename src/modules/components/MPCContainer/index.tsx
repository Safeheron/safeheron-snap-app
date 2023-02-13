import React, {useState} from 'react';
import {Modal, Platform} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import WebView from 'react-native-webview';

import {onMessage, setupMPCInstance, webViewRef} from '@/service/mpc/algorithm/MPCBridge';
import logger from '@/service/logger/logger';
import Spinner from '@/modules/components/primitives/spinner/Spinner';
import {Flex} from '@/modules/components';

const MPCPreload: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const onWebViewLoadEnd = () => {
    setupMPCInstance();
    setLoading(false);
    logger.mpc.info('mpc bridge js loaded !!!');
  };
  const onWebViewDidTerminate = () => {
    logger.mpc.error('Webview terminated.');
    webViewRef.current?.reload();
  };

  return (
    <Flex>
      <Modal
        visible={loading}
        transparent
        style={{
          flex: 1,
        }}>
        <Flex align={'center'} justify={'center'} flex={1} style={{backgroundColor: 'rgba(0, 0,0, 0.4)'}}>
          <Spinner size={'large'} />
        </Flex>
      </Modal>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        allowingReadAccessToURL="./"
        allowFileAccess={true}
        source={Platform.select({
          ios: require('@/service/mpc-lib/MPC.html'),
          android: {uri: 'file:///android_asset/MPC.html'},
        })}
        style={{position: 'absolute', flex: 0, height: 0}}
        containerStyle={{flex: 0, height: 0}}
        onContentProcessDidTerminate={onWebViewDidTerminate}
        onLoadEnd={onWebViewLoadEnd}
        onMessage={event => {
          onMessage(event.nativeEvent.data);
        }}
      />
    </Flex>
  );
};

class MPCContainer {
  instance: RootSiblings | null = null;
  mount = () => {
    if (this.instance) {
      return;
    }
    this.instance = new RootSiblings(<MPCPreload />);
  };
}

export default new MPCContainer();
