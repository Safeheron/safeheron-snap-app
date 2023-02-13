import {Platform, TextStyle} from 'react-native';

const fontWeight = {
  regular: <TextStyle['fontWeight']>'400',
  medium: Platform.select<TextStyle['fontWeight']>({
    ios: '500',
    android: '700',
  }),
  semibold: '700',
};

export default fontWeight;
