import CryptoJS from 'crypto-js';
import Aes from 'react-native-aes-crypto';
import {utils} from 'ethers';

const pbkdf2 = async function (pwd: string, salt: string, iterations = 65536) {
  return await Aes.pbkdf2(pwd, salt, iterations, 512 / 32);
};

const aes = {
  encrypt(data: string, pwd: string): string {
    const result = CryptoJS.AES.encrypt(data, pwd, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return result.toString();
  },
  decrypt(encryptedData: string, pwd: string) {
    return CryptoJS.AES.decrypt(encryptedData, pwd, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  },
};

export default {pbkdf2, aes, sha256: utils.sha256};
