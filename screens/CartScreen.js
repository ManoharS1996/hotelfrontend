import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, Text } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f8f8f8;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  ${Platform.OS === 'android' ? 'elevation: 3;' : `
    shadow-color: #000;
    shadow-opacity: 0.2;
    shadow-radius: 2px;
    shadow-offset: 0px 2px;
  `}
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 15px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 25px;
  padding-left: 15px;
  padding-right: 15px;
  flex: 1;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
`;

const VoiceButton = styled.TouchableOpacity`
  margin-left: 10px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-left: 20px;
  margin-top: 10px;
`;

const CartItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  ${Platform.OS === 'android' ? 'elevation: 2;' : `
    shadow-color: #000;
    shadow-opacity: 0.2;
    shadow-radius: 2px;
    shadow-offset: 0px 2px;
  `}
`;

const ItemRow = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

const ItemImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 10px;
`;

const ItemDetails = styled.View`
  flex: 1;
  margin-left: 15px;
  justify-content: center;
`;

const ItemName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ItemDesc = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const ItemPrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
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
  margin-left: 15px;
  margin-right: 15px;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const RemoveText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const SummaryContainer = styled.View`
  background-color: #fff;
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SummaryText = styled.Text`
  font-size: 16px;
  color: #555;
`;

const SummaryAmount = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const TotalAmount = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 15px;
  border-radius: 10px;
  margin: 15px;
  align-items: center;
`;

const CheckoutText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const MoreItemsContainer = styled.View`
  margin-top: 10px;
`;

const MoreItemsTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-left: 15px;
  margin-bottom: 10px;
`;

const MoreItemCard = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin: 5px 10px;
  flex-direction: row;
  ${Platform.OS === 'android' ? 'elevation: 1;' : `
    shadow-color: #000;
    shadow-opacity: 0.2;
    shadow-radius: 2px;
    shadow-offset: 0px 2px;
  `}
`;

const MoreItemImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 10px;
`;

const MoreItemDetails = styled.View`
  flex: 1;
  margin-left: 15px;
  justify-content: center;
`;

const MoreItemName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
`;

const MoreItemPrice = styled.Text`
  font-size: 14px;
  color: #e74c3c;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

const CartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [moreItems, setMoreItems] = useState([
    {
      id: 3,
      name: 'Pancakes',
      description: 'Fluffy pancakes with maple syrup',
      price: 199,
      image: require('../assets/pancake.jpg')
    },
    {
      id: 4,
      name: 'Chocolate Shake',
      description: 'Rich chocolate milkshake with whipped cream',
      price: 129,
      image: require('../assets/shake.jpg')
    },
    {
      id: 5,
      name: 'Veg Burger',
      description: 'Delicious veg burger with fresh veggies',
      price: 99,
      image: require('../assets/burger.jpg')
    }
  ]);

  useEffect(() => {
    if (route.params?.addedItem) {
      const newItem = {
        id: route.params.addedItem.id,
        name: route.params.addedItem.name,
        description: route.params.addedItem.description,
        price: parseInt(route.params.addedItem.price.replace('₹', '')),
        quantity: 1,
        image: route.params.addedItem.image
      };
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newItem.id);
        if (existingItem) {
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
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    const newItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: 1,
      image: item.image
    };
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, newItem];
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.05;
    return subtotal + deliveryFee + tax;
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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <VoiceButton onPress={handleVoiceSearch}>
            <MaterialIcons
              name={isListening ? "mic" : "mic-none"}
              size={24}
              color={isListening ? "#e74c3c" : "#999"}
            />
          </VoiceButton>
        </SearchContainer>
      </Header>

      <ScrollView>
        {cartItems.map((item) => (
          <CartItemContainer key={item.id}>
            <ItemRow>
              <ItemImage source={item.image} />
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemDesc>{item.description}</ItemDesc>
                <ItemPrice>₹{item.price * item.quantity}</ItemPrice>
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
              </ItemDetails>
            </ItemRow>
          </CartItemContainer>
        ))}

        <SummaryContainer>
          <SummaryRow>
            <SummaryText>Subtotal</SummaryText>
            <SummaryAmount>₹{calculateSubtotal()}</SummaryAmount>
          </SummaryRow>
          <SummaryRow>
            <SummaryText>Delivery Fee</SummaryText>
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

        <CheckoutButton onPress={() => alert('Proceed to checkout')}>
          <CheckoutText>Checkout</CheckoutText>
        </CheckoutButton>

        <MoreItemsContainer>
          <MoreItemsTitle>More items</MoreItemsTitle>
          {moreItems.map(item => (
            <MoreItemCard key={item.id}>
              <MoreItemImage source={item.image} />
              <MoreItemDetails>
                <MoreItemName>{item.name}</MoreItemName>
                <MoreItemPrice>₹{item.price}</MoreItemPrice>
              </MoreItemDetails>
              <AddButton onPress={() => addToCart(item)}>
                <Text style={{ color: '#fff' }}>+</Text>
              </AddButton>
            </MoreItemCard>
          ))}
        </MoreItemsContainer>
      </ScrollView>
    </Container>
  );
};

export default CartScreen;
