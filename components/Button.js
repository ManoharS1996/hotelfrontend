import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.bgColor || '#3498db'};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
`;

const ButtonText = styled.Text`
  color: ${props => props.textColor || '#fff'};
  font-size: 16px;
  font-weight: bold;
`;

export const Button = ({ title, onPress, bgColor, textColor, loading, disabled }) => {
  return (
    <ButtonContainer 
      onPress={onPress} 
      bgColor={bgColor} 
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor || '#fff'} />
      ) : (
        <ButtonText textColor={textColor}>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
};
