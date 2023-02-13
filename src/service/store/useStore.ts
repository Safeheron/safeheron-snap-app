import {useMemo, useState} from 'react';
import Store, {Wallet} from '@/service/store/Store';

export default function useStore(): [Wallet | undefined, Store] {
  const [store] = useState<Store>(Store.get());

  const wallet = useMemo(() => store.wallet, [store]);

  return [wallet, store];
}
