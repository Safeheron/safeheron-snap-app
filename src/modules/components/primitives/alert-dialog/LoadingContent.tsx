import React from 'react';

import Spinner from '../spinner/Spinner';
import Flex from '../flex/Flex';
import Text from '../text/Text';

import Box from '../box/Box';

const LoadingContent: React.FC = () => {
  return (
    <Box radius={8} padding={0} style={{width: 120, height: 120, alignSelf: 'center'}}>
      <Flex flex={1} align={'center'} justify={'center'}>
        <Spinner />
        <Text mt={10}>Loading</Text>
      </Flex>
    </Box>
  );
};

export default LoadingContent;
