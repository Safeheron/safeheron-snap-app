import React, {FC} from 'react';
import {colors, Flex, Text} from '@/modules/components';
import {StyleSheet, TextInput as Input} from 'react-native';
import useSpaceStyles from '@/modules/components/hooks/use-space-props/useSpaceStyles';
import {ISpaceStyleProps} from '@/modules/components/hooks/use-space-props/types';
import {useMergedState} from '../../hooks';

interface DefaultInputProps extends ISpaceStyleProps {
  title: string;
  text?: string;
  hint?: string;
  maxLength?: number;
  disableSpaces?: boolean;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
}

const DefaultInput: FC<DefaultInputProps> = props => {
  const {title, hint, disableSpaces, maxLength, onChangeText} = props;
  const [spaceStyles] = useSpaceStyles(props);
  const [text, setText] = useMergedState<string>('', props.text);

  const shouldSetText = (val: string) => {
    if (!('text' in props)) {
      setText(val);
    }
  };

  const handleChangeText = (value: string) => {
    if (disableSpaces) {
      value = value.replace(/\s+/g, '');
    }
    onChangeText && onChangeText(value);
    shouldSetText(value);
  };

  return (
    <Flex style={[spaceStyles]}>
      <Text blod pb={8}>
        {title}
      </Text>
      <Input
        style={styles.input}
        value={text}
        selectionColor={colors.primary}
        autoCapitalize={'none'}
        textAlign={'left'}
        clearTextOnFocus={false}
        clearButtonMode={'never'}
        // blurOnSubmit={false}
        maxLength={maxLength}
        placeholder={hint}
        placeholderTextColor={colors.input.hint}
        secureTextEntry={props.secureTextEntry}
        underlineColorAndroid={'transparent'}
        onChangeText={handleChangeText}
      />
    </Flex>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text.primary,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.board.primary,
    height: 48,
  },
});

export default DefaultInput;
