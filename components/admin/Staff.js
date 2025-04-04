import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${config.address}/api/staff/all`);
      setStaffList(response.data.theStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={staffList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('View Staff', { staff: item })}
                style={styles.staffContainer}
              >
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{item.s_fname} {item.s_lname}</Text>
                  <Text style={styles.staffDetails}>Position: {item.s_position}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id || Math.random().toString()}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.emptyText}>No staff found.</Text>}
          />
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  listContainer: { flexGrow: 1, flex: 1 },
  staffContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 5, padding: 15, backgroundColor: 'white', marginBottom: 10, marginHorizontal: 25, elevation: 3 },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 22, fontWeight: 'bold', fontFamily: 'Inter_700Bold' },
  staffDetails: { fontSize: 16, color: 'gray', marginTop: 5 },
  emptyText: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
});

export default Staff;