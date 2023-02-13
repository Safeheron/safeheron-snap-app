import {BaseWorkFlow} from '@/service/mpc/flow/BaseWorkFlow';
import {ComputeMessage, OperationType} from '@/service/mpc/algorithm/Model';
import logger from '@/service/logger/logger';
import {MessageChannel} from '@/service/webrtc/MessageChannel';
import {
  BaseRelayMessage,
  SendType,
  SignPrepareMessage,
  SignPrepareParams,
  SignReadyMessage,
  SignRoundMessage,
} from '@safeheron/mpcsnap-types';
import Store from '@/service/store/Store';
import {Signer} from '@safeheron/mpc-wasm-sdk/lib/mpc-webview-client';
import {createSigner} from '@/service/mpc/algorithm/MPCAlgorithm';
import {serialize} from '@/service/mpc/sign/SerializeUtil';
import {wrapMessage} from '@/service/mpc/util';

export default class SignFlow extends BaseWorkFlow {
  private signer: Signer;

  readonly signKey: string;
  private readonly partnerRole = 'A';
  private hash: string | undefined;

  private signMethod?: SignPrepareParams['method'];
  private signParams?: any;
  private signCommonParams?: SignPrepareParams['commonParams'];

  constructor(messageChannel: MessageChannel) {
    super('sign', messageChannel);

    const signKey = Store.get().originalSignKey;

    if (!signKey) {
      throw new Error('SignKey not exist.');
    }

    this.signKey = signKey;
    this.signer = createSigner();
  }

  async handleMessage(message: {
    type: OperationType;
    messages: BaseRelayMessage<OperationType, SendType, any>[];
  }): Promise<any | undefined> {
    const {type, messages} = message;
    switch (type) {
      case OperationType.signPrepare:
        const signConfirmData: SignPrepareMessage['messageContent'] = messages[0].messageContent;

        const {method, params, commonParams} = signConfirmData;
        this.signMethod = method;
        this.signParams = params;
        this.signCommonParams = commonParams;

        this.emitPrepare({event: 'Sign', data: signConfirmData});
        break;

      case OperationType.signReady:
        // @ts-ignore
        const signReadyMessage: SignReadyMessage = messages[0];
        return await this.createContext(signReadyMessage.messageContent.pub);

      case OperationType.signRound:
        return await this.runRound(messages as SignRoundMessage[]);

      default:
        logger.mpcTask.error(`Unsupported operation type (${type})`);
        throw new Error(`Unsupported operation type (${type})`);
    }
  }

  async confirmSign() {
    try {
      const message = await this.getSignReadyMessage(this.signMethod!, this.signParams);
      this.messageChannel.sendMessage(message);
    } catch (e: any) {
      logger.mpcTask.error('Sign confirm with error: ', e);
      this.cancelFlowWithError(e?.message ?? 'Confirm sign with error.');
      throw e;
    }
  }

  handleProgress(type: OperationType, currentProgress: number, before: boolean): void {
    switch (type) {
      case OperationType.signReady:
        this.updateProgress(before ? 6 : 12);
        break;
      case OperationType.signRound:
        this.updateProgress((currentProgress += 11));
        break;
      case OperationType.abort:
        break;
    }
  }

  async getSignReadyMessage(
    method: SignPrepareParams['method'],
    params: any,
  ): Promise<BaseRelayMessage<OperationType, SendType, any>> {
    logger.wallet.debug('[Sign] ready start, serialize params now...');

    this.hash = serialize(method, params);

    logger.wallet.debug('[Sign] ready end, serialize params finished.', this.hash);
    const partyId = Store.get().wallet?.partyId;

    // Create communication keypair
    await this.signer.setupLocalCpkp();

    return wrapMessage(OperationType.signReady, {
      partyId: partyId,
      pub: this.signer.localCommunicationPub,
    }) as SignReadyMessage;
  }

  async createContext(remotePub: string) {
    if (!this.hash) {
      throw 'hash is null';
    }
    logger.wallet.debug('[Sign] createCoSignContext start...', this.hash);
    const partyId = Store.get().wallet?.partyId;
    if (!partyId) {
      throw 'Missing partyId';
    }
    const res = await this.signer.createContext(this.hash, this.signKey, [partyId, this.partnerRole], {
      partyId: this.partnerRole,
      pub: remotePub,
    });
    logger.wallet.debug('[Sign] createCoSignContext end');
    return wrapMessage(OperationType.signRound, res);
  }

  async runRound(messageArray: SignRoundMessage[]) {
    const partyId = Store.get().wallet?.partyId;
    const remoteMessageList = messageArray.map(v =>
      v.messageContent.find(msg => msg.destination === partyId),
    ) as ComputeMessage[];

    logger.wallet.debug('[Sign] computeCoSignRound start, ', remoteMessageList);
    const res = await this.signer.runRound(remoteMessageList);
    logger.wallet.debug('[Sign] computeCoSignRound end,  ', res);

    if (!this.signer.isComplete) {
      logger.wallet.debug('[Sign] prepare to send runRound message,');
      return wrapMessage(OperationType.signRound, res);
    }

    this.emitSuccessEvent();
    return undefined;
  }
}
