import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox, List, PaperProvider, Modal, Portal } from 'react-native-paper';
import AppBar from '../design/AppBar';
import { ApplicationProvider, CheckBox, Datepicker, DatepickerProps, Radio, IndexPath, Select, SelectItem, Input, Text } from '@ui-kitten/components';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
 
const SignupInfo = ({ navigation }) => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};
    const [activeChecked, setActiveChecked] = React.useState(false);
    const handlePress = () => setExpanded(!expanded);
    const [checked, setChecked] = React.useState(false);
    let [fontsLoaded] = useFonts({
        Inter_700Bold,
        Inter_500Medium,
      });
    
      if (!fontsLoaded) {
        return null;
      }

      const handleLogin = () => {
        navigation.navigate('Login');
      };
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
        <PaperProvider>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.gradientOverlay}
            >
                <ScrollView style={styles.container}>
                    <AppBar></AppBar>
                    <Text style={styles.formHeader}>Create Account</Text>
                    <View style={styles.formContainer}>
                        <Text style={styles.formsubHeader}>Personal Information</Text>
                        <View style={styles.info}>
                        <Text style={styles.label}>First Name</Text>
                        <Input style={styles.input}/>
                        <View style={styles.mlnamelabel}>
                        <Text style={styles.mlabel}>Middle Name</Text>
                        <Text style={styles.llabel}>Last Name</Text>
                        </View>
                        <View style={styles.mlname}>
                            <Input style={styles.minput}/>
                            <Input style={styles.linput}/>
                        </View>
                        <View style={styles.mlnamelabel}>
                            <Text style={styles.label}>Gender</Text>
                            <Text style={styles.bdaylabel}>Birthdate</Text>
                        </View>
                            <View style={styles.genderContainer}>
                            <Radio
                                style={styles.radio}
                                checked={activeChecked}
                                onChange={nextChecked => setActiveChecked(nextChecked)}
                            >
                                Male
                            </Radio>
                            <Radio
                                style={styles.radio}
                                checked={activeChecked}
                                onChange={nextChecked => setActiveChecked(nextChecked)}
                            >
                                Female
                            </Radio>
                            <Input style={styles.binput} placeholder='MM/DD/YYYY'/>
                            </View>
                        <Text style={styles.label}>Contact Number</Text>
                        <Input style={styles.input} placeholder='+63'/>
                        <Text style={styles.label}>Address 1</Text>
                        <Input style={styles.input} placeholder='Floor or Unit Number, Street Name, Lot Number'/>
                        <Text style={styles.label}>Address 2</Text>
                        <Input style={styles.input} placeholder='Building, Subdivision, City/Municipality, Province'/>
                        {/* <List.Accordion
                            style={styles.id}
                            title="Please select the Valid ID"
                            left={props => <List.Icon {...props} icon="identifier" />}>
                            <List.Item title="Postal ID" />
                            <List.Item title="National ID" />
                            <List.Item title="Passport" />
                            <List.Item title="Drivers License" />
                        </List.Accordion> */}
                        <TouchableOpacity style={styles.IDButton}>
                            <Text style={styles.submitButtonText}>Upload Valid ID</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={showModal}>
                            <Text style={styles.submitButtonText}>Create Account</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                        <View style={styles.pinfo}>
                        <Portal>
                            <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <View style={styles.modalcontainer}>
                                <Text style={styles.successtext}>Account Successfully Created!</Text>
                                <Text style={styles.label2}>Please log in your credentials.</Text>
                                <TouchableOpacity style={styles.submitButton2}>
                                    <Text style={styles.submitButtonText} onPress={handleLogin}>Log in</Text>
                                </TouchableOpacity>
                                </View>
                            </Modal>
                        </Portal>
                        
                    </View>
                </ScrollView>
            </LinearGradient>
        </PaperProvider>
        </ApplicationProvider>
    );
};
 
const styles = StyleSheet.create({
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
        padding: 5,
        backgroundColor: '#fff',
        margin: 15,
        marginTop: 20,
        height: '77%',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        elevation: 5,
    },
    radio: {
        fontFamily: 'Inter_500Medium',
        marginTop: 5,
        fonstSize: 15,
    },
    gender: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    genderContainer: {
        width: '114%',
        flexDirection: 'row',
    },
    formHeader: {
        fontSize: 40,
        marginTop: 20,
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
        width: '90%',
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
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 10,
        width: '60%',
        
    },
    submitButton: {
        backgroundColor: '#ff69b4',
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    submitButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
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
});
 
export default SignupInfo;