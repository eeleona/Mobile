import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
 
const ViewEvent = ({ route, navigation }) => {
  // Use state to manage the event data
  const [event, setEvent] = useState(route.params.event);
 
  // Simple navigation to edit screen
  const handleEdit = () => {
    navigation.navigate('Edit Event', {
      eventId: event._id,
      // No callback needed - we'll refresh when returning
    });
  };
 
  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.combinedContainer}>
        <Image
          style={styles.eventImage}
          source={{ uri: `${config.address}${event.e_image}?${Date.now()}` }} // Cache busting
          resizeMode="cover"
        />
 
        <View style={styles.whitebg}>
          <Text style={styles.eventName}>{event.e_title}</Text>
          <Text style={styles.event}>Location: {event.e_location}</Text>
          <Text style={styles.event}>Date: {new Date(event.e_date).toDateString()}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.event}>Description: {event.e_description}</Text>
 
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editbtn}
              onPress={handleEdit}
            >
              <Text style={styles.editbtntext}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deletebtn}
              onPress={() => console.log('Delete Event', event._id)}
            >
              <Text style={styles.deletebtntext}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  combinedContainer: {
    marginHorizontal: 20,
    borderRadius: 5, // Rounded corners for the entire container
    overflow: 'hidden', // Ensures the image and white background respect the border radius
    elevation: 3, // Adds shadow for Android
    backgroundColor: 'white', // Ensures the background is white
  },
  eventImage: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 15, // Rounded top-left corner
    borderTopRightRadius: 15, // Rounded top-right corner
  },
  whitebg: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15, // Rounded bottom-left corner
    borderBottomRightRadius: 15, // Rounded bottom-right corner
  },
  eventName: { fontSize: 30, color: '#ff69b4', fontWeight: 'bold', marginBottom: 15, fontFamily: 'Inter_700Bold' },
  event: { fontFamily: 'Inter_400Regular', fontSize: 16, color:'#353935', marginBottom: 5 },
  divider: { marginVertical: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 },
  editbtn: { padding: 10, marginHorizontal: 5, backgroundColor: '#a6cb7e', width: 90, height: 40, borderRadius: 5 },
  editbtntext: { fontSize: 18, color: 'white', textAlign: 'center', fontFamily: 'Inter_700Bold' },
  deletebtn: { padding: 10, marginHorizontal: 5, backgroundColor: '#d95555', width: 90, height: 40, borderRadius: 5 },
  deletebtntext: { fontSize: 18, color: 'white', textAlign: 'center', fontFamily: 'Inter_700Bold' },
});
 
export default ViewEvent;