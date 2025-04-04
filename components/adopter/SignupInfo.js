import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox, Modal, Portal, Button, PaperProvider, RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import appbar from '../design/AppBar'; // Import your custom AppBar
import AppBar from '../design/AppBar';

const SignupInfo = () => {
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
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

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
        if (!formData.birthDate) 
            newErrors.birthDate = "Birthdate is required";
        if (!formData.gender) 
            newErrors.gender = "Gender is required";
        if (!formData.validId) 
            newErrors.validId = "Valid ID is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setShowPrivacyModal(true);
    };

    const handleFinalSubmit = async () => {
        if (!privacyAccepted) return;
        setLoading(true);

        try {
            // Here you would make your API call similar to the web version
            // const response = await axios.post(`${config.address}/api/user/new`, formData);
            
            // Simulate API call success
            setTimeout(() => {
                setLoading(false);
                setShowPrivacyModal(false);
                Alert.alert(
                    "Sign Up Successful",
                    "Your account has been created and is pending verification",
                    [
                        { text: "OK", onPress: () => navigation.navigate('Login') }
                    ]
                );
            }, 1500);
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", error.message || "Failed to create account");
        }
    };

    const pickImage = async (type) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === 'profile') {
                setFormData({...formData, profileImage: result.assets[0].uri});
            } else {
                setFormData({...formData, validId: result.assets[0].uri});
            }
        }
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData({...formData, birthDate: selectedDate});
        }
    };

    return (
        <PaperProvider>
        <AppBar />
        <ScrollView style={styles.container}>
            <View style={styles.whitebg}>
                <Text style={styles.header}>Create Account</Text>
                
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

                {/* Name Fields - Updated with Middle Initial first */}
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
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text>{formData.birthDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.birthDate}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                        {errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}
                    </View>
                </View>

                {/* Gender - Updated with Radio Buttons */}
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
                >
                    <Text style={styles.submitButtonText}>Sign Up</Text>
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
            </View>
        </ScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FAF9F6',
    },
    whitebg: {backgroundColor: 'white', padding: 20, borderRadius: 10, marginHorizontal: 20},
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff69b4',
        textAlign: 'left',
        marginBottom: 20,
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

export default SignupInfo;