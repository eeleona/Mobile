import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Divider, Chip } from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const PetDetails = ({ route, navigation }) => {
  const { pet } = route.params;

  return (
    <View style={styles.container}>
      <AppBar title="Pet Details" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pet Image */}
        <View style={styles.section}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.petImage}
              source={{ uri: `${config.address}${pet.pet_img[0]}` }}
            />
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Divider style={styles.sectionDivider} />
          <DetailRow label="Name:" value={pet.p_name} />
          <DetailRow label="Type:" value={pet.p_type} />
          <DetailRow label="Breed:" value={pet.p_breed} />
          <DetailRow label="Gender:" value={pet.p_gender} />
          <DetailRow label="Age:" value={pet.p_age} />
          <DetailRow label="Weight:" value={`${pet.p_weight} kg`} />
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Divider style={styles.sectionDivider} />
          <View style={styles.statusContainer}>
            <Chip
              icon={pet.p_status === 'Available' ? 'check' : 'clock'}
              style={[
                styles.statusChip,
                pet.p_status === 'Available' ? styles.availableChip : styles.pendingChip
              ]}
            >
              {pet.p_status}
            </Chip>
          </View>
        </View>

        {/* Vaccines */}
        {pet.p_vaccines && pet.p_vaccines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vaccines</Text>
            <Divider style={styles.sectionDivider} />
            <View style={styles.chipContainer}>
              {pet.p_vaccines.map((vaccine, index) => (
                <Chip key={index} style={styles.vaccineChip}>{vaccine}</Chip>
              ))}
            </View>
          </View>
        )}

        {/* Medical History */}
        {pet.p_medicalhistory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical History</Text>
            <Divider style={styles.sectionDivider} />
            <Text style={styles.multilineText}>{pet.p_medicalhistory}</Text>
          </View>
        )}

        {/* Description */}
        {pet.p_description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Divider style={styles.sectionDivider} />
            <Text style={styles.multilineText}>{pet.p_description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View>
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
    <Divider style={styles.rowDivider} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
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
    marginBottom: 16,
  },
  petImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    resizeMode: 'contain', // Show full image
    backgroundColor: 'white',
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
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vaccineChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#EDF2F7',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  availableChip: {
    backgroundColor: '#C6F6D5',
  },
  pendingChip: {
    backgroundColor: '#FEEBC8',
  },
});

export default PetDetails;
