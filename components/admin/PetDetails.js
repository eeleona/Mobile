import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const PetDetails = ({ route }) => {
  const { petid } = route.params || {}; // Get pet ID from the navigation params
  const [petDetails, setPetDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pet details using axios
  useEffect(() => {
    const fetchPetDetails = () => {
      axios
        .get(`http://localhost:8000/api/pet/${petid}`)
        .then((response) => {
          setPetDetails(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          setLoading(false);
        });
    };

    fetchPetDetails();
  }, [petid]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading pet details.</Text>;
  }

  return (
    <View style={styles.container}>
      {petDetails && (
        <>
          <Image style={styles.petImage} source={{ uri: petDetails.petImage }} />
          <Text style={styles.petName}>{petDetails.p_name}</Text>
          <Text style={styles.petType}>{petDetails.p_type}</Text>
          <Text style={styles.petDescription}>{petDetails.description}</Text>
          {/* Add more pet details here as needed */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  petName: {
    fontSize: 22,
    //fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  petType: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  petDescription: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default PetDetails;
