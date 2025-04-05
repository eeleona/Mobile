import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { Divider, PaperProvider, Modal, Portal } from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config'; // Import your config for API address

const ManagePets = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null); // State to store selected pet details

  const showModal = (pet) => {
    setSelectedPet(pet); // Set the selected pet details
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedPet(null); // Clear the selected pet details
  };

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  const fetchPets = () => {
    axios
      .get(`${config.address}/api/pet/all`)
      .then((response) => {
        console.log(response.data.thePet);
        setPets(response.data.thePet);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => showModal(item)} style={styles.petCard}>
      <Image source={{ uri: `${config.address}${item.pet_img[0]}` }} style={styles.petImage} />
      <Text style={styles.petName}>{item.p_name}</Text>
      <Text style={styles.petDesc}>{item.p_gender} || {item.p_breed}</Text>
      
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <AppBar />

        <FlatList
          data={pets}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2} // Display 2 items per row
          key={'2-columns'} // Static key to ensure FlatList renders correctly
          contentContainerStyle={styles.listContainer}
        />
        <Portal>
  <Modal
    visible={visible}
    onDismiss={hideModal}
    contentContainerStyle={styles.modalContainer} // Apply the updated container style
  >
    {selectedPet && (
      <ScrollView style={{ maxHeight: '100%' }}> {/* Make the modal scrollable */}
        {/* Pet Image Container */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.petImageModal}
            source={{ uri: `${config.address}${selectedPet.pet_img[0]}` }}
            resizeMode="contain" // Ensures the image maintains its aspect ratio
          />
        </View>

        {/* Pet Details */}
        <Text style={styles.petNameModal}>{selectedPet.p_name}</Text>
        <Text style={styles.petDetails}>Type: {selectedPet.p_type}</Text>
        <Text style={styles.petDetails}>Gender: {selectedPet.p_gender}</Text>
        <Text style={styles.petDetails}>Age: {selectedPet.p_age}</Text>
        <Text style={styles.petDetails}>Breed: {selectedPet.p_breed}</Text>
        <Text style={styles.petDetails}>Weight: {selectedPet.p_weight} kg</Text>
        <Text style={styles.petDetails}>Medical History: {selectedPet.p_medicalhistory}</Text>
        <Text style={styles.petDetails}>Vaccines: {selectedPet.p_vaccines.join(', ')}</Text>
        <Text style={styles.petDetails}>Status: {selectedPet.p_status}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.petDetails}>Description: {selectedPet.p_description}</Text>
      </ScrollView>
    )}
  </Modal>
</Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  listContainer: {
    padding: 10,
    justifyContent: 'center', // Center items when there's only one
  },
  petCard: {
    width: '45%', // Fixed width for each card (adjust for spacing)
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  petImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  petDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 30, // Space outside the modal
  },
  imageContainer: {
    width: '100%',
    height: 300, // Fixed height for the image container
    borderRadius: 8,
  },
  petImageModal: {
    width: '100%',
    height: '100%', // Ensures the image fills the container
    borderRadius: 8,
  },
  petNameModal: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#333',
  },
  petDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  divider: {
    marginVertical: 10,
  },
    
});

export default ManagePets;