import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const AdoptionTracker = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { adoptionData, petData } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [petDetails, setPetDetails] = useState(petData || null);
  const [adoptionStatus, setAdoptionStatus] = useState(adoptionData?.status || 'pending');

  // Custom Stepper Component
  const StatusStepper = ({ status }) => {
    const getSteps = () => {
      switch (status) {
        case 'pending': return ['Submitted', 'Under Review'];
        case 'accepted': return ['Submitted', 'Approved', 'Scheduled'];
        case 'complete': return ['Submitted', 'Approved', 'Completed'];
        case 'rejected': return ['Submitted', 'Rejected'];
        default: return ['Submitted', 'In Progress'];
      }
    };

    const getActiveStep = () => {
      switch (status) {
        case 'pending': return 1;
        case 'accepted': return 2;
        case 'complete': return 3;
        case 'rejected': return 1;
        default: return 1;
      }
    };

    const steps = getSteps();
    const activeStep = getActiveStep();

    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                index < activeStep && styles.completedStep,
                index === activeStep && styles.activeStep
              ]}>
                {index < activeStep ? (
                  <Icon name="check" size={16} color="#FFF" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                index < activeStep && styles.completedLabel,
                index === activeStep && styles.activeLabel
              ]}>
                {step}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < activeStep - 1 && styles.completedLine
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const getStatusMessage = () => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const formatTime = (timeString) => {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    switch (adoptionStatus) {
      case 'pending':
        return 'Your application is currently under review. We will notify you once a decision has been made.';
      case 'accepted':
        return `Your adoption request has been approved! Your scheduled visit is on ${formatDate(adoptionData.visitDate)} at ${formatTime(adoptionData.visitTime)}.`;
      case 'complete':
        return 'Congratulations! The adoption process is complete. Thank you for giving a pet a loving home.';
      case 'rejected':
        return 'We regret to inform you that your adoption request was not approved. Please contact us for more information.';
      default:
        return 'Your adoption status is currently being processed.';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Pet Information Section */}
      <AppBar />
      <View style={styles.petSection}>
        <Image
          source={petDetails?.pet_img?.[0] 
            ? { uri: `${config.address}${petDetails.pet_img[0]}` }
            : require('../../assets/Images/nobglogo.png')}
          style={styles.petImage}
        />
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{petDetails?.p_name || 'Unknown Pet'}</Text>
          <View style={styles.petDetails}>
            <Text>{petDetails?.p_age || 'N/A'} • {petDetails?.p_gender || 'N/A'}</Text>
            <Text>{petDetails?.p_type || 'N/A'} • {petDetails?.p_breed || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Status Stepper */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Adoption Status</Text>
        <StatusStepper status={adoptionStatus} />
        <View style={styles.statusMessageBox}>
          <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
        </View>
      </View>

      {/* Adoption Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Adoption Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Application Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(adoptionData.a_submitted_at).toLocaleDateString()}
          </Text>
        </View>
        {adoptionData.visitDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Scheduled Visit:</Text>
            <Text style={styles.detailValue}>
              {new Date(adoptionData.visitDate).toLocaleDateString()} at {adoptionData.visitTime}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: 
              adoptionStatus === 'pending' ? '#FFA500' :
              adoptionStatus === 'accepted' ? '#4CAF50' :
              adoptionStatus === 'complete' ? '#2196F3' : '#F44336'
            }
          ]}>
            <Text style={styles.statusText}>{adoptionStatus.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>BACK TO MY ADOPTIONS</Text>
        </TouchableOpacity>
        {adoptionStatus === 'accepted' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => Alert.alert('Contact Shelter', 'Would you like to contact the shelter about your visit?')}
          >
            <Text style={[styles.actionButtonText, { color: '#FFF' }]}>CONTACT SHELTER</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    marginHorizontal: 20,
    paddingBottom: 40,
  },
  petSection: {
    
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: '#F8F8F8',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  petDetails: {
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FF66C4',
  },
  statusSection: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    backgroundColor: '#FF66C4',
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
    color: '#FF66C4',
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
  statusMessageBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
  },
  statusMessage: {
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsSection: {
    marginTop: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF66C4',
  },
  primaryButton: {
    backgroundColor: '#FF66C4',
  },
  actionButtonText: {
    color: '#FF66C4',
    fontWeight: 'bold',
  },
});

export default AdoptionTracker;