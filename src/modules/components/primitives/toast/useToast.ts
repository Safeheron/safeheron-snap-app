import {useNavigation} from '@react-navigation/native';
import {useMemo} from 'react';

import toast from './Toast';

export default function useToast() {
  const navigation = useNavigation();
  const hookToast = useMemo(
    () => ({
      success: (text: string, position?: 'top' | 'center', duration?: number) => {
        if (navigation.isFocused()) {
          toast.success(text, position, duration);
        }
      },
      error: (text: string, position?: 'top' | 'center', duration?: number) => {
        if (navigation.isFocused()) {
          text = typeof text === 'object' ? JSON.stringify(text) : text;
          toast.error(text, position, duration);
        }
      },
      show: (text: string, type?: 'success' | 'error', position?: 'top' | 'center', duration?: number) => {
        if (navigation.isFocused()) {
          toast.show(text, type, position, duration);
        }
      },
    }),
    [navigation],
  );
  return hookToast;
}
