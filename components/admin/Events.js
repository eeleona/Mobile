import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Alert, FlatList, Text } from 'react-native';
import { PaperProvider, Modal, Portal, TextInput, Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';

const Events = ({ navigation }) => {
    const [allEvents, setAllEvents] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const showModal = (event) => {
        setSelectedEvent(event);
        setVisible(true);
    };

    const hideModal = () => setVisible(false);

    const fetchEvents = () => {
        axios.get('http://192.168.0.110:8000/api/events/all')
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
                            <TouchableOpacity onPress={() => showModal(item)} style={styles.eventContainer}>
                                <Image style={styles.eventThumbnail} source={{ uri: `http://192.168.0.110:8000${item.e_image}` }} />
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
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                        {selectedEvent && (
                            <View>
                                <Image style={styles.eventImage} source={{ uri: `http://192.168.0.110:8000${selectedEvent.e_image}` }} />
                                <Text style={styles.eventName}>{selectedEvent.e_title}</Text>
                                <Text style={styles.eventLocation}>Location: {selectedEvent.e_location}</Text>
                                <Text style={styles.eventDate}>Date: {new Date(selectedEvent.e_date).toDateString()}</Text>
                                <Divider style={styles.divider} />
                                <Text style={styles.eventDescription}>Description: {selectedEvent.e_description}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.editbtn} onPress={() => navigation.navigate('Edit Event', { eventId: selectedEvent._id })}>
                                        <Text style={styles.editbtntext}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deletebtn} onPress={() => console.log('Delete Event', selectedEvent._id)}>
                                        <Text style={styles.deletebtntext}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    listContainer: { flexGrow: 1, flex: 1 },
    formHeader: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    eventContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 5, marginVertical: 5, backgroundColor: 'white', marginHorizontal: 20, elevation: 3, borderColor: '#E0E0E0', borderWidth: 0.5 },
    eventThumbnail: { width: 80, height: 80, borderRadius: 5, marginRight: 10 },
    eventInfo: { flex: 1 },
    eventTitle: { fontSize: 18, fontWeight: 'bold' },
    eventDetails: { fontSize: 14, color: 'gray', marginTop: 5 },
    emptyText: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
    divider: { marginVertical: 10 },
    modalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 8, margin: 30 },
    eventImage: { width: '100%', height: 200, borderRadius: 5 },
    eventName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 }
});

export default Events;
