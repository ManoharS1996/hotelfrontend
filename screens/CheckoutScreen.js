import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 20px;
`;

const PaymentSection = styled.View`
  margin-top: 10px;
`;

const PaymentOption = styled.TouchableOpacity`
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
`;

const PaymentText = styled.Text`
  font-size: 18px;
  margin-left: 15px;
  color: #2c3e50;
`;

const Icon = styled.Image`
  width: 28px;
  height: 28px;
`;

const Button = styled.TouchableOpacity`
  background-color: #27ae60;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 30px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const CheckoutScreen = () => {
  const navigation = useNavigation();

  // Placeholder images - replace these with your actual image paths
  const paymentIcons = {
    online: require('../assets/online.png'),
    netbanking: require('../assets/netbanking.png'),
    qrcode: require('../assets/qrcode.png'),
    cash: require('../assets/cash.png'),
  };

  // Fallback for missing images
  const getImageSource = (icon) => {
    try {
      return paymentIcons[icon];
    } catch (e) {
      // Return a placeholder or null if image doesn't exist
      return null;
    }
  };

  return (
    <Container>
      <Title>Checkout</Title>
      <Subtitle>Select a Payment Method</Subtitle>

      <PaymentSection>
        <PaymentOption>
          <Icon source={getImageSource('online')} />
          <PaymentText>Online Payment</PaymentText>
        </PaymentOption>

        <PaymentOption>
          <Icon source={getImageSource('netbanking')} />
          <PaymentText>Net Banking</PaymentText>
        </PaymentOption>

        <PaymentOption>
          <Icon source={getImageSource('qrcode')} />
          <PaymentText>Scan QR Code</PaymentText>
        </PaymentOption>

        <PaymentOption>
          <Icon source={getImageSource('cash')} />
          <PaymentText>Cash on Delivery</PaymentText>
        </PaymentOption>
      </PaymentSection>

      <Button onPress={() => navigation.navigate('Home')}>
        <ButtonText>Place Order</ButtonText>
      </Button>
    </Container>
  );
};

export default CheckoutScreen;