import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, PermissionsAndroid, Animated, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Geolocation from 'react-native-geolocation-service';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Locating...');
  const [city, setCity] = useState('Locating...');
  const [area, setArea] = useState('Loading area...');
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollViewRef = useRef(null);
  const currentOfferIndex = useRef(0);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) setUserEmail(email);

        const savedCart = await AsyncStorage.getItem('cartItems');
        if (savedCart) setCartItems(JSON.parse(savedCart));
        
        await fetchLocation();
        
        Animated.loop(
          Animated.sequence([
            Animated.timing(blinkAnim, {
              toValue: 1,
              duration: 30000,
              useNativeDriver: true,
            }),
            Animated.timing(blinkAnim, {
              toValue: 0,
              duration: 30000,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        const interval = setInterval(() => {
          if (scrollViewRef.current) {
            currentOfferIndex.current = (currentOfferIndex.current + 1) % offers.length;
            scrollViewRef.current.scrollTo({
              x: currentOfferIndex.current * (screenWidth * 0.8),
              animated: true,
            });
          }
        }, 3000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Initialization error:', error);
        setDefaultLocation();
      }
    };

    init();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const savedCart = await AsyncStorage.getItem('cartItems');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    });
    return unsubscribe;
  }, [navigation]);

  const setDefaultLocation = () => {
    setCity('Vijayawada');
    setArea('Benz Circle');
    setLocation('Default Location');
  };

  const fetchLocation = async () => {
    try {
      const hasPermission = await checkLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      } else {
        setDefaultLocation();
      }
    } catch (error) {
      console.error('Location error:', error);
      setDefaultLocation();
    }
  };

  const checkLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted) return true;
      
      const requestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to show nearby restaurants.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      return requestResult === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const getCurrentLocation = () => {
    if (!Geolocation) {
      console.error('Geolocation service is not available');
      setDefaultLocation();
      return;
    }

    setLocation('Getting location...');
    setCity('Locating...');
    setArea('Finding your area...');

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.log('Location error:', error.code, error.message);
        setDefaultLocation();
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000,
        forceRequestLocation: true
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_API_KEY`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const address = data.results[0];
        const addressComponents = address.address_components;
        
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality')
        );
        setCity(cityComponent ? cityComponent.long_name : 'Unknown City');
        
        const areaComponent = addressComponents.find(component =>
          component.types.includes('sublocality') || 
          component.types.includes('neighborhood') ||
          component.types.includes('route')
        );
        
        if (areaComponent) {
          setArea(areaComponent.long_name);
        } else {
          const formattedAddress = address.formatted_address.split(',')[0];
          setArea(formattedAddress || cityComponent?.long_name || 'Nearby Area');
        }
      } else {
        setDefaultLocation();
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setDefaultLocation();
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addToCart = async (item) => {
    try {
      const cartItem = {
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: parseInt(item.price.replace('₹', '')),
        quantity: 1,
        image: item.image
      };

      const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id.toString());
      let updatedCart;

      if (existingItemIndex >= 0) {
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart = [...cartItems, cartItem];
      }
      
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      Alert.alert(
        'Added to Cart',
        `${item.name} has been added to your cart`,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
          { 
            text: 'View Cart', 
            onPress: () => navigation.navigate('Cart', { cartItems: updatedCart }) 
          }
        ]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const offers = [
    {
      id: 1,
      title: '50% OFF',
      subtitle: 'On first 3 orders',
      color: '#FF5733',
      isNew: true,
      image: require('../assets/offer1.jpg'),
    },
    {
      id: 2,
      title: 'FREE DELIVERY',
      subtitle: 'On orders above ₹200',
      color: '#33A1FF',
      isNew: true,
      image: require('../assets/offer2.jpg'),
    },
    {
      id: 3,
      title: 'COMBO MEAL',
      subtitle: 'Pizza + Drink @ ₹299',
      color: '#8E33FF',
      isNew: false,
      image: require('../assets/offer3.jpg'),
    },
    {
      id: 4,
      title: 'WEEKEND SPECIAL',
      subtitle: 'Buy 1 Get 1 Free',
      color: '#33FF57',
      isNew: true,
      image: require('../assets/offer4.jpg'),
    },
  ];

  const categories = [
    { id: 1, name: 'Millets', icon: 'local-dining' },
    { id: 2, name: 'Sweets', icon: 'cake' },
    { id: 3, name: 'Breakfast', icon: 'free-breakfast' },
    { id: 4, name: 'Dessert', icon: 'icecream' },
    { id: 5, name: 'Drinks', icon: 'local-drink' },
    { id: 6, name: 'Lunch', icon: 'restaurant' },
    { id: 7, name: 'Dinner', icon: 'dinner-dining' },
    { id: 8, name: 'Snacks', icon: 'fastfood' },
  ];

  const popularItems = [
    {
      id: 1,
      name: 'Organic Millet',
      price: '₹299',
      rating: 4.5,
      image: { uri: 'https://m.media-amazon.com/images/I/61aB4dzOGiL._AC_UF1000,1000_QL80_.jpg' },
      description: 'Healthy organic millet with mixed vegetables',
      category: 'Millets'
    },
    {
      id: 2,
      name: 'Rava Dosa',
      price: '₹149',
      rating: 4.2,
      image: { uri: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/05/rava-dosa-recipe.jpg' },
      description: 'Crispy South Indian rava dosa with chutney',
      category: 'Breakfast'
    },
    {
      id: 3,
      name: 'Pancakes',
      price: '₹199',
      rating: 4.7,
      image: { uri: 'https://www.marthastewart.com/thmb/Vgb9cQSlegZz5fcoSbkkqyHPmHY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/338185-basic-pancakes-09-00b18f8418fd4e52bb2050173d083d04.jpg' },
      description: 'Fluffy pancakes with maple syrup',
      category: 'Breakfast'
    },
    {
      id: 4,
      name: 'Chocolate Shake',
      price: '₹129',
      rating: 4.3,
      image: { uri: 'https://iambaker.net/wp-content/uploads/2024/06/Chocolate-Shake-4.jpg' },
      description: 'Creamy chocolate milkshake',
      category: 'Drinks'
    },
    {
      id: 5,
      name: 'Gulab Jamun',
      price: '₹99',
      rating: 4.8,
      image: { uri: 'https://theartisticcook.com/wp-content/uploads/2024/10/Gulab-Jamun-with-Milk-Powder.jpg' },
      description: 'Sweet fried milk balls in sugar syrup',
      category: 'Sweets'
    },
    {
      id: 7,
      name: 'Pasta',
      price: '₹179',
      rating: 4.4,
      image: { uri: 'https://www.nestleprofessional.in/sites/default/files/2021-08/Vegetable-Penne-Pasta.jpg' },
      description: 'Italian pasta in creamy white sauce',
      category: 'Dinner'
    },
    {
      id: 8,
      name: 'Samosa',
      price: '₹49',
      rating: 4.1,
      image: { uri: 'https://vegecravings.com/wp-content/uploads/2017/03/Aloo-Samosa-Recipe-Step-By-Step-Instructions.jpg' },
      description: 'Crispy fried pastry with spicy potato filling',
      category: 'Snacks'
    },
  ];

  const restaurantInfo = {
    name: "Restaurant Name",
    rating: 4.5,
    deliveryTime: "20-30 mins",
    minOrder: "100",
    address: "123 Main Street, Foodnagar",
    image: require('../assets/restaurant.jpg')
  };

  const blinkInterpolation = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3]
  });

  const filteredItems = popularItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-pin" size={24} color="#e74c3c" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationText} numberOfLines={1}>{area}, {city}</Text>
            <Text style={styles.locationSubtext} numberOfLines={1}>{location}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#333" />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart', { cartItems })}>
            <View style={styles.cartContainer}>
              <MaterialIcons name="shopping-cart" size={24} color="#333" style={styles.cartIcon} />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search in ${area}, ${city}`}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers in {area}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Offers')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={screenWidth * 0.8}
            decelerationRate="fast"
            contentContainerStyle={styles.offersScrollContent}
          >
            {offers.map((offer) => (
              <View key={offer.id} style={[styles.offerCard, { backgroundColor: offer.color }]}>
                {offer.isNew && (
                  <Animated.View style={[styles.newBadge, { opacity: blinkInterpolation }]}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </Animated.View>
                )}
                <Image source={offer.image} style={styles.offerImage} />
                <View style={styles.offerTextContainer}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryCard, 
                  selectedCategory === category.name && styles.activeCategory
                ]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <MaterialIcons 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.name ? '#fff' : '#e74c3c'} 
                />
                <Text style={[
                  styles.categoryText, 
                  selectedCategory === category.name && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Restaurant in {area}</Text>
          <TouchableOpacity 
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('Restaurant', { restaurant: restaurantInfo })}
          >
            <Image source={restaurantInfo.image} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurantInfo.name}</Text>
              <View style={styles.restaurantMeta}>
                <Text style={styles.restaurantRating}>★ {restaurantInfo.rating}</Text>
                <Text style={styles.restaurantDelivery}>⏱ {restaurantInfo.deliveryTime}</Text>
                <Text style={styles.restaurantMinOrder}>₹ {restaurantInfo.minOrder} min</Text>
              </View>
              <Text style={styles.restaurantAddress} numberOfLines={1}>{restaurantInfo.address}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? `${selectedCategory} Items` : 'Popular Items'} in {area}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Menu', { items: popularItems })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {filteredItems.length === 0 ? (
            <Text style={styles.noResultsText}>
              {searchQuery ? `No items found for "${searchQuery}"` : 'No items in this category'}
            </Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.itemsScrollContent}
            >
              {filteredItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.itemCard}
                  activeOpacity={0.8}
                >
                  <Image source={item.image} style={styles.itemImage} />
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.itemBottom}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <View style={styles.itemRating}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.itemRatingText}>{item.rating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartContainer: {
    position: 'relative',
    marginRight: 15,
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  offersScrollContent: {
    paddingHorizontal: 15,
  },
  offerCard: {
    width: screenWidth * 0.8,
    height: 150,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  offerTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  categoriesScrollContent: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeCategory: {
    backgroundColor: '#e74c3c',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  restaurantMeta: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  restaurantRating: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 15,
    fontWeight: 'bold',
  },
  restaurantDelivery: {
    fontSize: 14,
    color: '#555',
    marginRight: 15,
  },
  restaurantMinOrder: {
    fontSize: 14,
    color: '#555',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  itemsScrollContent: {
    paddingHorizontal: 15,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  itemCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRatingText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;