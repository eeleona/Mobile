import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PetHotel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PET HOTELS</Text>
      <View style={styles.clinicContainer}>
        <View style={styles.clinicItem}>
          <Image
            source={require('../../assets/Images/hotelone.png')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicDetails}>
            <Text style={styles.clinicName}>Dog Friend Hotel & SPA</Text>
            <Text style={styles.clinicAddress}>Unit K & C Felimarc Center Taft Avenue</Text>
            <Text style={styles.clinicAddress}>(nearby Cartimar), Pasay City, Philippines</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.clinicContainer}>
        <View style={styles.clinicItem}>
          <Image
            source={require('../../assets/Images/hotelTwo.png')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicDetails}>
            <Text style={styles.clinicName}>The Pup Club</Text>
            <Text style={styles.clinicAddress}>131 Armstrong Ave corner Von Braun,</Text>
            <Text style={styles.clinicAddress}>Parañaque, Philippines</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 24,
    //fontWeight: 'bold',
    marginBottom: 20,
  },
  clinicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  clinicItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicImage: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
  },
  clinicDetails: {
    flex: 1,
    marginLeft: 10,
  },
  clinicName: {
    fontSize: 16,
    //fontWeight: 'bold',
    marginBottom: 3,
  },
  clinicAddress: {
    fontSize: 12,
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#FF66C4',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    //fontWeight: 'bold',
    fontSize: 12,
  },
});

export default PetHotel;
