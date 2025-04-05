import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';

const PendingAdoptions = () => {
  const [pendingAdoptions, setPendingAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch pending adoptions
  const fetchPendingAdoptions = async () => {
    try {
      const response = await axios.get(`${config.address}/api/adoption/pending`);
      setPendingAdoptions(response.data); // Assuming the API returns an array of pending adoptions
    } catch (error) {
      console.error('Error fetching pending adoptions:', error);
      Alert.alert('Error', 'Failed to fetch pending adoptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdoptions();
  }, []);

  // Render each adoption item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.adoptionContainer}
      onPress={() => navigation.navigate('View Pending Adoption', { adoption: item })}
    >
      {/* Pet Image */}
      <Image
        style={styles.petImage}
        source={{ uri: `${config.address}${item.p_id?.pet_img?.[0]}` }}
      />
      {/* Adoption Info */}
      <View style={styles.adoptionInfo}>
        <Text style={styles.petName}>{item.p_id?.p_name || 'Unknown Pet'}</Text>
        <Text style={styles.adoptionDetails}>Adopter: {item.v_id?.v_fname} {item.v_id?.v_lname}</Text>
        <Text style={styles.adoptionDetails}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={pendingAdoptions}
            renderItem={renderItem}
            keyExtractor={(item) => item._id || Math.random().toString()} // Fallback for missing _id
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No pending adoptions found.</Text>}
          />
        )}
      </View>
    </PaperProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 10,
  },
  adoptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 8,
    elevation: 3,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  adoptionInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
  adoptionDetails: {
    fontSize: 14,
    color: 'gray',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default PendingAdoptions;