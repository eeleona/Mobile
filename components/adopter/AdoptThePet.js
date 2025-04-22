import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

const AdoptThePet = ({ route, navigation }) => {
  const { pet } = route.params;

  return (
    <ImageBackground
      source={require('../../assets/Images/pawbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <AppBar title="Pet Details" onBackPress={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Pet Image */}
          <View style={styles.section}>
            <View style={styles.imageContainer}>
              {pet.pet_img?.[0] ? (
                <Image
                  style={styles.petImage}
                  source={{ uri: `${config.address}${pet.pet_img[0]}` }}
                />
              ) : (
                <Text style={styles.noImageText}>No image available</Text>
              )}
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Divider style={styles.sectionDivider} />
            <DetailRow label="Name" icon="pets" value={pet.p_name} />
            <DetailRow label="Pet Type" icon="pets" value={pet.p_type} />
            <DetailRow label="Breed" icon="pets" value={pet.p_breed} />
            <DetailRow label="Gender" icon="pets" value={pet.p_gender} />
            <DetailRow label="Age" icon="pets" value={pet.p_age} />
          </View>

          {/* Description */}
          {pet.p_description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Divider style={styles.sectionDivider} />
              <Text style={styles.multilineText}>{pet.p_description}</Text>
            </View>
          )}

          {/* Adopt Me Button */}
          <TouchableOpacity
            style={styles.adoptButton}
            onPress={() => navigation.navigate('Adoption Form', { id: pet._id })}
          >
            <Text style={styles.adoptButtonText}>Adopt me!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const DetailRow = ({ label, icon, value }) => (
  <View>
    <View style={styles.detailRow}>
      <View style={styles.iconLabel}>
        <MaterialIcons name={icon} size={18} color="#ff69b4" style={{ marginRight: 6 }} />
        <Text style={styles.detailLabel}>{label}:</Text>
      </View>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
    <Divider style={styles.rowDivider} />
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  section: {
    backgroundColor: 'white',
    
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    alignItems: 'center',
  },
  petImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  noImageText: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff69b4',
    marginBottom: 12,
  },
  sectionDivider: {
    marginBottom: 12,
    backgroundColor: '#eee',
    height: 1,
  },
  rowDivider: {
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    height: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    alignItems: 'center',
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flex: 1,
    paddingLeft: 16,
  },
  multilineText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    lineHeight: 20,
  },
  adoptButton: {
    backgroundColor: '#ff69b4',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  adoptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdoptThePet;