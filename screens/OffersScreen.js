import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

        <Image source={offer.image} style={styles.detailImage} />

        <View style={styles.detailContent}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailName}>{offer.name}</Text>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.offersContainer}>
          {filteredOffers.map(offer => (
            <TouchableOpacity
              key={offer.id}
              style={styles.offerCard}
              onPress={() => setSelectedOffer(offer)}
            >
              <Image source={offer.image} style={styles.offerImage} />

              <View style={styles.offerContent}>
                <Text style={styles.offerName}>{offer.name}</Text>

                <View style={styles.offerPriceContainer}>
                  <Text style={styles.offerPrice}>{offer.price}</Text>
                  <Text style={styles.offerOriginalPrice}>{offer.originalPrice}</Text>
                  <Text style={styles.offerDiscount}>{offer.discount}</Text>
                </View>

                <View style={styles.offerMeta}>
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.offerRating}>{offer.rating}</Text>
                  <Text style={styles.offerDelivery}>{offer.delivery}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    marginHorizontal: 5,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  activeFilterText: {
    color: '#fff',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  offersContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  offerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  offerContent: {
    padding: 10,
  },
  offerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  offerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  offerPrice: {
    fontSize: 16,
    color: '#28a745',
    marginRight: 10,
  },
  offerOriginalPrice: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  offerDiscount: {
    fontSize: 14,
    color: '#e60000',
    marginLeft: 10,
  },
  offerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  offerRating: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 5,
  },
  offerDelivery: {
    fontSize: 14,
    color: '#007bff',
    marginLeft: 10,
  },
  vegIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vegIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  vegText: {
    fontSize: 12,
    marginLeft: 5,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  detailContent: {
    padding: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  detailPrice: {
    fontSize: 18,
    color: '#28a745',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  discount: {
    fontSize: 14,
    color: '#e60000',
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 5,
  },
  prepTime: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  deliveryText: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 15,
    lineHeight: 20,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OffersScreen;