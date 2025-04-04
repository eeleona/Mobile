import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AdminDetails = ({ route }) => {
  const { admin } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `http://192.168.0.110:8000${admin.a_img || '/default-image.png'}` }}
        style={styles.profileImage}
      />
      <Text style={styles.label}>Name: {admin.a_fname} {admin.a_lname}</Text>
      <Text style={styles.label}>Email: {admin.a_email}</Text>
      <Text style={styles.label}>Contact: {admin.a_contactnumber}</Text>
      <Text style={styles.label}>Address: {admin.a_address}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f6f6f6' },
  profileImage: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10, color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  editButton: { backgroundColor: '#4caf50', padding: 10, borderRadius: 5, marginRight: 10 },
  deleteButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default AdminDetails;