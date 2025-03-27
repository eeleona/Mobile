import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PetProfile = ({ navigation }) => {
  const handleSubmit = () => {
    navigation.navigate('Submission');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Profile</Text>
      <Text style={styles.petName}>COBY</Text>
      <View style={styles.petDetails}>
        <Text style={styles.info}>• Golden Retriever</Text>
        <Text style={styles.info}>• Male dog</Text>
        <Text style={styles.info}>• 2 Years Old</Text>
        <Text style={styles.info}>• Vaccinated</Text>
        <Text style={styles.info}>• Been in an animal shelter since birth</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.btn}>ADOPT</TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: '40',
    //fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 30,
  },
  petImage: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  petName: {
    //fontWeight: 'bold',
    fontSize: 38,
    marginBottom: 25,
  },
  petDetails: {
    marginLeft: 20,
  },
  info: {
    fontSize: 15,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginHorizontal: 5,
    marginTop: 25,
    backgroundColor: 'red',
    color: 'white',
    //fontWeight: 'bold',
    fontFamily: 'arial',
    justifyContent: 'center',
    textAlign: 'center'
  },
});

export default PetProfile;
