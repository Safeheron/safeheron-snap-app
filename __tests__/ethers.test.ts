import {arrayify, computeAddress, recoverPublicKey} from 'ethers/lib/utils';
import {ethers} from 'ethers';

describe('ethers recovery with r,s,v,hash', () => {
  test('recovery', () => {
    const hash =
      '0xb8f1200b4774b3313c2f0349ab2b16321c35e9275048ff7eab950352cafb5784';
    const sig = {
      r: '0x3af5b5bce872bd916439d0e7a0c31faa41175fd38cbfb9c4ff4514da5200c571',
      s: '0x2859d221e20d7262e59254343e9c035019029b73e0363d3641cd86c6f69f998c',
      recoveryParam: 0,
    };

    const publickKey = recoverPublicKey(arrayify(hash), sig);

    const address = computeAddress(publickKey);

    console.log('address...', address);
  });

  test('decode tx', () => {
    const signedTx =
      '0x02f87205808459682f00850786f9a9ea82520894324a1c5f646f5aa117afca9e8cc9fe74547f822e87038d7ea4c6800080c080a0fe1aba85de71a3025df8e44a8aea12b0c011cf396a10e6c0353c7701de20cfe2a07c11ea88e3a2116b2d187e6f1118a4ff68376032184ba651506ee4d4726a1950';
    const parsedTx = ethers.utils.parseTransaction(signedTx);

    console.log('parsedTx: ', parsedTx);
  });
});
