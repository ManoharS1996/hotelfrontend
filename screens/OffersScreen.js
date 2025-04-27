import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
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
    },
    {
      id: 5,
      name: 'Veg Combo',
      price: '₹399',
      originalPrice: '₹599',
      discount: '33% OFF',
      image: require('../assets/veg-combo.jpg'),
      description: '1 Pizza + 1 Pasta + 2 Garlic Bread + 2 Soft Drinks',
      delivery: 'Delivery: ₹40',
      rating: 4.6,
      prepTime: '30-40 mins',
      isVeg: true,
    },
    
  ];

  const filteredOffers = activeFilter === 'All' 
    ? offers 
    : offers.filter(offer => 
        offer.discount.includes(activeFilter) || 
        offer.delivery.includes(activeFilter)
      ).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

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
          
          <TouchableOpacity style={styles.addToCartButton}>
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
          <View style={{ width: 24 }} /> {/* For alignment */}
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
    paddingVertical: 5,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    marginHorizontal: 5,
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  offerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  offerContent: {
    padding: 10,
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  offerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  offerPrice: {
    fontSize: 14,
    color: '#28a745',
  },
  offerOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#aaa',
    marginLeft: 10,
  },
  offerDiscount: {
    fontSize: 12,
    color: '#e60000',
    marginLeft: 10,
  },
  offerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  offerRating: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 5,
  },
  offerDelivery: {
    fontSize: 12,
    color: '#555',
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
    marginRight: 5,
  },
  vegText: {
    fontSize: 12,
    color: '#333',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    paddingBottom: 20,
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  detailContent: {
    paddingTop: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  detailPrice: {
    fontSize: 18,
    color: '#28a745',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#aaa',
    marginLeft: 10,
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
    marginLeft: 5,
  },
  prepTime: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
  deliveryText: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OffersScreen;
