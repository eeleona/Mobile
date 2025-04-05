import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert, FlatList, Text } from 'react-native';
import { PaperProvider, Modal, Portal, TextInput, Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Events = ({ navigation }) => {
    const [allEvents, setAllEvents] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    AsyncStorage.getItem('authToken').then(token => console.log("Stored Token:", token));


    const fetchEvents = () => {
        axios.get(`${config.address}/api/events/all`)
            .then((response) => {
                setAllEvents(response.data.theEvent);
            })
            .catch((err) => {
                console.error('Error fetching events:', err);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <AppBar />
                <View style={styles.listContainer}>
                    <FlatList
                        data={allEvents}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                        onPress={() => navigation.navigate('View Event', { event: item })} // Pass the event data
                        style={styles.eventContainer}
                        >
                        <Image style={styles.eventThumbnail} source={{ uri: `${config.address}${item.e_image}` }} />
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventTitle}>{item.e_title}</Text>
                            <Text style={styles.eventDetails}>{item.e_location} | {new Date(item.e_date).toDateString()}</Text>
                        </View>
                        </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={<Text style={styles.emptyText}>No events found.</Text>}
                    />
                </View>
                
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF9F6' },
    listContainer: { flexGrow: 1, flex: 1 },
    formHeader: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', },
    eventContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 5, padding: 15, backgroundColor: 'white', marginBottom: 10, marginHorizontal: 25, elevation: 3},
    eventThumbnail: { width: 70, height: 70, borderRadius: 35, marginRight: 10 },
    eventInfo: { flex: 1 },
    eventTitle: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Inter_700Bold'},
    eventDetails: { fontSize: 16, color: 'gray', marginTop: 5 },
    emptyText: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
    divider: { marginVertical: 10 },
    modalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 8, margin: 30 },
    imageContainer: { width: '100%', height: 300, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    eventImage: { width: '100%', height: '100%', borderRadius: 5 },
    eventName: { fontSize: 30, fontWeight: 'bold', marginVertical: 15, fontFamily: 'Inter_700Bold' },
    event: { fontFamily: 'Inter_400Regular', fontSize: 16, marginBottom: 5 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 },
    editbtn: { padding: 10, marginHorizontal: 5, backgroundColor: '#a6cb7e', width: 90, height: 40, borderRadius: 5,},
    editbtntext: { fontSize: 18, color: 'white', textAlign: 'center', fontFamily: 'Inter_700Bold' },
    deletebtn: { padding: 10, marginHorizontal: 5, backgroundColor: '#d95555', width: 90, height: 40, borderRadius: 5, },
    deletebtntext: { fontSize: 18, color: 'white', textAlign: 'center', fontFamily: 'Inter_700Bold' },
});

export default Events;
