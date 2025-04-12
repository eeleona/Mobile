import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';

const Admin = () => {
  const [adminList, setAdminList] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      console.log("Fetching admins from:", `${config.address}/api/admin/all`);
      const response = await axios.get(`${config.address}/api/admin/all`);
      console.log("Full API response:", response.data);
      
      if (response.data && Array.isArray(response.data.admins)) {
        // Filter to show only admin and pending-admin (excluding super-admin)
        const filteredAdmins = response.data.admins.filter(admin => 
          admin.s_role === 'admin' || admin.s_role === 'pending-admin'
        );
        
        console.log("Filtered admins:", filteredAdmins);
        setAdminList(filteredAdmins);
        setFilteredAdmins(filteredAdmins);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error.message);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedAdmin(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>
          {item.a_fname} {item.a_lname}
        </Text>
        <Text style={styles.cardText}>Username: {item.a_username}</Text>
        <Text style={styles.cardText}>Email: {item.a_email}</Text>
        <Text style={styles.cardText}>
          Role: {item.s_role.toUpperCase()} {item.s_role === 'pending-admin' && '(Pending)'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading admins...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={filteredAdmins}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No administrators found</Text>
          }
        />

        {/* Admin Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Admin Information</Text>
                
                {selectedAdmin && (
                  <>
                    <Text style={styles.modalLabel}>Admin ID:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_id}</Text>

                    <Text style={styles.modalLabel}>First Name:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_fname}</Text>

                    <Text style={styles.modalLabel}>Last Name:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_lname}</Text>

                    <Text style={styles.modalLabel}>Username:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_username}</Text>

                    <Text style={styles.modalLabel}>Email:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_email}</Text>

                    <Text style={styles.modalLabel}>Role:</Text>
                    <Text style={styles.modalText}>
                      {selectedAdmin.s_role.toUpperCase()} 
                      {selectedAdmin.s_role === 'pending-admin' && ' (Pending Approval)'}
                    </Text>

                    <Text style={styles.modalLabel}>Position:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_position}</Text>

                    <Text style={styles.modalLabel}>Gender:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_gender}</Text>

                    <Text style={styles.modalLabel}>Birthdate:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_birthdate}</Text>

                    <Text style={styles.modalLabel}>Contact Number:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_contactnumber}</Text>

                    <Text style={styles.modalLabel}>Address:</Text>
                    <Text style={styles.modalText}>{selectedAdmin.a_add}</Text>
                  </>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingTop: 20,
  },
  header: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 5,
  },
  cardText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#4a5568',
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#2a2a2a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#4a5568',
    marginTop: 10,
  },
  modalText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#ff69b4',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: 'white',
  },
});

export default Admin;