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

  useEffect(() => {
    fetchRandomPets();
    fetchRandomEvents();
    fetchRandomServices();
  }, []);

  const fetchRandomPets = async () => {
    try {
      const response = await axios.get(`${config.address}/api/pet/all`);
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setPets(shuffled.slice(0, 3));
      setLoading(prev => ({ ...prev, pets: false }));
    } catch (error) {
      console.error('Error fetching pets:', error);
      setLoading(prev => ({ ...prev, pets: false }));
    }
  };

  const fetchRandomEvents = async () => {
    try {
      const response = await axios.get(`${config.address}/api/events/all`);
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setEvents(shuffled.slice(0, 3));
      setLoading(prev => ({ ...prev, events: false }));
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const fetchRandomServices = async () => {
    try {
      const response = await axios.get(`${config.address}/api/service/all`);
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setServices(shuffled.slice(0, 3));
      setLoading(prev => ({ ...prev, services: false }));
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  if (!fontsLoaded) return null;

  const renderPetItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => navigation.navigate('Pet Details', { petId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.pet_img?.[0]}` }} 
        style={styles.petImage} 
      />
      <Text style={styles.petName}>{item.p_name}</Text>
      <Text style={styles.petBreed}>{item.breed}</Text>
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => navigation.navigate('Event Details', { eventId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.event_image}` }} 
        style={styles.eventImage} 
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.event_name}</Text>
        <Text style={styles.eventDate}>{new Date(item.event_date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => navigation.navigate('Service Details', { serviceId: item._id })}
    >
      <Image 
        source={{ uri: `${config.address}${item.service_image}` }} 
        style={styles.serviceImage} 
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.service_name}</Text>
        <Text style={styles.serviceLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ADOPT A PET SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adopt A Pet</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Adopt A Pet')}
        >
          <Text style={styles.buttonText}>Browse Pets</Text>
        </TouchableOpacity>
        
        {loading.pets ? (
          <Text style={styles.loadingText}>Loading pets...</Text>
        ) : (
          <FlatList
            horizontal
            data={pets}
            renderItem={renderPetItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* WHY ADOPT SECTION */}
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

      {/* EVENTS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('User Events')}
        >
          <Text style={styles.buttonText}>View All Events</Text>
        </TouchableOpacity>
        
        {loading.events ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : (
          <FlatList
            horizontal
            data={events}
            renderItem={renderEventItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* NEARBY SERVICES SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Services</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('User Nearby Services')}
        >
          <Text style={styles.buttonText}>Explore Services</Text>
        </TouchableOpacity>
        
        {loading.services ? (
          <Text style={styles.loadingText}>Loading services...</Text>
        ) : (
          <FlatList
            horizontal
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#2a2a2a',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
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