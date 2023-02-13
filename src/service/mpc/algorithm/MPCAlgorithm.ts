import {mpcInstance} from '@/service/mpc/algorithm/MPCBridge';
import {Signer} from '@safeheron/mpc-wasm-sdk/lib/mpc-webview-client';

export const MPCHelp = {
  async getMnemonicFromSignKey(signKey: string) {
    return await mpcInstance.mpcHelper.extractMnemonicFromSignKey(signKey);
  },
  async createKeyPair() {
    return await mpcInstance.mpcHelper.createKeyPair();
  },
  async generateMnemonic(partialShards: string[], X: string) {
    return await mpcInstance.mpcHelper.aggregateKeyShard(partialShards, X);
  },
  async encrypt(localPri: string, remotePub: string, plainText: string) {
    return await mpcInstance.mpcHelper.encrypt(localPri, remotePub, plainText);
  },
  async decrypt(localPri: string, remotePub: string, cypher: string) {
    return await mpcInstance.mpcHelper.decrypt(localPri, remotePub, cypher);
  },
};

export function createKeyGenInstance() {
  return mpcInstance.KeyGen.getCoSigner();
}

export function createSigner(): Signer {
  return mpcInstance.Signer.getCoSigner();
}

export function createKeyRecoveryInstance() {
  return mpcInstance.KeyRecovery.getCoSigner();
}

export function createKeyRefreshInstance() {
  return mpcInstance.KeyRefresh.getCoSigner();
}
