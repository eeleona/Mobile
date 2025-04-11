import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PaperProvider, Modal, Portal } from 'react-native-paper';
import AppBar from '../design/AppBar';
import { ApplicationProvider, CheckBox, Input, Text } from '@ui-kitten/components';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../server/config/config';

const AdoptionForm = ({ navigation, route }) => {
    // Add pet ID from route params
    const { id } = route.params;
    
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};
    
    // Add form state
    const [occupation, setOccupation] = useState('');
    const [homeType, setHomeType] = useState('');
    const [yearsResided, setYearsResided] = useState('');
    const [adultsInHousehold, setAdultsInHousehold] = useState('');
    const [childrenInHousehold, setChildrenInHousehold] = useState('');
    const [householdDescription, setHouseholdDescription] = useState('');
    const [allergicToPets, setAllergicToPets] = useState(false);
    
    // Add user information state
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        gender: '',
        birthdate: '',
        contactNumber: '',
        address: ''
    });
    
    // Add loading state
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Function to fetch user profile information
        const fetchUserProfile = async () => {
            try {
                // Get the token from AsyncStorage
                const token = await AsyncStorage.getItem('authToken');
                
                if (!token) {
                    Alert.alert('Authentication Error', 'You need to login first.');
                    navigation.navigate('Login'); // Navigate to login screen
                    return;
                }
                
                // Fetch user profile information
                const response = await axios.get(
                    `${config.address}/api/user/profile`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                const userData = response.data.user;
                
                // Format the full name from the response
                const fullName = `${userData.firstName} ${userData.middleName ? userData.middleName + ' ' : ''}${userData.lastName}`;
                
                // Format the birthdate (assuming it comes as a date string)
                const birthdate = userData.birthdate ? new Date(userData.birthdate).toLocaleDateString() : '';
                
                // Format contact number if needed (similar to web version)
                const formattedContact = formatContactNumber(userData.contactNumber);
                
                // Update user info state
                setUserInfo({
                    fullName: fullName,
                    gender: userData.gender || '',
                    birthdate: birthdate,
                    contactNumber: formattedContact,
                    address: userData.address || ''
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error.response?.data || error.message);
                Alert.alert('Error', 'Failed to load user information. Please try again.');
                setLoading(false);
            }
        };
        
        // Call the function to fetch user profile
        fetchUserProfile();
    }, [navigation]);
    
    // Function to format contact number (similar to web version)
    const formatContactNumber = (number) => {
        if (!number) return '';
        const numStr = String(number);
        if (numStr.startsWith('63')) {
            return `+63 ${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
        }
        return numStr;
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

    const handleSubmitAdoption = async () => {
        try {
            // Get the token from AsyncStorage
            const token = await AsyncStorage.getItem('authToken');
            
            if (!token) {
                Alert.alert('Authentication Error', 'You need to login first.');
                return;
            }
            
            // Create the adoption form data
            const formData = {
                pet_id: id,
                occupation,
                home_type: homeType,
                years_resided: yearsResided,
                adults_in_household: adultsInHousehold,
                children_in_household: childrenInHousehold,
                household_description: householdDescription,
                allergic_to_pets: allergicToPets ? 'Yes' : 'No'
            };
            
            // Send the request with the token in the header
            const response = await axios.post(
                `${config.address}/api/adoption/submit`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            Alert.alert('Success', 'Adoption form submitted successfully!');
            navigation.navigate('Adoption Process');
            
        } catch (error) {
            console.error('Error submitting adoption form:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to submit adoption form. Please try again.');
        }
    };

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <PaperProvider>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']}
                    style={styles.gradientOverlay}
                >
                    <ScrollView style={styles.container}>
                        <AppBar />
                        <Text style={styles.formHeader}>Adoption Form</Text>
                        
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#ff69b4" />
                                <Text style={styles.loadingText}>Loading user information...</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.formContainer}>
                                    <Text style={styles.formsubHeader}>Account Information</Text>
                                    <View style={styles.info}>
                                        <Text style={styles.label}>Full Name: {userInfo.fullName}</Text>
                                        <Text style={styles.label}>Gender: {userInfo.gender}</Text>
                                        <Text style={styles.label}>Birthdate: {userInfo.birthdate}</Text>
                                        <Text style={styles.label}>Contact Number: {userInfo.contactNumber}</Text>
                                        <Text style={styles.label}>Address: {userInfo.address}</Text>
                                    </View>
                                </View>
                                <View style={styles.formContainer2}>
                                    <Text style={styles.formsubHeader}>Personal Information</Text>
                                    <View style={styles.info2}>
                                        <Text style={styles.mlabel}>What is your Occupation?</Text>
                                        <Input 
                                            style={styles.input}
                                            value={occupation}
                                            onChangeText={setOccupation}
                                        />
                                        <Text style={styles.mlabel}>What type of Home do you live in?</Text>
                                        <Input 
                                            style={styles.input}
                                            value={homeType}
                                            onChangeText={setHomeType}
                                        />
                                        <Text style={styles.mlabel}>Number of Years Resided:</Text>
                                        <Input 
                                            style={styles.input}
                                            value={yearsResided}
                                            onChangeText={setYearsResided}
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.mlabel}>How many Adults live in your Household?</Text>
                                        <Input 
                                            style={styles.input}
                                            value={adultsInHousehold}
                                            onChangeText={setAdultsInHousehold}
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.mlabel}>How many Children live in your Household?</Text>
                                        <Input 
                                            style={styles.input}
                                            value={childrenInHousehold}
                                            onChangeText={setChildrenInHousehold}
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.mlabel}>Please describe your household:</Text>
                                        <Input 
                                            style={styles.input}
                                            value={householdDescription}
                                            onChangeText={setHouseholdDescription}
                                            multiline={true}
                                        />
                                        <View style={styles.checkboxContainer}>
                                            <CheckBox
                                                checked={allergicToPets}
                                                onChange={nextChecked => setAllergicToPets(nextChecked)}
                                                style={styles.checkbox}
                                            >
                                                <Text style={styles.checkboxText}>Anyone allergic to pets?</Text>
                                            </CheckBox>
                                        </View>
                                    </View>
                                    <View style={styles.btnC}>
                                        <TouchableOpacity style={styles.btn} onPress={showModal}>
                                            <Text style={styles.btnlabel}>Submit Adoption</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
                        
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <View style={styles.modalcontainer}>
                                    <Text style={styles.successtext}>Submit Adoption Application?</Text>
                                    <TouchableOpacity style={styles.submitButton2}>
                                        <Text 
                                            style={styles.submitButtonText} 
                                            onPress={() => {
                                                hideModal();
                                                handleSubmitAdoption();
                                            }}
                                        >Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </Portal>
                    </ScrollView>
                </LinearGradient>
            </PaperProvider>
        </ApplicationProvider>
    );
};
 
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Inter_500Medium'
    },
    container: {
        flex: 1,
    },
    check: {
        flexDirection: 'row',
    },
    containers: {
        minHeight: 128,
    },
    logo: {
        width: 40,
        height: 40,
        alignItems: 'center',
        
    },
    label2: {
        marginTop: 15,
        marginBottom: 5,
    },
    labels: {
        fontFamily: 'Inter_500Medium',
        marginBottom: 10,
    },
    btnC: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    },
    btn: {
        backgroundColor: '#cad47c',
        width: '60%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    btnlabel: {
        fontFamily: 'Inter_700Bold',
        color: 'white',
        fontSize: 19,
    },
    background: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    gradientOverlay: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    formContainer: {
        backgroundColor: '#fff',
        margin: 15,
        marginTop: 10,
        height: 170,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        elevation: 5,
    },
    formContainer2: {
        backgroundColor: '#fff',
        margin: 15,
        marginTop: -10,
        height: 600, // Increased height for checkbox
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        elevation: 5,
    },
    formHeader: {
        fontSize: 30,
        marginTop: 10,
        width: '100%',
        color: '#ff69b4',
        textAlign: 'center',
        fontFamily: 'Inter_700Bold'
    },
    formsubHeader: {
        fontSize: 27,
        marginTop: 10,
        width: '100%',
        color: '#ff69b4',
        textAlign: 'left',
        marginLeft: 35,
        fontFamily: 'Inter_700Bold',
    },
    labelcontainer: {
        width: '100%',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    label: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'flex-start',
        fontFamily: 'Inter_500Medium',
    },
    mlnamelabel: {
        flexDirection: 'row',
    },
    info: {
        marginLeft: -145,
    },
    info2: {
        width: '90%',
    },
    mlabel: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'flex-start',
        fontFamily: 'Inter_500Medium',
    },
    llabel: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'flex-start',
        fontFamily: 'Inter_500Medium',
        marginLeft: 28,
    },
    bdaylabel:{
        marginTop: 5,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'flex-start',
        fontFamily: 'Inter_500Medium',
        marginLeft: 103,
    },
    input: {
        marginTop: 5,
        marginBottom: 10,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    mlname: {
        width: '106%',
        flexDirection: 'row',
    },
    minput: {
        marginTop: 5,
        marginBottom: 10,
        width: '25%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    linput: {
        marginTop: 5,
        marginBottom: 10,
        width: '60%',
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 2,
        paddingLeft: 5,
    },
    binput: {
        marginTop: 5,
        marginBottom: 10,
        width: '45%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    dateInput: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        textAlign: 'center',
    },
    IDButton: {
        backgroundColor: '#cad47c',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    id: {
        marginTop: 5,
        marginBottom: 10,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    submitButton2: {
        backgroundColor: '#ff69b4',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 15,
        width: '60%',
        
    },
    submitButton: {
        backgroundColor: '#ff69b4',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    submitButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
    },
    label2: {
        marginTop: 8,
        marginBottom: 3,
        fontSize: 15,
        fontFamily: 'Inter',
    },
    successtext:{
        fontSize: 25,
        color: '#cad47c',
        fontFamily: 'Inter_700Bold',
    },
    mContainer: {
        width: '95%',
        alignContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    modalcontainer: {
        alignItems: 'center',
        alignContent: 'center'
    },
    error: {
        color: 'red',
        fontSize: 10,
        fontFamily: 'Inter',
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
    },
});
 
export default AdoptionForm;