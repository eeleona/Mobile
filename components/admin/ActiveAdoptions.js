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
    const navigation = useNavigation();

    useEffect(() => {
        fetchActiveAdoptions();
    }, []);

    

    // Fetch active adoptions
    const fetchActiveAdoptions = async () => {
        try {
            const response = await axios.get(`${config.address}/api/adoption/active`);
            setActiveAdoptions(response.data);
        } catch (error) {
            console.error('Error fetching active adoptions:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('View Active Adoption', { adoption: item })}>
            {/* Pet Image Preview */}
            <Image source={{ uri: `${config.address}${item.p_id?.pet_img?.[0]}` }} style={styles.petImage} />
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.v_id?.v_fname} {item.v_id?.v_lname}</Text>
                <Text style={styles.cardText}>Pet: {item.p_id?.p_name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <PaperProvider>
            <View style={styles.container}>
              
                <FlatList
                    data={activeAdoptions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id || Math.random().toString()} // Fallback for missing _id
                />
            </View>
        </PaperProvider>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f6f6', padding: 10 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, marginHorizontal: 8, elevation: 3 },
    petImage: { width: 70, height: 70, borderRadius: 35, marginRight: 10 },
    cardTextContainer: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_700Bold', color: '#2a2a2a'},
    cardText: { fontSize: 14, color: 'gray' },
});

export default ActiveAdoptions;
