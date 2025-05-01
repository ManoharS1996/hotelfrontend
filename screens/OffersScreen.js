import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

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
    // ... other offer items
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

        <Image source={{uri:'https://www.bing.com/images/search?q=offers%20images&FORM=IQFRBA&id=4DA8792C195324FAEB614B6790A1D67871EAA80F'}} style={styles.detailImage} />

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
          contentContainerStyle={styles.filterContent}
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

        <ScrollView style={styles.offersContainer} contentContainerStyle={styles.offersContent}>
          {filteredOffers.map(offer => (
            <TouchableOpacity
              key={offer.id}
              style={styles.offerCard}
              onPress={() => setSelectedOffer(offer)}
            >
              <Image source={{uri:'https://static.vecteezy.com/system/resources/previews/000/267/866/original/vector-special-offer-creative-sale-banner-design.jpg'}} style={styles.offerImage} />

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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderColor:'red',
    borderWidth:2
  },
  filterContent: {
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    marginHorizontal: 5,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:'red',
    borderWidth:2
  },
  activeFilter: {
    backgroundColor: '#e74c3c',
  },
  activeFilterText: {
    color: '#fff',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  offersContainer: {
    flex: 1,
    borderColor:'red',
    borderWidth:2
  },
  offersContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    flexDirection: 'row',
  },
  offerImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  offerContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  offerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 5,
  },
  offerOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  offerDiscount: {
    fontSize: 14,
    color: '#27ae60',
  },
  offerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerRating: {
    marginLeft: 5,
    marginRight: 10,
    fontSize: 14,
    color: '#333',
  },
  offerDelivery: {
    fontSize: 14,
    color: '#333',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  detailImage: {
    width: screenWidth - 40,
    width:150,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  detailContent: {
    flex: 1,
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
  vegIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vegIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  vegText: {
    fontSize: 14,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discount: {
    fontSize: 16,
    color: '#27ae60',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  prepTime: {
    fontSize: 14,
    color: '#333',
  },
  deliveryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default OffersScreen;