import {StyleProp, ViewStyle} from 'react-native';

export interface IAlertFooterProps {
  plain?: boolean;
  custom?: boolean;
  type?: 'alert' | 'confirm' | 'loading';
  cancelText?: string;
  okText?: string;
  onCancel?: () => void;
  onOk?: () => void;
  okDelay?: number; // unit: second
}

export interface IAlertContentProps {
  contentStyle?: StyleProp<ViewStyle>;
}

export interface IAlertCloseButtonProps {
  onClose?: () => void;
}

export interface IAlertContainerProps extends IAlertContentProps, IAlertFooterProps, IAlertCloseButtonProps {
  closeable?: boolean;
  visible: boolean;
  afterClose?: () => void;
  onBackButtonPress?(): boolean;
}

export type IAlertApiProps = Omit<IAlertContainerProps, 'visible'>;
