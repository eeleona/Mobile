import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const ManagePets = ({ navigation }) => {
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
      setPets(response.data.thePet);
      setFilteredPets(response.data.thePet);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to fetch pets');
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
    const filtered = pets.filter((pet) => {
      const matchesSearch =
        pet.p_name.toLowerCase().includes(lowerText) ||
        pet.p_breed.toLowerCase().includes(lowerText) ||
        pet.p_type.toLowerCase().includes(lowerText);

      const matchesFilter =
        filter === 'All' ||
        pet.p_type.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    setFilteredPets(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
  }, [fetchPets]);

  const navigateToPetDetails = (pet) => {
    navigation.navigate('View Pet Details', { pet });
  };

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        onPress={() => navigateToPetDetails(item)}
        style={styles.petCard}
      >
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
                name={item.p_type === 'Dog' ? 'pets' : 'pets'}
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" color="#FF66C4" />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <AppBar title="Manage Pets" onBackPress={() => navigation.goBack()} />

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <MaterialIcons 
              name="search" 
              size={20} 
              color="#ff69b4" 
              style={styles.searchIcon} 
            />
            <TextInput 
              placeholder="Search by name, breed or type..." 
              placeholderTextColor="#A0AEC0"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
          </View>

          <View style={styles.filterButtonsContainer}>
            {['All', 'Dog', 'Cat'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilter(type)}
                style={[
                  styles.filterButton,
                  filter === type && styles.activeFilterButton,
                ]}
              >
                <MaterialIcons
                  name={type === 'Dog' ? 'pets' : type === 'Cat' ? 'pets' : 'all-inclusive'}
                  size={20}
                  color={filter === type ? '#FFF' : '#FF66C4'}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter === type && styles.activeFilterText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredPets}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
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
              <Text style={styles.emptySubText}>
                Try adjusting your search or filters
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchPets}
              >
                <Text style={styles.refreshButtonText}>Refresh Pets</Text>
              </TouchableOpacity>
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
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#333333',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FF66C4',
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  activeFilterButton: {
    backgroundColor: '#FF66C4',
    borderColor: '#FF66C4',
  },
  filterIcon: {
    marginRight: 5,
  },
  filterText: {
    color: '#FF66C4',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 30,
  },
  petCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  petImage: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-end',
  },
  petImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageGradient: {
    height: 50,
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 6,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petTypeText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 13,
  },
  petInfoContainer: {
    padding: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  petDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petDetailText: {
    fontSize: 13,
    color: '#4A5568',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A0AEC0',
    marginTop: 12,
  },
  emptySubText: {
    color: '#CBD5E0',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  refreshButton: {
    marginTop: 16,
    backgroundColor: '#FF66C4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ManagePets;