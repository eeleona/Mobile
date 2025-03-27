import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import AppBar from '../design/AppBar';
import axios from 'axios';
import { ProgressBar, MD3Colors, Divider, PaperProvider, Modal, Portal, Appbar, Button } from 'react-native-paper';

const ActiveAdoptions = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const fetchEvents = () => {
    axios.get('http://192.168.0.110:8000/api/adoption/active')
      .then((response) => {
        console.log(response.data);
        setAllEvents(response.data);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.allusercontainer}>
      <View style={styles.userContainer}>
        <Text style={styles.userName}>Bunnie A. Brown</Text>
        <Text style={styles.userDetails}>Active Adoption for: Zimomo, Dog</Text>
        
      </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    console.log(allEvents);
  }, [allEvents]);

  return (
    <PaperProvider>
    <View style={styles.container}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Active Adoptions</Text>
      </View>
      <TouchableOpacity onPress={showModal}>
          <FlatList data={allEvents} 
            renderItem={renderItem} 
            keyExtractor={item => item.id}
          />
      </TouchableOpacity>
      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <View style={styles.header}>
          <Image style={styles.profilepic} source={require('../../assets/Images/petdog.jpg')}></Image>
          <View style={styles.details}>
            <Text style={styles.name}>Pet</Text>
            <Text style={styles.labels1}>Name: Zimomo</Text>
            <Text style={styles.labels1}>Gender: Male</Text>
            <Text style={styles.labels1}>Age: 2 years old</Text>
          </View>
        </View>
        <Divider/>
        <View style={styles.header}>
          <Image style={styles.profilepic} source={require('../../assets/Images/verified.jpg')}></Image>
          <View style={styles.details}>
            <Text style={styles.name}>Applicant</Text>
            <Text style={styles.labels1}>Name: Bunnie A. Brown</Text>
            <Text style={styles.labels1}>Username: bunnie</Text>
            <Text style={styles.labels1}>Contact Number: 0928 487 8278</Text>
          </View>
        </View>
          <Divider></Divider>
          <View style={styles.statuss}>
            <Text style={styles.status}>Status: </Text>
            <Text style={styles.status1}>Reviewing Documents</Text>
          </View>
          <ProgressBar style={styles.bar} progress={0.3} color={MD3Colors.tertiary90} />
          <View style={styles.barlabels}>
            <Text style={styles.labels1}>Pending</Text>
            <Text style={styles.labels1}>Accepted</Text>
            <Text style={styles.labels1}>Completed</Text>
          </View>
          <Text style={styles.msg}>Please message the Shelter for updates!</Text>
          
        </Modal>
      </Portal>
      <AdminNavbar></AdminNavbar>
    </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  header: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  submitButton2: {
    backgroundColor: '#ff69b4',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '60%',
    height: 50,
},
  IDButton: {
    width: '40%',
    backgroundColor: '#cad47c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
},
submitButtonText: {
  textAlign: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
  heading: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    marginTop: 15,
    fontSize: 30,
    marginLeft: 15,
  },
  labels1: {
    fontFamily: 'Inter',
    marginBottom: 5,
  },
  details: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  allusercontainer: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
  },
  userContainer: {
    width: '90%',
    height: 70,
    backgroundColor: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.10)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    elevation: 5,
  },
  userName: {
    width: '90%',
    height: 20,
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  barlabels: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statuss: {
    marginTop: 5,
    flexDirection: 'row',
  },
  btncontainer: {
    justifyContent: 'center',
  },
  userDetails: {
    width: '90%',
    height: 20,
    fontFamily: 'Inter',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDescription: {
    width: '90%',
    height: 20,
    fontFamily: 'Inter',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  mContainer: {
    width: '95%',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 5,
    marginTop: -50,
  },
  profilepic: {
    width: 130,
    height: 130,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  label1: {
    marginBottom: 10,
  },
  label2: {
    marginTop: 15,
  },
  labels: {
    fontFamily: 'Inter_500Medium',
    marginBottom: 10,
  },
  labels1: {
    fontFamily: 'Inter_500Medium',
    marginBottom: 5,
  },
  status: {
    marginTop: 15,
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    color: '#ff69b4',
  },
  status1: {
    marginTop: 15,
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    color: 'black',
  },
  msg: {
    marginTop: 20,
    fontSize: 17,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    color: 'black',
    textAlign: 'center'
  },
  name: {
    marginTop: 13,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: '#ff69b4',
  },
  editbtn: {
    backgroundColor: '#cad47c',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  editbtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  bar: {
    marginTop: 10,
  },
  
});

export default ActiveAdoptions;