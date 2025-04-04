import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { List, PaperProvider, Modal, Portal } from 'react-native-paper';
import AppBar from '../design/AppBar';
import { ApplicationProvider, Datepicker, DatepickerProps, Radio, IndexPath, Select, SelectItem, Input, Text } from '@ui-kitten/components';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
 
const AddEvent = ({ navigation }) => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};
    const [activeChecked, setActiveChecked] = React.useState(false);
    const handlePress = () => setExpanded(!expanded);
    
    let [fontsLoaded] = useFonts({
        Inter_700Bold,
        Inter_500Medium,
      });
    
      if (!fontsLoaded) {
        return null;
      }

      const handleBack = () => {
        navigation.navigate('Events');
      };
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
        <PaperProvider>
                <ScrollView style={styles.container}>
                    <AppBar></AppBar>
                    <Text style={styles.formHeader}>Add Event</Text>
                    <View style={styles.formContainer1}>
                    <View style={styles.formContainer}>
                        <View style={styles.addiconContainer}>
                        <Image style={styles.addicon} source={require('../../assets/Images/addicon.png')}></Image>
                        </View>
                        <View style={styles.info}>
                        <Text style={styles.label}>Name of Event:</Text>
                        <Input style={styles.input}/>
                        <Text style={styles.label}>Event Location:</Text>
                        <Input style={styles.input}/>
                        <Text style={styles.label}>Date and Time:</Text>
                        <Input style={styles.input}/>
                        <Text style={styles.label}>Description of Event:</Text>
                        <Input style={styles.input}/>
                        
                        <TouchableOpacity style={styles.IDButton} onPress={showModal}>
                            <Text style={styles.submitButtonText2}>Add Event</Text>
                        </TouchableOpacity>
            
                        </View>
                    </View>
                    </View>
                        <Portal>
                            <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <View style={styles.modalcontainer}>
                                <Text style={styles.successtext}>Event Added!</Text>
                                <Text style={styles.successsubtext}>Event has been added succesfully to list of events.</Text>
                                <View style={styles.backbtn}>
                                    <TouchableOpacity style={styles.submitButton2}>
                                        <Text style={styles.submitButtonText} onPress={handleBack}>Back</Text>
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
        
    },
    containers: {
        minHeight: 128,
        alignItems: 'center',
      },
      addiconContainer: {
        alignItems: 'center',
    },
    addicon: {
        marginTop: 20,
        marginBottom: 10,
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        padding: 5,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        height: 600,
        marginTop: 40,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 30,
        marginTop: 25,
        width: '100%',
        color: '#ff69b4',
        textAlign: 'center',
        fontFamily: 'Inter_700Bold',
    },
    successsubtext: {
        fontFamily: 'Inter_500Medium',
        fonstSize: '15',
        marginTop: 10,
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
    info: {
      marginTop: 10,
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
        marginTop: 40,
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
    backbtn: {
        justifyContent: 'flex-end',
        marginLeft: 198,
    },
    submitButton2: {
        backgroundColor: '#ff69b4',
        borderRadius: 5,
        marginTop: 30,
        width: 100,
        height: 30,
    },
    submitButton: {
        backgroundColor: '#ff69b4',
        paddingVertical: 15,
        borderRadius: 5,
    },
    submitButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        marginTop: 6,
    },
    submitButtonText2: {
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
        width: '100%',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontSize: 10,
        fontFamily: 'Inter',
        marginBottom: 5,
      },
});
 
export default AddEvent;