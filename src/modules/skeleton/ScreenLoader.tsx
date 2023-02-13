import {Screen} from './SkeletonScreen';
import HomeScreen from '@/modules/screens/home/HomeScreen';
import WalletScreen from '@/modules/screens/wallet/WalletScreen';
import SetPasswordScreen from '@/modules/screens/password/SetPasswordScreen';
import ResultScreen from '@/modules/screens/result/ResultScreen';
import VerifyPasswordScreen from '@/modules/screens/password/VerifyPasswordScreen';
import SignConfirmScreen from '@/modules/screens/sign/SignConfirmScreen';
import BackupGuide from '@/modules/screens/backup/BackupGuide';
import BackupMain from '@/modules/screens/backup/BackupMain';
import BackupTip from '@/modules/screens/backup/BackupTip';
import CheckKeyShard from '@/modules/screens/backup/CheckKeyShard';
import MnemonicInputScreen from '@/modules/screens/recovery/MnemonicInputScreen';
import MnemonicPartyReview from '@/modules/screens/recovery/MnemonicPartyReview';
import RecoveryNotNeedScreen from '@/modules/screens/recovery/RecoveryNotNeedScreen';
import PrepareScreen from '@/modules/screens/recovery/PrepareScreen';
import MPCLoadingScreen from '@/modules/screens/mpc/MPCLoadingScreen';
import QRCodeDisplayScreen from '@/modules/screens/connection/QRCodeDisplayScreen';
import ScanDynamicQRCodeScreen from '@/modules/screens/connection/ScanDynamicQRCodeScreen';
import UnlockScreen from '@/modules/screens/auth/UnlockScreen';
import LaunchDispatchScreen from '@/modules/screens/home/LaunchDispatchScreen';

const screens: Screen[] = [
  {name: 'WalletScreen', component: WalletScreen},
  {name: 'HomeScreen', component: HomeScreen},
  {name: 'SetPasswordScreen', component: SetPasswordScreen},
  {name: 'ScanDynamicQRCodeScreen', component: ScanDynamicQRCodeScreen},
  {name: 'ResultScreen', component: ResultScreen},
  {name: 'VerifyPasswordScreen', component: VerifyPasswordScreen},
  {name: 'SignConfirmScreen', component: SignConfirmScreen},
  {name: 'BackupGuide', component: BackupGuide},
  {name: 'BackupTip', component: BackupTip},
  {name: 'BackupMain', component: BackupMain},
  {name: 'CheckKeyShard', component: CheckKeyShard},
  {name: 'MnemonicInputScreen', component: MnemonicInputScreen},
  {name: 'MnemonicPartyReview', component: MnemonicPartyReview},
  {name: 'RecoveryNotNeedScreen', component: RecoveryNotNeedScreen},
  {name: 'PrepareScreen', component: PrepareScreen},
  {name: 'MPCLoadingScreen', component: MPCLoadingScreen},
  {name: 'QRCodeDisplayScreen', component: QRCodeDisplayScreen},
  {name: 'UnlockScreen', component: UnlockScreen},
  {name: 'LaunchDispatch', component: LaunchDispatchScreen},
];

export default function (): {screens: Screen[]} {
  return {
    screens: screens,
  };
}
