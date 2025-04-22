import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity,
  TextInput, 
  FlatList, 
  StyleSheet, 
  Text, 
  Image, 
  Dimensions, StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for the edit icon


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const UserNearby = () => {
  const [clinics, setClinics] = useState([]);
  const [activeButton, setActiveButton] = useState('veterinary');
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7724.397116509549!2d120.98557551626152!3d14.530632179242353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c98aa3066ca5%3A0xe376b7446d803df1!2sPasay%20City%20Animal%20Shelter%2FClinic!5e0!3m2!1sen!2sph!4v1743927407344!5m2!1sen!2sph");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${config.address}/api/service/all`);
        const fetchedServices = response.data;
        setServices(fetchedServices);
        handleFilter('veterinary', fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleFilter = (type, servicesList = services) => {
    setActiveButton(type);
    const filteredServices = servicesList.filter(service => service.ns_type === type);
    setClinics(filteredServices); 
  };

  const handleBoxClick = (ns_pin) => {
    setMapSrc(ns_pin);
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.ns_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.ns_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateMapHtml = (mapUrl) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <title>Map</title>
          <style>
            body, html { 
              margin: 0; 
              padding: 0; 
              height: 100%; 
              width: 100%; 
              overflow: hidden; 
            }
            iframe { 
              border: none; 
              width: 100%; 
              height: 100%; 
              min-height: 100%;
            }
          </style>
        </head>
        <body>
          <iframe 
            src="${mapUrl}" 
            allowfullscreen 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <AppBar />
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: generateMapHtml(mapSrc) }}
          style={styles.mapWebView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // Fix: Update the state with the input text
        />
        <MaterialIcons
          name="search"
          size={24}
          color="#ff69b4"
          style={styles.searchIcon}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.buttonContainer}>
        {['veterinary', 'neutering', 'hotel', 'grooming'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              activeButton === type 
                ? styles.activeFilterButton 
                : styles.inactiveFilterButton
            ]}
            onPress={() => handleFilter(type)}
          >
            <Text style={[
              styles.filterButtonText,
              activeButton === type 
                ? styles.activeFilterButtonText 
                : styles.inactiveFilterButtonText
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clinics List */}
      <FlatList
        data={filteredClinics}
        renderItem={({ item }) => (
          <View style={styles.clinicBox} key={item._id}>
            <View style={styles.clinicRow}>
              <Image
                source={{ 
                  uri: item.ns_image 
                    ? `${config.address}${item.ns_image}` 
                    : 'https://via.placeholder.com/60'
                }}
                style={styles.clinicImage}
              />
              <View style={styles.clinicDetails}>
                <Text style={styles.clinicName}>{item.ns_name}</Text>
                <Text style={styles.clinicAddress}>{item.ns_address}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => handleBoxClick(item.ns_pin )}
            >
              <Text style={styles.mapButtonText}>📍 View on Map</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    
  },
  mapContainer: {
    height: SCREEN_HEIGHT * 0.35,
    minHeight: 250,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 20,
  },
  mapWebView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  
  searchIcon: {
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
    marginHorizontal: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#ff69b4',
  },
  inactiveFilterButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6e6e6e',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  inactiveFilterButtonText: {
    color: '#6e6e6e',
  },
  clinicBox: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clinicImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  clinicDetails: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  mapButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default UserNearby;