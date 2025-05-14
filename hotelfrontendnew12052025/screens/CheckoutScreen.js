import React, { useState, useEffect } from 'react'; // Added useEffect
import { View, Animated, Easing, Alert, Platform } from 'react-native'; // Added Alert, Platform
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Added AsyncStorage


// Styled Components (Keep your existing styled components as they are)
const Container = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: { flexGrow: 1 } // Ensure scrollview can expand
})`
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
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.08;
      shadow-radius: 5px;
      shadow-offset: 0px 3px;
    `,
    android: `
      elevation: 3;
    `,
  })}
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
  color: #333;
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
  color: #2c3e50;
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
  background-color: ${props => props.selected ? '#d4edda' : props.disabled ? '#f0f0f0' : '#ecf0f1'};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  border-width: ${props => props.selected ? '1.5px' : '0'};
  border-color: ${props => props.selected ? '#28a745' : 'transparent'};
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const PaymentText = styled.Text`
  font-size: 18px;
  margin-left: 15px;
  color: ${props => props.disabled ? '#aaa' : props.selected ? '#155724' : '#2c3e50'};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
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
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.1;
      shadow-radius: 5px;
      shadow-offset: 0px 3px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

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
   ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.08;
      shadow-radius: 5px;
      shadow-offset: 0px 3px;
    `,
    android: `
      elevation: 3;
    `,
  })}
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
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.1;
      shadow-radius: 5px;
      shadow-offset: 0px 3px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

const ContinueButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Robust default values and parameter extraction
  const params = route.params || {};
  const cartItems = params.cartItems || [];
  const subtotal = typeof params.subtotal === 'number' ? params.subtotal : 0;
  const deliveryFee = typeof params.deliveryFee === 'number' ? params.deliveryFee : 0;
  const tax = typeof params.tax === 'number' ? params.tax : 0;
  const total = typeof params.total === 'number' ? params.total : 0;

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [scaleValue] = useState(new Animated.Value(0.5)); // Start smaller for better animation
  const [rotationValue] = useState(new Animated.Value(0));

  // Placeholder for asset loading
  // In a real app, you'd use require directly or a more sophisticated asset management
  const paymentIcons = {
    online: require('../assets/online.png'), // Make sure these paths are correct
    netbanking: require('../assets/netbanking.png'), // and the assets exist
    qrcode: require('../assets/qrcode.png'),
    cash: require('../assets/cash.png'),
  };

  const getImageSource = (iconName) => {
    // Basic error handling for icons
    if (paymentIcons[iconName]) {
      return paymentIcons[iconName];
    }
    // Return a default or handle missing icon
    console.warn(`Icon for ${iconName} not found, using default.`);
    return paymentIcons['cash']; // Or some placeholder
  };


  const generateOrderDetails = () => {
    const now = new Date();
    return {
      orderId: `ORD${Math.floor(Math.random() * 1000000) + Date.now().toString().slice(-4)}`, // More unique ID
      date: now.toLocaleDateString('en-GB'), // Or your preferred locale
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), // Or your preferred locale
      paymentMethod: selectedPayment,
      total: total.toFixed(2) // Use the total received from params
    };
  };

 const handleConfirmOrder = async () => {
    if (selectedPayment !== 'cash') {
      Alert.alert("Payment Method", "Only Cash on Delivery is currently available.");
      return;
    }
    if (cartItems.length === 0) {
        Alert.alert("Empty Order", "Cannot place an order with no items.");
        return;
    }

    const details = generateOrderDetails();
    setOrderDetails(details);

    Animated.sequence([
        Animated.spring(scaleValue, { toValue: 1.2, friction: 3, tension: 40, useNativeDriver: true }),
        Animated.spring(scaleValue, { toValue: 1, friction: 4, tension: 30, useNativeDriver: true }),
    ]).start();

    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 700, // Slightly faster
      easing: Easing.elastic(1.5), // More pronounced elastic effect
      useNativeDriver: true
    }).start(() => {
        // Optionally clear cart after successful order
        AsyncStorage.removeItem('cartItems')
            .then(() => console.log("Cart cleared after order confirmation."))
            .catch(err => console.error("Error clearing cart:", err));
    });

    setOrderConfirmed(true);
  };


  const handleContinueShopping = () => {
    // Navigate to Home and reset the stack if applicable
    // For example, if Home is the root of a tab navigator or stack
    navigation.navigate('Home', { screen: 'HomeScreen', params: { orderJustPlaced: true } }); // Example: Passing a param back
    // Or, if you want to reset the entire navigation stack to Home:
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Home' }],
    // });
  };

  if (orderConfirmed && orderDetails) { // Ensure orderDetails is not null
    const rotate = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    const paymentMethodDisplay = {
        cash: 'Cash on Delivery',
        online: 'Online Payment',
        netbanking: 'Net Banking',
        qrcode: 'QR Code'
    };

    return (
      <ConfirmationContainer>
        <Animated.View style={{ transform: [{ scale: scaleValue }, { rotate }] }}>
          <FontAwesome name="check-circle" size={100} color="#28a745" />
        </Animated.View>
        <ConfirmationTitle>Order Confirmed!</ConfirmationTitle>
        <ConfirmationSubtitle>Thank you for your purchase. Your order details are below.</ConfirmationSubtitle>

        <OrderDetailsCard>
          <OrderDetailRow><OrderDetailLabel>Order ID:</OrderDetailLabel><OrderDetailValue>{orderDetails.orderId}</OrderDetailValue></OrderDetailRow>
          <OrderDetailRow><OrderDetailLabel>Date:</OrderDetailLabel><OrderDetailValue>{orderDetails.date}</OrderDetailValue></OrderDetailRow>
          <OrderDetailRow><OrderDetailLabel>Time:</OrderDetailLabel><OrderDetailValue>{orderDetails.time}</OrderDetailValue></OrderDetailRow>
          <OrderDetailRow>
            <OrderDetailLabel>Payment Method:</OrderDetailLabel>
            <OrderDetailValue>
              {paymentMethodDisplay[orderDetails.paymentMethod] || 'N/A'}
            </OrderDetailValue>
          </OrderDetailRow>
          <OrderDetailRow><OrderDetailLabel>Total Amount:</OrderDetailLabel><OrderDetailValue>₹{orderDetails.total}</OrderDetailValue></OrderDetailRow>
        </OrderDetailsCard>

        <ContinueButton onPress={handleContinueShopping}>
          <ContinueButtonText>Continue Shopping</ContinueButtonText>
        </ContinueButton>
      </ConfirmationContainer>
    );
  }

  return (
    <Container>
      <Title>Checkout</Title>
      <Subtitle>Review your order and complete your purchase</Subtitle>

      {cartItems.length > 0 ? (
        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          {cartItems.map((item, index) => (
            <SummaryRow key={item.id ? `${item.id}-${index}` : `item-${index}`}> {/* More robust key */}
              <SummaryText>{item.name} (x{item.quantity || 1})</SummaryText>
              <SummaryAmount>₹{(item.price * (item.quantity || 1)).toFixed(2)}</SummaryAmount>
            </SummaryRow>
          ))}
          <SummaryRow><SummaryText>Subtotal</SummaryText><SummaryAmount>₹{subtotal.toFixed(2)}</SummaryAmount></SummaryRow>
          <SummaryRow><SummaryText>Delivery Fee</SummaryText><SummaryAmount>₹{deliveryFee.toFixed(2)}</SummaryAmount></SummaryRow>
          <SummaryRow><SummaryText>Tax (5%)</SummaryText><SummaryAmount>₹{tax.toFixed(2)}</SummaryAmount></SummaryRow>
          <TotalRow><TotalText>Total</TotalText><TotalAmount>₹{total.toFixed(2)}</TotalAmount></TotalRow>
        </OrderSummary>
      ) : (
        <OrderSummary>
             <SummaryTitle>Order Summary</SummaryTitle>
             <Text style={{textAlign: 'center', color: '#7f8c8d', fontSize: 16, paddingVertical: 20}}>Your cart is empty. Add items to proceed.</Text>
        </OrderSummary>
      )}


      <PaymentSection>
        <SectionTitle>Select Payment Method</SectionTitle>

        <PaymentOption selected={selectedPayment === 'online'} onPress={() => setSelectedPayment('online')} disabled={true}>
          <Icon source={getImageSource('online')} disabled={true} />
          <PaymentText disabled={true} selected={selectedPayment === 'online'}>Online Payment (Coming Soon)</PaymentText>
        </PaymentOption>

        <PaymentOption selected={selectedPayment === 'netbanking'} onPress={() => setSelectedPayment('netbanking')} disabled={true}>
          <Icon source={getImageSource('netbanking')} disabled={true} />
          <PaymentText disabled={true} selected={selectedPayment === 'netbanking'}>Net Banking (Coming Soon)</PaymentText>
        </PaymentOption>

        <PaymentOption selected={selectedPayment === 'qrcode'} onPress={() => setSelectedPayment('qrcode')} disabled={true}>
          <Icon source={getImageSource('qrcode')} disabled={true} />
          <PaymentText disabled={true} selected={selectedPayment === 'qrcode'}>Scan QR Code (Coming Soon)</PaymentText>
        </PaymentOption>

        <PaymentOption selected={selectedPayment === 'cash'} onPress={() => setSelectedPayment('cash')}>
          <Icon source={getImageSource('cash')} />
          <PaymentText selected={selectedPayment === 'cash'}>Cash on Delivery</PaymentText>
        </PaymentOption>
      </PaymentSection>

      <Button onPress={handleConfirmOrder} disabled={selectedPayment !== 'cash' || cartItems.length === 0}>
        <ButtonText>Place Order</ButtonText>
      </Button>
    </Container>
  );
};

export default CheckoutScreen;