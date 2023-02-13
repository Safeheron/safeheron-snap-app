import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {BackHandler, Platform} from 'react-native';

type BackHandlerFunc = () => boolean;
type backHandlerComponentProps = {
  onBackPress: BackHandlerFunc;
  children?: React.ReactNode;
};

const useAndroidBackHandler = (onBackPress: BackHandlerFunc) => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'ios') {
        return;
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onBackPress]),
  );
};

const useAndroidBackReactHandler = (onBackPress: BackHandlerFunc) => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove();
  }, []);
};

const AndroidBackHandler = ({onBackPress, children = null}: backHandlerComponentProps) => {
  useAndroidBackHandler(onBackPress);

  return children;
};

const AndroidBackReactHandler = ({onBackPress, children = null}: backHandlerComponentProps) => {
  useAndroidBackReactHandler(onBackPress);

  return children;
};

export {AndroidBackHandler, AndroidBackReactHandler, useAndroidBackHandler, useAndroidBackReactHandler};
