import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import {
  TextInput,
  Button,
  PaperProvider,
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const { width } = Dimensions.get('window');

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
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
        pet.p_type.toLowerCase().includes(lowerText);

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
    navigation.navigate('View Pet Details', { pet });
  };

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => navigateToPetDetails(item)} style={styles.petCard}>
        <Image
          source={{ uri: `${config.address}${item.pet_img[0]}` }}
          style={styles.petImage}
        />
        <View style={styles.petInfoContainer}>
          <Text style={styles.petName}>{item.p_name}</Text>
          <View style={styles.inlineChipGroup}>
            <Chip icon="paw" style={styles.chip}>{item.p_type}</Chip>
            <Chip icon="gender-male-female" style={styles.chip}>{item.p_gender}</Chip>
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
          <TextInput
            label="Search pets..."
            value={searchText}
            onChangeText={setSearchText}
            mode="outlined"
            style={styles.searchInput}
            left={<TextInput.Icon name="magnify" />}
            theme={{
              colors: {
                primary: '#FF66C4',
                background: '#fff',
                text: '#333',
              }
            }}
          />
          <View style={styles.fullWidthFilterContainer}>
            {['All', 'Dog', 'Cat'].map((type) => (
              <Button
                key={type}
                mode={filter === type ? 'contained' : 'outlined'}
                onPress={() => setFilter(type)}
                style={[
                  styles.filterButton,
                  filter === type && styles.activeFilter
                ]}
                labelStyle={[
                  styles.filterLabel,
                  filter === type && styles.activeFilterLabel
                ]}
              >
                {type}
              </Button>
            ))}
          </View>
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
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
    height: 50,
  },
  fullWidthFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    height: 38,
    borderColor: '#FF66C4',
  },
  activeFilter: {
    backgroundColor: '#FF66C4',
  },
  filterLabel: {
    color: '#FF66C4',
    fontWeight: 'bold',
  },
  activeFilterLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  petCard: {
    width: width / 2 - 20,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  petInfoContainer: {
    padding: 10,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  inlineChipGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#ff99ce',
    height: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#FF66C4',
    borderRadius: 8,
  },
  refreshButtonLabel: {
    color: 'white',
  },
});

export default ManagePets;
