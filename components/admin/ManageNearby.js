import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const NearbyServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeTab, setActiveTab] = useState('veterinary');
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null); // Reference to the MapView

  // Fetch all nearby services
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${config.address}/api/service/all`);
      setServices(response.data);
      filterServices('veterinary', response.data); // Default filter
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on type
  const filterServices = (type, allServices = services) => {
    const filtered = allServices.filter(service => service.ns_type === type);
    setFilteredServices(filtered);
    setActiveTab(type);
  };

  // Navigate to a specific service on the map
  const navigateToService = (latitude, longitude) => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005, // Zoom level (more zoomed in)
          longitudeDelta: 0.005,
        },
        1000 // Animation duration in milliseconds
      );
    } else {
      console.error('Invalid coordinates or mapRef is not set.');
    }
  };

  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      {/* Map View */}
      {/* <MapView
        ref={mapRef} // Attach the ref to the MapView
        style={styles.map}
        initialRegion={{
          latitude: 14.5378, // Latitude of Pasay City
          longitude: 120.9817, // Longitude of Pasay City
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {filteredServices
          .filter(
            (service) =>
              service.ns_latitude !== undefined &&
              service.ns_longitude !== undefined &&
              !isNaN(service.ns_latitude) &&
              !isNaN(service.ns_longitude)
          )
          .map((service) => (
            <Marker
              key={service._id}
              coordinate={{
                latitude: service.ns_latitude,
                longitude: service.ns_longitude,
              }}
              title={service.ns_name}
              description={service.ns_address}
            />
          ))}
      </MapView> */}
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'veterinary' && styles.activeTab]}
          onPress={() => filterServices('veterinary')}
        >
          <Text style={[styles.tabText, activeTab === 'veterinary' && styles.activeTabText]}>Veterinary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'neutering' && styles.activeTab]}
          onPress={() => filterServices('neutering')}
        >
          <Text style={[styles.tabText, activeTab === 'neutering' && styles.activeTabText]}>Neutering</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hotel' && styles.activeTab]}
          onPress={() => filterServices('hotel')}
        >
          <Text style={[styles.tabText, activeTab === 'hotel' && styles.activeTabText]}>Hotel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'grooming' && styles.activeTab]}
          onPress={() => filterServices('grooming')}
        >
          <Text style={[styles.tabText, activeTab === 'grooming' && styles.activeTabText]}>Grooming</Text>
        </TouchableOpacity>
      </View>

      

      {/* Service List */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToService(item.ns_latitude, item.ns_longitude)} // Navigate to the service
            >
              <View style={styles.serviceItem}>
                <Text style={styles.serviceName}>{item.ns_name}</Text>
                <Text style={styles.serviceAddress}>{item.ns_address}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No services available for this category.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#d2d2d5',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'black',
  },
  map: {
    height: 300,
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  serviceItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
  serviceAddress: {
    fontSize: 14,
    color: 'gray',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default NearbyServices;