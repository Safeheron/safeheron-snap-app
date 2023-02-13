import React, {FC} from 'react';
import {colors, Flex, Text} from '@/modules/components';

const DataItem: FC<{
  name: string;
  value: string;
  subValue?: string;
}> = props => {
  const {name, value, subValue} = props;
  return (
    <Flex px={20} row style={{height: 54, backgroundColor: colors.bg.white}} align={'center'}>
      <Text pr={20} style={{flex: 0}} lineHeight={20} align={'left'} color={'second'}>
        {name}
      </Text>
      <Flex flex={1}>
        <Text lineHeight={20} blod align={'right'}>
          {value}
        </Text>
        {subValue && (
          <Text lineHeight={20} align={'right'}>
            {subValue}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default DataItem;
