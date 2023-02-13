import React, {FC, useEffect, useState} from 'react';
import Lottie from 'lottie-react-native';
import Text from '../../primitives/text/Text';
import Flex from '../../primitives/flex/Flex';
import {StyleSheet} from 'react-native';
import {IFlexProps} from '@/modules/components/primitives/flex/types';

import {BusinessType} from '@/service/mpc/mpcTypes';

const LOTTIE_HEIGHT = 300;

interface MpcLoadingProps extends IFlexProps {
  progress: string;
  flowType: BusinessType;
}

const MpcLoading: FC<MpcLoadingProps> = ({progress, flowType, ...flexProps}) => {
  const [description, setDescription] = useState('');
  const [statusDesc, setStatusDesc] = useState('');

  useEffect(() => {
    switch (flowType) {
      case 'keygen':
        setDescription('Creating the Wallet Successfully');
        setStatusDesc('Creating...');
        break;
      case 'sign':
        setDescription('Signing to Complete');
        setStatusDesc('Signing...');
        break;
      case 'recover':
        setDescription('Recovery Success');
        setStatusDesc('Recovering...');
        break;
    }
  }, []);

  return (
    <Flex style={styles.container} {...flexProps}>
      <Text blod align={'center'} mt={57}>
        Keep this page open for {'\n'} {description}
      </Text>
      <Flex style={styles.lottieContainer}>
        <Lottie style={{height: '100%'}} source={require('~/resources/lottie/loading.json')} autoPlay loop />
      </Flex>
      <Flex style={styles.textContainer}>
        <Text lineHeight={20}>{`${progress}%`}</Text>
      </Flex>
      <Text blod align={'center'}>
        {statusDesc}
      </Text>
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  lottieContainer: {
    alignItems: 'center',
    height: LOTTIE_HEIGHT,
  },
  textContainer: {
    height: LOTTIE_HEIGHT,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
  },
});

export default React.memo(MpcLoading);
