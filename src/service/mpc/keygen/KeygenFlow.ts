import {BaseWorkFlow} from '@/service/mpc/flow/BaseWorkFlow';
import {MessageChannel} from '@/service/webrtc/MessageChannel';
import {
  KeygenRoundMessage,
  OperationType,
  PartyPrepareMessage,
  PartyReadyMessage,
  RelayMessage,
} from '@safeheron/mpcsnap-types';
import {genWalletId, getPartyIndex, PartyId, wrapMessage} from '@/service/mpc/util';
import Store from '@/service/store/Store';
import logger from '@/service/logger/logger';
import {createKeyGenInstance} from '@/service/mpc/algorithm/MPCAlgorithm';
import {PartyWithPub} from '@safeheron/mpc-wasm-sdk';
import {ComputeMessage} from '@/service/mpc/algorithm/Model';
import {computeAddress} from 'ethers/lib/utils';

export default class KeygenFlow extends BaseWorkFlow {
  private keygen;

  private walletName?: string;
  private sessionId = '';
  private ownPartyId?: PartyId;

  private signKey?: string;
  private pubKey?: string;

  constructor(messageChannel: MessageChannel) {
    super('keygen', messageChannel);
    this.keygen = createKeyGenInstance();
  }

  handleProgress(type: OperationType, currentProgress: number, before: boolean): void {
    switch (type) {
      case OperationType.partyPrepare:
        this.updateProgress(before ? 4 : 6);
        break;
      case OperationType.partyReady:
        this.updateProgress(before ? 15 : 27);
        break;
      case OperationType.keyGenRound:
        this.updateProgress((currentProgress += 6));
        break;
      case OperationType.createSuccess:
        this.updateProgress(100);
        break;
    }
  }

  async handleMessage(message: {type: OperationType; messages: RelayMessage[]}): Promise<any | undefined> {
    const {type, messages} = message;
    switch (type) {
      case OperationType.partyPrepare:
        this.emitPrepare({event: 'CreateWallet'});

        const content: PartyPrepareMessage['messageContent'] = (messages[0] as PartyPrepareMessage).messageContent;

        this.walletName = content.walletName;
        this.ownPartyId = content.partyId as PartyId;
        this.sessionId = content.sessionId;

        return await this.createParty();

      case OperationType.partyReady:
        const partyArray = (messages as PartyReadyMessage[]).map(m => m.messageContent);
        return await this.createContext(partyArray);

      case OperationType.keyGenRound:
        return await this.runRound(messages as KeygenRoundMessage[]);

      case OperationType.createSuccess:
        const walletArtifacts = this.getArtifacts();

        try {
          await Store.get().createWallet({
            id: genWalletId(this.sessionId, walletArtifacts.address),
            name: this.walletName!,
            ...walletArtifacts,
            partyId: this.ownPartyId!,
            isBackup: false,
          });

          this.emitSuccessEvent();
        } catch (e) {
          logger.mpcTask.error('Cannot save the wallet: ', e);
          throw new Error('Cannot save wallet.');
        }

        break;

      default:
        logger.mpcTask.error(`Unsupported operation type (${type})`);
        throw new Error(`Unsupported operation type (${type})`);
    }
  }

  private async createParty(): Promise<PartyReadyMessage> {
    const party = this.keygen.setLocalParty(this.ownPartyId!, getPartyIndex(this.ownPartyId!));

    await this.keygen.setupLocalCpkp();

    const partyWithPub = {
      ...party,
      pub: this.keygen.localCommunicationPub,
    };
    return wrapMessage(OperationType.partyReady, partyWithPub) as PartyReadyMessage;
  }

  private async createContext(remoteParties: PartyWithPub[]) {
    const message = await this.keygen.createContext(remoteParties);
    return wrapMessage(OperationType.keyGenRound, message);
  }

  async runRound(messageArray: KeygenRoundMessage[]): Promise<any | undefined> {
    const remoteMessageList = messageArray.map(v =>
      v.messageContent.find(msg => msg.destination === this.ownPartyId),
    ) as ComputeMessage[];
    const res = await this.keygen.runRound(remoteMessageList);
    if (!this.keygen.isComplete) {
      return wrapMessage(OperationType.keyGenRound, res);
    }
    this.signKey = this.keygen.getSignKey();
    this.pubKey = this.keygen.getPubKey();
    return wrapMessage(OperationType.createSuccess, this.pubKey);
  }

  private getArtifacts() {
    return {
      address: computeAddress(`0x${this.pubKey!}`),
      signKey: this.signKey!,
    };
  }
}
