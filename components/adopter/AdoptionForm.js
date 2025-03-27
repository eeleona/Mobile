import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox, List, PaperProvider, Modal, Portal } from 'react-native-paper';
import AppBar from '../design/AppBar';
import { ApplicationProvider, CheckBox, Datepicker, DatepickerProps, Radio, IndexPath, Select, SelectItem, Input, Text } from '@ui-kitten/components';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
 
const AdoptionForm = ({ navigation }) => {
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
        navigation.navigate('Adoption Process');
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
                    <Text style={styles.formHeader}>Adoption Form</Text>
                        <View style={styles.formContainer}>
                            <Text style={styles.formsubHeader}>Account Information</Text>
                            <View style={styles.info}>
                                <Text style={styles.label}>Full Name: Bunnie A. Brown</Text>
                                <Text style={styles.label}>Gender: Female</Text>
                                <Text style={styles.label}>Birthdate: 09/19/2000</Text>
                                <Text style={styles.label}>Contact Number: 9284878278</Text>
                                <Text style={styles.label}>Address: 22 CarrotVille Pasay City</Text>
                            </View>
                        </View>
                        <View style={styles.formContainer2}>
                            <Text style={styles.formsubHeader}>Personal Information</Text>
                            <View style={styles.info2}>
                            <Text style={styles.mlabel}>What is your Occupation?</Text>
                            <Input style={styles.input}/>
                                <Text style={styles.mlabel}>What type of Home do you live in?</Text>
                                <Input style={styles.input}/>
                                <Text style={styles.mlabel}>Number of Years Resided:</Text>
                                <Input style={styles.input}/>
                                <Text style={styles.mlabel}>How many Adults live in your Household?</Text>
                                <Input style={styles.input}/>
                                <Text style={styles.mlabel}>How many Children live in your Household?</Text>
                                <Input style={styles.input}/>
                                <Text style={styles.mlabel}>Please describe your household:</Text>
                                <Input style={styles.input}/>
                            </View>
                            <View style={styles.btnC}>
                                <TouchableOpacity style={styles.btn} onPress={showModal}>
                                    <Text style={styles.btnlabel}>Submit Adoption</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    
                        <View style={styles.pinfo}>
                        <Portal>
                            <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <View style={styles.modalcontainer}>
                                <Text style={styles.successtext}>Submit Adoption Application?</Text>
                                <TouchableOpacity style={styles.submitButton2}>
                                    <Text style={styles.submitButtonText} onPress={handleLogin}>Submit</Text>
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
        height: 560,
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
});
 
export default AdoptionForm;