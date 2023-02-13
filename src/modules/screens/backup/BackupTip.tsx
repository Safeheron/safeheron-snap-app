import React, {useEffect} from 'react';
import {Button, colors, Flex, Icon, Text} from '@/modules/components';
import {ScreenProps} from '@/types/navigation.types';
import Box from '@/modules/components/primitives/box/Box';
import useBottomSpace from '@/modules/components/hooks/useBottomSpace';
import {ScrollView} from 'react-native';
import useStore from '@/service/store/useStore';

export interface BackupTipScreenProps {
  type: 'backup' | 'check';
}

const tips = [
  {
    title: 'Carefully back up and keep them safe',
    desc: 'The recovery phrase represents the ownership of a private key shard. Please store it safely.',
  },
  {
    title: 'Decentralized and irretrievable',
    desc: "Safeheron will not be able to retrieve your mnemonic phrase, so please make sure it's well secured.",
  },
  {
    title: 'Store it safely',
    desc: 'Store the mnemonic phrase offline. Avoid internet connections, network transmission, or saving on online platforms like email, cloud storage, or chat tools, etc.',
  },
];

const mentions = [
  'Stay clear of cameras.',
  'We suggest that you disconnect your device from the Internet for offline backup.',
  'Each recovery phrase matches a key shard (A, B, or C). When backing up shards, please label the backed-up phrase with its corresponding shard.',
];

const BackupTip: React.FC<ScreenProps<'BackupTip'>> = ({navigation, route}) => {
  const {type} = route.params.type;
  let [wallet] = useStore();

  const setup = () => {
    navigation.setOptions({
      title: type === 'backup' ? 'Backup Key Shard' : 'View Key Shard',
    });
  };

  const toNext = () => {
    if (type === 'backup') {
      navigation.navigate('BackupMain');
    }
    if (type === 'check') {
      navigation.navigate('CheckKeyShard');
    }
  };

  useEffect(() => {
    setup();
  });

  const bottomSpace = useBottomSpace();

  return (
    <Flex flex={1} px={20}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Flex mb={40}>
          <Text align={'center'} mt={30} mb={25} fontSize={16} blod>
            {type === 'backup'
              ? `Back Up Private Key Shard ${wallet?.partyId}`
              : `View Private Key Shard ${wallet?.partyId}`}
          </Text>
          <Text lineHeight={22}>
            {type === 'backup'
              ? 'The MPC wallet created in Safeheron Snap has three private key shards, A, B, and C which are distributed across MetaMask Extension and 2 mobile phones with the Safeheron Snap App installed. Please complete the backup of the three key shards before using the wallet.'
              : 'The MPC wallet created in Safeheron Snap comprises three private key shards (A, B, and C), distributed across MetaMask Extension and 2 mobile phones with the Safeheron Snap App installed.'}
          </Text>
          <Box padding={[20, 12]} mt={37} radius={8} bg={'#F6F6F6'}>
            {tips.map((tip, index) => (
              <Flex key={index} mb={12}>
                <Flex row>
                  <Icon name={'tip'} />
                  <Text fontSize={13} blod ml={10}>
                    {tip.title}
                  </Text>
                </Flex>
                <Text fontSize={12} mt={4} color={colors.text.second}>
                  {tip.desc}
                </Text>
              </Flex>
            ))}
          </Box>
        </Flex>
        <Flex pb={bottomSpace === 0 ? 44 : 22}>
          {mentions.map((m, index) => (
            <Flex key={'metion_' + index} row align={'flex-start'}>
              <Text color={colors.text.warning} mt={4} mr={4} blod>
                ·
              </Text>
              <Text style={{flex: 1}} fontSize={13} lineHeight={24} color={colors.text.warning}>
                {m}
              </Text>
            </Flex>
          ))}
        </Flex>
      </ScrollView>
      <Button mt={16} type={'primary'} onPress={toNext}>
        {type === 'backup' ? 'Start Backup' : 'Continue'}
      </Button>
    </Flex>
  );
};

export default BackupTip;
