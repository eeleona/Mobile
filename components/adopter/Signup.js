import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox, Modal, Portal, Button, PaperProvider, RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const Signup = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        password: '',
        confirmPassword: '',
        address: '',
        contactNumber: '',
        gender: '',
        birthDate: new Date(),
        profileImage: null,
        validId: null
    });
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState(null);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    // Validate form
    const validate = () => {
        const newErrors = {};
        if (!formData.username || formData.username.length < 3) 
            newErrors.username = "Username must be at least 3 characters";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) 
            newErrors.email = "Invalid email address";
        if (!formData.firstName) 
            newErrors.firstName = "First name is required";
        if (!formData.lastName) 
            newErrors.lastName = "Last name is required";
        if (!formData.password || formData.password.length < 6) 
            newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) 
            newErrors.confirmPassword = "Passwords don't match";
        if (!formData.address) 
            newErrors.address = "Address is required";
        if (!formData.contactNumber || !/^\+?[1-9]\d{1,14}$/.test(formData.contactNumber)) 
            newErrors.contactNumber = "Invalid contact number";
        if (!formData.gender) 
            newErrors.gender = "Gender is required";
        if (!formData.validId) 
            newErrors.validId = "Valid ID is required";
        if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime()))
            newErrors.birthDate = "Valid birthdate is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setShowPrivacyModal(true);
    };

    // Image picker with compression
    const pickImage = async (type) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your photos to upload images');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const compressedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );

                if (type === 'profile') {
                    setFormData(prev => ({ ...prev, profileImage: compressedImage.uri }));
                } else {
                    setFormData(prev => ({ ...prev, validId: compressedImage.uri }));
                }
                setImageError(null);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            setImageError('Failed to select image. Please try again.');
        }
    };

    // Final submission with privacy policy check
    const handleFinalSubmit = async () => {
        if (!privacyAccepted) {
            Alert.alert('Error', 'You must accept the privacy policy');
            return;
        }
        
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Append all text fields
            formDataToSend.append('p_username', formData.username);
            formDataToSend.append('p_emailadd', formData.email);
            formDataToSend.append('p_fname', formData.firstName);
            formDataToSend.append('p_lname', formData.lastName);
            formDataToSend.append('p_mname', formData.middleName || '');
            formDataToSend.append('p_password', formData.password);
            formDataToSend.append('p_repassword', formData.confirmPassword);
            formDataToSend.append('p_add', formData.address);
            formDataToSend.append('p_contactnumber', formData.contactNumber);
            formDataToSend.append('p_gender', formData.gender);
            
            // Format date to DD/MM/YYYY
            const formattedDate = `${formData.birthDate.getDate()}/${formData.birthDate.getMonth() + 1}/${formData.birthDate.getFullYear()}`;
            formDataToSend.append('p_birthdate', formattedDate);
            
            // Append profile image if exists
            if (formData.profileImage) {
                const profileImageUriParts = formData.profileImage.split('.');
                const profileImageFileType = profileImageUriParts[profileImageUriParts.length - 1];
                
                formDataToSend.append('p_img', {
                    uri: formData.profileImage,
                    name: `profile_${Date.now()}.${profileImageFileType}`,
                    type: `image/${profileImageFileType}`,
                });
            }
            
            // Append valid ID if exists
            if (formData.validId) {
                const validIdUriParts = formData.validId.split('.');
                const validIdFileType = validIdUriParts[validIdUriParts.length - 1];
                
                formDataToSend.append('p_validID', {
                    uri: formData.validId,
                    name: `validID_${Date.now()}.${validIdFileType}`,
                    type: `image/${validIdFileType}`,
                });
            }

            // Submit data
            const response = await axios.post(`${config.address}/api/user/new`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
            });

            // Send welcome email
            const emailData = {
                to: formData.email,
                subject: 'Account Application Status',
                text: `Good Day, ${formData.firstName}!\n\nThank you for signing up with us!\n\nPlease note that your account is currently pending verification. Our admin team will review your credentials shortly. In the meantime, you are welcome to browse through the wonderful pets available on our platform.\n\nIf you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nPasay Animal Shelter`,
            };

            await axios.post(`${config.address}/api/send-email`, emailData);

            Alert.alert(
                "Success",
                "Account created! Awaiting verification.",
                [{ text: "OK", onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            } else if (error.request) {
                console.log('Request:', error.request);
            }
            
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Registration failed. Please try again.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
            setShowPrivacyModal(false);
        }
    };

    const showDatepicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatepicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateConfirm = (event, selectedDate) => {
        hideDatepicker();
        if (selectedDate) {
            setFormData({...formData, birthDate: selectedDate});
        }
    };

    return (
        <PaperProvider>
            <AppBar />
            <ScrollView style={styles.container}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']}
                    style={styles.gradientOverlay}
                >
                    <Text style={styles.header}>Account Information</Text>
                    
                    {/* Profile Image */}
                    <TouchableOpacity onPress={() => pickImage('profile')}>
                        <View style={styles.profileImageContainer}>
                            {formData.profileImage ? (
                                <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <Text style={styles.placeholderText}>+</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    {imageError && <Text style={styles.error}>{imageError}</Text>}

                    {/* Username */}
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter username"
                        value={formData.username}
                        onChangeText={(text) => setFormData({...formData, username: text})}
                    />
                    {errors.username && <Text style={styles.error}>{errors.username}</Text>}

                    {/* Email */}
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(text) => setFormData({...formData, email: text})}
                    />
                    {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                    {/* Password Fields */}
                    <View style={styles.row}>
                        <View style={styles.passwordInput}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                value={formData.password}
                                onChangeText={(text) => setFormData({...formData, password: text})}
                            />
                            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                        </View>
                        <View style={styles.passwordInput}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                secureTextEntry
                                value={formData.confirmPassword}
                                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                            />
                            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                        </View>
                    </View>

                    <Text style={styles.header2}>Personal Information</Text>
                    
                    {/* Name Fields */}
                    <View style={styles.row}>
                        <View style={styles.firstNameInput}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="First name"
                                value={formData.firstName}
                                onChangeText={(text) => setFormData({...formData, firstName: text})}
                            />
                            {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
                        </View>
                        <View style={styles.middleNameInput}>
                            <Text style={styles.label}>M.I.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="M.I."
                                value={formData.middleName}
                                onChangeText={(text) => setFormData({...formData, middleName: text})}
                                maxLength={1}
                            />
                        </View>
                    </View>
                    <View style={styles.lastNameInput}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Last name"
                            value={formData.lastName}
                            onChangeText={(text) => setFormData({...formData, lastName: text})}
                        />
                        {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
                    </View>

                    {/* Address */}
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Complete address"
                        value={formData.address}
                        onChangeText={(text) => setFormData({...formData, address: text})}
                    />
                    {errors.address && <Text style={styles.error}>{errors.address}</Text>}

                    {/* Contact and Birthdate */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Contact Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+63"
                                keyboardType="phone-pad"
                                value={formData.contactNumber}
                                onChangeText={(text) => setFormData({...formData, contactNumber: text})}
                            />
                            {errors.contactNumber && <Text style={styles.error}>{errors.contactNumber}</Text>}
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Birthdate</Text>
                            <TouchableOpacity 
                                style={styles.input} 
                                onPress={showDatepicker}
                            >
                                <Text>{formData.birthDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            {errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}
                        </View>
                    </View>

                    {/* Gender */}
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.radioGroup}>
                        <View style={styles.radioButton}>
                            <RadioButton
                                value="Male"
                                status={formData.gender === 'Male' ? 'checked' : 'unchecked'}
                                onPress={() => setFormData({...formData, gender: 'Male'})}
                            />
                            <Text style={styles.radioLabel}>Male</Text>
                        </View>
                        <View style={styles.radioButton}>
                            <RadioButton
                                value="Female"
                                status={formData.gender === 'Female' ? 'checked' : 'unchecked'}
                                onPress={() => setFormData({...formData, gender: 'Female'})}
                            />
                            <Text style={styles.radioLabel}>Female</Text>
                        </View>
                    </View>
                    {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

                    {/* Valid ID Upload */}
                    <Text style={styles.label}>Valid ID</Text>
                    <TouchableOpacity 
                        style={styles.uploadButton}
                        onPress={() => pickImage('id')}
                    >
                        <Text style={styles.uploadButtonText}>
                            {formData.validId ? 'Change Valid ID' : 'Upload Valid ID'}
                        </Text>
                    </TouchableOpacity>
                    {formData.validId && (
                        <View style={styles.validIdPreview}>
                            <Image 
                                source={{ uri: formData.validId }} 
                                style={styles.validIdImage} 
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    {errors.validId && <Text style={styles.error}>{errors.validId}</Text>}

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* Privacy Modal */}
                    <Portal>
                        <Modal 
                            visible={showPrivacyModal} 
                            onDismiss={() => setShowPrivacyModal(false)}
                            contentContainerStyle={styles.modalContainer}
                        >
                            <ScrollView style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Data Privacy</Text>
                                <Text style={styles.modalText}>
                                    Your privacy is important to us. This statement outlines how we collect, use, and protect your information when you sign up for our service.
                                </Text>
                                <Text style={styles.modalSubtitle}>What We Collect:</Text>
                                <Text style={styles.modalText}>
                                    - Basic info like name, email, phone, and address.
                                    {"\n"}- Additional details about your preferences and usage of our app.
                                </Text>
                                <Text style={styles.modalSubtitle}>How We Use It:</Text>
                                <Text style={styles.modalText}>
                                    - To manage your account and deliver our services.
                                    {"\n"}- To personalize your experience and send relevant updates.
                                    {"\n"}- To analyze trends and improve our app.
                                </Text>
                                <Text style={styles.modalSubtitle}>Security & Sharing:</Text>
                                <Text style={styles.modalText}>
                                    - We keep your data secure and don't sell it to third parties.
                                    {"\n"}- Trusted partners may access your info to support our services.
                                </Text>
                                <Text style={styles.modalSubtitle}>Your Rights:</Text>
                                <Text style={styles.modalText}>
                                    - You can access, correct, or delete your data anytime.
                                </Text>
                                <View style={styles.checkboxContainer}>
                                    <Checkbox
                                        status={privacyAccepted ? 'checked' : 'unchecked'}
                                        onPress={() => setPrivacyAccepted(!privacyAccepted)}
                                    />
                                    <Text style={styles.checkboxLabel}>I accept the Data Privacy Policy</Text>
                                </View>
                                <Button 
                                    mode="contained" 
                                    onPress={handleFinalSubmit}
                                    loading={loading}
                                    disabled={!privacyAccepted || loading}
                                    style={styles.modalButton}
                                >
                                    {loading ? 'Processing...' : 'Submit'}
                                </Button>
                            </ScrollView>
                        </Modal>
                    </Portal>
                </LinearGradient>
            </ScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    gradientOverlay: {
        flex: 1,
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff69b4',
        textAlign: 'left',
        marginBottom: 20,
    },
    header2: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff69b4',
        textAlign: 'left',
        marginBottom: 5,
        marginTop: 20,
    },
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 30,
        color: '#666',
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    firstNameInput: {
        width: '68%',
    },
    middleNameInput: {
        width: '25%',
    },
    lastNameInput: {
        width: '100%',
    },
    passwordInput: {
        width: '48%',
    },
    halfInput: {
        width: '48%',
    },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioLabel: {
        marginLeft: 8,
    },
    uploadButton: {
        backgroundColor: '#cad47c',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    validIdPreview: {
        marginTop: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    validIdImage: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    submitButton: {
        backgroundColor: '#ff69b4',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 5,
    },
    modalContent: {
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    modalText: {
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
    },
    checkboxLabel: {
        marginLeft: 10,
    },
    modalButton: {
        marginTop: 10,
        backgroundColor: '#ff69b4',
    },
});

export default Signup;