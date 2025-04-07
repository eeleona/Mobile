import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, FlatList, Text, RefreshControl } from 'react-native';
import { PaperProvider, Card, Title, Paragraph, ActivityIndicator, FAB } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import AppBar from '../design/AppBar';

const Events = ({ navigation }) => {
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${config.address}/api/events/all`);
            setAllEvents(response.data.theEvent);
        } catch (err) {
            console.error('Error fetching events:', err);
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

    const renderEventItem = ({ item }) => (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('View Event', { event: item })}>
                <View style={styles.cardContent}>
                    <Image 
                        style={styles.eventImage} 
                        source={{ uri: `${config.address}${item.e_image}` }} 
                        resizeMode="cover"
                    />
                    <View style={styles.eventDetails}>
                        <Title style={styles.eventTitle}>{item.e_title}</Title>
                        <View style={styles.locationContainer}>
                            <MaterialIcons name="location-on" size={16} color="#666" />
                            <Paragraph style={styles.eventLocation}>{item.e_location}</Paragraph>
                        </View>
                        <View style={styles.dateContainer}>
                            <MaterialIcons name="date-range" size={16} color="#666" />
                            <Paragraph style={styles.eventDate}>
                                {format(new Date(item.e_date), 'MMM dd, yyyy - hh:mm a')}
                            </Paragraph>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Card>
    );

    if (loading) {
        return (
            <PaperProvider>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator 
                        animating={true} 
                        size="large" 
                        color="#ff69b4"
                        style={styles.loadingIndicator}
                    />
                    <Text style={styles.loadingText}>Loading events...</Text>
                </View>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                <AppBar />

                <FlatList
                    data={allEvents}
                    renderItem={renderEventItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#ff69b4']}
                            tintColor="#ff69b4"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="event-busy" size={50} color="#ccc" />
                            <Text style={styles.emptyText}>No events available</Text>
                        </View>
                    }
                />

                <FAB
                    style={styles.fab}
                    icon="plus"
                    color="white"
                    onPress={() => navigation.navigate('Add Event')}
                />
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingIndicator: {
        marginBottom: 16,
    },
    loadingText: {
        color: '#ff69b4',
        fontSize: 16,
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white', // Explicit white background
    },
    cardContent: {
        flexDirection: 'row',
        height: 120, // Fixed height for all cards
    },
    eventImage: {
        width: 120,
        height: '100%', // Will now fill the card height
    },
    eventDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'center', // Vertically center content
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    eventLocation: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventDate: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 10,
        bottom: 10,
        backgroundColor: '#a6cb7e',
    },
});

export default Events;