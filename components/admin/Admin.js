import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Animated, 
  Easing, 
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { PaperProvider, FAB } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import { MaterialIcons } from '@expo/vector-icons';

const Admin = () => {
  const [adminList, setAdminList] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    fetchAdmins();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredAdmins(adminList);
    } else {
      const lower = search.toLowerCase();
      setFilteredAdmins(
        adminList.filter(
          admin =>
            (admin.a_fname && admin.a_fname.toLowerCase().includes(lower)) ||
            (admin.a_lname && admin.a_lname.toLowerCase().includes(lower)) ||
            (admin.s_role && (
              (admin.s_role === 'admin' && 'admin'.includes(lower)) ||
              (admin.s_role === 'pending-admin' && 'pending admin'.includes(lower)) ||
              admin.s_role.toLowerCase().includes(lower)
            ))
        )
      );
    }
  }, [search, adminList]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${config.address}/api/admin/all`);
      if (response.data && Array.isArray(response.data.admins)) {
        const filteredAdmins = response.data.admins.filter(admin => 
          admin.s_role === 'admin' || admin.s_role === 'pending-admin'
        );
        setAdminList(filteredAdmins);
        setFilteredAdmins(filteredAdmins);
      } else {
        console.error('Invalid response format:', response.data);
        setAdminList([]);
        setFilteredAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error.message);
      setAdminList([]);
      setFilteredAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${config.address}/api/staff/all`);
      if (response.data && Array.isArray(response.data.theStaff)) {
        setStaffList(response.data.theStaff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const openModal = (admin) => {
    setSelectedAdmin(admin);
    setEditFormData({
      a_fname: admin.a_fname,
      a_lname: admin.a_lname,
      a_mname: admin.a_mname,
      a_add: admin.a_add,
      a_contactnumber: admin.a_contactnumber,
      a_position: admin.a_position,
      a_gender: admin.a_gender,
      a_birthdate: admin.a_birthdate,
      a_email: admin.a_email
    });
    setModalVisible(true);
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
    ]).start(() => {
      setModalVisible(false);
      setSelectedAdmin(null);
      setEditMode(false);
    });
  };

  const handleInputChange = (name, value) => {
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`${config.address}/api/admin/update/${selectedAdmin._id}`, editFormData);
      fetchAdmins();
      setEditMode(false);
      Alert.alert('Success', 'Admin updated successfully');
    } catch (error) {
      console.error('Error updating admin:', error);
      Alert.alert('Error', 'Failed to update admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.patch(`${config.address}/api/admin/update/${selectedAdmin._id}`, {
        s_role: 'deleted-admin'
      });
      fetchAdmins();
      closeModal();
      setShowDeleteModal(false);
      Alert.alert('Success', 'Admin deleted successfully');
    } catch (error) {
      console.error('Error deleting admin:', error);
      Alert.alert('Error', 'Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelection = (staff) => {
    setSelectedStaff({
      s_id: staff.s_id,
      firstName: staff.s_fname,
      lastName: staff.s_lname,
      middleName: staff.s_mname || '',
      address: staff.s_add || '',
      contact: staff.s_contactnumber || '',
      position: staff.s_position || '',
      gender: staff.s_gender || '',
      birthdate: staff.s_birthdate || '',
      email: staff.s_email || ''
    });
    setShowStaffModal(false);
    setShowConfirmationModal(true);
  };

  const confirmAddAdmin = async () => {
    try {
      setLoading(true);
      
      // Generate credentials
      const username = generateUsername(selectedStaff.firstName, selectedStaff.lastName);
      const password = generatePassword();
  
      const adminData = {
        s_id: selectedStaff.s_id,
        firstName: selectedStaff.firstName,
        lastName: selectedStaff.lastName,
        middleName: selectedStaff.middleName,
        address: selectedStaff.address,
        contact: selectedStaff.contact,
        position: selectedStaff.position,
        gender: selectedStaff.gender,
        birthdate: selectedStaff.birthdate,
        email: selectedStaff.email,
        username: username,
        password: password,
        s_role: 'admin'
      };
  
      console.log('Sending admin data:', adminData);
  
      // Add admin
      const response = await axios.post(`${config.address}/api/admin/new`, adminData);
      
      if (response.data.success) {
        // Send email if email exists (fire-and-forget)
        if (adminData.email) {
          axios.post(`${config.address}/api/send-email`, {
            to: adminData.email,
            subject: "Your Admin Credentials",
            text: `Dear ${adminData.firstName},\n\nYour admin account has been created. Below are your login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after logging in.\n`
          }).catch(emailError => {
            console.error('Email error:', emailError);
          });
        }
  
        // Close modals immediately
        setShowConfirmationModal(false);
        setShowStaffModal(false);
        setSelectedStaff(null);
        
        // Refresh the admin list
        await fetchAdmins();
        
        // Show success alert
        Alert.alert(
          'Success', 
          'Admin added successfully',
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Optional: You could add additional actions here
                // if needed after the user acknowledges the alert
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      let errorMessage = 'Failed to add admin. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateUsername = (firstName, lastName) => {
    const shortFirstName = firstName.charAt(0).toLowerCase();
    const shortLastName = lastName.slice(0, 5).toLowerCase();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${shortFirstName}${shortLastName}${randomNum}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const filteredStaff = staffList.filter(staff => {
    // Only show staff who aren't already admins
    if (adminList.some(admin => admin.s_id === staff.s_id)) return false;
    
    // Filter by search query if present
    if (!staffSearchQuery.trim()) return true;
    
    const query = staffSearchQuery.toLowerCase();
    return (
      (staff.s_fname && staff.s_fname.toLowerCase().includes(query)) ||
      (staff.s_lname && staff.s_lname.toLowerCase().includes(query)) ||
      (staff.s_position && staff.s_position.toLowerCase().includes(query))
    );
  });

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
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
            {item.a_fname || ''} {item.a_lname || ''}
          </Text>
          <View style={[
            styles.positionBadge, 
            item.s_role === 'pending-admin' ? styles.pendingBadge : styles.adminBadge
          ]}>
            <Text style={[
              styles.positionText,
              item.s_role === 'pending-admin' ? styles.pendingText : styles.adminText
            ]}>
              {item.s_role === 'pending-admin' ? 'PENDING ADMIN' : 'ADMIN'}
            </Text>
          </View>
          <View style={styles.emailContainer}>
            <MaterialIcons name="email" size={16} color="#718096" />
            <Text style={styles.cardSubText}>{item.a_email || 'No email'}</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
      </View>
    </TouchableOpacity>
  );

  const DetailRow = ({ icon, label, value, editable, name, onChange }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <MaterialIcons name={icon} size={20} color="#ff69b4" />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.detailInput}
            value={value || ''}
            onChangeText={(text) => onChange(name, text)}
          />
        ) : (
          <Text style={styles.detailValue}>{value || 'N/A'}</Text>
        )}
      </View>
    </View>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  if (loading && adminList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loadingText}>Loading admins...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by name or role"
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

        <FlatList
          data={filteredAdmins}
          renderItem={renderItem}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchAdmins}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="admin-panel-settings" size={50} color="#ff69b4" />
              <Text style={styles.emptyText}>No administrators found</Text>
            </View>
          }
        />

        {/* FAB Button */}
        <FAB
          style={styles.fab}
          icon="plus"
          color="white"
          onPress={() => setShowStaffModal(true)}
        />

        {/* Admin Details Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
          animationType="none"
        >
          <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
            <Animated.View 
              style={[
                styles.modalContainer, 
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Admin Details</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                  <MaterialIcons name="close" size={24} color="#718096" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScrollView}>
                {selectedAdmin && (
                  <View style={styles.modalContent}>
                    <View style={styles.profileSection}>
                      <Text style={styles.profileName}>
                        {selectedAdmin.a_fname || ''} {selectedAdmin.a_lname || ''}
                      </Text>
                      <View style={[
                        styles.statusBadge, 
                        selectedAdmin.s_role === 'pending-admin' ? 
                          { backgroundColor: '#f59e0b' } : 
                          { backgroundColor: '#ff69b4' }
                      ]}>
                        <Text style={styles.statusText}>
                          {selectedAdmin.s_role === 'pending-admin' ? 'PENDING ADMIN' : 'ADMIN'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <DetailRow 
                        icon="badge" 
                        label="Admin ID" 
                        value={selectedAdmin.a_id} 
                        editable={false}
                      />
                      <DetailRow 
                        icon="person-outline" 
                        label="Username" 
                        value={selectedAdmin.a_username} 
                        editable={false}
                      />
                      <DetailRow 
                        icon="email" 
                        label="Email" 
                        value={editMode ? editFormData.a_email : selectedAdmin.a_email}
                        editable={editMode}
                        name="a_email"
                        onChange={handleInputChange}
                      />
                      <DetailRow 
                        icon="work-outline" 
                        label="Position" 
                        value={editMode ? editFormData.a_position : selectedAdmin.a_position}
                        editable={editMode}
                        name="a_position"
                        onChange={handleInputChange}
                      />
                      <DetailRow 
                        icon="wc" 
                        label="Gender" 
                        value={editMode ? editFormData.a_gender : selectedAdmin.a_gender}
                        editable={editMode}
                        name="a_gender"
                        onChange={handleInputChange}
                      />
                      <DetailRow 
                        icon="cake" 
                        label="Birthdate" 
                        value={editMode ? editFormData.a_birthdate : formatDate(selectedAdmin.a_birthdate)}
                        editable={editMode}
                        name="a_birthdate"
                        onChange={handleInputChange}
                      />
                      <DetailRow 
                        icon="phone" 
                        label="Contact" 
                        value={editMode ? editFormData.a_contactnumber : selectedAdmin.a_contactnumber}
                        editable={editMode}
                        name="a_contactnumber"
                        onChange={handleInputChange}
                      />
                      <DetailRow 
                        icon="location-on" 
                        label="Address" 
                        value={editMode ? editFormData.a_add : selectedAdmin.a_add}
                        editable={editMode}
                        name="a_add"
                        onChange={handleInputChange}
                      />
                    </View>

                    {!editMode ? (
                      <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity 
                          style={[styles.actionButton, styles.editButton]}
                          onPress={handleEdit}
                        >
                          <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => setShowDeleteModal(true)}
                        >
                          <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => setEditMode(false)}
                        >
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.saveButton]}
                          onPress={handleUpdate}
                          disabled={loading}
                        >
                          <Text style={styles.buttonText}>
                            {loading ? 'Saving...' : 'Save'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Staff Selection Modal */}
        <Modal
          visible={showStaffModal}
          animationType="slide"
          onRequestClose={() => setShowStaffModal(false)}
        >
          <View style={styles.staffModalContainer}>
            <View style={styles.staffModalHeader}>
              <Text style={styles.staffModalTitle}>Select Staff Member</Text>
              <TouchableOpacity 
                onPress={() => setShowStaffModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#718096" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalSearchContainer}>
              <TextInput
                style={styles.modalSearchBar}
                placeholder="Search staff..."
                placeholderTextColor="#aaa"
                value={staffSearchQuery}
                onChangeText={setStaffSearchQuery}
              />
              <MaterialIcons
                name="search"
                size={24}
                color="#ff69b4"
                style={styles.modalSearchIcon}
              />
            </View>

            <FlatList
              data={filteredStaff}
              keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity 
                    style={styles.staffItemContainer}
                    onPress={() => handleStaffSelection(item)}
                  >
                    {/* <View style={styles.staffAvatar}>
                      <MaterialIcons name="person" size={28} color="#ff69b4" />
                    </View> */}
                    <View style={styles.staffInfo}>
                      <Text style={styles.staffName}>
                        {item.s_fname} {item.s_lname}
                      </Text>
                      
                        <Text style={styles.staffPosition}>{item.s_position}</Text>
                        <Text style={styles.staffEmail}>{item.s_email}</Text>
                      
                    </View>
                    <MaterialIcons 
                      name="chevron-right" 
                      size={24} 
                      color="#cbd5e0" 
                    />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyStaffContainer}>
                  <MaterialIcons name="people-outline" size={50} color="#cbd5e0" />
                  <Text style={styles.emptyStaffText}>No staff available to add as admin</Text>
                </View>
              }
            />
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          transparent={true}
          visible={showConfirmationModal}
          onRequestClose={() => setShowConfirmationModal(false)}
        >
          <View style={styles.confirmationBackdrop}>
            <View style={styles.confirmationModal}>
              <Text style={styles.confirmationTitle}>Confirm Add Admin</Text>
              <Text style={styles.confirmationText}>
                Are you sure you want to add {selectedStaff?.firstName} {selectedStaff?.lastName} as an admin?
              </Text>
              <Text style={styles.confirmationEmail}>
                Email: {selectedStaff?.email}
              </Text>
              <View style={styles.confirmationButtons}>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.cancelConfirmButton]}
                  onPress={() => setShowConfirmationModal(false)}
                >
                  <Text style={styles.confirmButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.addConfirmButton]}
                  onPress={confirmAddAdmin}
                  disabled={loading}
                >
                  <Text style={styles.confirmButtonText}>
                    {loading ? 'Adding...' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.confirmationBackdrop}>
            <View style={styles.confirmationModal}>
              <Text style={styles.confirmationTitle}>Confirm Delete Admin</Text>
              <Text style={styles.confirmationText}>
                Are you sure you want to delete {selectedAdmin?.a_fname} {selectedAdmin?.a_lname}?
              </Text>
              <Text style={styles.warningText}>This action cannot be undone.</Text>
              <View style={styles.confirmationButtons}>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.cancelConfirmButton]}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.confirmButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.deleteConfirmButton]}
                  onPress={handleDelete}
                  disabled={loading}
                >
                  <Text style={styles.confirmButtonText}>
                    {loading ? 'Deleting...' : 'Delete'}
                  </Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  adminBadge: {
    backgroundColor: '#f0f9ff',
  },
  pendingBadge: {
    backgroundColor: '#ffedd5',
  },
  positionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  adminText: {
    color: '#0369a1',
  },
  pendingText: {
    color: '#9a3412',
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
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#1e293b',
    marginBottom: 10,
    marginTop: 15,
    textAlign: 'center',
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
  fab: {
    position: 'absolute',
    margin: 20,
    right: 10,
    bottom: 10,
    backgroundColor: '#ff69b4',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#b4e38a',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#fc6868',
  },
  saveButton: {
    backgroundColor: '#ff69b4',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailInput: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#ff69b4',
    paddingVertical: 4,
  },

  // Enhanced Staff Selection Modal Styles
  staffModalContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  staffModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  staffModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 5,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation: 2,
  },
  modalSearchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  modalSearchIcon: {
    marginLeft: 8,
  },
  staffItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  staffAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  staffDetails: {
    flexDirection: 'row',
  },
  staffPosition: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 10,
  },
  staffEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 85,
  },
  emptyStaffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStaffText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 15,
    textAlign: 'center',
  },
  confirmationBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#1e293b',
  },
  confirmationEmail: {
    fontSize: 14,
    marginBottom: 15,
    color: '#64748b',
  },
  warningText: {
    fontSize: 14,
    marginBottom: 15,
    color: '#F44336',
    fontWeight: 'bold',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  addConfirmButton: {
    backgroundColor: '#b4e38a',
  },
  deleteConfirmButton: {
    backgroundColor: '#F44336',
  },
  cancelConfirmButton: {
    backgroundColor: '#9E9E9E',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Admin;