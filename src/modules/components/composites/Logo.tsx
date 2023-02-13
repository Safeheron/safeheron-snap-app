import React, {FC} from 'react';
import Flex from '@/modules/components/primitives/flex/Flex';
import {FlexStyle, Image} from 'react-native';
import {Text} from '@/modules/components';

interface LogoProps {
  style?: FlexStyle;
}

const Logo: FC<LogoProps> = ({style}) => {
  return (
    <Flex row style={style}>
      <Image source={require('~/resources/images/logo.png')} style={{width: 30, height: 30}} />
      <Flex ml={5}>
        <Text fontSize={16} blod>
          Safeheron Snap
        </Text>
        <Text fontSize={12} color={'#6b6d7c'}>
          An MPC wallet for MetaMask users
        </Text>
      </Flex>
    </Flex>
  );
};

export default Logo;
