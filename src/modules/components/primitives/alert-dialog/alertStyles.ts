import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  alertContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3000,
  },
  alertWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
});
