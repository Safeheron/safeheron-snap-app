import React, {FC} from 'react';
import {Box, Flex, Text} from '@/modules/components';
import useStore from '@/service/store/useStore';

const FormItem: FC<{
  title: string;
  value: string;
  maxLine?: number | undefined;
  mt?: number;
}> = props => {
  const {title, value, maxLine, mt} = props;

  return (
    <Flex mt={mt}>
      <Text pb={8} color={'second'}>
        {title}
      </Text>

      <Box padding={[14, 12]} bg={'#ECEDEF'} radius={8}>
        <Text numberOfLines={maxLine} ellipsizeMode={'middle'}>
          {value}
        </Text>
      </Box>
    </Flex>
  );
};

interface FromWalletCardProps {
  showTitle?: boolean;
}

const FromWalletCard: FC<FromWalletCardProps> = ({showTitle}) => {
  let [wallet, _] = useStore();

  return (
    <Flex>
      {showTitle && (
        <Text pb={8} color={'second'} blod>
          From
        </Text>
      )}
      <Box padding={[14, 12]} bg={'#ECEDEF'} radius={8}>
        <Flex>
          <Text style={{fontWeight: '700'}}>{wallet?.name}</Text>
          <Text fontSize={12}>{wallet?.address}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export {FromWalletCard};

export default FormItem;
