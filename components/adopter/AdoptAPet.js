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
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import {
  TextInput,
  PaperProvider,
  ActivityIndicator,
} from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2; // 2 columns with margin

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
    const filtered = pets.filter((pet) => {
      const matchesSearch =
        pet.p_name.toLowerCase().includes(lowerText) ||
        pet.p_breed.toLowerCase().includes(lowerText) ||
        pet.p_type.toLowerCase().includes(lowerText) ||
        pet.p_gender.toLowerCase().includes(lowerText);

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
    navigation.navigate('Adopt The Pet', { pet });
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
                placeholder: '#A0AEC0',
              },
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
                  filter === type && styles.activeFilterButton,
                ]}
              >
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
          </ScrollView>
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
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: 'transparent',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    height: 48,
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF66C4',
    marginRight: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#FF66C4',
    borderColor: '#FF66C4',
  },
  filterText: {
    color: '#FF66C4',
    fontSize: 13,
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

export default AdoptAPet;
