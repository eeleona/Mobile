import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Animated, Alert, Easing } from 'react-native';
import { PaperProvider, ActivityIndicator, FAB } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const Staff = ({ navigation }) => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [formData, setFormData] = useState({
    s_fname: '',
    s_lname: '',
    s_mname: '',
    s_add: '',
    s_contactnumber: '',
    s_position: '',
    s_gender: '',
    s_birthdate: '',
    s_email: ''
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredStaff(staffList);
    } else {
      const lower = search.toLowerCase();
      setFilteredStaff(
        staffList.filter(
          s =>
            (s.s_fname && s.s_fname.toLowerCase().includes(lower)) ||
            (s.s_lname && s.s_lname.toLowerCase().includes(lower)) ||
            (s.s_position && s.s_position.toLowerCase().includes(lower)) ||
            (s.s_gender && s.s_gender.toLowerCase().includes(lower))
        )
      );
    }
  }, [search, staffList]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${config.address}/api/staff/all`);
      setStaffList(response.data.theStaff);
      setFilteredStaff(response.data.theStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Login Required', 'Admin access required. Please log in.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        return false;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        await AsyncStorage.removeItem('authToken');
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        return false;
      }

      if (!['admin', 'super-admin'].includes(decodedToken.role)) {
        Alert.alert('Access Denied', 'Only administrators can perform this action.');
        return false;
      }

      return token;
    } catch (error) {
      console.error('Error verifying access:', error);
      Alert.alert('Error', 'Failed to verify permissions');
      return false;
    }
  };

  const openModal = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      s_fname: staff.s_fname,
      s_lname: staff.s_lname,
      s_mname: staff.s_mname || '',
      s_add: staff.s_add,
      s_contactnumber: staff.s_contactnumber,
      s_position: staff.s_position,
      s_gender: staff.s_gender,
      s_birthdate: staff.s_birthdate,
      s_email: staff.s_email
    });
    setModalVisible(true);
    setEditMode(false);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = async () => {
    const token = await verifyAdminAccess();
    if (!token) return;

    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedStaff.s_fname} ${selectedStaff.s_lname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${config.address}/api/staff/delete/${selectedStaff._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setStaffList(staffList.filter(staff => staff._id !== selectedStaff._id));
              closeModal();
              Alert.alert('Success', 'Staff member deleted successfully');
            } catch (error) {
              console.error('Error deleting staff:', error);
              Alert.alert('Error', 'Failed to delete staff member');
            }
          }
        }
      ]
    );
  };

  const handleUpdate = async () => {
    const token = await verifyAdminAccess();
    if (!token) return;

    try {
      const response = await axios.put(
        `${config.address}/api/staff/update/${selectedStaff._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStaffList(staffList.map(staff => 
        staff._id === selectedStaff._id ? response.data.theUpdateStaff : staff
      ));
      setEditMode(false);
      Alert.alert('Success', 'Staff information updated successfully');
    } catch (error) {
      console.error('Error updating staff:', error);
      Alert.alert('Error', 'Failed to update staff information');
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
      onPress={() => openModal(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>
            {item.s_fname} {item.s_lname}
          </Text>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{item.s_position}</Text>
          </View>
          {item.s_email && (
            <View style={styles.emailContainer}>
              <MaterialIcons name="email" size={16} color="#718096" />
              <Text style={styles.cardSubText}>{item.s_email}</Text>
            </View>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loadingText}>Loading staff...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Search Bar styled like PendingAdoptions */}
        <View style={styles.searchContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <MaterialIcons
              name="search"
              size={24}
              color="#ff69b4"
              style={styles.searchIcon}
            />
          </View>
        </View>
        <FlatList
          data={filteredStaff}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={50} color="#cbd5e0" />
              <Text style={styles.emptyText}>No staff members found</Text>
            </View>
          }
        />

        {/* FAB Button */}
        <FAB
          style={styles.fab}
          icon="plus"
          color="white"
          onPress={() => navigation.navigate('Add Staff')}
        />

        {/* Staff Details Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Staff Details</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                    <MaterialIcons name="close" size={24} color="#718096" />
                  </TouchableOpacity>
                </View>

                {selectedStaff && (
                  <View style={styles.modalContent}>
                    <View style={styles.profileSection}>
                      {editMode ? (
                        <TextInput
                          style={styles.editInput}
                          value={formData.s_fname}
                          onChangeText={(text) => handleInputChange('s_fname', text)}
                        />
                      ) : (
                        <Text style={styles.profileName}>
                          {selectedStaff.s_fname} {selectedStaff.s_lname}
                        </Text>
                      )}
                      <View style={[styles.statusBadge, { backgroundColor: '#ff69b4' }]}>
                        {editMode ? (
                          <TextInput
                            style={styles.editInput}
                            value={formData.s_position}
                            onChangeText={(text) => handleInputChange('s_position', text)}
                          />
                        ) : (
                          <Text style={styles.statusText}>{selectedStaff.s_position}</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <DetailRow 
                        icon="person-outline" 
                        label="Staff ID" 
                        value={selectedStaff._id} 
                        editMode={false}
                      />
                      <DetailRow 
                        icon="badge" 
                        label="First Name" 
                        value={editMode ? formData.s_fname : selectedStaff.s_fname}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_fname', text)}
                      />
                      <DetailRow 
                        icon="badge" 
                        label="Last Name" 
                        value={editMode ? formData.s_lname : selectedStaff.s_lname}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_lname', text)}
                      />
                      <DetailRow 
                        icon="badge" 
                        label="Middle Name" 
                        value={editMode ? formData.s_mname : selectedStaff.s_mname || 'N/A'}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_mname', text)}
                      />
                      <DetailRow 
                        icon="wc" 
                        label="Gender" 
                        value={editMode ? formData.s_gender : selectedStaff.s_gender}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_gender', text)}
                      />
                      <DetailRow 
                        icon="work-outline" 
                        label="Position" 
                        value={editMode ? formData.s_position : selectedStaff.s_position}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_position', text)}
                      />
                      <DetailRow 
                        icon="location-on" 
                        label="Address" 
                        value={editMode ? formData.s_add : selectedStaff.s_add}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_add', text)}
                      />
                      <DetailRow 
                        icon="phone" 
                        label="Contact" 
                        value={editMode ? formData.s_contactnumber : selectedStaff.s_contactnumber}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_contactnumber', text)}
                      />
                      <DetailRow 
                        icon="cake" 
                        label="Birthdate" 
                        value={editMode ? formData.s_birthdate : new Date(selectedStaff.s_birthdate).toLocaleDateString()}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_birthdate', text)}
                      />
                      <DetailRow 
                        icon="email" 
                        label="Email" 
                        value={editMode ? formData.s_email : selectedStaff.s_email}
                        editMode={editMode}
                        onChangeText={(text) => handleInputChange('s_email', text)}
                      />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.modalActions}>
                      {editMode ? (
                        <>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => setEditMode(false)}
                          >
                            <Text style={styles.actionButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleUpdate}
                          >
                            <Text style={styles.actionButtonText}>Save</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.editButton]}
                            onPress={handleEdit}
                          >
                            <Text style={styles.actionButtonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={handleDelete}
                          >
                            <Text style={styles.actionButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const DetailRow = ({ icon, label, value, editMode, onChangeText }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <MaterialIcons name={icon} size={20} color="#ff69b4" />
    </View>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      {editMode ? (
        <TextInput
          style={styles.editInput}
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={styles.detailValue}>{value}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  searchIcon: {
    marginLeft: 8,
  },
  header: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#2a2a2a',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff69b4',
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
  positionBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  positionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#0369a1',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#718096',
    marginLeft: 5,
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
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#718096',
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#1e293b',
  },
  closeIcon: {
    padding: 5,
  },
  modalContent: {
    paddingVertical: 15,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff69b4',
    marginBottom: 15,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 10,
    marginTop: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: 'white',
  },
  detailsSection: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1e293b',
  },
  editInput: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#ff69b4',
    paddingVertical: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: 'white',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 10,
    bottom: 10,
    backgroundColor: '#ff69b4',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Staff;