import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@/modules/components';

export const withSafearea = (Component: React.ComponentType<any>) => {
  if (Component.useSafearea !== false) {
    const WrapComponent: React.FC<any> = (props: any) => {
      return (
        <SafeAreaView
          key={Component.displayName}
          style={[{flex: 1, backgroundColor: colors.bg.white}, Component.safeareaStyle]}
          edges={['bottom']}>
          <Component {...props} />
        </SafeAreaView>
      );
    };
    return React.memo(WrapComponent);
  } else {
    return Component;
  }
};
