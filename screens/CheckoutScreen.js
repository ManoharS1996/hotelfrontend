import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  background-color: #f8f8f8;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const CheckoutScreen = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <Title>Checkout</Title>
      <Text>Payment methods and order confirmation would go here</Text>

      <Button onPress={() => navigation.navigate('Home')}>
        <ButtonText>Place Order</ButtonText>
      </Button>
    </Container>
  );
};

export default CheckoutScreen;