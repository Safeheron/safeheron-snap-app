import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BackupTipScreenProps} from '@/modules/screens/backup/BackupTip';
import {SetPasswordScreenProps} from '@/modules/screens/password/SetPasswordScreen';
import {SignalingDataLocal} from '@/service/webrtc/RTCPeer';
import {SignPrepareParams} from '@safeheron/mpcsnap-types';
import {PartyId} from '@/service/mpc/util';
import {BusinessType, VerifyPasswordType} from '@/service/mpc/mpcTypes';

export type RootStackParamList = {
  ScanDynamicQRCodeScreen: {flowType: BusinessType};
  HomeScreen: undefined;
  SetPasswordScreen: SetPasswordScreenProps;
  QRCodeDisplayScreen: {sdpICE: SignalingDataLocal; flowType: BusinessType};
  MPCLoadingScreen: {flowType: BusinessType};
  WalletScreen: undefined;
  ResultScreen: {flowType: BusinessType};
  VerifyPasswordScreen: VerifyPasswordType;
  SignConfirmScreen: SignPrepareParams;
  BackupGuide: undefined;
  BackupTip: {type: BackupTipScreenProps};
  BackupMain: undefined;
  CheckKeyShard: undefined;
  MnemonicInputScreen: {partyId: PartyId};
  MnemonicPartyReview: {mnemonic: string[]};
  RecoveryNotNeedScreen: undefined;
  PrepareScreen: undefined;
  UnlockScreen: {nextScreen?: ScreenKeys};
  LaunchDispatch: undefined;
};

export type ScreenKeys = keyof RootStackParamList;

export type ScreenProps<T extends ScreenKeys> = NativeStackScreenProps<RootStackParamList, T>;
export type RouteProps<T extends ScreenKeys> = ScreenProps<T>['route'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
