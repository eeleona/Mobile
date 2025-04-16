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
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import axios from 'axios';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

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
  

  useEffect(() => {
    fetchRandomPets();
    fetchRandomEvents();
    fetchRandomServices();
  }, []);

  if (!fontsLoaded) return null;

  const renderPetItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.eventCard, {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }]}
      onPress={() => navigation.navigate('Adopt The Pet', { petId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.pet_img[0]}` }} 
        style={styles.eventImage}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.p_name}</Text>
        <Text style={styles.eventDate}>{item.p_breed}</Text>
      </View>
    </TouchableOpacity>
  );
  

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.eventCard, {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }]}
      onPress={() => navigation.navigate('Event Details', { eventId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.e_image}` }}
        style={styles.eventImage}
        onError={(e) => console.log('Failed to load event image:', e.nativeEvent.error)}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.e_title}</Text>
        <Text style={styles.eventDate}>{new Date(item.e_date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.eventCard, {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }]}
      onPress={() => navigation.navigate('User Nearby Services', { serviceId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.ns_image}` }} 
        style={styles.eventImage}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.ns_name}</Text>
        <Text style={styles.eventDate}>{item.ns_type}</Text>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <ScrollView style={styles.container}>
      {/* HEADER SECTION */}
      <LinearGradient
        colors={['#FF66C4', '#FF8E53']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image 
            source={require('../../assets/Images/nobglogo.png')} 
            style={styles.logo} 
            accessibilityLabel="App logo"
          />
          <View style={styles.searchBox}>
            <MaterialIcons 
              name="search" 
              size={20} 
              color="#ff69b4" 
              style={styles.searchIcon} 
              accessibilityRole="imagebutton"
            />
            <TextInput 
              placeholder="Search..." 
              placeholderTextColor="#ff69b4" 
              style={styles.input}
              accessibilityLabel="Search input"
            />
          </View>
        </View>
        <Text style={styles.headerTitle}>Find your perfect companion with E-Pet Adopt</Text>
        <Text style={styles.headerSubtitle}>Adopt, Connect, and Discover</Text>
      </LinearGradient>

      {/* MAIN BUTTONS SECTION */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => navigation.navigate('Adopt A Pet')}
        >
          <Image 
            source={require('../../assets/Images/userpet.png')} 
            style={styles.buttonImage}
          />
          <Text style={styles.mainButtonText}>Adopt A Pet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => navigation.navigate('User Events')}
        >
          <Image 
            source={require('../../assets/Images/userevent.png')} 
            style={styles.buttonImage}
          />
          <Text style={styles.mainButtonText}>View Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainButton}
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
          <Text style={styles.loadingText}>Loading pets...</Text>
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

      <TouchableOpacity 
        style={styles.aboutContainer}
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
          <Text style={styles.loadingText}>Loading events...</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('User Nearby')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {loading.services ? (
          <Text style={styles.loadingText}>Loading services...</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
    elevation: 3,
    zIndex: 10,
    marginVertical: 5,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ff69b4',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#ff69b4',
  },
  header: {
    padding: 25,
    paddingTop: 140,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 25,
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
    marginTop: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  mainButton: {
    alignItems: 'center',
    width: '32%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aboutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 14,
    borderColor: '#ff69b4',
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  seeAll: {
    fontFamily: 'Inter_500Medium',
    color: '#FF66C4',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttonImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  mainButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#2a2a2a',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionNearby: {
    marginBottom: 110,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#2a2a2a',
    marginBottom: 15,
  },
  listContainer: {
    paddingRight: 20,
  },
  petCard: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  petImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  petName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#2a2a2a',
  },
  petBreed: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#666',
  },
  whyAdoptSection: {
    backgroundColor: '#ff69b4',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  eventCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 10,
  },
  eventTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#2a2a2a',
    marginBottom: 5,
  },
  eventDate: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#666',
  },
  serviceItem: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#2a2a2a',
    marginBottom: 3,
  },
  serviceLocation: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#666',
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