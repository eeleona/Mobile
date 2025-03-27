import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import axios from 'axios';
import { Avatar, Button, Card, Divider, PaperProvider, Modal, Portal } from 'react-native-paper';

const VerifiedUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const fetchUsers = () => {
    axios.get('http://192.168.0.110:8000/api/verified/all')
    .then((response)=>{
      console.log(response.data.users)
      setAllUsers(response.data.users)
    })
    .catch((err)=>{
      console.log(err)
    })
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.allusercontainer}>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{item.v_fname} {item.v_mname}. {item.v_lname}</Text>
          <Text style={styles.userDetails}>{item.v_username}</Text>
          <Text style={styles.userDetails}>{item.v_emailadd}</Text>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    console.log(allUsers);
  }, [allUsers]);

  return (
    <PaperProvider>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Verified Users</Text>
      </View>
      <TouchableOpacity onPress={showModal}>
        <FlatList data={allUsers} 
          renderItem={renderItem} 
          keyExtractor={item => item.id}
        />
      </TouchableOpacity>
      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Image style={styles.profilepic} source={require('../../assets/Images/verified.jpg')}></Image>
          <Text style={styles.name}>Bunnie A. Brown</Text>
          <View style={styles.label1}>
            <Text style={styles.labels}>Username: bunnie</Text>
            <Text style={styles.labels}>Contact Number: 0928 487 8278</Text>
            <Text style={styles.labels}>Email Address: bunnie@gmail.com</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Gender: Female</Text>
            <Text style={styles.labels}>Birthday: 2000/01/19</Text>
            <Text style={styles.labels}>Address: 22 CarrotVille Pasay City</Text>
          </View>
          <TouchableOpacity style={styles.editbtn}>
            <Text style={styles.editbtntext}>View Valid ID</Text>
          </TouchableOpacity>
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
  heading: {
    fontFamily: 'Inter',
    color: '#ff69b4',
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    marginLeft: 15,
    marginTop: 10,
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
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter_700Bold',
  },
  userDetails: {
    width: '90%',
    height: 20,
    
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter_500Medium',
  },
  mContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 20,
  },
  profilepic: {
    width: 300,
    height: 300,
    borderRadius: 5,
  },
  label1: {
    marginBottom: 10,
  },
  label2: {
    marginTop: 15,
  },
  labels: {
    marginBottom: 10,
    fontFamily: 'Inter_500Medium',
  },
  name: {
    marginTop: 13,
    marginBottom: 20,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#ff69b4',
    textAlign: 'center',
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
});

export default VerifiedUsers;