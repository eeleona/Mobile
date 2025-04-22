import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  RefreshControl, 
  ImageBackground,
  TextInput,
  FlatList, StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
import { MaterialIcons } from '@expo/vector-icons';

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.address}/api/events/all`);
      const eventsWithImages = (response.data?.theEvent || []).filter(event => event.e_image);
      
      // Sort events by date (nearest first)
      const sortedEvents = [...eventsWithImages].sort((a, b) => {
        return new Date(a.e_date) - new Date(b.e_date);
      });
      
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.e_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.e_location && event.e_location.toLowerCase().includes(searchQuery.toLowerCase()))
      ); // <-- Added the closing parenthesis here
      setFilteredEvents(filtered);
      
    }
  }, [searchQuery, events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.getDate(),
      day: date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase() + ', ' + date.getFullYear(),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const EventItem = ({ event }) => {
    const { date, day, month, time } = formatDate(event.e_date);

    return (
      
      <View style={styles.eventCard}>
        <StatusBar barStyle="default" />
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.dayText}>{day}</Text>
          <Text style={styles.monthText}>{month}</Text>
        </View>
        
        <Image 
          source={{ uri: `${config.address}${event.e_image}` }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.eventTitle}>{event.e_title}</Text>
          <Text style={styles.eventTime}>{time}</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons 
              name="location-on" 
              size={16} 
              color="#888" 
              style={styles.locationIcon}
            />
            <Text style={styles.eventLocation}>
              {event.e_location || 'Pasay Animal Shelter'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require('../../assets/Images/pasayshelter.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <AppBar />
        <ScrollView 
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff69b4']}
              tintColor="#ff69b4"
            />
          }
        >
          <Text style={styles.headerText}>UPCOMING EVENTS</Text>
          <Text style={styles.subHeaderText}>at Pasay Animal Shelter</Text>

          {/* Search Bar - Same style as UserNearby.js */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search events or location..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <MaterialIcons
              name="search"
              size={24}
              color="#ff69b4"
              style={styles.searchIcon}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#ff69b4" style={styles.loader} />
          ) : filteredEvents.length > 0 ? (
            <FlatList
              data={filteredEvents}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item._id}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('Event Details', { event: item })}
                >
                  <EventItem event={item} />
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noEventsContainer}>
              <Image 
                source={require('../../assets/Images/profiledp.png')}
                style={styles.noEventsImage}
              />
              <Text style={styles.noEventsText}>
                {searchQuery ? 'No matching events found' : 'No upcoming events'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#ff69b4',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subHeaderText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Inter_500Medium',
    color: '#555',
  },
  // Search bar styles (same as UserNearby.js)
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    height: 120,
  },
  dateContainer: {
    backgroundColor: '#ff69b4',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
  },
  dayText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Inter_500Medium',
    marginVertical: 2,
  },
  monthText: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Inter_500Medium',
  },
  eventImage: {
    width: 100,
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#ff69b4',
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 5,
  },
  eventLocation: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Inter_500Medium',
  },
  loader: {
    marginVertical: 40,
  },
  noEventsContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  noEventsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.7,
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    fontFamily: 'Inter_500Medium',
  },
});

export default UserEvents;