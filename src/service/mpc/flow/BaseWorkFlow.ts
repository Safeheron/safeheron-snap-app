import {MPCMessage} from '@/service/mpc/algorithm/Model';
import {EventEmitter2} from 'eventemitter2';
import {MessageChannel} from '@/service/webrtc/MessageChannel';
import {getMessage} from '@/service/mpc/flow/MessageFilter';
import logger from '@/service/logger/logger';
import {AbortMessage, OperationType, RelayMessage} from '@safeheron/mpcsnap-types';
import app from '@/service/app/App';
import {
  WORKFLOW_EVENT_CANCEL,
  WORKFLOW_EVENT_FAIL,
  WORKFLOW_EVENT_PROGRESS,
  WORKFLOW_EVENT_SUCCESS,
  WorkFlowPrepareEvent,
} from '@/service/mpc/mpcEvents';
import {BusinessType} from '@/service/mpc/mpcTypes';

export type WorkFlowPrepareParams = {
  event: WorkFlowPrepareEvent;
  data?: any;
};

export type WorkFlowErrorMessage = {
  flowType: BusinessType;
  operationType: OperationType;
  snapIsCancel: boolean;
  message?: string;
};

export abstract class BaseWorkFlow extends EventEmitter2 {
  private readonly _flowType: BusinessType;

  protected messageChannel: MessageChannel;

  private _progress = 0;

  get currentProgress(): number {
    return this._progress;
  }

  get flowType() {
    return this._flowType;
  }

  protected constructor(flowType: BusinessType, messageChannel: MessageChannel) {
    super();
    this.messageChannel = messageChannel;
    this._flowType = flowType;
  }

  protected abstract handleMessage(message: {
    type: OperationType;
    messages: RelayMessage[];
  }): Promise<MPCMessage | MPCMessage[] | undefined>;

  protected abstract handleProgress(type: OperationType, currentProgress: number, isBefore: boolean): void;

  /**
   * set message handler
   */
  start() {
    this.messageChannel.onMessage(async (message: string) => {
      const parsedMessage = getMessage(message);
      logger.mpcTask.debug(`receive remote message: ${message}`);
      const data = await this._handleMessage(parsedMessage);
      if (data) {
        let result: MPCMessage[] = [];
        if (!Array.isArray(data)) {
          result.push(data);
        } else {
          result = data;
        }
        result.forEach(v => {
          this.messageChannel?.sendMessage(v);
        });
      }
    });
  }

  /**
   * Message Handler
   * @param message
   * @private
   */
  private async _handleMessage(message: {
    type: OperationType;
    messages: RelayMessage[];
  }): Promise<MPCMessage | MPCMessage[] | undefined> {
    // received other party abort message, need to notify to screen
    if (message.type === OperationType.abort) {
      this.emit(WORKFLOW_EVENT_CANCEL);
      return;
    }

    try {
      this._handleProgress(message.type, this._progress, true);

      const result = await this.handleMessage(message);

      this._handleProgress(message.type, this._progress, false);

      return result;
    } catch (e: any) {
      logger.mpc.error('[BaseWorkFlow] (_handleMessage) error: ', e);
      this.cancelFlowWithError(
        e.message ?? `MPC flow (${this.flowType}) occur an error when handle a [${message.type}] message`,
      );
    }
  }

  private _handleProgress(type: OperationType, currentProgress: number, isBefore: boolean) {
    this.handleProgress(type, currentProgress, isBefore);
    this.emit(WORKFLOW_EVENT_PROGRESS, this._progress);
  }

  updateProgress(progress: number) {
    this._progress = progress;
    if (this._progress === 100) {
      this.emitSuccessEvent();
    }
  }

  emitPrepare(params: WorkFlowPrepareParams) {
    this.emit('prepare', params);
  }

  /**
   * User cancel the flow through interactive behaviors such as click button
   * not emit event, just send a message to remote parties
   * @param reason
   */
  cancelFlow(reason: string = 'User cancel the mpc flow') {
    const abortMessage: AbortMessage = {
      from: app.deviceId,
      sendType: 'broadcast',
      messageType: OperationType.abort,
      messageContent: {
        businessType: this.flowType,
        reason,
        abortType: 'userCancel',
      },
    };
    this.messageChannel.sendMessage(abortMessage);
  }

  /**
   * internal function calling error occur a cancellation
   * @param errorMessage
   */
  cancelFlowWithError(errorMessage: string) {
    const abortMessage: AbortMessage = {
      from: app.deviceId,
      sendType: 'broadcast',
      messageType: OperationType.abort,
      messageContent: {
        businessType: this.flowType,
        reason: errorMessage,
        abortType: 'error',
      },
    };
    this.messageChannel.sendMessage(abortMessage);

    this.emit(WORKFLOW_EVENT_FAIL);
  }

  emitSuccessEvent() {
    this.emit(WORKFLOW_EVENT_SUCCESS);
  }

  onSuccess() {
    // TODO delete
    this.emitSuccessEvent();
  }
}
