import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';
import { useNavigation } from '@react-navigation/native';


const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.address}/api/events/all`);
        // Filter events with images
        const eventsWithImages = (response.data?.theEvent || []).filter(event => event.e_image);
        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
            <Image 
              source={require('../../assets/Images/usernearby.png')} 
              style={styles.locationIcon}
            />
            <Text style={styles.eventLocation}>Pasay Animal Shelter</Text>
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
        <ScrollView style={styles.container}>
          <Text style={styles.headerText}>UPCOMING EVENTS</Text>
          <Text style={styles.subHeaderText}>at Pasay Animal Shelter</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#F9739A" style={styles.loader} />
          ) : events.length > 0 ? (
            events.map(event => (
              <TouchableOpacity
                key={event._id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Event Details', { eventId: event._id })}
              >
                <EventItem event={event} />
              </TouchableOpacity>

            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Image 
                source={require('../../assets/Images/profiledp.png')}
                style={styles.noEventsImage}
              />
              <Text style={styles.noEventsText}>No upcoming events</Text>
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
    color: '#F9739A',
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
    backgroundColor: '#F9739A',
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
    color: '#F9739A',
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
    tintColor: '#888',
  },
  eventLocation: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Inter_500Medium',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
    alignItems: 'center',
  },
  paginationButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  pageLink: {
    fontSize: 16,
    color: '#F9739A',
    fontFamily: 'Inter_700Bold',
  },
  pageNumber: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter_500Medium',
    marginHorizontal: 15,
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