import React from 'react';
import RootSiblings from 'react-native-root-siblings';

import AlertContainer from './AlertContainer';
import {IAlertApiProps} from './types';

class AlertApi {
  private instance?: RootSiblings;
  private visible = true;

  private children?: React.ReactNode | JSX.Element;
  private memoizedProps?: IAlertApiProps;
  private _innerClose = () => {};
  private _afterClose = () => {};

  private closePromiseResolve?: (value?: unknown) => any;

  private getAlertComponent() {
    return (
      <AlertContainer
        visible={this.visible}
        onClose={this._innerClose}
        afterClose={this._afterClose}
        {...this.memoizedProps}>
        {this.children}
      </AlertContainer>
    );
  }

  private destroy() {
    this.instance?.destroy(() => {
      this.closePromiseResolve && this.closePromiseResolve();
    });
  }

  private updateInstance() {
    this.instance?.update(this.getAlertComponent());
  }

  open(props: IAlertApiProps, children?: React.ReactNode | JSX.Element) {
    const {afterClose, onClose, ...otherProps} = props;

    this.children = children;
    this.memoizedProps = otherProps;
    this._innerClose = () => {
      onClose && onClose();
      this.visible = false;
      this.updateInstance();
    };
    this._afterClose = () => {
      afterClose && afterClose();
      this.destroy();
    };

    this.instance = new RootSiblings(this.getAlertComponent());

    return this;
  }

  close() {
    return new Promise(resolve => {
      this.closePromiseResolve = resolve;
      this.visible = false;
      this.updateInstance();
    });
  }
}

export default AlertApi;
