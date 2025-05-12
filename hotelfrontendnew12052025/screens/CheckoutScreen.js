import React, { useState } from 'react';
import { View, Image, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

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

const OrderSummary = styled.View`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const SummaryTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SummaryText = styled.Text`
  font-size: 16px;
  color: #555;
`;

const SummaryAmount = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const TotalAmount = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
`;

const PaymentSection = styled.View`
  margin-top: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
`;

const PaymentOption = styled.TouchableOpacity`
  background-color: ${props => props.selected ? '#d4edda' : props.disabled ? '#f5f5f5' : '#ecf0f1'};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  border-width: ${props => props.selected ? '1px' : '0'};
  border-color: #28a745;
`;

const PaymentText = styled.Text`
  font-size: 18px;
  margin-left: 15px;
  color: ${props => props.disabled ? '#aaa' : '#2c3e50'};
`;

const Icon = styled.Image`
  width: 28px;
  height: 28px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const Button = styled.TouchableOpacity`
  background-color: #27ae60;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 30px;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

// Confirmation Screen Components
const ConfirmationContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 30px;
  align-items: center;
  justify-content: center;
`;

const ConfirmationTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #28a745;
  margin-top: 30px;
  margin-bottom: 15px;
  text-align: center;
`;

const ConfirmationSubtitle = styled.Text`
  font-size: 18px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 30px;
`;

const OrderDetailsCard = styled.View`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  margin-top: 20px;
`;

const OrderDetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const OrderDetailLabel = styled.Text`
  font-size: 16px;
  color: #6c757d;
`;

const OrderDetailValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #343a40;
`;

const ContinueButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 30px;
  width: 100%;
`;

const ContinueButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { cartItems, subtotal, deliveryFee, tax, total } = route.params || {
    cartItems: [],
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0
  };

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [scaleValue] = useState(new Animated.Value(0));
  const [rotationValue] = useState(new Animated.Value(0));

  // Placeholder images - replace these with your actual image paths
  const paymentIcons = {
    online: require('../assets/online.png'),
    netbanking: require('../assets/netbanking.png'),
    qrcode: require('../assets/qrcode.png'),
    cash: require('../assets/cash.png'),
  };

  // Generate random order details
  const generateOrderDetails = () => {
    const now = new Date();
    return {
      orderId: `ORD${Math.floor(Math.random() * 1000000)}`,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      paymentMethod: selectedPayment,
      total: total.toFixed(2)
    };
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    if (selectedPayment !== 'cash') return;
    
    const details = generateOrderDetails();
    setOrderDetails(details);
    
    // Start scale animation
    Animated.sequence([
      // Initial scale up
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true
      }),
      // Scale down to normal
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      // Bounce effect
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    // Rotation animation
    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1),
      useNativeDriver: true
    }).start();
    
    setOrderConfirmed(true);
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigation.navigate('Home');
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

  // Render confirmation screen
  if (orderConfirmed) {
    const rotate = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    
    return (
      <ConfirmationContainer>
        <Animated.View style={{
          transform: [
            { scale: scaleValue },
            { rotate: rotate }
          ]
        }}>
          <FontAwesome name="check-circle" size={100} color="#28a745" />
        </Animated.View>
        
        <ConfirmationTitle>Order Confirmed!</ConfirmationTitle>
        <ConfirmationSubtitle>Thank you for your purchase</ConfirmationSubtitle>
        
        <OrderDetailsCard>
          <OrderDetailRow>
            <OrderDetailLabel>Order ID:</OrderDetailLabel>
            <OrderDetailValue>{orderDetails.orderId}</OrderDetailValue>
          </OrderDetailRow>
          <OrderDetailRow>
            <OrderDetailLabel>Date:</OrderDetailLabel>
            <OrderDetailValue>{orderDetails.date}</OrderDetailValue>
          </OrderDetailRow>
          <OrderDetailRow>
            <OrderDetailLabel>Time:</OrderDetailLabel>
            <OrderDetailValue>{orderDetails.time}</OrderDetailValue>
          </OrderDetailRow>
          <OrderDetailRow>
            <OrderDetailLabel>Payment Method:</OrderDetailLabel>
            <OrderDetailValue>
              {selectedPayment === 'cash' ? 'Cash on Delivery' : 
               selectedPayment === 'online' ? 'Online Payment' :
               selectedPayment === 'netbanking' ? 'Net Banking' : 'QR Code'}
            </OrderDetailValue>
          </OrderDetailRow>
          <OrderDetailRow>
            <OrderDetailLabel>Total Amount:</OrderDetailLabel>
            <OrderDetailValue>₹{orderDetails.total}</OrderDetailValue>
          </OrderDetailRow>
        </OrderDetailsCard>
        
        <ContinueButton onPress={handleContinueShopping}>
          <ContinueButtonText>Continue Shopping</ContinueButtonText>
        </ContinueButton>
      </ConfirmationContainer>
    );
  }

  // Render checkout screen
  return (
    <Container>
      <Title>Checkout</Title>
      <Subtitle>Complete your purchase</Subtitle>

      <OrderSummary>
        <SummaryTitle>Order Summary</SummaryTitle>
        {cartItems.map((item) => (
          <SummaryRow key={item.id}>
            <SummaryText>{item.name} (x{item.quantity})</SummaryText>
            <SummaryAmount>₹{item.price * item.quantity}</SummaryAmount>
          </SummaryRow>
        ))}
        <SummaryRow>
          <SummaryText>Subtotal</SummaryText>
          <SummaryAmount>₹{subtotal.toFixed(2)}</SummaryAmount>
        </SummaryRow>
        <SummaryRow>
          <SummaryText>Delivery Fee</SummaryText>
          <SummaryAmount>₹{deliveryFee.toFixed(2)}</SummaryAmount>
        </SummaryRow>
        <SummaryRow>
          <SummaryText>Tax (5%)</SummaryText>
          <SummaryAmount>₹{tax.toFixed(2)}</SummaryAmount>
        </SummaryRow>
        <TotalRow>
          <TotalText>Total</TotalText>
          <TotalAmount>₹{total.toFixed(2)}</TotalAmount>
        </TotalRow>
      </OrderSummary>

      <PaymentSection>
        <SectionTitle>Payment Method</SectionTitle>
        <PaymentOption 
          selected={selectedPayment === 'online'}
          onPress={() => setSelectedPayment('online')}
          disabled={true}
        >
          <Icon source={getImageSource('online')} disabled={true} />
          <PaymentText disabled={true}>Online Payment (Coming Soon)</PaymentText>
        </PaymentOption>

        <PaymentOption 
          selected={selectedPayment === 'netbanking'}
          onPress={() => setSelectedPayment('netbanking')}
          disabled={true}
        >
          <Icon source={getImageSource('netbanking')} disabled={true} />
          <PaymentText disabled={true}>Net Banking (Coming Soon)</PaymentText>
        </PaymentOption>

        <PaymentOption 
          selected={selectedPayment === 'qrcode'}
          onPress={() => setSelectedPayment('qrcode')}
          disabled={true}
        >
          <Icon source={getImageSource('qrcode')} disabled={true} />
          <PaymentText disabled={true}>Scan QR Code (Coming Soon)</PaymentText>
        </PaymentOption>

        <PaymentOption 
          selected={selectedPayment === 'cash'}
          onPress={() => setSelectedPayment('cash')}
        >
          <Icon source={getImageSource('cash')} />
          <PaymentText>Cash Payment</PaymentText>
        </PaymentOption>
      </PaymentSection>

      <Button 
        onPress={handleConfirmOrder}
        disabled={selectedPayment !== 'cash'}
      >
        <ButtonText>Place Order</ButtonText>
      </Button>
    </Container>
  );
};

export default CheckoutScreen;