import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const UserNearby = () => {
  const [clinics, setClinics] = useState([]);
  const [activeButton, setActiveButton] = useState('veterinary');
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?...");

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

  const handleBoxClick = (ns_pin) => setMapSrc(ns_pin);

  const filteredClinics = clinics.filter(clinic =>
    clinic.ns_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.ns_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateMapHtml = (mapUrl) => `
    <!DOCTYPE html>
    <html><head><style>
      body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style></head>
    <body>
      <iframe src="${mapUrl}" allowfullscreen loading="lazy"></iframe>
    </body></html>
  `;

  const animatedPress = new Animated.Value(1);

  const animateIn = () => Animated.spring(animatedPress, { toValue: 0.95, useNativeDriver: true }).start();
  const animateOut = () => Animated.spring(animatedPress, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  return (
    <View style={styles.container}>
      <AppBar />

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: generateMapHtml(mapSrc) }}
          style={styles.mapWebView}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search clinics or address..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />

      {/* Filter Buttons */}
      <View style={styles.buttonContainer}>
        {['veterinary', 'neutering', 'hotel', 'grooming'].map(type => (
          <TouchableOpacity
            key={type}
            activeOpacity={0.8}
            style={[
              styles.filterButton,
              activeButton === type
                ? styles.activeFilterButton
                : styles.inactiveFilterButton
            ]}
            onPress={() => handleFilter(type)}
            onPressIn={animateIn}
            onPressOut={animateOut}
          >
            <Animated.Text
              style={[
                styles.filterButtonText,
                activeButton === type
                  ? styles.activeFilterButtonText
                  : styles.inactiveFilterButtonText,
                { transform: [{ scale: animatedPress }] }
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Animated.Text>
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
                source={{ uri: item.ns_image ? `${config.address}${item.ns_image}` : 'https://via.placeholder.com/60' }}
                style={styles.clinicImage}
              />
              <View style={styles.clinicDetails}>
                <Text style={styles.clinicName}>{item.ns_name}</Text>
                <Text style={styles.clinicAddress}>{item.ns_address}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={() => handleBoxClick(item.ns_pin)}>
              <Text style={styles.mapButtonText}>📍 View on Map</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyState}>No results found. Try another type or keyword.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },

  mapContainer: {
    height: SCREEN_HEIGHT * 0.35,
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#ccc',
  },
  mapWebView: { flex: 1 },

  searchInput: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 15,
    backgroundColor: '#fff',
    marginBottom: 12,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#0B3D24',
  },
  inactiveFilterButton: {
    borderWidth: 1,
    borderColor: '#6e6e6e',
    backgroundColor: '#fff',
  },
  filterButtonText: { fontSize: 14, fontWeight: '600' },
  activeFilterButtonText: { color: '#fff' },
  inactiveFilterButtonText: { color: '#6e6e6e' },

  clinicBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
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
  clinicDetails: { flex: 1 },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
  },
  mapButton: {
    marginTop: 4,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0B3D24',
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: { paddingBottom: 24 },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 40,
  },
});

export default UserNearby;
