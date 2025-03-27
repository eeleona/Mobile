import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import axios from 'axios';
import { Button, Divider, PaperProvider, Modal, Portal } from 'react-native-paper';

const Staff = () => {
  const [allStaff, setAllStaff] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const fetchStaff = () => {
    axios.get('http://192.168.0.110:8000/api/staff/all')
    .then((response)=>{
      console.log(response.data.theStaff);
      setAllStaff(response.data.theStaff);
    })
    .catch((err)=>{
      console.log(err)
    })
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.allusercontainer}>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{item.s_fname} {item.s_mname} {item.s_lname}</Text>
          <Text style={styles.userDetails}>{item.s_position}</Text>
          <Text style={styles.userDetails}>{item.s_contactnumber}</Text>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchStaff();
  }, []);
  useEffect(() => {
    console.log(allStaff);
  }, [allStaff]);

  return (
    <PaperProvider>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Staff List</Text>
        <View style={styles.addcontainer}>
          <Button style={styles.plus} onPress={showModal} icon="plus">
            <Text style={styles.addStaffbtntext} >Add Staff</Text>
          </Button>
        </View>
      </View>
      <TouchableOpacity onPress={showModal}>
        <FlatList data={allStaff} 
          renderItem={renderItem} 
          keyExtractor={item => item.id}
        />
      </TouchableOpacity>
      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          {/* <Image style={styles.profilepic} source={require('../../assets/Images/junjun.jpg')}></Image> */}
          <Text style={styles.name}>Delete this staff?</Text>
          {/* <View style={styles.label1}>
            <Text style={styles.labels}>Contact Number: 0921 839 2201</Text>
            <Text style={styles.labels}>Email Address: ramburat@gmail.com</Text>
            <Text style={styles.labels}>Position: Secretary</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Gender: Female</Text>
            <Text style={styles.labels}>Birthday: 09/18/2002</Text>
            <Text style={styles.labels}>Address: Makati City</Text>
          </View> */}
          <View style={styles.btncontainer}>
            <TouchableOpacity style={styles.editbtn}>
              <Text style={styles.editbtntext}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deletebtn}>
              <Text style={styles.deletebtntext}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
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
    height: 55,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'Inter',
    color: '#ff69b4',
    fontSize: 30,
    marginLeft: 15,
    marginTop: 15,
    fontFamily: 'Inter_700Bold',
  },
  addcontainer:{
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  plus: {
    width: '60%',
    height: 35,
    backgroundColor: '#cad47c',
    marginLeft: 40,
  },
  addStaffbtntext: {
    width: '100%',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    alignItems: 'center',
    fontFamily: 'Inter_500Medium',
  },
  allusercontainer: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  userContainer: {
    width: '90%',
    height: 80,
    backgroundColor: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.10)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  userName: {
    width: '90%',
    height: 20,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  userDetails: {
    width: '90%',
    height: 20,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mContainer: {
    width: '95%',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
  profilepic: {
    width: 300,
    height: 300,
    borderRadius: 5,
    borderColor: 'gray',
    alignItems: 'center',
    marginLeft: 15,
    alignContent: 'center',
    borderWidth: 1,
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
  name: {
    marginTop: 13,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  btncontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  editbtn: {
    width: 160,
    backgroundColor: '#cad47c',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5,
  },
  editbtntext: {
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: 'white',
  },
  deletebtn: {
    width: 160,
    backgroundColor: '#e85d5d',
    fontFamily: 'Inter_700Bold',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 5,
  },
  deletebtntext: {
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: 'white',
  },
});

export default Staff;