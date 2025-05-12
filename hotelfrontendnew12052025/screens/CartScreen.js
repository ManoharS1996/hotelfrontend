import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Platform } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 15px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 25px;
  padding: 8px 15px;
  flex: 1;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
  color: #333;
`;

const VoiceButton = styled.TouchableOpacity`
  margin-left: 10px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin: 20px 15px 10px;
  color: #333;
`;

const CartItemContainer = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  margin: 8px 15px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.05;
      shadow-radius: 5px;
      shadow-offset: 0px 2px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

const ItemRow = styled.View`
  flex-direction: row;
`;

const ItemImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 8px;
`;

const ItemDetails = styled.View`
  flex: 1;
  margin-left: 15px;
  justify-content: space-between;
`;

const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ItemDesc = styled.Text`
  font-size: 13px;
  color: #777;
  margin-bottom: 8px;
`;

const ItemPrice = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #f0f0f0;
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled.Text`
  font-size: 16px;
  margin: 0 12px;
  font-weight: 500;
`;

const RemoveButton = styled.TouchableOpacity`
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #f8e0e0;
  margin-top: 8px;
`;

const RemoveText = styled.Text`
  color: #e74c3c;
  font-size: 13px;
  font-weight: 500;
`;

const SummaryContainer = styled.View`
  background-color: #fff;
  padding: 20px;
  margin: 15px;
  border-radius: 12px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.05;
      shadow-radius: 5px;
      shadow-offset: 0px 2px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SummaryText = styled.Text`
  font-size: 15px;
  color: #555;
`;

const SummaryAmount = styled.Text`
  font-size: 15px;
  font-weight: 500;
`;

const TotalText = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #333;
`;

const TotalAmount = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #e74c3c;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 16px;
  border-radius: 10px;
  margin: 15px;
  align-items: center;
  ${Platform.select({
    ios: `
      shadow-color: #e74c3c;
      shadow-opacity: 0.3;
      shadow-radius: 5px;
      shadow-offset: 0px 2px;
    `,
    android: `
      elevation: 3;
    `,
  })}
`;

const CheckoutText = styled.Text`
  color: #fff;
  font-size: 17px;
  font-weight: 600;
`;

const EmptyCartContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyCartText = styled.Text`
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 20px;
`;

const CartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (route.params?.addedItem) {
      const newItem = {
        id: route.params.addedItem.id,
        name: route.params.addedItem.name,
        description: route.params.addedItem.description,
        price: parseInt(route.params.addedItem.price.replace('₹', '')),
        quantity: 1,
        image: route.params.addedItem.image,
      };
      setCartItems(prevItems => {
        const existing = prevItems.find(i => i.id === newItem.id);
        if (existing) {
          return prevItems.map(item =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevItems, newItem];
      });
    }
  }, [route.params?.addedItem]);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('organic millet');
    }, 1500);
  };

  const increaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const delivery = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.05;
    return subtotal + delivery + tax;
  };

  const handleCheckout = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.05;
    const total = calculateTotal();

    navigation.navigate('Checkout', {
      cartItems,
      subtotal,
      deliveryFee,
      tax,
      total
    });
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </BackButton>
        <SearchContainer>
          <FontAwesome name="search" size={18} color="#999" />
          <SearchInput
            placeholder="Search items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <VoiceButton onPress={handleVoiceSearch}>
            <MaterialIcons
              name={isListening ? 'mic' : 'mic-none'}
              size={24}
              color={isListening ? '#e74c3c' : '#999'}
            />
          </VoiceButton>
        </SearchContainer>
      </Header>

      <ScrollView>
        <Title>My Cart ({cartItems.length})</Title>

        {cartItems.length === 0 ? (
          <EmptyCartContainer>
            <MaterialIcons name="remove-shopping-cart" size={60} color="#ccc" />
            <EmptyCartText>Your cart is empty</EmptyCartText>
          </EmptyCartContainer>
        ) : (
          <>
            {cartItems.map(item => (
              <CartItemContainer key={item.id}>
                <ItemRow>
                  <ItemImage source={item.image} />
                  <ItemDetails>
                    <View>
                      <ItemName>{item.name}</ItemName>
                      <ItemDesc>{item.description}</ItemDesc>
                      <ItemPrice>₹{item.price * item.quantity}</ItemPrice>
                    </View>
                    <View>
                      <QuantityContainer>
                        <QuantityButton onPress={() => decreaseQuantity(item.id)}>
                          <Text>-</Text>
                        </QuantityButton>
                        <QuantityText>{item.quantity}</QuantityText>
                        <QuantityButton onPress={() => increaseQuantity(item.id)}>
                          <Text>+</Text>
                        </QuantityButton>
                      </QuantityContainer>
                      <RemoveButton onPress={() => removeItem(item.id)}>
                        <RemoveText>Remove</RemoveText>
                      </RemoveButton>
                    </View>
                  </ItemDetails>
                </ItemRow>
              </CartItemContainer>
            ))}
            <SummaryContainer>
              <SummaryRow>
                <SummaryText>Subtotal</SummaryText>
                <SummaryAmount>₹{calculateSubtotal().toFixed(2)}</SummaryAmount>
              </SummaryRow>
              <SummaryRow>
                <SummaryText>Delivery</SummaryText>
                <SummaryAmount>₹{calculateSubtotal() > 500 ? 0 : 40}</SummaryAmount>
              </SummaryRow>
              <SummaryRow>
                <SummaryText>Tax (5%)</SummaryText>
                <SummaryAmount>₹{(calculateSubtotal() * 0.05).toFixed(2)}</SummaryAmount>
              </SummaryRow>
              <SummaryRow>
                <TotalText>Total</TotalText>
                <TotalAmount>₹{calculateTotal().toFixed(2)}</TotalAmount>
              </SummaryRow>
            </SummaryContainer>
            <CheckoutButton onPress={handleCheckout}>
              <CheckoutText>Proceed to Checkout</CheckoutText>
            </CheckoutButton>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default CartScreen;