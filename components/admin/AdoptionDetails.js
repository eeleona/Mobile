import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const AdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);

  const handleFail = () => {
    Alert.alert('Adoption Failed', 'The adoption process has been marked as failed.');
  };

  const handleComplete = () => {
    Alert.alert('Adoption Completed', 'The adoption process has been marked as completed.');
  };

  const formatContactNumber = (number) => {
    if (!number) return 'N/A';
    const numStr = number.toString();
    if (numStr.startsWith('63')) {
      return `0${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
    }
    return numStr.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  const StatusStepper = ({ status }) => {
    const steps = ['Submitted', 'Accepted', 'Completed'];

    const getActiveStep = () => {
      switch (status?.toLowerCase()) {
        case 'pending':
        case 'submitted':
          return 1;
        case 'accepted':
          return 2;
        case 'completed':
          return 3;
        default:
          return 1;
      }
    };

    const activeStep = getActiveStep();

    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  index < activeStep && styles.completedStep,
                  index === activeStep - 1 && styles.activeStep,
                ]}
              >
                {index < activeStep ? (
                  <MaterialIcons name="check" size={16} color="#FFF" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  index < activeStep && styles.completedLabel,
                  index === activeStep - 1 && styles.activeLabel,
                ]}
              >
                {step}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < activeStep - 1 && styles.completedLine,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={20} color="#ff69b4" style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar title="Adoption Details" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Application</Text>
          <Divider style={styles.sectionDivider} />
          <DetailRow
            icon="event"
            label="Submitted At:"
            value={new Date(adoption.a_submitted_at).toLocaleDateString()}
          />
          <Divider style={styles.rowDivider} />
          <DetailRow
            icon="info"
            label="Status:"
            value={adoption.status}
          />
          <Divider style={styles.rowDivider} />
          <StatusStepper status={adoption.status} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.failButton]}
              onPress={handleFail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={handleComplete}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Details</Text>
          <Divider style={styles.sectionDivider} />
          {adoption.p_id?.pet_img?.[0] ? (
            <Image
              style={styles.petImage}
              source={{ uri: `${config.address}${adoption.p_id.pet_img[0]}` }}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}
          <DetailRow icon="pets" label="Name:" value={adoption.p_id?.p_name} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="category" label="Type:" value={adoption.p_id?.p_type} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="pets" label="Breed:" value={adoption.p_id?.p_breed} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="male" label="Gender:" value={adoption.p_id?.p_gender} />
          <Divider style={styles.rowDivider} />
          <DetailRow
            icon="calendar-today"
            label="Age:"
            value={adoption.p_id?.p_age ? `${adoption.p_id.p_age} years` : null}
          />
        </View>

        {/* Adopter Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adopter Details</Text>
          <Divider style={styles.sectionDivider} />
          {adoption.v_id?.v_img ? (
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={{ uri: `${config.address}${adoption.v_id.v_img}` }}
              />
              
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Profile Image</Text>
            </View>
          )}
          <DetailRow icon="person" label="Name:" value={`${adoption.v_id?.v_fname} ${adoption.v_id?.v_lname}`} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="male" label="Gender:" value={adoption.v_id?.v_gender} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="cake" label="Birthdate:" value={adoption.v_id?.v_birthdate} />
          <Divider style={styles.rowDivider} />
          <DetailRow
            icon="phone"
            label="Contact:"
            value={formatContactNumber(adoption.v_id?.v_contactnumber)}
          />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="work" label="Occupation:" value={adoption.occupation} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="home" label="Address:" value={adoption.v_id?.v_add} />
        </View>

        {/* Adoption Form Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Form Details</Text>
          <Divider style={styles.sectionDivider} />
          <DetailRow icon="home" label="Home Type:" value={adoption.home_type} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="calendar-today" label="Years Resided:" value={adoption.years_resided} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="people" label="Adults in Household:" value={adoption.adults_in_household} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="child-care" label="Children in Household:" value={adoption.children_in_household} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="pets" label="Allergic to Pets:" value={adoption.allergic_to_pets} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="description" label="Household Description:" value={adoption.household_description} />
        </View>
      </ScrollView>
    </View>
  );
};

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
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  verifiedStatus: {
    marginTop: 8,
    fontSize: 14,
    color: '#ff69b4',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  rowDivider: {
    backgroundColor: '#eee',
    height: 1,
    marginVertical: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  stepContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  activeStep: {
    backgroundColor: '#ff69b4',
  },
  stepNumber: {
    color: '#757575',
    fontWeight: 'bold',
  },
  stepLabel: {
    marginTop: 5,
    color: '#757575',
    fontSize: 12,
    textAlign: 'center',
  },
  completedLabel: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  activeLabel: {
    color: '#ff69b4',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  failButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdoptionDetails;