import React, {FC, useEffect, useState} from 'react';
import {Button, colors, Flex, Text, toast} from '@/modules/components';
import Step from '@/modules/screens/backup/comp/Step';
import Mnemonics from '@/modules/screens/backup/comp/Mnemonics';
import BackupStep3 from '@/modules/screens/backup/comp/BackupStep3';
import {ScreenProps} from '@/types/navigation.types';
import {MPCHelp} from '@/service/mpc/algorithm/MPCAlgorithm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useBottomSpace from '@/modules/components/hooks/useBottomSpace';
import useStore from '@/service/store/useStore';
import {PartyId} from '@/service/mpc/util';

const BACKUP_NUMBER = __DEV__ ? 1 : 6;

const BackupMain: FC<ScreenProps<'BackupMain'>> = ({navigation}) => {
  const [partyId, setPartyId] = useState<PartyId>();
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);

  const [step, setStep] = useState(1);
  let [wallet, store] = useStore();

  const [verifyResult, setVerifyResult] = useState(false);
  const handleVerify = async (result: boolean) => {
    setVerifyResult(result);
  };

  const doBackup = async () => {
    const isBackup = store.finishBackup();
    if (!isBackup) {
      toast.error('Backup exception,Please try again.');
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{name: 'WalletScreen'}],
    });
  };

  const setup = async () => {
    const signKey = store.originalSignKey;
    setPartyId(wallet?.partyId);
    if (signKey) {
      const {mnemo} = await MPCHelp.getMnemonicFromSignKey(signKey);
      if (mnemo) {
        setMnemonicWords(mnemo?.split(' '));
      }
    }
  };

  const toNext = async () => {
    if (step === 3) {
      await doBackup();
    } else {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const bottomSpace = useBottomSpace();

  return (
    <Flex flex={1}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{flex: 1}}
        keyboardDismissMode={'on-drag'}>
        <Text align={'center'} fontSize={16} blod mt={30} mb={15}>
          Backup Private Key Shard {partyId}
        </Text>
        <Flex row justify={'center'} mb={30}>
          <Step currentStep={step} steps={['Backup', 'Verify', 'Complete']} />
        </Flex>
        {step === 1 && (
          <Mnemonics key={'step1'} partyId={partyId} containerProps={{px: 20}} words={mnemonicWords} mode={'preview'} />
        )}
        {step === 2 && (
          <Mnemonics
            key={'step2'}
            partyId={partyId}
            containerProps={{px: 20}}
            words={mnemonicWords}
            mode={'partyVerify'}
            randomNum={BACKUP_NUMBER}
            onVerifySuccess={handleVerify}
          />
        )}
        {step === 3 && <BackupStep3 key={'step3'} />}
      </KeyboardAwareScrollView>

      <Flex px={20}>
        {step !== 3 && (
          <Text
            mb={20}
            mx={10}
            fontSize={12}
            lineHeight={24}
            align={'center'}
            color={step === 1 ? colors.text.warning : colors.text.second}>
            {step === 1
              ? 'Please write down these words in the correct order and save them in a secure place.'
              : 'Fill in the blanks in the correct order to verify the accuracy of the recovery phrase backup.'}
          </Text>
        )}

        <Button
          mb={bottomSpace === 0 ? 32 : 22}
          type={'primary'}
          disabled={step === 2 && !verifyResult}
          onPress={toNext}>
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};

BackupMain.title = 'Backup Key Shard';

export default BackupMain;
