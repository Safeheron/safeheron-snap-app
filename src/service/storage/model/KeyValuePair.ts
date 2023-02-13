import {Wallet} from '@/service/store/Store';

export interface StorageKeyValueType {
  wallet: Wallet;
}

export type StorageKeys = keyof StorageKeyValueType;

export type StorageValue<T extends StorageKeys> = StorageKeyValueType[T];
