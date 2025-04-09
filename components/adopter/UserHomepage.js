import React, { useState, useEffect } from 'react';
import { 
  Button, 
  StyleSheet, 
  Text, 
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
      
      // Check if response.data.theEvent exists and is an array
      const eventsArray = response.data?.theEvent || [];
      
      // Filter out events without images and shuffle
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
      
      // Change from response.data?.theService to just response.data
      const servicesArray = Array.isArray(response.data) ? response.data : [];
      
      // Change from service.service_image to item.ns_image
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
      style={styles.eventCard}  // Match card style
      onPress={() => navigation.navigate('Pet Details', { petId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.pet_img[0]}` }} 
        style={styles.eventImage} // Match image style
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.p_name}</Text>
        <Text style={styles.eventDate}>{item.breed}</Text>
      </View>
    </TouchableOpacity>
  );
  

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
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
      style={styles.eventCard}
      onPress={() => navigation.navigate('Service Details', { serviceId: item._id })}
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
        <Text style={styles.sectionTitle}>Pets Available for Adoption</Text>
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
        <Text style={styles.sectionTitle}>Why Adopt?</Text>
        <Image 
          source={require('../../assets/Images/catdog.jpg')} 
          style={styles.whyAdoptImage}
        />
        <Text style={styles.whyAdoptText}>
          By adopting, you're opening your heart and home to a wonderful pet who's ready to shower you with love. Each adoption creates space for more animals to be rescued, giving you the chance to make a meaningful difference.
        </Text>
      </View>

      {/* EVENTS CAROUSEL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Services</Text>
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

      {/* WHY ADOPT SECTION */}
    </ScrollView>
  );
};

// ... (keep your existing styles unchanged)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingVertical: 150
  },
  header: {
    padding: 20,
    backgroundColor: '#ff69b4',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  mainButton: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 3,
  },
  buttonImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
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
  sectionTitle: {
    fontSize: 20,
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
    backgroundColor: '#fff9f9',
    paddingVertical: 25,
  },
  whyAdoptImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  whyAdoptText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'center',
  },
  eventCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    elevation: 2,
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
    elevation: 2,
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