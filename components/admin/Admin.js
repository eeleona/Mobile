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
  TextInput
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredAdmins(adminList);
    } else {
      const lower = search.toLowerCase();
      setFilteredAdmins(
        adminList.filter(
          admin =>
            ((admin.a_fname && admin.a_fname.toLowerCase().includes(lower)) ||
            (admin.a_lname && admin.a_lname.toLowerCase().includes(lower))) ||
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
      console.log('Admin API response:', response.data); // Debug log
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
      // Alert.alert('Error', 'Failed to fetch administrators');
      setAdminList([]);
      setFilteredAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (admin) => {
    setSelectedAdmin(admin);
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
      setSelectedAdmin(null); // Clear selected admin when modal closes
    });
  };

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

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <MaterialIcons name={icon} size={20} color="#ff69b4" />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || 'N/A'}</Text>
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

  if (loading) {
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="admin-panel-settings" size={50} color="#cbd5e0" />
              <Text style={styles.emptyText}>No administrators found</Text>
            </View>
          }
        />

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
                      <DetailRow icon="badge" label="Admin ID" value={selectedAdmin.a_id} />
                      <DetailRow icon="person-outline" label="Username" value={selectedAdmin.a_username} />
                      <DetailRow icon="email" label="Email" value={selectedAdmin.a_email} />
                      <DetailRow icon="work-outline" label="Position" value={selectedAdmin.a_position} />
                      <DetailRow icon="wc" label="Gender" value={selectedAdmin.a_gender} />
                      <DetailRow icon="cake" label="Birthdate" value={formatDate(selectedAdmin.a_birthdate)} />
                      <DetailRow icon="phone" label="Contact" value={selectedAdmin.a_contactnumber} />
                      <DetailRow icon="location-on" label="Address" value={selectedAdmin.a_add} />
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
});

export default Admin;