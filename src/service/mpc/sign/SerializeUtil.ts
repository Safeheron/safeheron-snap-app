import {ethers} from 'ethers';
import {
  SignTypedDataVersion,
  TypedDataUtils,
  TypedDataV1,
  TypedMessage,
  typedSignatureHash,
} from '@metamask/eth-sig-util';
import {TransactionParams} from '@/service/mpc/sign/SignModels';
import {normalizeTx, stripHexPrefix} from '@/service/utils/transactionUtil';
import {isHexString} from 'ethers/lib/utils';
import {SignPrepareParams} from '@safeheron/mpcsnap-types';

export function serialize(method: SignPrepareParams['method'], params: Record<string, any>) {
  switch (method) {
    case 'eth_signTransaction':
      // @ts-ignore
      return serializeTransaction(params);
    case 'eth_sign':
      // @ts-ignore
      return serializeRawMessage(params);
    case 'personal_sign':
      // @ts-ignore
      return serializePersonalMessage(params);
    case 'eth_signTypedData_v1':
      return serializeTypedData(SignTypedDataVersion.V1, params);
    case 'eth_signTypedData_v3':
      return serializeTypedData(SignTypedDataVersion.V3, params);
    case 'eth_signTypedData_v4':
      return serializeTypedData(SignTypedDataVersion.V4, params);
    default:
      throw new Error('Unsupported request serialize method');
  }
}

export function serializeTransaction(unsignedTx: TransactionParams) {
  const serializedTransaction = ethers.utils.serializeTransaction(normalizeTx(unsignedTx));
  let unsignedTxHash = ethers.utils.keccak256(serializedTransaction);
  if (unsignedTxHash.startsWith('0x')) {
    unsignedTxHash = unsignedTxHash.substring(2);
  }
  return unsignedTxHash;
}

export function serializeRawMessage(rawMessage: string) {
  return stripHexPrefix(rawMessage);
}

export function serializePersonalMessage(personalMessage: string) {
  const rawPersonalMessage = isHexString(personalMessage) ? msgHexToText(personalMessage) : personalMessage;
  return stripHexPrefix(ethers.utils.hashMessage(rawPersonalMessage));
}

export function serializeTypedData(version: SignTypedDataVersion, typedMessage: Record<string, any>) {
  let hash = '';
  if (version === 'V3') {
    hash = TypedDataUtils.eip712Hash(typedMessage as TypedMessage<any>, SignTypedDataVersion.V3).toString('hex');
  } else if (version === 'V4') {
    hash = TypedDataUtils.eip712Hash(typedMessage as TypedMessage<any>, SignTypedDataVersion.V4).toString('hex');
  } else {
    hash = typedSignatureHash(typedMessage as TypedDataV1);
  }

  return stripHexPrefix(hash);
}

export function msgHexToText(hex: string) {
  try {
    const stripped = stripHexPrefix(hex);
    const buff = Buffer.from(stripped, 'hex');
    return buff.length === 32 ? hex : buff.toString('utf8');
  } catch (e) {
    return hex;
  }
}
