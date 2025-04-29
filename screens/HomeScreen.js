import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, PermissionsAndroid, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Geolocation from 'react-native-geolocation-service';

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Locating...');
  const [city, setCity] = useState('Locating...');
  const [area, setArea] = useState('Loading area...');
  const scrollViewRef = useRef(null);
  const currentOfferIndex = useRef(0);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) setUserEmail(email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
    fetchLocation();

    // Start blinking animation for NEW badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-scroll offers
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        currentOfferIndex.current = (currentOfferIndex.current + 1) % offers.length;
        scrollViewRef.current.scrollTo({
          x: currentOfferIndex.current * 210,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchLocation = async () => {
    try {
      const hasPermission = await checkLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Location error:', error);
      setLocation('Location unavailable');
      setCity('Unknown');
      setArea('Area not available');
    }
  };

  const checkLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      if (granted) {
        return true;
      }
      
      const requestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Food App Location Permission',
          message: 'Food App needs access to your location to show nearby restaurants.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      return requestResult === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = () => {
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
        console.log(error.code, error.message);
        setLocation('Unable to get location');
        setCity('Unknown');
        setArea('Area not available');
        
        // Fallback to default location (Vijayawada as example)
        setCity('Vijayawada');
        setArea('Benz Circle');
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
      // Note: In a real app, replace 'YOUR_GOOGLE_API_KEY' with your actual Google Maps API key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const address = data.results[0];
        const addressComponents = address.address_components;
        
        // Extract city
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality')
        );
        if (cityComponent) {
          setCity(cityComponent.long_name);
        } else {
          setCity('Unknown City');
        }
        
        // Extract area (sublocality)
        const areaComponent = addressComponents.find(component =>
          component.types.includes('sublocality') || 
          component.types.includes('neighborhood')
        );
        
        if (areaComponent) {
          setArea(areaComponent.long_name);
        } else {
          // If no sublocality, use route (street name) or fallback
          const routeComponent = addressComponents.find(component =>
            component.types.includes('route')
          );
          setArea(routeComponent ? routeComponent.long_name : cityComponent?.long_name || 'Central Area');
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to default location (Vijayawada as example)
      setCity('Vijayawada');
      setArea('Benz Circle');
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
    { id: 1, name: 'Millets', icon: 'local-dining', active: true },
    { id: 2, name: 'Sweets', icon: 'cake', active: true },
    { id: 3, name: 'Breakfast', icon: 'free-breakfast', active: true },
    { id: 4, name: 'Dessert', icon: 'icecream', active: true },
    { id: 5, name: 'Drinks', icon: 'local-drink', active: true },
  ];

  const popularItems = [
    { id: 1, name: 'Organic Millet', price: '₹299', rating: 4.5, image: require('../assets/millets.jpg') },
    { id: 2, name: 'Rava Dosa', price: '₹149', rating: 4.2, image: require('../assets/dosa.jpg') },
    { id: 3, name: 'Pancakes', price: '₹199', rating: 4.7, image: require('../assets/pancake.jpg') },
    { id: 4, name: 'Chocolate Shake', price: '₹129', rating: 4.3, image: require('../assets/shake.jpg') },
  ];

  const restaurantInfo = {
    name: "Restaurant Name",
    rating: 4.5,
    deliveryTime: "20-30 mins",
    minOrder: "₹100",
    address: "123 Main Street, Foodnagar",
    image: require('../assets/restaurant.jpg')
  };

  const blinkInterpolation = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3]
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-pin" size={24} color="#e74c3c" />
          <View>
            <Text style={styles.locationText}>{area}, {city}</Text>
            <Text style={styles.locationSubtext}>{location}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#333" />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search in ${area}, ${city}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Special Offers */}
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
            snapToInterval={210}
            decelerationRate="fast"
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

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={[styles.categoryCard, category.active && styles.activeCategory]}
                onPress={() => navigation.navigate('Category', { categoryName: category.name })}
              >
                <MaterialIcons name={category.icon} size={24} color={category.active ? '#fff' : '#e74c3c'} />
                <Text style={[styles.categoryText, category.active && styles.activeCategoryText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Restaurant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Restaurant in {area}</Text>
          <View style={styles.restaurantCard}>
            <Image source={restaurantInfo.image} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurantInfo.name}</Text>
              <Text style={styles.restaurantRating}>Rating: {restaurantInfo.rating} | Delivery: {restaurantInfo.deliveryTime}</Text>
              <Text style={styles.restaurantAddress}>{restaurantInfo.address}</Text>
            </View>
          </View>
        </View>

        {/* Popular Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Items in {area}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => navigation.navigate('ItemDetail', { item })}>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
  },
  offerCard: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e74c3c',
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  offerTextContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  categoryCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  activeCategory: {
    backgroundColor: '#3498db',
  },
  activeCategoryText: {
    color: '#fff',
  },
  categoryText: {
    marginTop: 10,
    color: '#333',
    fontSize: 14,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  restaurantInfo: {
    marginLeft: 15,
    justifyContent: 'center',
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantRating: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  itemCard: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: 150,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default HomeScreen;