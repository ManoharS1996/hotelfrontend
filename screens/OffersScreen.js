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
      price: '₹299',
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
      price: '₹199',
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
    // ... (rest of your offer items remain the same)
    {
      id: 3,
      name: 'Sweets',
      price: '₹249',
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
      price: '₹129',
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
      price: '₹499',
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
      price: '₹799',
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
      price: '₹249',
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
      price: '₹399',
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
    navigation.navigate('Cart', { 
      addedItem: {
        id: offer.id,
        name: offer.name,
        description: offer.description,
        price: offer.price,
        image: offer.image
      }
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
              <Text style={styles.detailPrice}>{offer.price}</Text>
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
                  <Text style={styles.offerPrice}>{offer.price}</Text>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  filterWrapper: {
    height: 60,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  filterButton: {
    height: 40,
    marginRight: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  offersContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  offersContent: {
    paddingBottom: 20,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  offerContent: {
    padding: 15,
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  offerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 8,
  },
  offerOriginalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#777',
    marginRight: 8,
  },
  offerDiscount: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '500',
  },
  offerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerRating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  offerDelivery: {
    fontSize: 13,
    color: '#777',
    maxWidth: '50%',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailScrollContent: {
    paddingBottom: 30,
  },
  backButton: {
    padding: 15,
    paddingBottom: 10,
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailContent: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  vegIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  vegIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  vegText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#777',
    marginRight: 10,
  },
  discount: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#333',
  },
  prepTime: {
    fontSize: 14,
    color: '#777',
    marginLeft: 15,
  },
  deliveryText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 15,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 25,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OffersScreen;