import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Divider, ProgressBar, MD3Colors } from 'react-native-paper';
import AppBar from '../design/AppBar';
import { useFonts, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import config from '../../server/config/config';

const AdoptionDetails = ({ route }) => {
    const { adoption } = route.params;

    let [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium });
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            {/* Fixed AppBar at the top */}
            <AppBar />

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Adoption Application Form</Text>
                    <Text style={styles.label}>Submitted At: {adoption.a_submitted_at}</Text>
                    <Text style={styles.label}>Status: {adoption.status}</Text>
                    <ProgressBar style={styles.progressBar} progress={0.3} color={MD3Colors.tertiary90} />
                </View>
                <View style={styles.petDetails}>
                    <Text style={styles.title}>Pet Details</Text>
                    {/* Check if Pet Image Exists Before Rendering */}
                    {adoption.p_id?.pet_img?.[0] ? (
                        <Image source={{ uri: `${config.address}${adoption.p_id.pet_img[0]}` }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.noImageText}>No image available</Text>
                    )}

                    <Text style={styles.label}>Name: {adoption.p_id?.p_name}</Text>
                    <Text style={styles.label}>Type: {adoption.p_id?.p_type}</Text>
                    <Text style={styles.label}>Breed: {adoption.p_id?.p_breed}</Text>
                    <Text style={styles.label}>Gender: {adoption.p_id?.p_gender}</Text>
                    <Text style={styles.label}>Age: {adoption.p_id?.p_age} years</Text>
                </View>
                <View style={styles.adopterDetails}>
                    <Text style={styles.title}>Adopter Details</Text>
                    {/* Check if Image Exists Before Rendering */}
                    {adoption.v_id?.v_img ? (
                        <Image source={{ uri: `${config.address}${adoption.v_id.v_img}` }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.noImageText}>No image available</Text>
                    )}
                    
                    <View style={styles.labelrow}>
                        <Text style={styles.label}>Name: {adoption.v_id?.v_fname} {adoption.v_id?.v_lname}</Text>
                    </View>
                        <Text style={styles.label}>Username: {adoption.v_id?.v_username}</Text>
                    <Text style={styles.label}>Email: {adoption.v_id?.v_emailadd}</Text>
                    <Text style={styles.label}>Contact: {adoption.v_id?.v_contactnumber}</Text>
                    <Text style={styles.label}>Address: {adoption.v_id?.v_add}</Text>
                    <Text style={styles.label}>Birthdate: {adoption.v_id?.v_birthdate}</Text>
                    <Text style={styles.label}>Gender: {adoption.v_id?.v_gender}</Text>
                    <Text style={styles.label}>Occupation: {adoption.occupation}</Text>
                    <Text style={styles.label}>Years resided in current address: {adoption.years_resided}</Text>
                    <Text style={styles.label}>Number of Adults in the Household: {adoption.adutls_in_household}</Text>
                    <Text style={styles.label}>Number of Children in the Household: {adoption.children_in_household}</Text>
                    <Text style={styles.label}>Allergy to Pets: {adoption.allergic_to_pets}</Text>
                    <Text style={styles.label}>Household Description: {adoption.household_description}</Text>
                </View>
                
            </ScrollView>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f6f6' },
    content: { padding: 20, }, // Extra padding for better spacing
    header: {backgroundColor: 'white', borderRadius: 10, padding: 15},
    adopterDetails: {backgroundColor: 'white', borderRadius: 10, padding: 15, marginTop: 15},
    petDetails: {backgroundColor: 'white', borderRadius: 10, padding: 15, marginTop: 15},
    title: { fontSize: 28, fontWeight: 'bold', color: '#ff69b4', marginBottom: 10, fontFamily: 'Inter_700Bold', },
    label: { fontSize: 16, marginBottom: 5, justifyContent: 'space-between', fontFamily: 'Inter_500Medium', },
    profileImage: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        alignSelf: 'center', 
        marginVertical: 10 
    },
    noImageText: { textAlign: 'center', fontSize: 14, color: 'gray', marginBottom: 10 },
    progressBar: { marginTop: 20 },
});

export default AdoptionDetails;
