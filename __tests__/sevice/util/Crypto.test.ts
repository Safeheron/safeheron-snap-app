import Crypto from '@/service/utils/Crypto';

describe('aes and kdf', () => {
  test('kdf', () => {
    const sourcePassword = '123456';
    const targetPwdHash =
      '33cac9b9b47192bfc3bdb08e59acc8a97a581afa73da344efb187c6f50499254cf23673994901d081d89e43094ab9de47cc77915976891c37f0330284f76a0ba';
    const salt = 'Safeheron';

    for (let p of new Array(5).fill(sourcePassword)) {
      const pwdHash = Crypto.pbkdf2(p, salt);
      expect(pwdHash).toEqual(targetPwdHash);
    }
  });

  test('aes encrypt and decrypt', () => {
    const sourceData = 'hello world';
    const pwd =
      '33cac9b9b47192bfc3bdb08e59acc8a97a581afa73da344efb187c6f50499254cf23673994901d081d89e43094ab9de47cc77915976891c37f0330284f76a0ba';

    const encryptedData = Crypto.aes.encrypt(sourceData, pwd);

    const decryptedData = Crypto.aes.decrypt(encryptedData, pwd + '1111');

    expect(decryptedData).toEqual(sourceData);
  });
});
