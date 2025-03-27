import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton, Divider, List, PaperProvider, Modal, Portal} from 'react-native-paper';
import AppBar from '../design/AppBar';
import { ApplicationProvider, Button, Input, Text } from '@ui-kitten/components';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
 
const Signup = ({ navigation }) => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [checked, setChecked] = React.useState('first');
    const [expanded, setExpanded] = React.useState(true);
    const [visible, setVisible] = React.useState(false);
    const [password, setPassword] = useState('');

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};

    const handlePress = () => setExpanded(!expanded);
    
    const handleNext = () => {
        navigation.navigate('Sign up Info');
      };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(Platform.OS === 'ios');
        setDateOfBirth(currentDate);
    };
 
    const showDatepicker = () => {
        setShowDatePicker(true);
    };
 
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
        <PaperProvider>
                <ScrollView style={styles.container}>
                    <AppBar></AppBar>
                    <Text style={styles.formHeader}>Create Account</Text>
                    <View style={styles.formContainer}>
                        <Text style={styles.formsubHeader}>Account Information</Text>
                        <View style={styles.email}>
                        <View style={styles.addiconContainer}>
                        <Image style={styles.addicon} source={require('../../assets/Images/addicon.png')}></Image>
                        </View>
                        <Text style={styles.label}>Email Address</Text>
                        <Input style={styles.input} />
                        <Text style={styles.label}>Password</Text>
                        <Input style={styles.input} value={password} secureTextEntry={true} onChangeText={text => setPassword(text)}/>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
        </PaperProvider>
        </ApplicationProvider>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    background: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    logotext: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        alignItems: 'center',
        marginLeft: 10,
        fontFamily: 'Inter',
    },
    formContainer: {
        padding: 5,
        backgroundColor: '#fff',
        margin: 15,
        marginTop: 30,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        elevation: 5,
        
    },
    formHeader: {
        fontSize: 40,
        marginTop: 30,
        width: '100%',
        color: '#ff69b4',
        textAlign: 'center',
        fontFamily: 'Inter_700Bold'
    },
    formsubHeader: {
        fontSize: 27,
        marginTop: 10,
        marginBottom: 5,
        width: '100%',
        color: '#ff69b4',
        textAlign: 'left',
        marginLeft: 35,
        fontFamily: 'Inter_700Bold'
    },
    addiconContainer: {
        alignItems: 'center',
    },
    addicon: {
        marginTop: 10,
        marginBottom: 10,
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelcontainer: {
        width: '100%',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    label: {
        marginTop: 15,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'flex-start',
        fontFamily: 'Inter_500Medium',
    },
    input: {
        marginTop: 5,
        marginBottom: 10,
        width: "90%",
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    button: {
        width: 180,
        height: 50,
        boxShadow: '0px 4px 4px 2px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#FF9DD9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
      },
      buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        textTransform: 'capitalize',
        wordWrap: 'break-word',
      },
});
 
export default Signup;