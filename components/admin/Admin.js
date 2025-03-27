import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import axios from 'axios';
import { Divider, PaperProvider, Modal, Portal } from 'react-native-paper';

const Admin = () => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const fetchAdmin = () => {
    axios.get('http://192.168.0.110:8000/api/admin/all')
    .then((response)=>{
      console.log(response.data.admins);
      setAllAdmins(response.data.admins);
    })
    .catch((err)=>{
      console.log(err)
    })
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.allusercontainer}>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{item.a_fname} {item.a_mname} {item.a_lname}</Text>
          <Text style={styles.userDetails}>{item.a_email}</Text>
          <Text style={styles.userDetails}>{item.a_contactnumber}</Text>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchAdmin();
  }, []);
  useEffect(() => {
    console.log(allAdmins);
  }, [allAdmins]);

  return (
    <PaperProvider>
      <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Admin List</Text>
      </View>
      <TouchableOpacity onPress={showModal}>
        <FlatList data={allAdmins} 
          renderItem={renderItem} 
          keyExtractor={item => item.id}/>
      </TouchableOpacity>
      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Image style={styles.profilepic} source={require('../../assets/Images/Admin.jpg')}></Image>
          <Text style={styles.name}>Alyssa Bianca Estipona</Text>
          <View style={styles.label1}>
            <Text style={styles.labels}>Contact Number: 0928 930 9047</Text>
            <Text style={styles.labels}>Email Address: alyssaestipona@gmail.com</Text>
            <Text style={styles.labels}>Position: Pet Caretaker</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Gender: Female</Text>
            <Text style={styles.labels}>Birthday: 2002/8/14</Text>
            <Text style={styles.labels}>Address: Paranaque City</Text>
          </View>
          <View style={styles.btncontainer}>
            <TouchableOpacity style={styles.editbtn}>
              <Text style={styles.editbtntext}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deletebtn}>
              <Text style={styles.deletebtntext}>Delete</Text>
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
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    marginTop: 10,
    fontSize: 30,
    marginLeft: 15,
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
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: 15,
    borderColor: 'gray',
    borderWidth: 1,
  },
  label1: {
    marginBottom: 10,
  },
  label2: {
    marginTop: 15,
  },
  labels: {
    fontFamily: 'Inter',
    marginBottom: 10,
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
  },
  editbtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  deletebtn: {
    width: 160,
    backgroundColor: '#e85d5d',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  deletebtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

export default Admin;