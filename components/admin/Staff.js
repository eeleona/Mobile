import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('View Staff', { staff: item })}
    >
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.s_fname} {item.s_lname}</Text>
        <Text style={styles.cardText}>Position: {item.s_position}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={staffList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || Math.random().toString()}
        />
        
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6', padding: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 3 },
  profileImage: { width: 70, height: 70, borderRadius: 35, marginRight: 10 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2a2a2a' },
  cardText: { fontSize: 14, color: 'gray' },
});

export default Staff;