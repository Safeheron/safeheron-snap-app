import {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const useBottomSpace = () => {
  const [bottomSpace, setBottomSpace] = useState(0);
  const {bottom: bottomInset} = useSafeAreaInsets();

  useEffect(() => {
    setBottomSpace(bottomInset);
  }, [bottomInset]);

  return bottomSpace;
};

export default useBottomSpace;
