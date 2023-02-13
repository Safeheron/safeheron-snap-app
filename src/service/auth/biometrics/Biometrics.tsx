import BiometricsScanner, {Params} from './BiometricsScanner';
import logger from '@/service/logger/logger';

const biometricsErrorMap: {[key: string]: string} = {
  AuthenticationFailed: 'Authentication failed. Try it again.',
  AuthenticationTimeout: 'Authentication timeout. Try it again.',
  AuthenticationProcessFailed: 'Authentication process failed. Try it again.',
  UserCancel: "You've cancelled authentication.",
  UserFallback: "You've cancelled biometric and fallback to password.",
  SystemCancel: 'System cancelled authentication.',
  PasscodeNotSet: 'Lock screen passcode not set. Set it up & retry.',
  FingerprintScannerNotAvailable:
    'Authentication could not start because Fingerprint Scanner is not available on the device.',
  FingerprintScannerNotEnrolled: 'Fingerprint not enrolled. Set it up & retry.',
  FingerprintScannerUnknownError: 'Fingerprint not enrolled. Set it up & retry.',
  FingerprintScannerNotSupported: 'Fingerprint scanner not supported.',
  DeviceLocked: 'Authentication failed. Device is currently locked.',
  DeviceLockedPermanent: 'Authentication was not successful, device must be unlocked via password.',
  DeviceOutOfMemory: 'Insufficient mobile memory.',
  HardwareError: 'Hardware error.',
  AuthenticationNotMatch: 'Biometric verification is not available!',
};

const cancelCode: string[] = ['UserCancel', 'SystemCancel'];

export const authenticate = (params: Params) => {
  BiometricsScanner.authenticate(params)
    .then(() => {
      params.next();
    })
    .catch((err: any) => {
      logger.base.error('Biometric verify failed. ', err);
      const key = err.message;
      const code = err.code;

      if (cancelCode.includes(key) || cancelCode.includes(code)) {
        if (params?.onCancel) {
          params.onCancel();
        }
      } else {
        const message = getErrorMessage(key) || getErrorMessage(code);
        params.onError(message);
      }
    });
};

export async function isSensorAvailable() {
  try {
    await BiometricsScanner.isSensorAvailable();
    return true;
  } catch (e) {
    return false;
  }
}

const getErrorMessage = (key: string): string => {
  const errorMessage = biometricsErrorMap[key];
  return errorMessage ?? 'Biometric verification is not available!';
};
