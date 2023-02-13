import {MPCMessage, OperationType, SendType} from '@/service/mpc/algorithm/Model';
import app from '@/service/app/App';
import {RelayMessage} from '@safeheron/mpcsnap-types';

function getMessage(message: string): {
  type: OperationType;
  messages: RelayMessage[];
} {
  let result: RelayMessage[] = [];
  let type: OperationType;
  const messageArr: RelayMessage[] | RelayMessage = JSON.parse(message);
  if (Array.isArray(messageArr)) {
    result = messageArr;
    type = messageArr.length > 0 ? messageArr[0].messageType : OperationType.abort;
  } else {
    type = messageArr.messageType;
    result.push(messageArr);
  }
  return {
    messages: result,
    type: type,
  };
}

function wrapMessage(
  result: MPCMessage[],
  messageType: OperationType,
  message: any,
  optional?: {sendType?: SendType; to?: string},
) {
  result.push({
    from: app.deviceId,
    messageType,
    messageContent: message,
    ...optional,
  });
}

// TODO 这个方法有啥意义?
function filterMessage(messages: MPCMessage[], index?: number): MPCMessage | undefined {
  return messages.length > 0 ? messages[index ?? 0] : undefined;
}

export {wrapMessage, filterMessage, getMessage};
