import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { 
  TextInput, 
  Button, 
  Divider, 
  PaperProvider, 
  Modal, 
  Portal, 
  Chip,
  IconButton 
} from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ManagePets = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('All');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade-in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    fetchPets();
  }, []);

  useEffect(() => {
    handleFilterSearch();
  }, [pets, searchText, filter]);

  const showModal = (pet) => {
    setSelectedPet(pet);
    setVisible(true);
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setSelectedPet(null);
      fadeAnim.setValue(1);
    });
  };

  const handleFilterSearch = () => {
    const lowerText = searchText.toLowerCase();
    const filtered = pets.filter(pet => {
      const matchesSearch =
        pet.p_name.toLowerCase().includes(lowerText) ||
        pet.p_breed.toLowerCase().includes(lowerText) ||
        pet.p_type.toLowerCase().includes(lowerText);

      const matchesFilter = filter === 'All' || pet.p_type.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    setFilteredPets(filtered);
  };

  const fetchPets = () => {
    axios
      .get(`${config.address}/api/pet/all`)
      .then((response) => {
        setPets(response.data.thePet);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => showModal(item)} style={styles.petCard}>
        <LinearGradient
          colors={['#FF66C4', '#FF8E53']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Image 
          source={{ uri: `${config.address}${item.pet_img[0]}` }} 
          style={styles.petImage} 
        />
        <View style={styles.petInfoContainer}>
          <Text style={styles.petName}>{item.p_name}</Text>
          <View style={styles.chipContainer}>
            <Chip icon="paw" style={styles.chip}>{item.p_type}</Chip>
            <Chip icon="gender-male-female" style={styles.chip}>{item.p_gender}</Chip>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <AppBar />

        <View style={styles.searchContainer}>
          <TextInput
            label="Search pets..."
            value={searchText}
            onChangeText={setSearchText}
            mode="outlined"
            style={styles.searchInput}
            left={<TextInput.Icon name="magnify" />}
            theme={{ colors: { primary: '#FF66C4' } }}
          />

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((type) => (
              <Button
                key={type}
                mode={filter === type ? 'contained' : 'outlined'}
                onPress={() => setFilter(type)}
                style={[
                  styles.filterButton,
                  filter === type && styles.activeFilter
                ]}
                labelStyle={styles.filterLabel}
              >
                {type}
              </Button>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredPets}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pets found</Text>
              <Button 
                mode="contained" 
                onPress={fetchPets}
                style={styles.refreshButton}
                labelStyle={styles.refreshButtonLabel}
              >
                Refresh
              </Button>
            </View>
          }
        />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {selectedPet && (
                <ScrollView style={styles.modalScrollView}>
                  <IconButton
                    icon="close"
                    style={styles.closeButton}
                    onPress={hideModal}
                  />
                  
                  <View style={styles.imageModalContainer}>
                    <Image
                      style={styles.petImageModal}
                      source={{ uri: `${config.address}${selectedPet.pet_img[0]}` }}
                    />
                  </View>

                  <View style={styles.modalContent}>
                    <Text style={styles.petNameModal}>{selectedPet.p_name}</Text>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Type</Text>
                        <Text style={styles.detailValue}>{selectedPet.p_type}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Gender</Text>
                        <Text style={styles.detailValue}>{selectedPet.p_gender}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Age</Text>
                        <Text style={styles.detailValue}>{selectedPet.p_age}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Weight</Text>
                        <Text style={styles.detailValue}>{selectedPet.p_weight} kg</Text>
                      </View>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Breed</Text>
                      <Text style={styles.sectionContent}>{selectedPet.p_breed}</Text>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Vaccines</Text>
                      <View style={styles.vaccineContainer}>
                        {selectedPet.p_vaccines.map((vaccine, index) => (
                          <Chip key={index} style={styles.vaccineChip}>{vaccine}</Chip>
                        ))}
                      </View>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Medical History</Text>
                      <Text style={styles.sectionContent}>{selectedPet.p_medicalhistory}</Text>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Status</Text>
                      <Chip 
                        icon={selectedPet.p_status === 'Available' ? 'check' : 'clock'} 
                        style={[
                          styles.statusChip,
                          selectedPet.p_status === 'Available' ? styles.availableChip : styles.pendingChip
                        ]}
                      >
                        {selectedPet.p_status}
                      </Chip>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.sectionContent}>{selectedPet.p_description}</Text>
                    </View>
                  </View>
                </ScrollView>
              )}
            </Animated.View>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    marginRight: 8,
    borderRadius: 20,
    borderColor: '#FF66C4',
  },
  activeFilter: {
    backgroundColor: '#FF66C4',
  },
  filterLabel: {
    color: '#FF66C4',
  },
  listContainer: {
    padding: 10,
  },
  petCard: {
    width: width / 2 - 20,
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  petImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  petInfoContainer: {
    padding: 12,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#EDF2F7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#FF66C4',
    borderRadius: 8,
  },
  refreshButtonLabel: {
    color: 'white',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollView: {
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  imageModalContainer: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  petImageModal: {
    width: '100%',
    height: '100%',
  },
  modalContent: {
    padding: 20,
  },
  petNameModal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
  },
  vaccineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vaccineChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#EDF2F7',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  availableChip: {
    backgroundColor: '#C6F6D5',
  },
  pendingChip: {
    backgroundColor: '#FEEBC8',
  },
});

export default ManagePets;