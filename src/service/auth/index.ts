import {authenticate, isSensorAvailable} from './biometrics/Biometrics';
import logger from '@/service/logger/logger';

/**
 * This is a generalized biometric judgment method.
 * The result it returns represents whether the App can use biometric recognition.
 * @return boolean
 */
export async function isSupportBiometrics() {
  return await isSensorAvailable();
}

export async function authWithBiometrics(): Promise<boolean> {
  return new Promise(resolve => {
    try {
      authenticate({
        title: 'Biometric Unlock',
        subTitle: '',
        description: 'Access Safeheron Snap App using Face ID or fingerprint scanner',
        cancelButton: 'Cancel',
        fallbackEnabled: false,
        next: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
        onError: message => {
          logger.base.error('authWithBiometrics failed, message: ', message);
          resolve(false);
        },
      });
    } catch (e) {
      logger.base.error('authWithBiometrics occur an error: ', e);
      resolve(false);
    }
  });
}
