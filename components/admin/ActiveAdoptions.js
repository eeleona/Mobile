import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../design/AppBar';
import { useFonts, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import config from '../../server/config/config';

const ActiveAdoptions = () => {
    const [activeAdoptions, setActiveAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchActiveAdoptions();
    }, []);

    const fetchActiveAdoptions = async () => {
        try {
            const response = await axios.get(`${config.address}/api/adoption/active`);
            setActiveAdoptions(response.data);
        } catch (error) {
            console.error('Error fetching active adoptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('View Active Adoption', { adoption: item })}
        >
            <Image 
                source={{ uri: `${config.address}${item.p_id?.pet_img?.[0]}` }} 
                style={styles.petImage} 
            />
            <View style={styles.infoContainer}>
                <Text style={styles.petName}>{item.p_id?.p_name || 'Unknown Pet'}</Text>
                <Text style={styles.adopterName}>
                    Adopter: {item.v_id?.v_fname} {item.v_id?.v_lname}
                </Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Active</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <PaperProvider>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : activeAdoptions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../../assets/Images/pawicon2.png')}
                            style={styles.pawIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyText}>No Active Adoptions</Text>
                    </View>
                ) : (
                    <FlatList
                        data={activeAdoptions}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id || Math.random().toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    adopterName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statusContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#E1F5E1',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pawIcon: {
        width: 80,
        height: 80,
        opacity: 0.3,
        marginBottom: 15,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#999',
    },
    listContainer: {
        paddingVertical: 8,
    },
});

export default ActiveAdoptions;