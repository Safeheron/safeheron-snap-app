import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Pressable, TouchableOpacity} from 'react-native';

import {AlertContext} from './Context';

import Button from '../button/Button';
import Divider from '../divider/Index';
import Flex from '../flex/Flex';
import Text from '../text/Text';
import {IAlertFooterProps} from './types';
import {useInterval} from 'ahooks';
import {colors} from '@/modules/components';

const AlertFooter: React.FC<IAlertFooterProps> = ({
  plain = false,
  type = 'alert',
  cancelText = 'Cancel',
  okText = 'Confirm',
  onCancel,
  onOk,
  okDelay,
}) => {
  const alertContext = useContext(AlertContext);

  const [countDown, setCountDown] = useState(okDelay ? okDelay : 0);
  const clearInterval = useInterval(() => {
    setCountDown(old => old - 1);
    if (countDown <= 0) {
      clearInterval();
    }
  }, 1000);

  const innerOkText = useMemo(() => {
    return countDown > 0 ? `${okText} (${countDown}s)` : okText;
  }, [countDown, okText]);

  const okButtonDisable = useMemo(() => countDown > 0, [countDown]);

  const handleOk = () => {
    if (okButtonDisable) {
      return;
    }

    if (onOk) {
      onOk();
    } else {
      alertContext.handleClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      alertContext.handleClose();
    }
  };

  useEffect(() => {
    return () => clearInterval();
  }, [okDelay]);

  if (plain) {
    return (
      <>
        <Divider />
        <Flex row align={'stretch'} style={{height: 56}}>
          {type === 'confirm' && (
            <>
              <Pressable style={{flex: 1, justifyContent: 'center'}} onPress={handleCancel}>
                <Text align={'center'} fontSize={16} color={'second'}>
                  {cancelText}
                </Text>
              </Pressable>
              <Divider col h={56} />
            </>
          )}
          <TouchableOpacity
            activeOpacity={0.2}
            style={[
              {flex: 1, justifyContent: 'center'},
              okButtonDisable ? {backgroundColor: colors.disable} : undefined,
            ]}
            onPress={handleOk}>
            <Text fontSize={16} align={'center'}>
              {innerOkText}
            </Text>
          </TouchableOpacity>
        </Flex>
      </>
    );
  }

  return (
    <Flex row padding={20} pt={0}>
      {type === 'confirm' && (
        <Button type={'solid'} mr={16} style={{flex: 1, borderRadius: 4}} onPress={handleCancel}>
          {cancelText}
        </Button>
      )}
      <Button type={'primary'} disabled={okButtonDisable} style={{flex: 1, borderRadius: 4}} onPress={handleOk}>
        {innerOkText}
      </Button>
    </Flex>
  );
};

export default React.memo(AlertFooter);
