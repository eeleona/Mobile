import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${config.address}/api/staff/all`);
      setStaffList(response.data.theStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedStaff(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>
          {item.s_fname} {item.s_lname}
        </Text>
        <Text style={styles.cardText}>Position: {item.s_position}</Text>
        {item.s_email && (
          <Text style={styles.cardSubText}>Email: {item.s_email}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading staff...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={staffList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No staff members found</Text>
          }
        />

        {/* Staff Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>View Staff Information</Text>
                
                {selectedStaff && (
                  <>
                    <Text style={styles.modalLabel}>Staff ID:</Text>
                    <Text style={styles.modalText}>{selectedStaff._id}</Text>

                    <Text style={styles.modalLabel}>Last Name:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_lname}</Text>

                    <Text style={styles.modalLabel}>First Name:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_fname}</Text>

                    <Text style={styles.modalLabel}>Middle Name:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_mname || 'N/A'}</Text>

                    <Text style={styles.modalLabel}>Gender:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_gender}</Text>

                    <Text style={styles.modalLabel}>Position:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_position}</Text>

                    <Text style={styles.modalLabel}>Address:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_add}</Text>

                    <Text style={styles.modalLabel}>Contact Number:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_contactnumber}</Text>

                    <Text style={styles.modalLabel}>Date of Birth:</Text>
                    <Text style={styles.modalText}>
                      {new Date(selectedStaff.s_birthdate).toLocaleDateString()}
                    </Text>

                    <Text style={styles.modalLabel}>Email:</Text>
                    <Text style={styles.modalText}>{selectedStaff.s_email}</Text>
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
    backgroundColor: '#f8f9fa',
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
  cardSubText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#718096',
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

export default Staff;