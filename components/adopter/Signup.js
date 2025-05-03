import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox, Modal, Portal, Button, PaperProvider, RadioButton } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

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
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

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
        if (!formData.contactNumber || !/^09\d{9}$/.test(formData.contactNumber)) 
            newErrors.contactNumber = "Contact number must start with 09 and be 11 digits";
        if (!formData.gender) 
            newErrors.gender = "Gender is required";
        if (!formData.validId) 
            newErrors.validId = "Valid ID is required";
        if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime()))
            newErrors.birthDate = "Valid birthdate is required";
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            setShowErrorModal(true);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setShowPrivacyModal(true);
    };

    const validatePhoneNumber = (text) => {
        // Remove all non-digit characters
        const cleaned = ('' + text).replace(/\D/g, '');
        return cleaned;
      };

    const pickImage = async (type) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'We need access to your photos to upload images',
                    [{ text: 'OK', onPress: () => console.log('Permission denied') }]
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === 'profile' ? [1, 1] : [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const compressedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: type === 'profile' ? 500 : 800 } }],
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        setFormData({...formData, birthDate: date});
        hideDatePicker();
    };

    const handleFinalSubmit = async () => {
        if (!privacyAccepted) {
            Alert.alert('Error', 'You must accept the privacy policy');
            return;
        }
        
        setModalLoading(true);

        try {
            const formDataToSend = new FormData();
            
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
            
            const formattedDate = `${formData.birthDate.getDate()}/${formData.birthDate.getMonth() + 1}/${formData.birthDate.getFullYear()}`;
            formDataToSend.append('p_birthdate', formattedDate);
            
            if (formData.profileImage) {
                const profileImageUriParts = formData.profileImage.split('.');
                const profileImageFileType = profileImageUriParts[profileImageUriParts.length - 1];
                
                formDataToSend.append('p_img', {
                    uri: formData.profileImage,
                    name: `profile_${Date.now()}.${profileImageFileType}`,
                    type: `image/${profileImageFileType}`,
                });
            }
            
            if (formData.validId) {
                const validIdUriParts = formData.validId.split('.');
                const validIdFileType = validIdUriParts[validIdUriParts.length - 1];
                
                formDataToSend.append('p_validID', {
                    uri: formData.validId,
                    name: `validID_${Date.now()}.${validIdFileType}`,
                    type: `image/${validIdFileType}`,
                });
            }

            const response = await axios.post(`${config.address}/api/user/new`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
            });

            const emailData = {
                to: formData.email,
                subject: 'Account Application Status',
                text: `Good Day, ${formData.firstName}!\n\nThank you for signing up with us!\n\nPlease note that your account is currently pending verification. Our admin team will review your credentials shortly. In the meantime, you are welcome to browse through the wonderful pets available on our platform.\n\nIf you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nPasay Animal Shelter`,
            };

            await axios.post(`${config.address}/api/send-email`, emailData);

            Alert.alert(
                "Account created successfully!",
                "Your account is pending verification. You can now login your account.",
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
            setModalLoading(false);
            setLoading(false);
            setShowPrivacyModal(false);
        }
    };

    return (
        <PaperProvider>
            <StatusBar barStyle="default" />
            <AppBar />
            <ScrollView style={styles.container}>
                <View style={styles.whitebg}>
                    <Text style={styles.header}>Account Information</Text>
                    
                    <View style={styles.profileImageContainer}>
                        <TouchableOpacity onPress={() => pickImage('profile')} style={styles.profileImageWrapper}>
                            {formData.profileImage ? (
                                <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <MaterialIcons name="add-a-photo" size={32} color="#ff69b4" />
                                    <Text style={styles.placeholderText}>Add Profile Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    {imageError && <Text style={styles.error}>{imageError}</Text>}

                    <Text style={styles.label}>
                        <Text style={styles.requiredLabel}>Username</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            value={formData.username}
                            onChangeText={(text) => setFormData({...formData, username: text})}
                        />
                        <MaterialIcons name="person" size={20} color="#888" style={styles.inputIcon} />
                    </View>
                    {errors.username && <Text style={styles.error}>{errors.username}</Text>}

                    <Text style={styles.label}>
                        <Text style={styles.requiredLabel}>Email Address</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => setFormData({...formData, email: text})}
                        />
                        <MaterialIcons name="email" size={20} color="#888" style={styles.inputIcon} />
                    </View>
                    {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                    
                        <View style={[styles.passwordInput]}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>Password</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry={!showPassword}
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({...formData, password: text})}
                                />
                                <MaterialIcons name="lock" size={20} color="#888" style={styles.inputIcon} />
                                <TouchableOpacity 
                                    style={styles.passwordToggle}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <MaterialIcons 
                                        name={showPassword ? "visibility" : "visibility-off"} 
                                        size={20} 
                                        color="#888" 
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                        </View>
                        <View style={styles.passwordInput}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>Re-enter Password</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry={!showConfirmPassword}
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                                />
                                <MaterialIcons name="lock" size={20} color="#888" style={styles.inputIcon} />
                                <TouchableOpacity 
                                    style={styles.passwordToggle}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <MaterialIcons 
                                        name={showConfirmPassword ? "visibility" : "visibility-off"} 
                                        size={20} 
                                        color="#888" 
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                        </View>
                    </View>
                    <View style={styles.whitebg}>
                    <Text style={styles.header2}>Personal Information</Text>
                    
                    <View style={styles.row}>
                        <View style={[styles.firstNameInput]}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>First Name</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChangeText={(text) => setFormData({...formData, firstName: text})}
                                />
                                <MaterialIcons name="person" size={20} color="#888" style={styles.inputIcon} />
                            </View>
                            {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
                        </View>
                        <View style={styles.middleNameInput}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>M.I.</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="M.I."
                                    value={formData.middleName}
                                    onChangeText={(text) => {
                                        const formattedText = text.slice(0, 2).toUpperCase();
                                        setFormData({...formData, middleName: formattedText});
                                    }}
                                    maxLength={2}
                                />
                                <MaterialIcons name="person" size={20} color="#888" style={styles.inputIcon} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.lastNameInput}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>Last Name</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Last name"
                                value={formData.lastName}
                                onChangeText={(text) => setFormData({...formData, lastName: text})}
                            />
                            <MaterialIcons name="person" size={20} color="#888" style={styles.inputIcon} />
                        </View>
                        {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
                    </View>

                    <Text style={styles.label}>
                        <Text style={styles.requiredLabel}>Complete Address</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, styles.addressInput]}
                        value={formData.address}
                        onChangeText={(text) => setFormData({...formData, address: text})}
                        multiline={true}
                        numberOfLines={3}
                        />
                        <MaterialIcons name="home" size={20} color="#888" style={styles.inputIcon2} />
                    </View>
                    {errors.address && <Text style={styles.error}>{errors.address}</Text>}

                    
                        <View style={[styles.halfInput, {marginRight: 10}]}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>Contact Number</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                            <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="09XX XXX XXXX"
                                keyboardType="phone-pad"
                                value={formData.contactNumber}
                                onChangeText={(text) => {
                                    const cleaned = validatePhoneNumber(text);
                                    setFormData({...formData, contactNumber: cleaned});
                                }}
                                maxLength={11} // 09 + 9 digits
                                />
                                <MaterialIcons name="phone" size={20} color="#888" style={styles.inputIcon} />
                            </View>
                            {errors.contactNumber && <Text style={styles.error}>{errors.contactNumber}</Text>}
                        </View>
                        <View style={styles.halfInput}>
                        <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>Birthdate</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                            <TouchableOpacity 
                                style={[styles.input, styles.dateInput]} 
                                onPress={showDatePicker}
                            >
                                <Text style={styles.dateText}>{formData.birthDate.toLocaleDateString()}</Text>
                                <MaterialIcons name="calendar-today" size={20} color="#888" style={styles.inputIcon} />
                            </TouchableOpacity>
                            {errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}
                        </View>
                    

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
                        date={formData.birthDate}
                        maximumDate={new Date()}
                        display="spinner" // This gives better month/year selection
                        textColor="#ff69b4"
                        themeVariant="light"
                        locale="en_PH" // Or your preferred locale
                        cancelTextIOS="Cancel"
                        confirmTextIOS="Confirm"
                        headerTextIOS="Select Birthdate"
                    />

                    <Text style={styles.label}>
                        <Text style={styles.requiredLabel}>Gender</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <View style={styles.radioGroup}>
                        <TouchableOpacity 
                            style={[styles.radioOption, formData.gender === 'Male' && styles.radioOptionSelected]}
                            onPress={() => setFormData({...formData, gender: 'Male'})}
                        >
                            
                            <Text style={styles.radioLabel}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.radioOption, formData.gender === 'Female' && styles.radioOptionSelected]}
                            onPress={() => setFormData({...formData, gender: 'Female'})}
                        >
                            
                            <Text style={styles.radioLabel}>Female</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

                    <Text style={styles.label}>
                            <Text style={styles.requiredLabel}>Valid ID</Text>
                            <Text style={styles.requiredAsterisk}>*</Text>
                        </Text>
                    <TouchableOpacity 
                        style={styles.uploadButton}
                        onPress={() => pickImage('id')}
                    >
                        <MaterialIcons name="upload" size={20} color="white" style={styles.uploadIcon} />
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
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <MaterialIcons name="how-to-reg" size={24} color="white" />
                                <Text style={styles.submitButtonText}>Sign Up</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Error Modal */}
                    <Portal>
                        <Modal 
                            visible={showErrorModal} 
                            onDismiss={() => setShowErrorModal(false)}
                            contentContainerStyle={styles.errorModalContainer}
                        >
                            <View style={styles.errorModalContent}>
                                <MaterialIcons name="error-outline" size={50} color="#ff4444" style={styles.errorIcon} />
                                <Text style={styles.errorModalTitle}>Form Errors</Text>
                                <ScrollView style={styles.errorList}>
                                    {Object.values(errors).map((error, index) => (
                                        <Text key={index} style={styles.errorItem}>
                                            • {error}
                                        </Text>
                                    ))}
                                </ScrollView>
                                <Button 
                                    mode="contained" 
                                    onPress={() => setShowErrorModal(false)}
                                    style={styles.errorModalButton}
                                    labelStyle={styles.errorModalButtonLabel}
                                >
                                    OK
                                </Button>
                            </View>
                        </Modal>
                    </Portal>

                    {/* Privacy Modal */}
                    <Portal>
                        <Modal 
                            visible={showPrivacyModal} 
                            onDismiss={() => setShowPrivacyModal(false)}
                            contentContainerStyle={styles.modalContainer}
                        >
                            <View style={styles.modalContent}>
                                <ScrollView>
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
                                        <View style={styles.checkboxWrapper}>
                                            <Checkbox
                                                status={privacyAccepted ? 'checked' : 'unchecked'}
                                                onPress={() => setPrivacyAccepted(!privacyAccepted)}
                                                
                                            />
                                        </View>
                                        <Text style={styles.checkboxLabel}>I accept the Data Privacy Policy</Text>
                                    </View>
                                </ScrollView>
                                <Button 
                                    mode="contained" 
                                    onPress={handleFinalSubmit}
                                    disabled={!privacyAccepted || modalLoading}
                                    style={styles.modalButton}
                                    labelStyle={styles.modalButtonLabel}
                                >
                                    {modalLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : 'Create Account'}
                                </Button>
                            </View>
                        </Modal>
                    </Portal>
            </ScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    whitebg: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 10,
        borderColor: '#eee',
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
        
    },
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    profileImageWrapper: {
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#ff69b4',
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ff69b4',
        borderStyle: 'dashed',
    },
    placeholderText: {
        marginTop: 5,
        color: '#ff69b4',
        fontSize: 12,
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '600',
        color: '#555',
    },
    requiredLabel: {
        fontWeight: '600',
        color: '#555',
      },
      requiredAsterisk: {
        color: 'red',
      },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        paddingLeft: 40,
        marginBottom: 5,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    inputIcon2: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        zIndex: 1,
    },
    dateInput: {
        justifyContent: 'center',
    },
    dateText: {
        paddingLeft: 5,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    firstNameInput: {
        flex: 0.68,
    },
    middleNameInput: {
        flex: 0.25,
    },
    lastNameInput: {
        width: '100%',
    },
    passwordInput: {
        flex: 0.48,
    },
    halfInput: {
        flex: 0.48,
    },
    addressInput: {
        height: 60,
        textAlignVertical: 'top',
        paddingTop: 12,
      },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 0.48,
    },
    radioOptionSelected: {
        borderColor: '#ff69b4',
        backgroundColor: 'rgba(255, 105, 180, 0.1)',
    },
    radioButtonContainer: {
        marginLeft: -8,
    },
    radioLabel: {
        marginLeft: 8,
        color: '#555',
    },
    uploadButton: {
        backgroundColor: 'white',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ff69b4',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    uploadIcon: {
        marginRight: 10,
        color: '#ff69b4',
    },
    uploadButtonText: {
        color: '#ff69b4',
        fontWeight: 'bold',
        fontSize: 16,
    },
    validIdPreview: {
        marginTop: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    validIdImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    submitButton: {
        backgroundColor: '#ff69b4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 40,
        elevation: 3,
        marginHorizontal: 16,
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#ff69b4',
    },
    modalSubtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#555',
    },
    modalText: {
        marginBottom: 10,
        color: '#555',
        lineHeight: 22,
        fontSize: 16,
    },
    checkboxWrapper: {
        
        // width: 20,
        // height: 20,
        
        borderRadius: 4,
        marginLeft: -4, // To compensate for the default padding
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    checkboxLabel: {
        marginLeft: 10,
        color: '#555',
        fontSize: 16,
    },
    modalButton: {
        marginTop: 10,
        backgroundColor: '#ff69b4',
        borderRadius: 10,
        paddingVertical: 5,
    },
    modalButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorModalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    errorModalContent: {
        alignItems: 'center',
    },
    errorIcon: {
        marginBottom: 15,
    },
    errorModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff4444',
        marginBottom: 15,
    },
    errorList: {
        maxHeight: 200,
        width: '100%',
        marginBottom: 20,
    },
    errorItem: {
        color: '#555',
        marginBottom: 5,
        fontSize: 14,
    },
    errorModalButton: {
        backgroundColor: '#ff4444',
        borderRadius: 10,
        paddingVertical: 5,
        width: '100%',
    },
    errorModalButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Signup;