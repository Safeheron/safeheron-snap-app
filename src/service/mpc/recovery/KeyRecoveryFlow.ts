import {MessageChannel} from '@/service/webrtc/MessageChannel';
import {MPCMessage, OperationType} from '@/service/mpc/algorithm/Model';
import app from '@/service/app/App';
import {handlers} from './handlers';
import {MnemonicSkipMessage, RelayMessage} from '@safeheron/mpcsnap-types';
import {KeyRecovery, KeyRefresh} from '@safeheron/mpc-wasm-sdk/lib/mpc-webview-client';
import {PartyId} from '@/service/mpc/util';
import {createKeyRecoveryInstance, createKeyRefreshInstance} from '@/service/mpc/algorithm/MPCAlgorithm';
import Store from '@/service/store/Store';
import {BaseWorkFlow} from '@/service/mpc/flow/BaseWorkFlow';

export const DISABLE_SKIP_EVENT = 'DisableSkipEvent';

export class KeyRecoveryFlow extends BaseWorkFlow {
  deviceId = app.deviceId;

  readonly keyRecovery: KeyRecovery;
  readonly keyRefresh: KeyRefresh;

  readonly localKeyshareExist: boolean;
  readonly originAddress: string;
  localOriginMnemonic?: string;

  sessionId: string = '';
  joinOrderIndex: number = -1;

  localCommuPrivKey?: string;

  ownPartyId?: PartyId;

  private inputMnemonic?: string;

  remotePartyId?: PartyId;
  remoteDeviceId?: string;
  lostPartyId?: PartyId;
  lostDeviceId?: string;

  aggregatedMnemonic?: string;

  walletName?: string;
  ownWalletId?: string;

  remotePubKeys: {partyId: PartyId; pubKey: string}[] = [];
  partySecretKeys: {partyId: PartyId; secretKey: string}[] = [];

  get hasMnemonic() {
    return Boolean(this.localKeyshareExist) || Boolean(this.inputMnemonic);
  }

  get needBackup() {
    return !this.localKeyshareExist && !this.inputMnemonic;
  }

  get mnemonic() {
    return this.localOriginMnemonic || this.inputMnemonic || this.aggregatedMnemonic;
  }

  constructor(messageChannel: MessageChannel) {
    super('recover', messageChannel);
    this.keyRecovery = createKeyRecoveryInstance();
    this.keyRefresh = createKeyRefreshInstance();

    const wallet = Store.get().wallet;

    this.localKeyshareExist = Store.get().walletExist;

    this.originAddress = wallet?.address ?? '';
    this.ownPartyId = wallet?.partyId;
    this.walletName = wallet?.name;
    this.ownWalletId = wallet?.id;
  }

  getPubkeyByPartyId(partyId: string | PartyId) {
    return this.remotePubKeys.find(rp => rp.partyId === partyId)?.pubKey;
  }

  setInputMnemonic(mnemonic: string) {
    this.inputMnemonic = mnemonic;
  }

  handleProgress(type: OperationType, currentProgress: number, before: boolean): void {
    switch (type) {
      case 'recoverPrepare':
        !before && this.updateProgress(1);
        break;
      case 'roleReady':
        this.updateProgress(before ? 2 : 8);
        break;
      case 'mnemonicReady':
        this.updateProgress(before ? 13 : 18);
        break;
      case 'recoverRound':
        break;
      case 'partySecretKeyReady':
        break;
      case 'recoverSuccess':
        this.updateProgress(before ? 36 : 51);
        break;
      case 'refreshReady':
        this.updateProgress(before ? 57 : 62);
        break;
      case 'refreshRound':
        this.updateProgress((currentProgress += 5));
        break;
      case 'refreshSuccess':
        this.updateProgress(before ? 99 : 100);
        break;
    }
  }

  async handleMessage(message: {type: OperationType; messages: RelayMessage[]}): Promise<MPCMessage[]> {
    const result: MPCMessage[] = [];

    const messageArray = message.messages;

    // @ts-ignore
    const handler = handlers[message.type];
    if (handler) {
      await handler(this, messageArray, result);
    } else {
      throw new Error('Unknown message type: ' + message.type);
    }

    return result;
  }

  async skip() {
    const message: MnemonicSkipMessage = {
      sendType: 'broadcast',
      from: this.deviceId,
      messageType: OperationType.mnemonicSkip,
      messageContent: undefined,
    };
    this.messageChannel.sendMessage(message);
    this.recoveryContinue();
  }

  recoveryContinue() {
    const message = {
      from: this.deviceId,
      messageType: OperationType.mnemonicReady,
      messageContent: {
        walletName: this.walletName,
        partyId: this.ownPartyId,
        hasMnemonic: this.hasMnemonic,
      },
    };
    this.messageChannel.sendMessage(message);
  }

  cleanup() {
    // xx
  }
}
