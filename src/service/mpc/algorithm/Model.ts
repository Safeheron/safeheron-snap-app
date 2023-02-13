import {OperationType, ComputeMessage} from '@safeheron/mpcsnap-types';

export type {ComputeMessage};
export {OperationType};

export interface Party {
  party_id: string;
  index: string;
}

export interface PubAndZkp {
  X: string;
  dlog_zkp: string;
}

export type PartyWithZkp = Party & PubAndZkp;

export interface RunRoundRespone {
  message?: ComputeMessage;
  signKey?: string;
  sig?: string;
}

export interface LocalParty extends RemoteParty {
  authPriv: string;
  pailPriv: string;
}

export interface RemoteParty {
  role: number;
  partyID: string;
  authPub: string;
  pailPub: string;
  index: string;
}

export type SendType = 'p2p' | 'broadcast' | 'all';

export type MPCMessage<T = any> = {
  from: string;
  messageType: OperationType;
  messageContent: T;
  sendType?: SendType;
};

export interface ComputeParamsMessage {
  from: string;
  body: string;
}

export interface SignMessage {
  hash: string;
  derivePath: string;
}
