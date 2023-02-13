import React, {FC} from 'react';
import {Box, colors, Divider, Flex, Text} from '@/modules/components';
import {ScrollView} from 'react-native';
import DataItem from '@/modules/screens/sign/comp/DataItem';
import {FromWalletCard} from '@/modules/screens/sign/comp/FormItem';
import {isHexString} from 'ethers/lib/utils';
import {msgHexToText} from '@/service/mpc/sign/SerializeUtil';
import {SignPrepareParams} from '@safeheron/mpcsnap-types';

interface SignMessageProps {
  method: SignPrepareParams['method'];
  params: any;
  commonParams: SignPrepareParams['commonParams'];
}

function convertSignMessageRequest(method: SignPrepareParams['method'], params: any) {
  let title = 'Request for signature';
  let subTitle = 'Only sign this message if you fully understand the content and trust the requesting site.';
  let content = '';

  switch (method) {
    case 'eth_sign':
    case 'personal_sign':
      content = params as string;
      break;
    case 'eth_signTypedData_v1':
      params = typeof params === 'string' ? JSON.parse(params) : params;
      const parsedContent = params.reduce((m: any, n: any) => {
        m[n.name] = n.value;
        return m;
      }, {});
      content = JSON.stringify(parsedContent, null, 4);
      break;
    case 'eth_signTypedData_v3':
    case 'eth_signTypedData_v4':
      params = typeof params === 'string' ? JSON.parse(params) : params;
      title = params.domain.name;
      subTitle = 'Request for signature';
      content = JSON.stringify(params.message, null, 4);
      break;
    default:
      title = 'Re';
  }

  return {title, subTitle, content};
}

const SignMessage: FC<SignMessageProps> = ({method, params, commonParams}) => {
  const {title, subTitle, content} = convertSignMessageRequest(method, params);

  const convertedContent =
    method === 'personal_sign' ? (isHexString(content) ? msgHexToText(content) : content) : content;

  const {balance, nativeCurrency, formatTime, chainId, chainName} = commonParams;

  return (
    <Flex>
      <Box padding={[0, 0]}>
        <Text fontSize={22} mt={16} blod color={'#262833'} align={'center'}>
          {title}
        </Text>
        <Text fontSize={12} color={'#6B6D7C'} mt={4} mx={30} align={'center'}>
          {subTitle}
        </Text>
        <Divider mt={30} mx={20} mb={20} />

        <Flex px={20} mb={20}>
          <Flex row justify={'space-between'} mb={8}>
            <Text blod>From</Text>
            <Text>
              Balance: {balance ?? '--'} {nativeCurrency?.symbol ?? ''}
            </Text>
          </Flex>
          <FromWalletCard />
        </Flex>
      </Box>

      <Divider h={12} bgColor={colors.bg.bg1} />

      <Flex padding={[16, 20]} style={{backgroundColor: colors.bg.white}}>
        <Text blod mb={12}>
          Message
        </Text>
        <ScrollView>
          <Text>{convertedContent}</Text>
        </ScrollView>
      </Flex>

      <Divider h={12} bgColor={colors.bg.bg1} />

      <Flex>
        <DataItem name={'Date(UTC)'} value={formatTime} />
        {chainId && (
          <>
            <Divider mx={20} />
            <DataItem name={'Network'} value={chainName || chainId} />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default SignMessage;
