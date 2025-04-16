import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PaperProvider, Modal, Portal } from 'react-native-paper';
import { ApplicationProvider, CheckBox, Input, Text, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdoptionForm = ({ navigation, route }) => {
    const { id } = route.params;
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};
    
    // Form state
    const [occupation, setOccupation] = useState('');
    const [yearsResided, setYearsResided] = useState('');
    const [adultsInHousehold, setAdultsInHousehold] = useState('');
    const [childrenInHousehold, setChildrenInHousehold] = useState('');
    
    // Dropdown states
    const [homeTypeIndex, setHomeTypeIndex] = useState(new IndexPath(0));
    const [householdDescIndex, setHouseholdDescIndex] = useState(new IndexPath(0));
    const [allergicIndex, setAllergicIndex] = useState(new IndexPath(0));
    
    // Dropdown options
    const homeTypes = [
        'Select Home Type',
        'Bungalow',
        'Condominium',
        'Apartment',
        'Townhouse',
        'Single-Detached',
        'Single-Attached',
        'Duplex',
        'Mansion'
    ];
    
    const householdDescriptions = [
        'Select Household Description',
        'Active',
        'Noisy',
        'Quiet',
        'Average'
    ];
    
    const allergicOptions = [
        'Select Option',
        'Yes',
        'No'
    ];
    
    // User info
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        gender: '',
        birthdate: '',
        contactNumber: '',
        address: ''
    });
    
    const [loading, setLoading] = useState(true);
    const [petInfo, setPetInfo] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                
                if (!token) {
                    Alert.alert('Authentication Error', 'You need to login first.');
                    navigation.navigate('Login');
                    return;
                }
                
                // Fetch user profile
                const userResponse = await axios.get(
                    `${config.address}/api/user/profile`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                const userData = userResponse.data.user;
                const fullName = `${userData.firstName} ${userData.middleName ? userData.middleName + ' ' : ''}${userData.lastName}`;
                const birthdate = userData.birthdate ? new Date(userData.birthdate).toLocaleDateString() : '';
                
                setUserInfo({
                    fullName,
                    gender: userData.gender || '',
                    birthdate,
                    contactNumber: formatContactNumber(userData.contactNumber),
                    address: userData.address || ''
                });
                
                // Fetch pet info
                const petResponse = await axios.get(`${config.address}/api/pet/${id}`);
                setPetInfo(petResponse.data.thePet);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to load data. Please try again.');
                setLoading(false);
            }
        };
        
        fetchData();
    }, [navigation, id]);
    
    const formatContactNumber = (number) => {
        if (!number) return '';
        const numStr = String(number);
        if (numStr.startsWith('63')) {
            return `+63 ${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
        }
        return numStr;
    };
    
    const handleSubmitAdoption = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            if (!token) {
                Alert.alert('Authentication Error', 'You need to login first.');
                return;
            }
            
            // Validate form
            if (homeTypeIndex.row === 0 || householdDescIndex.row === 0 || allergicIndex.row === 0) {
                Alert.alert('Validation Error', 'Please complete all required fields');
                return;
            }
            
            const formData = {
                pet_id: id,
                occupation,
                home_type: homeTypes[homeTypeIndex.row],
                years_resided: yearsResided,
                adults_in_household: adultsInHousehold,
                children_in_household: childrenInHousehold,
                household_description: householdDescriptions[householdDescIndex.row],
                allergic_to_pets: allergicOptions[allergicIndex.row]
            };
            
            await axios.post(
                `${config.address}/api/adoption/submit`, 
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            Alert.alert('Success', 'Adoption form submitted successfully!');
            navigation.navigate('Adoption Process');
            
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Error', 'Failed to submit adoption form. Please try again.');
        }
    };

    let [fontsLoaded] = useFonts({
        Inter_700Bold,
        Inter_500Medium,
    });
    
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff69b4" />
            </View>
        );
    }

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <PaperProvider>
                <AppBar></AppBar>
                <ScrollView style={styles.container}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ff69b4" />
                            <Text style={styles.loadingText}>Loading information...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Pet Information */}
                            {petInfo && (
                                <View style={styles.sectionContainer}>
                                    
                                    <View style={styles.infoCard}>
                                    <View style={styles.sectionHeader}>
                                        <MaterialIcons name="pets" size={24} color="#ff69b4" />
                                        <Text style={styles.sectionTitle}>Pet Information</Text>
                                    </View>
                                        <View style={styles.infoRow}>
                                            <MaterialIcons name="badge" size={18} color="#666" style={styles.infoIcon} />
                                            <Text style={styles.infoText}>Name: {petInfo.p_name}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <MaterialIcons name="category" size={18} color="#666" style={styles.infoIcon} />
                                            <Text style={styles.infoText}>Type: {petInfo.p_type}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <MaterialIcons name="cake" size={18} color="#666" style={styles.infoIcon} />
                                            <Text style={styles.infoText}>Age: {petInfo.p_age} years old</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <MaterialIcons name="wc" size={18} color="#666" style={styles.infoIcon} />
                                            <Text style={styles.infoText}>Gender: {petInfo.p_gender}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <MaterialIcons name="grass" size={18} color="#666" style={styles.infoIcon} />
                                            <Text style={styles.infoText}>Breed: {petInfo.p_breed}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            
                            {/* User Information */}
                            <View style={styles.sectionContainer}>
                                
                                <View style={styles.infoCard}>
                                <View style={styles.sectionHeader}>
                                    <MaterialIcons name="person" size={24} color="#ff69b4" />
                                    <Text style={styles.sectionTitle}>Your Information</Text>
                                </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="badge" size={18} color="#666" style={styles.infoIcon} />
                                        <Text style={styles.infoText}>Full Name: {userInfo.fullName}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="transgender" size={18} color="#666" style={styles.infoIcon} />
                                        <Text style={styles.infoText}>Gender: {userInfo.gender}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="phone" size={18} color="#666" style={styles.infoIcon} />
                                        <Text style={styles.infoText}>Contact: {userInfo.contactNumber}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="home" size={18} color="#666" style={styles.infoIcon} />
                                        <Text style={styles.infoText}>Address: {userInfo.address}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Adoption Form */}
                            <View style={styles.sectionContainer}>
                                
                                <View style={styles.formCard}>
                                <View style={styles.sectionHeader}>
                                    <MaterialIcons name="description" size={24} color="#ff69b4" />
                                    <Text style={styles.sectionTitle}>Adoption Details</Text>
                                </View>
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="work" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Occupation</Text>
                                    </View>
                                    <Input
                                        style={styles.input}
                                        value={occupation}
                                        onChangeText={setOccupation}
                                        placeholder="Your occupation"
                                    />
                                    
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="home" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Home Type</Text>
                                    </View>
                                    <Select
                                        style={styles.select}
                                        selectedIndex={homeTypeIndex}
                                        onSelect={index => setHomeTypeIndex(index)}
                                        value={homeTypes[homeTypeIndex.row]}
                                    >
                                        {homeTypes.map((type, i) => (
                                            <SelectItem key={i} title={type} />
                                        ))}
                                    </Select>
                                    
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="calendar-today" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Years Resided</Text>
                                    </View>
                                    <Input
                                        style={styles.input}
                                        value={yearsResided}
                                        onChangeText={setYearsResided}
                                        placeholder="Number of years"
                                        keyboardType="numeric"
                                    />
                                    
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="people" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Adults in Household</Text>
                                    </View>
                                    <Input
                                        style={styles.input}
                                        value={adultsInHousehold}
                                        onChangeText={setAdultsInHousehold}
                                        placeholder="Number of adults"
                                        keyboardType="numeric"
                                    />
                                    
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="child-care" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Children in Household</Text>
                                    </View>
                                    <Input
                                        style={styles.input}
                                        value={childrenInHousehold}
                                        onChangeText={setChildrenInHousehold}
                                        placeholder="Number of children"
                                        keyboardType="numeric"
                                    />
                                    
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="groups" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Household Description</Text>
                                    </View>
                                    <Select
                                        style={styles.select}
                                        selectedIndex={householdDescIndex}
                                        onSelect={index => setHouseholdDescIndex(index)}
                                        value={householdDescriptions[householdDescIndex.row]}
                                    >
                                        {householdDescriptions.map((desc, i) => (
                                            <SelectItem key={i} title={desc} />
                                        ))}
                                    </Select>
                                    
                                    <View style={styles.labelContainer}>
                                        <MaterialIcons name="warning" size={20} color="#ff69b4" style={styles.labelIcon} />
                                        <Text style={styles.label}>Anyone allergic to pets?</Text>
                                    </View>
                                    <Select
                                        style={styles.select}
                                        selectedIndex={allergicIndex}
                                        onSelect={index => setAllergicIndex(index)}
                                        value={allergicOptions[allergicIndex.row]}
                                    >
                                        {allergicOptions.map((option, i) => (
                                            <SelectItem key={i} title={option} />
                                        ))}
                                    </Select>
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.submitButton} 
                                onPress={showModal}
                            >
                                <MaterialIcons name="send" size={20} color="white" style={styles.buttonIcon} />
                                <Text style={styles.submitButtonText}>Submit Application</Text>
                            </TouchableOpacity>
                        </>
                    )}
                        
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <View style={styles.modalContainer}>
                                    <Text style={styles.modalTitle}>Confirm Submission</Text>
                                    <Text style={styles.modalText}>Are you sure you want to submit this adoption application?</Text>
                                    
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity 
                                            style={[styles.modalButton, styles.cancelButton]}
                                            onPress={hideModal}
                                        >
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={[styles.modalButton, styles.confirmButton]}
                                            onPress={() => {
                                                hideModal();
                                                handleSubmitAdoption();
                                            }}
                                        >
                                            <Text style={styles.buttonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </Portal>
                    </ScrollView>
                
            </PaperProvider>
        </ApplicationProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAF9F6',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ff69b4',
        marginLeft: 8,
        fontFamily: 'Inter_700Bold',
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        marginRight: 8,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 6,
    },
    labelIcon: {
        marginRight: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter_500Medium',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
    },
    select: {
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: '#ff69b4',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    buttonIcon: {
        marginRight: 8,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    modalContainer: {
        alignItems: 'center',
        padding: 20,
        marginHorizontal: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ff69b4',
        marginBottom: 12,
        fontFamily: 'Inter_700Bold',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Inter_500Medium',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    confirmButton: {
        backgroundColor: '#ff69b4',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
});

export default AdoptionForm;