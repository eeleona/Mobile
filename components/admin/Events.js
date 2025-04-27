import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, FlatList, Text, RefreshControl, TextInput } from 'react-native';
import { PaperProvider, Card, Title, Paragraph, ActivityIndicator, FAB } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import AppBar from '../design/AppBar';

const Events = ({ navigation }) => {
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${config.address}/api/events/all`);
            setAllEvents(response.data.theEvent);
            setFilteredEvents(response.data.theEvent);
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

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredEvents(allEvents);
        } else {
            const filtered = allEvents.filter(event => 
                event.e_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.e_location.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredEvents(filtered);
        }
    }, [searchQuery, allEvents]);

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
                            <MaterialIcons name="location-on" size={18} color="#ff69b4" />
                            <Paragraph style={styles.eventLocation}>{item.e_location}</Paragraph>
                        </View>
                        <View style={styles.dateContainer}>
                            <MaterialIcons name="date-range" size={18} color="#ff69b4" />
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

                {/* Search Bar - Updated design */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInnerContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search events by name or location..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <View style={styles.searchIconContainer}>
                            {searchQuery !== '' ? (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <MaterialIcons name="close" size={24} color="#ff69b4" />
                                </TouchableOpacity>
                            ) : (
                                <MaterialIcons name="search" size={24} color="#ff69b4" />
                            )}
                        </View>
                    </View>
                </View>

                <FlatList
                    data={filteredEvents}
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
                            <Image 
                                source={require('../../assets/Images/pawicon2.png')} 
                                style={styles.emptyIcon}
                            />
                            <Text style={styles.emptyText}>
                                {searchQuery.trim() === '' 
                                    ? 'No events available' 
                                    : 'No events match your search'}
                            </Text>
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
        backgroundColor: '#FAF9F6',
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
        padding: 10,
        paddingBottom: 20,
    },
    card: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 8,
    },
    cardContent: {
        flexDirection: 'row',
        height: 140, // Increased height
    },
    eventImage: {
        width: 140, // Increased width to match height
        height: '100%',
    },
    eventDetails: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2a2a2a',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventLocation: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 6,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventDate: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 10,
        bottom: 10,
        backgroundColor: '#cad47c',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    // Search bar styles
    searchContainer: {
        padding: 15,
        paddingBottom: 10,
    },
    searchInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        height: 50, // Increased height
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2a2a2a',
        height: '100%',
    },
    searchIconContainer: {
        marginLeft: 10,
    },
});

export default Events;