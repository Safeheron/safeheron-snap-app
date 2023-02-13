import {ScreenKeys} from '@/types/navigation.types';

import {createStackNavigator, StackNavigationOptions} from '@react-navigation/stack';
import React, {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Platform, StatusBar} from 'react-native';
import BackButton from '@/modules/components/navigation/BackButton';
import {colors} from '@/modules/components';
import {getScreenOptions} from '@/modules/skeleton/screenUtil';
import {withSafearea} from '@/modules/skeleton/hoc';
import {navigationRef} from '@/service/navigation/RootNavigation';
import {AuthContextProvider} from '@/service/auth/AuthContext';
import mpcContainer from '@/modules/components/MPCContainer';

export type Screen = {
  name: ScreenKeys;
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
};

type Props = {
  screens: Screen[];
};

const RootStack = createStackNavigator();

const SkeletonScreen: FC<Props> = ({screens}) => {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');

    // mount mpc container
    mpcContainer.mount();

    setLaunched(true);
  }, []);

  if (!launched) {
    return <></>;
  }

  return (
    <AuthContextProvider>
      <NavigationContainer ref={navigationRef}>
        {Platform.OS === 'ios' && (
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={'white'}
            animated={true}
            hidden={false}
            translucent={true}
          />
        )}
        <RootStack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerLeft: BackButton,
            headerStyle: {
              backgroundColor: colors.bg.white,
              borderBottomWidth: 0,
            },
            headerTitleStyle: {fontSize: 16, fontWeight: '600'},
          }}
          initialRouteName={'LaunchDispatch'}>
          <RootStack.Group>
            {screens.map(screen => (
              <RootStack.Screen
                name={screen.name}
                key={screen.name}
                options={getScreenOptions(screen)}
                component={withSafearea(screen.component)}
              />
            ))}
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
};

export default SkeletonScreen;
