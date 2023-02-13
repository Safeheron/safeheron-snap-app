import React, {useLayoutEffect} from 'react';
import {Button, Flex, Text} from '@/modules/components';
import {ScrollView} from 'react-native';
import Mnemonics from '@/modules/screens/backup/comp/Mnemonics';
import {ScreenProps} from '@/types/navigation.types';
import {useAndroidBackHandler} from '@/modules/hooks/BackHandler.android';
import BackButton from '@/modules/components/navigation/BackButton';
import useStore from '@/service/store/useStore';
import useMPCFlow from '@/service/mpc/hooks/useMPCFlow';
import {KeyRecoveryFlow} from '@/service/mpc/recovery/KeyRecoveryFlow';
import {BusinessType} from '@/service/mpc/mpcTypes';

const MnemonicPartyReview: React.FC<ScreenProps<'MnemonicPartyReview'>> = ({navigation, route}) => {
  const {mnemonic} = route.params;
  const flowType: BusinessType = 'recover';
  const [recoverFlow, manuallyCancel] = useMPCFlow(navigation, flowType);

  const toNext = () => {
    (recoverFlow as KeyRecoveryFlow).recoveryContinue();
    navigation.replace('MPCLoadingScreen', {flowType});
  };

  let [wallet] = useStore();

  useAndroidBackHandler(() => {
    manuallyCancel();
    return true;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => <BackButton onPress={manuallyCancel} />,
    });
  });

  return (
    <Flex flex={1} px={20}>
      <ScrollView style={{flex: 1}}>
        <Text fontSize={16} blod my={30} align={'center'}>
          This mobile device already has a private key shard and does not need to be recovered. Please complete the
          recovery on other devices.
        </Text>
        <Text blod mb={12}>
          The private key shard {wallet?.partyId} for this device is as follows:
        </Text>
        <Mnemonics mode={'partyPreview'} randomNum={7} words={mnemonic} />
      </ScrollView>

      <Button mb={22} type={'primary'} onPress={toNext}>
        Continue
      </Button>
    </Flex>
  );
};

MnemonicPartyReview.title = 'Recover';

export default MnemonicPartyReview;
