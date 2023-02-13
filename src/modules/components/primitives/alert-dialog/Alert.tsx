import React from 'react';
import {RootSiblingPortal} from 'react-native-root-siblings';

import AlertContainer from './AlertContainer';
import {IAlertContainerProps} from './types';

const Alert: React.FC<IAlertContainerProps> = props => {
  return (
    <RootSiblingPortal>
      <AlertContainer {...props} />
    </RootSiblingPortal>
  );
};

export default Alert;
