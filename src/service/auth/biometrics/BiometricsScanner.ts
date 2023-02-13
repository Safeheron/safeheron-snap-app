import {NativeModules, Platform} from 'react-native';

export type Biometrics = 'Touch ID' | 'Face ID' | 'Biometrics';

export type Params = {
  title: string;
  description?: string;
  fallbackTitle?: string;
  fallbackEnabled?: boolean;
  subTitle: string;
  cancelButton: string;
  next: () => void;
  onCancel: () => void;
  onSuccess?: (type?: Biometrics) => void;
  onError: (message: string) => void;
};

const BiometricsScanner = Platform.OS === 'android' ? NativeModules.AndroidFingerprintScanner : NativeModules.Auth;

function authenticate(params: Params) {
  const {title, subTitle, description, cancelButton, fallbackTitle = '', fallbackEnabled = true} = params;

  if (Platform.OS === 'android') {
    return BiometricsScanner.authenticate(title, subTitle, description, cancelButton);
  }

  return new Promise((resolve, reject) => {
    BiometricsScanner.authenticate(description, fallbackTitle, fallbackEnabled, (error: any) => {
      if (error) {
        console.log(error);
        setTimeout(() => {
          reject({message: error.code});
        }, 250);
        return;
      }
      return resolve(true);
    });
  });
}

function isSensorAvailable() {
  if (Platform.OS === 'android') {
    return NativeModules.AndroidFingerprintScanner.isSensorAvailable();
  }

  return new Promise<Biometrics>((resolve, reject) => {
    BiometricsScanner.isSensorAvailable((error: any, biometryType: Biometrics) => {
      if (!error) {
      } else {
        reject({message: error.code});
      }
      resolve(biometryType);
    });
  });
}

function release() {
  if (Platform.OS !== 'android') {
    return;
  }
  BiometricsScanner.release();
}

export default {
  authenticate,
  isSensorAvailable,
  release,
};
