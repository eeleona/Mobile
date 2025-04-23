import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, TextInput, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import { PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

const ActiveAdoptions = () => {
  const [activeAdoptions, setActiveAdoptions] = useState([]);
  const [filteredAdoptions, setFilteredAdoptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchActiveAdoptions = async () => {
    try {
      const response = await axios.get(`${config.address}/api/adoption/active`);
      setActiveAdoptions(response.data);
      setFilteredAdoptions(response.data);
    } catch (error) {
      console.error('Error fetching active adoptions:', error);
      Alert.alert('Error', 'Failed to fetch active adoptions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActiveAdoptions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveAdoptions();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const query = text.toLowerCase();
    const filtered = activeAdoptions.filter(adoption => {
      const petName = adoption.p_id?.p_name?.toLowerCase() || '';
      const adopterName = `${adoption.v_id?.v_fname || ''} ${adoption.v_id?.v_lname || ''}`.toLowerCase();
      return petName.includes(query) || adopterName.includes(query);
    });
    setFilteredAdoptions(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, styles.activeBorder]}
      onPress={() => navigation.navigate('View Active Adoption', { adoption: item })}
    >
      <Image
        style={styles.petImage}
        source={{ uri: `${config.address}${item.p_id?.pet_img?.[0]}` }}
        defaultSource={require('../../assets/Images/pawicon2.png')}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.petName}>{item.p_id?.p_name || 'Unknown Pet'}</Text>
        <Text style={styles.adopterName}>
          Adopter: {item.v_id?.v_fname} {item.v_id?.v_lname}
        </Text>
      </View>
      <View style={styles.activeBadge}>
        <Text style={styles.activeText}>ACTIVE</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#ff69b4"
            style={styles.loadingIndicator}
          />
          <Text style={styles.loadingText}>Loading active adoptions...</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <MaterialIcons
            name="search"
            size={24}
            color="#ff69b4"
            style={styles.searchIcon}
          />
        </View>

        <FlatList
          data={filteredAdoptions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../assets/Images/pawicon2.png')}
                style={styles.pawIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>No Active Adoptions</Text>
            </View>
          }
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 15,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activeBorder: {
    borderLeftWidth: 6,
    borderLeftColor: '#8BC34A',
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#8BC34A',
  },
  infoContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginBottom: 8,
  },
  adopterName: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  activeBadge: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  pawIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ActiveAdoptions;