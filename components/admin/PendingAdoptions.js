import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';

const PendingAdoptions = () => {
    const [pendingAdoptions, setPendingAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchPendingAdoptions = async () => {
        try {
            const response = await axios.get(`${config.address}/api/adoption/pending`);
            setPendingAdoptions(response.data);
        } catch (error) {
            console.error('Error fetching pending adoptions:', error);
            Alert.alert('Error', 'Failed to fetch pending adoptions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingAdoptions();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('View Pending Adoption', { adoption: item })}
        >
            <Image
                style={styles.petImage}
                source={{ uri: `${config.address}${item.p_id?.pet_img?.[0]}` }}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.petName}>{item.p_id?.p_name || 'Unknown Pet'}</Text>
                <Text style={styles.adopterName}>
                    Adopter: {item.v_id?.v_fname} {item.v_id?.v_lname}
                </Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Pending</Text>
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
                ) : pendingAdoptions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../../assets/Images/pawicon2.png')}
                            style={styles.pawIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyText}>No Pending Adoptions</Text>
                    </View>
                ) : (
                    <FlatList
                        data={pendingAdoptions}
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
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        color: '#E65100',
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

export default PendingAdoptions;