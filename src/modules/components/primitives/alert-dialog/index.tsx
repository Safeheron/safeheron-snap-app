import React from 'react';

import {IAlertApiProps, IAlertContainerProps, IAlertFooterProps} from './types';

import Alert from './Alert';
import AlertApi from './AlertApi';

type IAlertTypeFunctionProps = Omit<IAlertApiProps, 'type'>;
type IAlertTypeFunction = (props: IAlertTypeFunctionProps, children?: React.ReactNode | JSX.Element) => AlertApi;

function open(props: IAlertApiProps, children?: React.ReactNode | JSX.Element) {
  const alertApi = new AlertApi();
  return alertApi.open(props, children);
}

type IAlertType = React.FC<IAlertContainerProps> & {
  alert: IAlertTypeFunction;
  confirm: IAlertTypeFunction;
  loading: () => AlertApi;
};

const AlertTemp = Alert as IAlertType;

(['alert', 'confirm', 'loading'] as IAlertFooterProps['type'][]).forEach(type => {
  // @ts-ignore
  AlertTemp[type] = (props: IAlertTypeFunctionProps, children?: React.ReactNode) => {
    return open({...props, type}, children);
  };
});

export default AlertTemp;
