import React from 'react';
import {colors, Flex, Text} from '@/modules/components';
import {Image} from 'react-native';

const BackupStep3: React.FC = () => {
  return (
    <Flex flex={1} align={'center'} mt={70}>
      <Image source={require('~/resources/images/checked-bordered.png')} />
      <Text mt={15} mb={8} blod>
        Success
      </Text>
      <Text mx={45} fontSize={13} lineHeight={20} align={'center'} color={colors.text.warning}>
        Please ensure all private key shards (A, B, and C) have been backed up before using the wallet.
      </Text>
    </Flex>
  );
};

export default BackupStep3;
