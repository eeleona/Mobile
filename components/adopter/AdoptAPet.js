import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Dimensions,
  RefreshControl,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import { 
  TextInput, 
  Button, 
  Divider, 
  PaperProvider, 
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AdoptAPet = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchPets = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${config.address}/api/pet/all`);
    const sortedPets = response.data.thePet.sort((a, b) =>
      a.p_name.localeCompare(b.p_name)
    );
    setPets(sortedPets);
    setFilteredPets(sortedPets);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    handleFilterSearch();
  }, [pets, searchText, filter]);

  const handleFilterSearch = () => {
    const lowerText = searchText.toLowerCase();
    const filtered = pets.filter(pet => {
      const matchesSearch =
        pet.p_name.toLowerCase().includes(lowerText) ||
        pet.p_breed.toLowerCase().includes(lowerText) ||
        pet.p_type.toLowerCase().includes(lowerText) ||
        pet.p_gender.toLowerCase().includes(lowerText);

      const matchesFilter = filter === 'All' || pet.p_type.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    setFilteredPets(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
  }, [fetchPets]);

  const navigateToPetDetails = (pet) => {
    navigation.navigate('Adopt The Pet', { pet });
  };

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => navigateToPetDetails(item)} style={styles.petCard}>
        <ImageBackground 
          source={{ uri: `${config.address}${item.pet_img[0]}` }} 
          style={styles.petImage}
          imageStyle={styles.petImageStyle}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          >
            <View style={styles.petBadge}>
              <MaterialIcons 
                name={item.p_type === 'Dog' ? 'pets' : 'cat'} 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.petTypeText}>{item.p_type}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.petInfoContainer}>
          <Text style={styles.petName}>{item.p_name}</Text>
          <View style={styles.petDetails}>
            <Text style={styles.petDetailText}>{item.p_breed}</Text>
            <View style={styles.genderContainer}>
              <MaterialIcons 
                name={item.p_gender === 'Male' ? 'male' : 'female'} 
                size={16} 
                color={item.p_gender === 'Male' ? '#4FD1C5' : '#F687B3'} 
              />
              <Text style={styles.petDetailText}>{item.p_gender}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading && !refreshing) {
    return (
      <PaperProvider>
        <ImageBackground 
          source={require('../../assets/Images/pawbg.png')}
          style={styles.loadingContainer}
          resizeMode="cover"
        >
          <ActivityIndicator animating={true} size="large" color="#FF66C4" />
        </ImageBackground>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <ImageBackground 
        source={require('../../assets/Images/pawbg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        
          <AppBar title="Manage Pets" onBackPress={() => navigation.goBack()} />

          <View style={styles.searchContainer}>
            <TextInput
              label="Search by name, type, or gender..."
              value={searchText}
              onChangeText={setSearchText}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon name="magnify" color="#FF66C4" />}
              theme={{ 
                colors: { 
                  primary: '#FF66C4',
                  background: '#FFFFFF',
                  text: '#333333',
                  placeholder: '#A0AEC0'
                } 
              }}
              outlineColor="#E2E8F0"
              activeOutlineColor="#FF66C4"
            />

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {['All', 'Dog', 'Cat'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFilter(type)}
                  style={[
                    styles.filterButton,
                    filter === type && styles.activeFilterButton
                  ]}
                >
                  <Text style={[
                    styles.filterText,
                    filter === type && styles.activeFilterText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredPets}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FF66C4']}
                tintColor="#FF66C4"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="pets" size={60} color="#CBD5E0" />
                <Text style={styles.emptyText}>No pets found</Text>
                <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={fetchPets}
                >
                  <Text style={styles.refreshButtonText}>Refresh Pets</Text>
                </TouchableOpacity>
              </View>
            }
          />
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    height: 50,
  },
  filterContainer: {
    width: '100%',
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF66C4',
    marginRight: 8,
    backgroundColor: 'white',
  },
  activeFilterButton: {
    backgroundColor: '#FF66C4',
    borderColor: '#FF66C4',
  },
  filterText: {
    color: '#FF66C4',
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  petCard: {
    width: width / 2 - 16,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#faedf2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  petImage: {
    width: '100%',
    height: 160,
  },
  petImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  petTypeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  petInfoContainer: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  petDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petDetailText: {
    fontSize: 13,
    color: '#718096',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#4A5568',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 4,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#FF66C4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AdoptAPet;