import React from 'react';
import {Pressable} from 'react-native';

import Icon from '../icon/Icon';
import {IAlertCloseButtonProps} from './types';

const AlertCloseButton: React.FC<IAlertCloseButtonProps> = ({onClose}) => {
  return (
    <Pressable onPress={onClose} hitSlop={16}>
      <Icon name={'closeOutlineCircle'} />
    </Pressable>
  );
};

export default AlertCloseButton;
