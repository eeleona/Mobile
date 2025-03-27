import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import AppBar from '../design/AppBar';
import axios from 'axios';
import { Button, Divider, PaperProvider, Modal, Portal, Appbar } from 'react-native-paper';
import config from '../adopter/config';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Input} from '@ui-kitten/components';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';

const PendingAdoptions = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [pendingAdoptions, setPendingAdoptions] = useState([]);
  const [activeAdoptions, setActiveAdoptions] = useState([]);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [selectedActiveAdoption, setSelectedActiveAdoption] = useState(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [failedReason, setFailedReason] = useState('');
  const [otherFailedReason, setOtherFailedReason] = useState('');
  const [allUsers, setAllUsers] = useState([]);

    const [pendingStartIndex, setPendingStartIndex] = useState(0);
    const [activeStartIndex, setActiveStartIndex] = useState(0);
    const cardsToShow = 5;


    const handleAccept = () => {
        setShowModal(false);
        setShowDateModal(true);
    };

    const handleReject = () => {
        setShowModal(false);
        setShowRejectModal(true);
    };

    const handleRejectConfirmation = () => {
        axios.patch(`${config.address}/api/adoption/decline/${selectedAdoption._id}`, { rejection_reason: rejectionReason === 'Other' ? otherReason : rejectionReason })
            .then(() => {
                setPendingAdoptions(prev => prev.filter(adopt => adopt._id !== selectedAdoption._id));
                setShowRejectModal(false);
                setSelectedAdoption(null);
                setRejectionReason('');
                setOtherReason('');
                alert('Adoption rejected successfully.');
                fetchAdoptions();
            })
            .catch(err => console.error("Error rejecting adoption:", err));
    };

    const handleSubmitDate = () => {
        axios.patch(`${config.address}/api/adoption/approve/${selectedAdoption._id}`, { visitDate, visitTime })
            .then(() => {
                setPendingAdoptions(prev => prev.filter(adopt => adopt._id !== selectedAdoption._id));
                setShowDateModal(false);
                setVisitDate('');
                setVisitTime('');
                alert('Adoption approved and visit scheduled.');
                fetchAdoptions(); 
            })
            .catch(err => console.error("Error approving adoption:", err));
    };

    const handleCompleteAdoption = () => {
        if (!selectedActiveAdoption || !selectedActiveAdoption._id) {
            console.error("No active adoption selected or missing adoption ID");
            return;
        }
        axios.patch(`${config.address}/api/adoption/complete/${selectedActiveAdoption._id}`)
            .then(() => {
                alert('Adoption marked as complete.');
                fetchAdoptions();
                setShowActiveModal(false);
            })
            .catch(err => console.error("Error completing adoption:", err));
    };

    const handleFailAdoption = () => {
        setShowModal(false);
        setShowFailedModal(true);
    };

    const handleSubmitFailed = () => {
        axios.patch(`${config.address}/api/adoption/fail/${selectedActiveAdoption._id}`, { reason: failedReason === 'Other' ? otherFailedReason : failedReason })
            .then(() => {
                alert('Adoption marked as failed.');
                fetchAdoptions();
                setShowFailedModal(false);
                setFailedReason('');
                setOtherFailedReason('');
                setShowActiveModal(false);
            })
            .catch(err => console.error("Error failing adoption:", err));
    };

    const handlePendingNext = () => {
        if (pendingStartIndex + cardsToShow < pendingAdoptions.length) {
            setPendingStartIndex(prevIndex => prevIndex + cardsToShow);
        }
    };

    const handlePendingPrev = () => {
        if (pendingStartIndex - cardsToShow >= 0) {
            setPendingStartIndex(prevIndex => prevIndex - cardsToShow);
        }
    };

    const handleActiveNext = () => {
        if (activeStartIndex + cardsToShow < activeAdoptions.length) {
            setActiveStartIndex(prevIndex => prevIndex + cardsToShow);
        }
    };

    const handleActivePrev = () => {
        if (activeStartIndex - cardsToShow >= 0) {
            setActiveStartIndex(prevIndex => prevIndex - cardsToShow);
        }
    };

    const handleRejectionReasonChange = (e) => {
        setRejectionReason(e.target.value);
        if (e.target.value !== 'Other') {
            setOtherReason('');
        }
    };

    const handleFailedReasonChange = (e) => {
        setFailedReason(e.target.value);
        if (e.target.value !== 'Other') {
            setOtherFailedReason('');
        }
    };

  const fetchEvents = () => {
    axios.get('http://192.168.0.110:8000/api/adoption/pending')
      .then((response) => {
        console.log(response.data);
        setAllEvents(response.data);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
      });
  };

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
        <Text style={styles.userName}>Alixia A. Blanchie</Text>
        <Text style={styles.userDetails}>{item.occupation}</Text>
        <Text style={styles.userDetails}>1 Camias St., Pasay City</Text>
        <Text style={styles.userDetails}>Adoption Application for: Polaris, cat</Text>
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
    <ApplicationProvider {...eva} theme={eva.light}>
    <PaperProvider>
    <View style={styles.container}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Pending Adoptions</Text>
      </View>
      
      <TouchableOpacity onPress={showModal}>
          <FlatList data={allEvents} 
            renderItem={renderItem} 
            keyExtractor={item => item.id}
          />
      </TouchableOpacity>
      <Portal>
        <Modal style={styles.mContainer} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text style={styles.name}>Accept Adoption?</Text>
          {/* <View style={styles.header}> */}
            {/* <Image style={styles.profilepic} source={require('../../assets/Images/adoptpet.jpg')}></Image>
            <View style={styles.details}>
              <Text style={styles.name}>Pet</Text>
              <Text style={styles.labels1}>Name: Polaris</Text>
              <Text style={styles.labels1}>Pet Type: Cat</Text>
              <Text style={styles.labels1}>Gender: Female</Text>
              <Text style={styles.labels1}>Age: 3 years old</Text>
            </View>
          </View>
          
          <View style={styles.header}>
          <Image style={styles.profilepic} source={require('../../assets/Images/applicant.jpg')}></Image>
            <View style={styles.details}>
                <Text style={styles.name}>Applicant</Text>
                <Text style={styles.labels1}>Name: Alixia A. Blanchie</Text>
                <Text style={styles.labels1}>Username: Alixia</Text>
              </View>
          </View>
          <View style={styles.label2}>
            <Text style={styles.labels}>Contact Number: 0928 893 1189</Text>
            <Text style={styles.labels}>Email Address: alixia.blanchie@gmail.com</Text>
            <Text style={styles.labels}>Address: 1 Camias St. Pasay City</Text>
          </View>
          <Divider/>
          <View style={styles.label2}>
            <Text style={styles.labels}>Occupation: Web Developer</Text>
            <Text style={styles.labels}>Home Type: Apartment</Text>
            <Text style={styles.labels}>Household Description: Average</Text>
            <Text style={styles.labels}>Years Resided: 2</Text>
            <Text style={styles.labels}>Allergic to Pets: No</Text>
            <Text style={styles.labels}>Adults in Household: 2</Text>
            <Text style={styles.labels}>Children in Household: 1</Text>
          </View>
          <TouchableOpacity style={styles.idbtn}>
            <Text style={styles.idbtntext}>View Valid ID</Text>
          </TouchableOpacity> */}
          <View style={styles.btncontainer}>
          <TouchableOpacity style={styles.rejectbtn}>
              <Text style={styles.rejectbtntext}>Cancel</Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.acceptbtn}>
              <Text style={styles.acceptbtntext}>Accept</Text>
            </TouchableOpacity>
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
  headerContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  heading: {
    color: '#ff69b4',
    fontSize: 30,
    marginLeft: 15,
    fontFamily: 'Inter_700Bold',
    marginTop: 12,
  },
  header: {
    marginLeft: 5,
    flexDirection: 'row'
  },
  details: {
    marginLeft: 12,
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
    height: 110,
    backgroundColor: 'white',
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
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    fontFamily: 'Inter_700Bold',
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
    marginTop: -15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  profilepic: {
    width: 110,
    height: 110,
    borderRadius: 5,
    marginBottom: 10,
  },
  label1: {
    marginBottom: 10,
  },
  label2: {
    marginTop: 5,
  },
  labels: {
    fontFamily: 'Inter_500Medium',
    marginBottom: 10,
  },
  labels1: {
    fontFamily: 'Inter_500Medium',
    marginBottom: 5,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
    marginTop: -6,
    marginBottom: 10,
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
    marginRight: 5,
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

export default PendingAdoptions;