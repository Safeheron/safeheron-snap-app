import {Eip1559Params, LegacyParams, TransactionBaseParams, TransactionParams} from '@/service/mpc/sign/SignModels';
import {ethers} from 'ethers';
import {formatEther} from 'ethers/lib/utils';

export interface HumanbleTransaction extends TransactionBaseParams {
  estimatedFee: string;
}

/**
 * For Screen
 * @param transaction
 */
export function convertToHumanableTx(transaction: TransactionParams): HumanbleTransaction {
  const {to, nonce, value, chainId, data, gasLimit, type} = transaction;
  const baseTx: TransactionBaseParams = {
    to,
    data,
    nonce: isHexPrefixed(nonce) ? hexStringToString(nonce) : nonce,
    value: formatEther(ethers.BigNumber.from(value)),
    chainId: isHexPrefixed(chainId) ? hexStringToString(chainId) : chainId,
    gasLimit: isHexPrefixed(gasLimit) ? hexStringToString(gasLimit) : gasLimit,
  };

  let estimatedFee = '';
  if (type === 2) {
    const {maxFeePerGas} = transaction;
    estimatedFee = formatEther(ethers.BigNumber.from(maxFeePerGas).mul(ethers.BigNumber.from(gasLimit)).toString());
  } else {
    const {gasPrice} = transaction;
    estimatedFee = formatEther(ethers.BigNumber.from(gasPrice).mul(ethers.BigNumber.from(gasLimit)).toString());
  }

  return {
    ...baseTx,
    estimatedFee,
  };
}

export type NormalizedTransaction = Omit<TransactionParams, 'nonce' | 'chainId'> & {
  nonce: number;
  chainId: number;
};

/**
 * For Serialize
 * @param transaction
 */
export function normalizeTx(transaction: TransactionParams): NormalizedTransaction {
  const {to, nonce, value, chainId, data, gasLimit, type} = transaction;
  const baseTx: Omit<TransactionBaseParams, 'nonce' | 'chainId'> & {
    nonce: number;
    chainId: number;
  } = {
    to,
    nonce: strToNumber(nonce),
    chainId: strToNumber(chainId),
    value: isHexPrefixed(value) ? value : numberToHexString(value),
    data: isHexString(data) ? data : ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${data}`)),
    gasLimit: isHexPrefixed(gasLimit) ? gasLimit : numberToHexString(gasLimit),
  };

  let specialTxParams: LegacyParams | Eip1559Params;
  if (type === 2) {
    const {maxFeePerGas, maxPriorityFeePerGas, accessList} = transaction;
    specialTxParams = {
      type,
      maxFeePerGas: isHexPrefixed(maxFeePerGas) ? maxFeePerGas : numberToHexString(maxFeePerGas),
      maxPriorityFeePerGas: isHexPrefixed(maxPriorityFeePerGas)
        ? maxPriorityFeePerGas
        : numberToHexString(maxPriorityFeePerGas),
      accessList,
    } as Eip1559Params;
  } else {
    const {gasPrice} = transaction;
    specialTxParams = {
      type,
      gasPrice: isHexPrefixed(gasPrice) ? gasPrice : numberToHexString(gasPrice),
    } as LegacyParams;
  }

  return {
    ...baseTx,
    ...specialTxParams,
  };
}

function strToNumber(value: string): number {
  return ethers.BigNumber.from(value).toNumber();
}

function hexStringToString(value: string): string {
  return ethers.BigNumber.from(value).toString();
}

function numberToHexString(value: string): string {
  return ethers.BigNumber.from(value).toHexString();
}

export function stripHexPrefix(str: string) {
  return isHexPrefixed(str) ? str.slice(2) : str;
}

export function isHexPrefixed(str: string): boolean {
  return str[0] === '0' && str[1] === 'x';
}

export function isHexString(value: string) {
  return ethers.utils.isHexString(value);
}
