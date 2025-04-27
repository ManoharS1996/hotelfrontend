import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InputContainer = styled.View`
  margin-bottom: 15px;
  width: 100%;
`;

const InputLabel = styled.Text`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const InputWrapper = styled.View`
  position: relative;
`;

const StyledInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#999',
  paddingHorizontal: 15,
}))`
  height: 50px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => {
    if (props.error) return '#e74c3c';
    if (props.isFocused) return '#3498db';
    return '#ddd';
  }};
  font-size: 16px;
  background-color: #fff;
  padding-right: ${props => (props.secureTextEntry ? '50px' : '15px')};
`;

const IconWrapper = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
  top: 13px;
`;

const ErrorText = styled.Text`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`;

export const Input = ({ label, error, secureTextEntry, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputContainer>
      {label && <InputLabel>{label}</InputLabel>}
      <InputWrapper>
        <StyledInput
          {...props}
          error={error}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
        />
        {secureTextEntry && (
          <IconWrapper onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#777"
            />
          </IconWrapper>
        )}
      </InputWrapper>
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};