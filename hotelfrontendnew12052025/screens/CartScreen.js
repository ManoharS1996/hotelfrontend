import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f9f9f9;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 15px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

const SearchContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #e8e8e8;
  border-radius: 30px;
  padding: 6px 12px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  padding: 8px 12px;
  color: #333;
`;

const VoiceButton = styled.TouchableOpacity`
  margin-left: 8px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  margin: 16px 20px 8px;
  color: #222;
`;

const CartItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 12px;
  margin: 8px 15px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.06;
      shadow-radius: 4px;
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
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: #eee;
`;

const ItemDetails = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: space-between;
`;

const ItemName = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
`;

const ItemDesc = styled.Text`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
`;

const ItemPrice = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #e74c3c;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #f2f2f2;
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled.Text`
  font-size: 14px;
  margin: 0 10px;
  font-weight: 600;
`;

const RemoveButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-top: 8px;
  padding: 4px 10px;
  background-color: #fdeeee;
  border-radius: 5px;
`;

const RemoveText = styled.Text`
  font-size: 12px;
  color: #c0392b;
  font-weight: 500;
`;

const SummaryContainer = styled.View`
  background-color: #fff;
  padding: 18px;
  margin: 15px;
  border-radius: 10px;
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
  margin-bottom: 10px;
`;

const SummaryText = styled.Text`
  font-size: 14px;
  color: #555;
`;

const SummaryAmount = styled.Text`
  font-size: 14px;
  font-weight: 500;
`;

const TotalText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #222;
`;

const TotalAmount = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 15px;
  margin: 15px;
  border-radius: 10px;
  align-items: center;
`;

const CheckoutText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyCartContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const EmptyCartText = styled.Text`
  font-size: 17px;
  color: #888;
  margin-top: 15px;
`;

const ContinueTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin: 15px;
`;

const SuggestionCard = styled.View`
  width: 140px;
  background-color: #fff;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.04;
      shadow-radius: 3px;
      shadow-offset: 0px 2px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

const AddButton = styled.TouchableOpacity`
  background-color: #27ae60;
  margin-top: 6px;
  padding: 6px 12px;
  border-radius: 5px;
`;

const AddText = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: bold;
`;

const CartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  const continueItems = [
    {
      id: '2001',
      name: 'Organic Honey',
      description: 'Pure and natural sweetener',
      price: 180,
      image: { uri: 'https://5.imimg.com/data5/SELLER/Default/2024/11/465007441/KU/JM/BC/30736415/pure-honey-500x500.webp' },
    },
    {
      id: '2002',
      name: 'Dry Figs',
      description: 'Healthy and tasty dry fruits',
      price: 220,
      image: { uri: 'https://www.thakkarbros.com/wp-content/uploads/2021/08/IMG_9878-copy-1.jpg' },
    },
    {
      id: '2003',
      name: 'Herbal Green Tea',
      description: 'Boost metabolism and immunity',
      price: 150,
      image: { uri: 'https://m.media-amazon.com/images/I/61THlQMso1L._AC_UF1000,1000_QL80_.jpg' },
    },
  ];

  useEffect(() => {
    if (route.params?.cartItems) {
      setCartItems(route.params.cartItems);
    }
  }, [route.params?.cartItems]);

  const addToCart = async (item) => {
    const existingItem = cartItems.find(i => i.id === item.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cartItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('organic honey');
    }, 1200);
  };

  const filteredItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateSubtotal = () => filteredItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const delivery = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.05;
    return subtotal + delivery + tax;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </BackButton>
          <SearchContainer>
            <FontAwesome name="search" size={18} color="#999" />
            <SearchInput
              placeholder="Search in cart..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              placeholderTextColor="#999"
            />
            <VoiceButton onPress={handleVoiceSearch}>
              <MaterialIcons name={isListening ? 'mic' : 'mic-none'} size={22} color={isListening ? '#e74c3c' : '#999'} />
            </VoiceButton>
          </SearchContainer>
        </Header>

        <ScrollView>
          <Title>My Cart ({filteredItems.length})</Title>

          {filteredItems.length === 0 ? (
            <EmptyCartContainer>
              <MaterialIcons name="remove-shopping-cart" size={60} color="#ccc" />
              <EmptyCartText>Your cart is empty</EmptyCartText>
            </EmptyCartContainer>
          ) : (
            <>
              {filteredItems.map(item => (
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
                          <QuantityButton onPress={() => addToCart({ ...item, quantity: 1 })}>
                            <Text>+</Text>
                          </QuantityButton>
                          <QuantityText>{item.quantity}</QuantityText>
                          <QuantityButton onPress={() => {
                            const updatedItems = cartItems.map(i => 
                              i.id === item.id && i.quantity > 1 ? 
                              { ...i, quantity: i.quantity - 1 } : i
                            );
                            setCartItems(updatedItems);
                            AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
                          }}>
                            <Text>-</Text>
                          </QuantityButton>
                        </QuantityContainer>
                        <RemoveButton onPress={async () => {
                          const updatedItems = cartItems.filter(i => i.id !== item.id);
                          setCartItems(updatedItems);
                          await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
                        }}>
                          <RemoveText>Remove</RemoveText>
                        </RemoveButton>
                      </View>
                    </ItemDetails>
                  </ItemRow>
                </CartItemContainer>
              ))}

              <SummaryContainer>
                <SummaryRow><SummaryText>Subtotal</SummaryText><SummaryAmount>₹{calculateSubtotal().toFixed(2)}</SummaryAmount></SummaryRow>
                <SummaryRow><SummaryText>Delivery</SummaryText><SummaryAmount>₹{calculateSubtotal() > 500 ? 0 : 40}</SummaryAmount></SummaryRow>
                <SummaryRow><SummaryText>Tax (5%)</SummaryText><SummaryAmount>₹{(calculateSubtotal() * 0.05).toFixed(2)}</SummaryAmount></SummaryRow>
                <SummaryRow><TotalText>Total</TotalText><TotalAmount>₹{calculateTotal().toFixed(2)}</TotalAmount></SummaryRow>
              </SummaryContainer>

              <CheckoutButton onPress={() => navigation.navigate('Checkout')}>
                <CheckoutText>Proceed to Checkout</CheckoutText>
              </CheckoutButton>

              <ContinueTitle>Continue Shopping</ContinueTitle>
              <FlatList
                horizontal
                data={continueItems}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <SuggestionCard>
                    <ItemImage source={item.image} style={{ width: 60, height: 60 }} />
                    <ItemName style={{ fontSize: 14, textAlign: 'center' }}>{item.name}</ItemName>
                    <ItemPrice style={{ fontSize: 14 }}>₹{item.price}</ItemPrice>
                    <AddButton onPress={() => addToCart(item)}>
                      <AddText>Add</AddText>
                    </AddButton>
                  </SuggestionCard>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default CartScreen;