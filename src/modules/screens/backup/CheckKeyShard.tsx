import React, {useEffect, useState} from 'react';
import {Button, Flex, Text} from '@/modules/components';
import Mnemonics from '@/modules/screens/backup/comp/Mnemonics';
import {MPCHelp} from '@/service/mpc/algorithm/MPCAlgorithm';
import {ScreenProps} from '@/types/navigation.types';
import useBottomSpace from '@/modules/components/hooks/useBottomSpace';
import useStore from '@/service/store/useStore';
import {PartyId} from '@/service/mpc/util';

const CheckKeyShard: React.FC<ScreenProps<'CheckKeyShard'>> = ({navigation}) => {
  let [wallet, store] = useStore();

  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [partyId, setPartyId] = useState<PartyId>();

  const getMnemonics = async () => {
    const signKey = store.originalSignKey;
    setPartyId(wallet?.partyId);
    if (signKey) {
      const {mnemo} = await MPCHelp.getMnemonicFromSignKey(signKey);
      if (mnemo) {
        setMnemonics(mnemo?.split(' '));
      }
    }
  };

  const doDone = () => {
    navigation.popToTop();
  };

  useEffect(() => {
    getMnemonics().then();
  }, []);

  const bottomSpace = useBottomSpace();

  return (
    <Flex flex={1}>
      <Flex flex={1} px={20}>
        <Text align={'center'} mt={30} fontSize={16} lineHeight={22} blod mb={30}>
          {`Private Key Shard ${partyId}`}
        </Text>
        <Mnemonics mode={'preview'} words={mnemonics} partyId={partyId} />
      </Flex>

      <Button mx={20} type={'primary'} onPress={doDone} mb={bottomSpace === 0 ? 32 : 22}>
        Done
      </Button>
    </Flex>
  );
};

CheckKeyShard.title = 'View Key Shard';

export default CheckKeyShard;
