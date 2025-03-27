import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import axios from 'axios';
import { ApplicationProvider, Datepicker, DatepickerProps, Radio, IndexPath, Select, SelectItem, Input } from '@ui-kitten/components';
import { Divider, PaperProvider, Modal, Portal } from 'react-native-paper';
import * as eva from '@eva-design/eva';
const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const fetchUsers = () => {
    axios.get('http://192.168.0.110:8000/api/user/all')
    .then((response)=>{
      console.log(response.data.users)
      setUsers(response.data.users)
    })
    .catch((err)=>{
      console.log(err)
    })
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={showModal}>
    <View style={styles.container}>
      <View style={styles.allusercontainer}>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{item.p_fname} {item.p_mname} {item.p_lname}</Text>
          <Text style={styles.userDetails}>{item.p_username}</Text>
          <Text style={styles.userDetails}>{item.p_emailadd}</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
    <PaperProvider>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Pending Users</Text>
      </View>
      <TouchableOpacity onPress={showModal}>
        <FlatList data={users} 
          renderItem={renderItem} 
          keyExtractor={item => item.id}
        />
      </TouchableOpacity>
      {/* <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Image style={styles.profilepic} source={require('../../assets/Images/mahra.jpg')}></Image>
          <Text style={styles.name}>Mahra Ladja Amil </Text>
          <View style={styles.label1}>
            <Text style={styles.labels}>Username: Leona</Text>
            <Text style={styles.labels}>Contact Number: 0915 530 1934</Text>
            <Text style={styles.labels}>Email Address: mahraamil@gmail.com</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Gender: Female</Text>
            <Text style={styles.labels}>Birthday: 2000/12/19</Text>
            <Text style={styles.labels}>Address: Pasay City</Text>
          </View>
          <TouchableOpacity style={styles.idbtn}>
            <Text style={styles.idbtntext}>View Valid ID</Text>
          </TouchableOpacity>
          <View style={styles.btncontainer}>
            <TouchableOpacity style={styles.rejectbtn}>
              <Text style={styles.rejectbtntext}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptbtn}>
              <Text style={styles.acceptbtntext}>Accept</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal> */}
      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <View style={styles.modalcontainer}>
            <Text style={styles.successtext}>Please input reason for rejection:</Text>
            <Input style={styles.input}/>
            
            <View style={styles.btncontainer}>
            
            <TouchableOpacity style={styles.acceptbtn}>
              <Text style={styles.acceptbtntext}>Submit</Text>
            </TouchableOpacity>
          </View>
            </View>
        </Modal>
    </Portal>
      <AdminNavbar></AdminNavbar>
    </View>
    </PaperProvider>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  successtext:{
    fontSize: 25,
    color: '#e85d5d',
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
  headerContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
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
    marginLeft: 15,
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
    color: '#ff69b4',
    textAlign: 'center',
  },
  input: {
    marginTop: 15,
    marginBottom: 15,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
},
  idbtn: {
    backgroundColor: '#ff69b4',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  idbtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  btncontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  acceptbtn: {
    width: 160,
    backgroundColor: '#cad47c',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 5,
  },
  acceptbtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  rejectbtn: {
    width: 160,
    backgroundColor: '#e85d5d',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5,
  },
  rejectbtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

export default PendingUsers;