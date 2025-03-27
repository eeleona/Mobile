import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Button, Divider, PaperProvider, Modal, Portal} from 'react-native-paper';
import AdminNavbar from '../design/AdminNavbar';
import AppBar from '../design/AppBar';


const ManagePets = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  
  const fetchPets = () => {
    axios.get('http://192.168.0.110:8000/api/pet/all')
    .then((response)=>{
      console.log(response.data.thePet)
      setPets(response.data.thePet)
    })
    .catch((err)=>{
      console.log(err)
    })
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.allusercontainer}>
        <View style={styles.userContainer}>
        <Text style={styles.userName}>{item.p_name}</Text>
        <Text style={styles.userDetails}>{item.p_type}</Text>
      </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchPets();
  }, []);
  useEffect(() => {
    console.log(pets);
  }, [pets]); 

  return (
    <PaperProvider>
    <View style={styles.container}>
      <AppBar></AppBar>

      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Pets in Shelter</Text>
      </View>

      <TouchableOpacity onPress={showModal}>
        <FlatList data={pets} 
          renderItem={renderItem} 
          keyExtractor={item => item.id}
        />
      </TouchableOpacity>

      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Image style={styles.profilepic} source={require('../../assets/Images/petdog.jpg')}></Image>
          <Text style={styles.name}>Brownies</Text>
          <View style={styles.label1}>
            <Text style={styles.labels}>Type: Dog</Text>
            <Text style={styles.labels}>Gender: Female</Text>
            <Text style={styles.labels}>Age: 2</Text>
            <Text style={styles.labels}>Breed: Pomeranian</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Medical History: None</Text>
            <Text style={styles.labels}>Vaccines: None</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Description: Brownieeee</Text>
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
    flexDirection: 'row',
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
  userDetails: {
    width: '90%',
    height: 20,
    fontFamily: 'Inter_500Medium',
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
  },
  profilepic: {
    width: 300,
    height: 300,
    borderRadius: 5,
    marginLeft: 5,
  },
  label1: {
    marginBottom: 10,
  },
  label2: {
    marginTop: 15,
    marginBottom: 5,
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
    marginLeft: 5,
  },
  deletebtntext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

export default ManagePets;