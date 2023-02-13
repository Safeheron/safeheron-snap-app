import React from 'react';
import {Box, colors, Divider, Flex, Text} from '@/modules/components';
import FormItem, {FromWalletCard} from '../comp/FormItem';
import DataItem from '../comp/DataItem';
import {TransactionParams} from '@/service/mpc/sign/SignModels';

import {convertToHumanableTx} from '@/service/utils/transactionUtil';
import {SignPrepareParams} from '@safeheron/mpcsnap-types';

interface SendNativeAssertProps {
  tx: TransactionParams;
  commonParams: SignPrepareParams['commonParams'];
}

const SendNativeAssert: React.FC<SendNativeAssertProps> = ({tx, commonParams}) => {
  const humanableTx = convertToHumanableTx(tx);

  const {value, to, estimatedFee, data} = humanableTx;
  const {chainName, chainId, nativeCurrency, formatTime} = commonParams;

  const symbol = nativeCurrency?.symbol ?? '--';

  return (
    <Flex pb={20}>
      <Box padding={[0, 0]}>
        <Text mt={30} align={'center'} fontSize={22} blod>
          Send {value} {symbol}
        </Text>

        <Divider mt={40} mb={20} mx={20} />

        <Flex px={20} mb={20}>
          <FromWalletCard showTitle />
          <FormItem mt={20} title={'To'} value={to} />
        </Flex>
      </Box>

      <Divider h={12} bgColor={colors.bg.bg1} />

      {data && (
        <>
          <Box padding={[16, 20]}>
            <Text style={{fontWeight: '700'}} mb={9}>
              Hex
            </Text>
            <Text fontSize={12} color={'#6B6D7C'}>
              {data}
            </Text>
          </Box>
          <Divider h={12} bgColor={'#f3f3f8'} />
        </>
      )}

      <Flex>
        <DataItem name={'Date (UTC)'} value={formatTime} />
        <Divider mx={20} />
        <DataItem name={'Network'} value={chainName || chainId || '--'} />
        <Divider mx={20} />
        <DataItem name={'Network Fee'} value={`${estimatedFee} ${symbol}`} />
      </Flex>
    </Flex>
  );
};

export default SendNativeAssert;
