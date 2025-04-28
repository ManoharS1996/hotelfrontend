import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

const PopupContainer = styled.View`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const PopupTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const PopupMessage = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
  color: #555;
`;

const PopupButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px 20px;
  border-radius: 5px;
`;

const PopupButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const Popup = ({ isVisible, title, message, onClose }) => {
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <PopupContainer>
        <PopupTitle>{title}</PopupTitle>
        <PopupMessage>{message}</PopupMessage>
        <PopupButton onPress={onClose}>
          <PopupButtonText>OK</PopupButtonText>
        </PopupButton>
      </PopupContainer>
    </Modal>
  );
};
