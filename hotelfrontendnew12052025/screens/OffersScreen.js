import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const OffersScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOffer, setSelectedOffer] = useState(null);

  const filters = ['All', '50% OFF', 'Free Delivery', 'Combo', 'Weekend Special'];

  const offers = [
    {
      id: 1,
      name: 'Organic snacks',
      price: 299,
      originalPrice: '₹599',
      discount: '50% OFF',
      image: require('../assets/snacks.jpg'),
      description: 'Classic delight with 100% real organic',
      delivery: 'Free delivery',
      rating: 4.5,
      prepTime: '20-30 mins',
      isVeg: true,
      category: 'normal'
    },
    {
      id: 2,
      name: 'Organic Sweets',
      price: 199,
      originalPrice: '₹299',
      discount: '33% OFF',
      image: require('../assets/sweets.jpg'),
      description: '100% organic sweets',
      delivery: 'Delivery: ₹30',
      rating: 4.2,
      prepTime: '15-25 mins',
      isVeg: false,
      category: 'normal'
    },
    {
      id: 3,
      name: 'Sweets',
      price: 249,
      originalPrice: '₹349',
      discount: '29% OFF',
      image: require('../assets/sweets1.jpg'),
      description: 'Creamy Alfredo sauce with penne pasta',
      delivery: 'Free delivery',
      rating: 4.3,
      prepTime: '25-35 mins',
      isVeg: true,
      category: 'normal'
    },
    {
      id: 4,
      name: 'Chocolate Shake',
      price: 129,
      originalPrice: '₹179',
      discount: '28% OFF',
      image: require('../assets/shake.jpg'),
      description: 'Rich chocolate flavor with whipped cream topping',
      delivery: 'Free delivery',
      rating: 4.7,
      prepTime: '5-10 mins',
      isVeg: true,
      category: 'normal'
    },
    {
      id: 5,
      name: 'Combo Meal',
      price: 499,
      originalPrice: '₹899',
      discount: '44% OFF',
      image: require('../assets/combo.jpg'),
      description: 'A meal with a main course, side dish, and dessert',
      delivery: 'Free delivery',
      rating: 4.8,
      prepTime: '40-50 mins',
      isVeg: true,
      category: 'combo'
    },
    {
      id: 6,
      name: 'Family Combo Pack',
      price: 799,
      originalPrice: '₹1499',
      discount: '47% OFF',
      image: require('../assets/combo2.jpg'),
      description: 'Delicious family meal with 3 dishes',
      delivery: 'Free delivery',
      rating: 4.6,
      prepTime: '30-40 mins',
      isVeg: false,
      category: 'combo'
    },
    {
      id: 7,
      name: 'Weekend Special Burger Set',
      price: 249,
      originalPrice: '₹399',
      discount: '38% OFF',
      image: require('../assets/burger.jpg'),
      description: 'Special weekend burger meal with fries and drink',
      delivery: 'Delivery: ₹30',
      rating: 4.3,
      prepTime: '10-15 mins',
      isVeg: false,
      category: 'weekend'
    },
    {
      id: 8,
      name: 'Weekend Special Pizza',
      price: 399,
      originalPrice: '₹599',
      discount: '33% OFF',
      image: require('../assets/pizza.jpg'),
      description: 'Large pizza with 2 toppings of your choice',
      delivery: 'Free delivery',
      rating: 4.7,
      prepTime: '20-30 mins',
      isVeg: true,
      category: 'weekend'
    },
  ];

  const filteredOffers = offers.filter((offer) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === '50% OFF' && offer.discount === '50% OFF') return true;
    if (activeFilter === 'Free Delivery' && offer.delivery === 'Free delivery') return true;
    if (activeFilter === 'Combo' && offer.category === 'combo') return true;
    if (activeFilter === 'Weekend Special' && offer.category === 'weekend') return true;
    return false;
  });

  const handleAddToCart = (offer) => {
    const cartItem = {
      id: offer.id,
      name: offer.name,
      description: offer.description,
      price: offer.price,
      image: offer.image,
      quantity: 1
    };
    
    navigation.navigate('Cart', { 
      addedItem: cartItem
    });
    
    setSelectedOffer(null);
    Alert.alert('Success', `${offer.name} added to cart!`);
  };

  const renderOfferDetails = (offer) => {
    return (
      <View style={styles.detailsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedOffer(null)}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.detailScrollContent}>
          <Image source={offer.image} style={styles.detailImage} />

          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailName} numberOfLines={2}>{offer.name}</Text>
              <View style={styles.vegIndicator}>
                <View
                  style={[styles.vegIcon, { backgroundColor: offer.isVeg ? '#4CAF50' : '#F44336' }]}
                />
                <Text style={styles.vegText}>
                  {offer.isVeg ? 'VEG' : 'NON-VEG'}
                </Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.detailPrice}>₹{offer.price}</Text>
              <Text style={styles.originalPrice}>{offer.originalPrice}</Text>
              <Text style={styles.discount}>{offer.discount}</Text>
            </View>

            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>{offer.rating}</Text>
              <Text style={styles.prepTime}>{offer.prepTime}</Text>
            </View>

            <Text style={styles.deliveryText}>{offer.delivery}</Text>

            <Text style={styles.description}>{offer.description}</Text>

            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(offer)}
            >
              <Text style={styles.addToCartText}>ADD TO CART</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderOfferList = () => {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Special Offers</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text 
                  style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}
                  numberOfLines={1}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView 
          style={styles.offersContainer} 
          contentContainerStyle={styles.offersContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredOffers.map(offer => (
            <TouchableOpacity
              key={offer.id}
              style={styles.offerCard}
              onPress={() => setSelectedOffer(offer)}
            >
              <Image source={offer.image} style={styles.offerImage} />

              <View style={styles.offerContent}>
                <Text style={styles.offerName} numberOfLines={1}>{offer.name}</Text>

                <View style={styles.offerPriceContainer}>
                  <Text style={styles.offerPrice}>₹{offer.price}</Text>
                  <Text style={styles.offerOriginalPrice}>{offer.originalPrice}</Text>
                  <Text style={styles.offerDiscount}>{offer.discount}</Text>
                </View>

                <View style={styles.offerMeta}>
                  <View style={styles.ratingWrapper}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.offerRating}>{offer.rating}</Text>
                  </View>
                  <Text style={styles.offerDelivery} numberOfLines={1}>{offer.delivery}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {selectedOffer ? renderOfferDetails(selectedOffer) : renderOfferList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterWrapper: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  filterContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  offersContainer: {
    flex: 1,
    marginTop: 20,
  },
  offersContent: {
    paddingBottom: 100,
  },
  offerCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  offerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  offerContent: {
    marginLeft: 15,
    justifyContent: 'space-between',
    flex: 1,
  },
  offerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  offerPriceContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  offerPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  offerOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#888',
    marginLeft: 10,
  },
  offerDiscount: {
    fontSize: 12,
    color: '#f44336',
    marginLeft: 10,
  },
  offerMeta: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerRating: {
    fontSize: 12,
    marginLeft: 5,
  },
  offerDelivery: {
    fontSize: 12,
    color: '#888',
  },
  detailsContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  detailScrollContent: {
    alignItems: 'center',
  },
  detailImage: {
    width: screenWidth - 40,
    height: screenWidth - 40,
    borderRadius: 20,
  },
  detailContent: {
    marginTop: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailName: {
    fontSize: 24,
    fontWeight: '600',
    maxWidth: screenWidth - 140,
  },
  vegIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  vegIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  vegText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceContainer: {
    marginBottom: 15,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#777',
    marginBottom: 5,
  },
  discount: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  prepTime: {
    marginLeft: 10,
    fontSize: 14,
    color: '#777',
  },
  deliveryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OffersScreen;