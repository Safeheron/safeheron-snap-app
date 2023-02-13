import Crypto from '@/service/utils/Crypto';
import {Buffer} from 'buffer';
import {BaseRelayMessage, OperationType, SendType} from '@safeheron/mpcsnap-types';
import app from '@/service/app/App';

export function genWalletId(sessionId: string, address: string) {
  return Crypto.sha256(Buffer.from(sessionId + '-' + address.toLowerCase()));
}

export function wrapMessage<T extends any>(
  messageType: OperationType,
  message: any,
): BaseRelayMessage<OperationType, SendType, T> {
  return {
    from: app.deviceId,
    messageType,
    messageContent: message,
  };
}

export type PartyId = 'A' | 'B' | 'C';
type PartyIndex = '1' | '2' | '3';

export const PartyIndexMap: {[key in PartyId]: PartyIndex} = {
  A: '1',
  B: '2',
  C: '3',
};

export function getPartyIndex(partyId: PartyId) {
  return PartyIndexMap[partyId];
}
