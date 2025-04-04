import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Appbar } from 'react-native-paper';
import UserNavbar from '../design/UserNavbar';
import AppBar from '../design/AppBar';
import { LinearGradient } from 'expo-linear-gradient';
import App from '../../App';

// Import your background image
const backgroundImage = require('../../assets/Images/pasayshelter.jpg'); // Adjust the path as necessary

const events = [
  {
    id: 1,
    date: '7',
    day: 'THURS',
    month: 'AUG, 2024',
    time: '12:30 PM',
    title: 'Free Anti-Rabies',
    description: 'Come and bring your pets for a free anti-rabbies shot at Pasay Animal Shelter.',
  },
  {
    id: 2,
    date: '7',
    day: 'THURS',
    month: 'SEPT, 2024',
    time: '1:00 PM',
    title: 'Free Vaccination',
    description: 'Come and bring your pets for a free vaccination session at Pasay Animal Shelter.',
  },
  {
    id: 3,
    date: '7',
    day: 'THURS',
    month: 'NOV, 2024',
    time: '2:00 PM',
    title: 'Free Check-Up',
    description: 'Come and bring your pets for a free check-up session at Pasay Animal Shelter.',
  },
];

const EventItem = ({ date, day, month, time, title, description }) => {
  return (
    <View style={styles.eventCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.monthText}>{month}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventTime}>{time}</Text>
        <Text style={styles.eventDescription}>{description}</Text>
      </View>
    </View>
  );
};

const UserEvents = () => {
  return (
    <View style={styles.container}>
    <AppBar></AppBar>
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>UPCOMING EVENTS</Text>
        <Text style={styles.subHeaderText}>in Pasay Animal Shelter</Text>
        {events.map(event => (
          <EventItem
            key={event.id}
            date={event.date}
            day={event.day}
            month={event.month}
            time={event.time}
            title={event.title}
            description={event.description}
          />
        ))}
        <View style={styles.pagination}>
          <TouchableOpacity>
            <Text style={styles.pageLink}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>1</Text>
          <TouchableOpacity>
            <Text style={styles.pageLink}>Next</Text>
          </TouchableOpacity>
        </View>
        <UserNavbar></UserNavbar>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 40,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#F9739A',
    marginTop: 20,
  },
  subHeaderText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_500Medium',
  },
  eventCard: {
    fontFamily: 'Inter_700Bold',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dateContainer: {
    fontFamily: 'Inter_700Bold',
    backgroundColor: '#F9739A',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dayText: {
    fontSize: 14,
    color: '#FFF',
  },
  monthText: {
    fontSize: 12,
    color: '#FFF',
  },
  detailsContainer: {
    marginLeft: 20,
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Inter_700Bold',
  },
  eventTime: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Inter_500Medium',
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontFamily: 'Inter_500Medium',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pageLink: {
    fontSize: 16,
    color: '#F9739A',
    marginHorizontal: 10,
  },
  pageNumber: {
    fontSize: 16,
    color: '#333',
  },
});

export default UserEvents;
