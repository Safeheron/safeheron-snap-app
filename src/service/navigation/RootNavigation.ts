import {createNavigationContainerRef} from '@react-navigation/native';
import {ScreenKeys} from '@/types/navigation.types';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: ScreenKeys, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
