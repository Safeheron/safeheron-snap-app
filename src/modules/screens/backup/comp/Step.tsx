import {colors, Divider, Flex, Text} from '@/modules/components';
import React, {FC, Fragment} from 'react';
import Box from '@/modules/components/primitives/box/Box';

const Step: FC<{
  currentStep: number;
  steps: string[];
}> = props => {
  const {currentStep, steps} = props;
  const maxLen = steps.length;

  return (
    <Flex direction={'row'} padding={[0, 0, 10, 0]}>
      {steps.map((step, i: number) => {
        const isSelected = currentStep >= i + 1;
        return (
          <Fragment key={i}>
            <Flex align={'center'} style={{width: 40}}>
              <Box
                radius={28}
                padding={0}
                bg={isSelected ? colors.primary : '#E7E8EC'}
                style={{
                  width: 28,
                  height: 28,
                }}>
                <Text
                  align={'center'}
                  lineHeight={28}
                  color={isSelected ? '#FFFFFF' : colors.text.second}
                  blod
                  fontSize={12}>
                  {`0${i + 1}`}
                </Text>
              </Box>
              <Text
                padding={[4, 0, 0, 0]}
                color={isSelected ? 'primary' : 'secondary'}
                blod
                fontSize={12}
                lineHeight={17}
                style={{width: 100}}
                align={'center'}>
                {step}
              </Text>
            </Flex>

            {i < maxLen - 1 && <Divider h={2} w={74} bgColor={'#E7E8EC'} col mt={13} />}
          </Fragment>
        );
      })}
    </Flex>
  );
};
export default Step;
