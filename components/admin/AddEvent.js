import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppBar from '../design/AppBar'; // Adjust path as needed

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    description: '',
    image: null,
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    console.log('Submitted Data:', formData);
    // You can handle API request here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppBar />

    <View style={styles.whitebg}>
      <TextInput
        placeholder="Event Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => handleInputChange('location', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={formData.date}
        onChangeText={(text) => handleInputChange('date', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => handleInputChange('description', text)}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>
          {formData.image ? 'Change Image' : 'Pick an Image'}
        </Text>
      </TouchableOpacity>

      {formData.image && (
        <Image source={{ uri: formData.image }} style={styles.previewImage} />
      )}

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} color="#007bff" />
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF9F6',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  whitebg: {backgroundColor: 'white', marginHorizontal: 20, padding: 15, borderRadius: 10,},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#333',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddEvent;
