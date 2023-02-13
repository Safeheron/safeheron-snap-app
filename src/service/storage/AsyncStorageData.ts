import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys, StorageValue} from '@/service/storage/model/KeyValuePair';
import {Callback} from '@react-native-async-storage/async-storage/src/types';

class AsyncStorageData {
  storeData = async <T extends StorageKeys>(key: T, value: StorageValue<T>): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('useAsyncStorageData >>> storeData', e);
      return false;
    }
  };

  getData = async <Key extends StorageKeys>(key: Key): Promise<StorageValue<Key> | undefined> => {
    try {
      const storeValue = await AsyncStorage.getItem(key);
      return storeValue !== null && storeValue !== undefined ? JSON.parse(storeValue) : null;
    } catch (e) {
      console.error('useAsyncStorageData >>> getData', e);
      return undefined;
    }
  };

  storeString = async (key: StorageKeys, str: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, str);
      return true;
    } catch (e) {
      console.error('useAsyncStorageData >>> storeString', e);
      return false;
    }
  };

  getString = async (key: StorageKeys): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('useAsyncStorageData >>> getString', e);
      return null;
    }
  };

  storeBoolean = async (key: StorageKeys, str: boolean): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, str + '');
      return true;
    } catch (e) {
      console.error('useAsyncStorageData >>> storeString', e);
      return false;
    }
  };
  getBoolean = async (key: StorageKeys): Promise<boolean> => {
    try {
      const result = await AsyncStorage.getItem(key);
      return result === 'true';
    } catch (e) {
      console.error('useAsyncStorageData >>> getString', e);
      return false;
    }
  };

  async deleteData(key: StorageKeys) {
    await AsyncStorage.removeItem(key);
  }

  async clean(callback?: Callback) {
    await AsyncStorage.clear(callback);
  }
}
export default new AsyncStorageData();
