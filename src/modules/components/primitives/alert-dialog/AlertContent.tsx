import React, {PropsWithChildren} from 'react';

import Box from '../box/Box';
import {IAlertContentProps} from './types';

const AlertContent: React.FC<PropsWithChildren<IAlertContentProps>> = ({contentStyle, children}) => {
  return (
    <Box padding={[24, 30]} style={[{minHeight: 95}, contentStyle]}>
      {children}
    </Box>
  );
};

export default AlertContent;
