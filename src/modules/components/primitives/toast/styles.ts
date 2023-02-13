import {StyleSheet} from 'react-native';

const toastStyles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 40,
    paddingVertical: 10,
    minWidth: 120,
    maxWidth: 280,
    alignItems: 'center',
  },
  containerWithIcon: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingVertical: 28,
    paddingHorizontal: 16,
    minWidth: 160,
    maxWidth: 260,
  },
  iconStyle: {
    marginBottom: 12,
    width: 52,
    height: 52,
  },
});

export default toastStyles;
