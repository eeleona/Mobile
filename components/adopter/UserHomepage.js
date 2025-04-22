import React, { useState, useEffect } from 'react';
import { 
  Button, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  RefreshControl,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import axios from 'axios';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const UserHomepage = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });
  const [pets, setPets] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    pets: true,
    events: true,
    services: true
  });
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');

  const fetchRandomPets = async () => {
    try {
      const response = await axios.get(`${config.address}/api/pet/all`);
      const petsArray = response.data?.thePet || [];
      const petsWithImages = petsArray.filter(pet => pet.pet_img?.[0]);
      const shuffled = [...petsWithImages].sort(() => 0.5 - Math.random());
      setPets(shuffled.slice(0, 3));
      setLoading(prev => ({ ...prev, pets: false }));
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
      setLoading(prev => ({ ...prev, pets: false }));
    }
  };

  const fetchRandomEvents = async () => {
    try {
      const response = await axios.get(`${config.address}/api/events/all`);
      const eventsArray = response.data?.theEvent || [];
      const eventsWithImages = eventsArray.filter(event => event.e_image);
      const shuffled = [...eventsWithImages].sort(() => 0.5 - Math.random());
      setEvents(shuffled.slice(0, 3));
      setLoading(prev => ({ ...prev, events: false }));
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(prev => ({ ...prev, events: false }));
      setEvents([]);
    }
  };

  const fetchRandomServices = async () => {
    try {
      const response = await axios.get(`${config.address}/api/service/all`);
      const servicesArray = Array.isArray(response.data) ? response.data : [];
      const servicesWithImages = servicesArray.filter(service => service.ns_image);
      const shuffled = [...servicesWithImages].sort(() => 0.5 - Math.random());
      setServices(shuffled.slice(0, 3));
      setLoading(prev => ({ ...prev, services: false }));
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const fetchUsername = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = jwt_decode(token);
        setUsername(decoded.username || 'User');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRandomPets();
    fetchRandomEvents();
    fetchRandomServices();
    fetchUsername();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRandomPets();
    fetchRandomEvents();
    fetchRandomServices();
    fetchUsername();
  }, []);

  if (!fontsLoaded) return null;

  const renderPetItem = ({ item }) => (
    <View style={[styles.cardContainer, styles.shadowContainer]}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Adopt The Pet', { pet: item })}
      >
        <Image 
          source={{ uri: `${config.address}${item.pet_img[0]}` }} 
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.p_name}</Text>
          <Text style={styles.cardSubtitle}>{item.p_breed}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={[styles.cardContainer, styles.shadowContainer]}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Event Details', { event: item })}
      >
        <Image 
          source={{ uri: `${config.address}${item.e_image}` }}
          style={styles.cardImage}
          onError={(e) => console.log('Failed to load event image:', e.nativeEvent.error)}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.e_title}</Text>
          <Text style={styles.cardSubtitle}>{new Date(item.e_date).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderServiceItem = ({ item }) => (
    <View style={[styles.cardContainer, styles.shadowContainer]}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('User Nearby Services', { service: item })}
      >
        <Image 
          source={{ uri: `${config.address}${item.ns_image}` }} 
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.ns_name}</Text>
          <Text style={styles.cardSubtitle}>{item.ns_type}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        {/* Fixed Header Section */}
        <LinearGradient
          colors={['#FF66C4', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Image 
              source={require('../../assets/Images/nobglogo.png')} 
              style={styles.logo} 
            />
            <Text style={styles.greeting}>Hello, {username}</Text>
          </View>
          <Text style={styles.headerTitle}>Find your perfect companion with E-Pet Adopt</Text>
          <Text style={styles.headerSubtitle}>Adopt, Connect, and Discover</Text>
        </LinearGradient>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff69b4']}
              tintColor="#ff69b4"
            />
          }
        >
          {/* Main Buttons Section */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.mainButton, styles.shadowContainer]}
              onPress={() => navigation.navigate('Adopt A Pet')}
            >
              <Image 
                source={require('../../assets/Images/userpet.png')} 
                style={styles.buttonImage}
              />
              <Text style={styles.mainButtonText}>Adopt A Pet</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, styles.shadowContainer]}
              onPress={() => navigation.navigate('User Events')}
            >
              <Image 
                source={require('../../assets/Images/userevent.png')} 
                style={styles.buttonImage}
              />
              <Text style={styles.mainButtonText}>View Events</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainButton, styles.shadowContainer]}
              onPress={() => navigation.navigate('User Nearby Services')}
            >
              <Image 
                source={require('../../assets/Images/usernearby.png')} 
                style={styles.buttonImage}
              />
              <Text style={styles.mainButtonText}>Nearby Services</Text>
            </TouchableOpacity>
          </View>

          {/* ADOPT A PET CAROUSEL */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pets to Adopt</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Adopt A Pet')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {loading.pets ? (
              <ActivityIndicator size="large" color="#ff69b4" />
            ) : pets.length > 0 ? (
              <FlatList
                horizontal
                data={pets}
                renderItem={renderPetItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.loadingText}>No pets available</Text>
            )}
          </View>

          {/* Why Adopt Section */}
          <View style={[styles.section, styles.whyAdoptSection]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: '#fff' }]}>Why Adopt?</Text>
            </View>
            <Image 
              source={require('../../assets/Images/catdog.jpg')} 
              style={styles.whyAdoptImage}
            />
            <Text style={styles.whyAdoptText}>
              By adopting, you're opening your heart and home to a wonderful pet who's ready to shower you with love. Each adoption creates space for more animals to be rescued, giving you the chance to make a meaningful difference.
            </Text>
          </View>

          {/* About Us Section */}
          <TouchableOpacity 
            style={[styles.aboutContainer, styles.shadowContainer]}
            onPress={() => navigation.navigate('About Us')}
          >
            <Image 
              source={require('../../assets/Images/nobglogo.png')} 
              style={styles.aboutLogo} 
            />
            <View style={styles.aboutTextContainer}>
              <Text style={styles.aboutTitle}>Know more about us</Text>
              <Text style={styles.aboutDetails}>📞 (02) 1234 5678</Text>
              <Text style={styles.aboutDetails}>📍 Pasay City Animal Shelter</Text>
            </View>
          </TouchableOpacity>

          {/* EVENTS CAROUSEL */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={() => navigation.navigate('User Events')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {loading.events ? (
              <ActivityIndicator size="large" color="#ff69b4" />
            ) : events.length > 0 ? (
              <FlatList
                horizontal
                data={events}
                renderItem={renderEventItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.loadingText}>No events available</Text>
            )}
          </View>

          {/* SERVICES CAROUSEL */}
          <View style={styles.sectionNearby}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Services</Text>
              <TouchableOpacity onPress={() => navigation.navigate('User Nearby Services')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {loading.services ? (
              <ActivityIndicator size="large" color="#ff69b4" />
            ) : services.length > 0 ? (
              <FlatList
                horizontal
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.loadingText}>No services available</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    padding: 25,
    paddingTop: 15,
    paddingBottom: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
  },
  greeting: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: 'white',
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FAF9F6',
    paddingTop: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  mainButton: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  buttonImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  mainButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#2a2a2a',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionNearby: {
    marginBottom: 140,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#2a2a2a',
  },
  seeAll: {
    fontFamily: 'Inter_500Medium',
    color: '#FF66C4',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  aboutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  aboutLogo: {
    width: 60,
    height: 60,
    marginRight: 16,
    resizeMode: 'contain',
  },
  aboutTextContainer: {
    flex: 1,
  },
  aboutTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#FF66C4',
    marginBottom: 4,
  },
  aboutDetails: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#444',
  },
  whyAdoptSection: {
    backgroundColor: '#ff69b4',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  whyAdoptText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
  },
  whyAdoptImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardContainer: {
    width: 200,
    marginRight: 15,
    marginBottom: 15,
    overflow: 'visible',
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#2a2a2a',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingRight: 20,
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default UserHomepage;