import Crypto from '@/service/utils/Crypto';
import AsyncStorageData from '@/service/storage/AsyncStorageData';
import logger from '@/service/logger/logger';
import {PartyId} from '@/service/mpc/util';
import {EventEmitter2} from 'eventemitter2';

export type Wallet = {
  /**
   * Wallet unique id, based on wallet address and sessionId
   */
  id: string;
  address: string;
  name: string;
  /**
   * Encrypted signKey, encrypt by user password
   */
  signKey: string;
  partyId: PartyId;

  isBackup: boolean;
};

export const WALLET_CREATE_EVENT = 'walletCreated';

export default class Store extends EventEmitter2 {
  private static instance?: Store;

  private password?: string;

  private _wallet?: Wallet;

  private decryptedSignKey?: string;

  get wallet() {
    return this._wallet;
  }

  get walletExist(): boolean {
    return Boolean(this._wallet);
  }

  get passwordSettled() {
    return Boolean(this.password);
  }

  get isBackup() {
    return Boolean(this._wallet?.isBackup);
  }

  get isDecrypted() {
    return Boolean(this.decryptedSignKey);
  }

  get originalSignKey() {
    return this.decryptedSignKey;
  }

  private constructor() {
    super();
  }

  /**
   * make it singleton
   */
  static get() {
    if (!this.instance) {
      this.instance = new Store();
    }
    return this.instance;
  }

  static async setup() {
    const store = this.get();
    if (!store.walletExist) {
      const result = await AsyncStorageData.getString('wallet');
      if (typeof result === 'string') {
        const wallet = JSON.parse(result) as Wallet;
        store.setWallet(wallet);
      }
    }
    return store;
  }

  setWallet(wallet: Wallet) {
    this._wallet = wallet;
  }

  /**
   * This method will encrypt user signKey and save to storage
   * @param wallet
   */
  async createWallet(wallet: Wallet) {
    if (!this.password) {
      throw new Error('password is empty');
    }
    this.decryptedSignKey = wallet.signKey;
    const salt = wallet.address.toLowerCase();

    const pwdHash = await Crypto.pbkdf2(this.password, salt);
    wallet.signKey = Crypto.aes.encrypt(wallet.signKey, pwdHash);
    this.setWallet(wallet);

    await this.persistentWallet();

    this.emit(WALLET_CREATE_EVENT);
  }

  async resetWallet() {
    await AsyncStorageData.deleteData('wallet');
    this.password = '';
    this._wallet = undefined;
    this.decryptedSignKey = undefined;
  }

  async setPassword(pwd: string) {
    if (this._wallet) {
      logger.wallet.debug('start to decrypt wallet....');
      const signKey = this._wallet.signKey;
      const salt = this._wallet.address.toLowerCase();
      const pwdHash = await Crypto.pbkdf2(pwd, salt);
      const decryptedSignKey = Crypto.aes.decrypt(signKey, pwdHash);

      if (!decryptedSignKey) {
        throw new Error('Incorrect password, please check.');
      }

      this.decryptedSignKey = decryptedSignKey;
    }
    this.password = pwd;
  }

  /**
   * This is an idempotent methods
   */
  async finishBackup() {
    try {
      if (this._wallet) {
        this._wallet!.isBackup = true;
        await this.persistentWallet();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      logger.wallet.error('backup wallet occur an error: ', e);
      return false;
    }
  }

  private async persistentWallet() {
    const saveResult = await AsyncStorageData.storeString('wallet', JSON.stringify(this._wallet));
    if (!saveResult) {
      throw new Error('cannot store wallet.');
    }
  }
}
