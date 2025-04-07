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
            <AppBar title="Adoption Details" onBackPress={() => navigation.goBack()} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adoption Application</Text>
                    <Divider style={styles.sectionDivider} />
                    <DetailRow label="Submitted At:" value={adoption.a_submitted_at} />
                    <DetailRow label="Status:" value={adoption.status} />
                    <ProgressBar 
                        style={styles.progressBar} 
                        progress={0.3} 
                        color={MD3Colors.tertiary90} 
                    />
                </View>

                {/* Pet Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pet Details</Text>
                    <Divider style={styles.sectionDivider} />
                    {adoption.p_id?.pet_img?.[0] ? (
                        <Image 
                            source={{ uri: `${config.address}${adoption.p_id.pet_img[0]}` }} 
                            style={styles.petImage} 
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>No image available</Text>
                        </View>
                    )}
                    <DetailRow label="Name:" value={adoption.p_id?.p_name} />
                    <DetailRow label="Type:" value={adoption.p_id?.p_type} />
                    <DetailRow label="Breed:" value={adoption.p_id?.p_breed} />
                    <DetailRow label="Gender:" value={adoption.p_id?.p_gender} />
                    <DetailRow label="Age:" value={adoption.p_id?.p_age ? `${adoption.p_id.p_age} years` : null} />
                </View>

                {/* Adopter Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adopter Details</Text>
                    <Divider style={styles.sectionDivider} />
                    {adoption.v_id?.v_img ? (
                        <Image 
                            source={{ uri: `${config.address}${adoption.v_id.v_img}` }} 
                            style={styles.profileImage} 
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>No image available</Text>
                        </View>
                    )}
                    <DetailRow label="Name:" value={`${adoption.v_id?.v_fname} ${adoption.v_id?.v_lname}`} />
                    <DetailRow label="Username:" value={adoption.v_id?.v_username} />
                    <DetailRow label="Email:" value={adoption.v_id?.v_emailadd} />
                    <DetailRow label="Contact:" value={adoption.v_id?.v_contactnumber} />
                    <DetailRow label="Address:" value={adoption.v_id?.v_add} />
                    <DetailRow label="Birthdate:" value={adoption.v_id?.v_birthdate} />
                    <DetailRow label="Gender:" value={adoption.v_id?.v_gender} />
                </View>

                {/* Household Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Household Information</Text>
                    <Divider style={styles.sectionDivider} />
                    <DetailRow label="Occupation:" value={adoption.occupation} />
                    <DetailRow label="Years in current address:" value={adoption.years_resided} />
                    <DetailRow label="Adults in household:" value={adoption.adutls_in_household} />
                    <DetailRow label="Children in household:" value={adoption.children_in_household} />
                    <DetailRow label="Allergic to pets:" value={adoption.allergic_to_pets} />
                    <DetailRow label="Home type:" value={adoption.home_type} />
                    <View style={styles.householdDescription}>
                        <Text style={styles.detailLabel}>Household Description:</Text>
                        <Text style={styles.descriptionText}>{adoption.household_description}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const DetailRow = ({ label, value }) => (
    <View>
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value || 'N/A'}</Text>
        </View>
        <Divider style={styles.rowDivider} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ff69b4',
        marginBottom: 12,
        fontFamily: 'Inter_700Bold',
    },
    sectionDivider: {
        marginBottom: 12,
        backgroundColor: '#eee',
        height: 1,
    },
    rowDivider: {
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        height: 1,
    },
    petImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        fontFamily: 'Inter_500Medium',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        textAlign: 'right',
        flex: 1,
        paddingLeft: 16,
        fontFamily: 'Inter_500Medium',
    },
    progressBar: {
        marginTop: 12,
        height: 6,
        borderRadius: 3,
    },
    householdDescription: {
        marginTop: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
        fontFamily: 'Inter_500Medium',
    },
});

export default AdoptionDetails;