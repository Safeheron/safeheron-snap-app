import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from '@/modules/components/primitives/icon/Icon';

interface Props {
  tintColor?: string;
  onPress?: () => void;
}

const BackButton: FC<Props> = el => {
  const {tintColor = '#BFCBCB', onPress} = el;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 56,
        height: 34,
        paddingLeft: 20,
        justifyContent: 'center',
      }}>
      <Icon name="navBack" color={tintColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
