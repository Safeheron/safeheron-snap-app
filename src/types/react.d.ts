import {ViewStyle} from 'react-native';
import {StackNavigationOptions} from '@react-navigation/stack';

declare global {
  namespace React {
    export interface FunctionComponent {
      title?: string | (() => string);
      useSafearea?: boolean;
      safeareaStyle?: ViewStyle | undefined;
      useBlurModal?: boolean;
      options?: StackNavigationOptions;
      keyboardAvoiding?: boolean;
    }

    export interface ComponentClass {
      title?: () => string;
      useSafearea?: boolean;
      safeareaStyle?: ViewStyle | undefined;
      useBlurModal?: boolean;
      options?: StackNavigationOptions;
      keyboardAvoiding?: boolean;
    }
  }
}

type PropsWithChildren<P = unknown> = P & {children?: ReactNode | undefined};
