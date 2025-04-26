import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const AdoptionTracker = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { adoptionData, petData } = route.params;
  
  const [petDetails] = useState(petData || null);
  const [feedbackExists, setFeedbackExists] = useState(false);
  
  // Fix: Handle both "complete" and "completed" values from the API
  const rawStatus = adoptionData?.status?.toLowerCase() || 'pending';
  const adoptionStatus = rawStatus === 'complete' ? 'completed' : rawStatus;

  // Status Stepper Component
  const StatusStepper = ({ status }) => {
    const steps = ['Submitted', 'Accepted', 'Completed'];

    const getActiveStep = () => {
      switch (status) {
        case 'pending':
          return 1;
        case 'accepted':
          return 2;
        case 'completed':
          return 3; // All steps completed
        case 'rejected':
          return 1; // Only first step completed
        case 'failed':
          return 2; // First and second step with X
        default:
          return 1;
      }
    };

    const isStepFailed = (index) => {
      if (status === 'rejected' && index === 1) return true;
      if (status === 'failed' && index === 2) return true;
      return false;
    };

    const activeStep = getActiveStep();

    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                // If status is completed, mark all steps as completed
                (status === 'completed' || index < activeStep) && !isStepFailed(index) && styles.completedStep,
                isStepFailed(index) && styles.failedStep,
                index === activeStep - 1 && !isStepFailed(index) && status !== 'completed' && styles.activeStep,
              ]}>
                {isStepFailed(index) ? (
                  <MaterialIcons name="close" size={16} color="#FFF" />
                ) : (status === 'completed' || index < activeStep) ? (
                  <MaterialIcons name="check" size={16} color="#FFF" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                (status === 'completed' || index < activeStep) && !isStepFailed(index) && styles.completedLabel,
                isStepFailed(index) && styles.failedLabel,
                index === activeStep - 1 && !isStepFailed(index) && status !== 'completed' && styles.activeLabel,
              ]}>
                {step}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                // If status is completed, mark all step lines as completed
                (status === 'completed' || index < activeStep - 1) && !isStepFailed(index) && !isStepFailed(index + 1) && styles.completedLine,
                isStepFailed(index) && styles.failedLine
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const getStatusMessage = () => {
    switch (adoptionStatus) {
      case 'pending':
        return 'Your application is under review. We will notify you once a decision is made.';
      case 'accepted':
        return 'Your adoption request has been approved!';
      case 'completed':
        return feedbackExists
          ? 'Thank you for providing a forever home to your new pet! You have already submitted feedback.'
          : 'Congratulations! The adoption process is complete. We would love to hear your feedback.';
      case 'rejected':
        return `We regret to inform you that your adoption request was not approved. Reason: ${adoptionData.rejection_reason || 'Not specified'}`;
      case 'failed':
        return `There was an issue with the adoption process. Reason: ${adoptionData.failedReason || 'Not specified'}`;
      default:
        return 'Your adoption status is being processed.';
    }
  };

  const PetDetailRow = ({ icon, label, value }) => (
    <View style={styles.petDetailRow}>
      <MaterialIcons name={icon} size={20} color="#FF66C4" style={styles.petDetailIcon} />
      <Text style={styles.petDetailLabel}>{label}</Text>
      <Text style={styles.petDetailValue}>{value || 'N/A'}</Text>
    </View>
  );

  const handleSubmitFeedback = () => {
    navigation.navigate('Submit Feedback', { 
      adoptionId: adoptionData._id,
      petId: petDetails?._id
    });
  };

  const getStatusDate = () => {
    switch (adoptionStatus) {
      case 'completed':
        return adoptionData.completed_at ? new Date(adoptionData.completed_at).toLocaleDateString() : 'Not recorded';
      case 'rejected':
        return adoptionData.declined_at ? new Date(adoptionData.declined_at).toLocaleDateString() : 'Not recorded';
      case 'failed':
        return adoptionData.failed_at ? new Date(adoptionData.failed_at).toLocaleDateString() : 'Not recorded';
      case 'accepted':
        return adoptionData.approved_at ? new Date(adoptionData.approved_at).toLocaleDateString() : 'Not recorded';
      default:
        return new Date(adoptionData.a_submitted_at).toLocaleDateString();
    }
  };

  // For debugging
  console.log('Raw status:', rawStatus);
  console.log('Processed status:', adoptionStatus);

  return (
    <View style={styles.container}>
      <AppBar title="Adoption Tracker" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Status</Text>
          <Divider style={styles.sectionDivider} />
          
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color="#FF66C4" />
            <Text style={styles.detailLabel}>Submitted At:</Text>
            <Text style={styles.detailValue}>
              {new Date(adoptionData.a_submitted_at).toLocaleDateString()}
            </Text>
          </View>
          
          <Divider style={styles.rowDivider} />
          
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color="#FF66C4" />
            <Text style={styles.detailLabel}>Status Date:</Text>
            <Text style={styles.detailValue}>{getStatusDate()}</Text>
          </View>
          
          <Divider style={styles.rowDivider} />
          
          <View style={styles.detailRow}>
            <MaterialIcons name="info" size={20} color="#FF66C4" />
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              { 
                backgroundColor: 
                  adoptionStatus === 'pending' ? '#FFA500' :
                  adoptionStatus === 'accepted' ? '#4CAF50' :
                  adoptionStatus === 'completed' ? '#FF66C4' : // Pink for completed
                  adoptionStatus === 'rejected' ? '#F44336' :
                  '#F44336' // failed
              }
            ]}>
              <Text style={styles.statusText}>
                {/* Show "COMPLETED" even if database has "COMPLETE" */}
                {adoptionStatus === 'completed' ? 'COMPLETED' : adoptionStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Divider style={styles.rowDivider} />
          
          <StatusStepper status={adoptionStatus} />
          
          <View style={styles.statusMessageBox}>
            <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
            {(adoptionStatus === 'rejected' || adoptionStatus === 'failed') && (
              <Text style={styles.reasonText}>
                Reason: {adoptionStatus === 'rejected' 
                  ? adoptionData.rejection_reason || 'Not specified'
                  : adoptionData.failedReason || 'Not specified'}
              </Text>
            )}
          </View>
        </View>
        {/* Pet Information Section */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet Details</Text>
          <Divider style={styles.rowDivider} />
          {petDetails?.pet_img?.[0] ? (
            <Image
              source={{ uri: `${config.address}${petDetails.pet_img[0]}` }}
              style={styles.petImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="pets" size={40} color="#999" />
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}
          
          <PetDetailRow icon="pets" label="Name:" value={petDetails?.p_name} />
          <Divider style={styles.rowDivider} />
          <PetDetailRow icon="pets" label="Type:" value={petDetails?.p_type} />
          <Divider style={styles.rowDivider} />
          <PetDetailRow icon="pets" label="Breed:" value={petDetails?.p_breed} />
          <Divider style={styles.rowDivider} />
          <PetDetailRow icon="pets" label="Gender:" value={petDetails?.p_gender} />
          <Divider style={styles.rowDivider} />
          <PetDetailRow 
            icon="pets" 
            label="Age:" 
            value={petDetails?.p_age ? `${petDetails.p_age} years` : null} 
          />
        </View>

        

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          
          
          {adoptionStatus === 'accepted' && (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={() => Alert.alert('Contact Shelter', 'Would you like to contact the shelter about your visit?')}
            >
              <MaterialIcons name="phone" size={20} color="#FFF" />
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Contact Shelter</Text>
            </TouchableOpacity>
          )}
          
          {/* Show feedback button for "completed" status (which comes from "complete" in the database) */}
          {adoptionStatus === 'completed' && (
            <TouchableOpacity 
              style={[styles.button, styles.feedbackButton]}
              onPress={handleSubmitFeedback}
            >
              <MaterialIcons name="feedback" size={20} color="#FFF" />
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Submit Feedback</Text>
            </TouchableOpacity>
          )}
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
    fontSize: 22,
    fontWeight: '600',
    color: '#FF66C4',
  },
  sectionDivider: {
    marginVertical: 12,
    backgroundColor: '#eee',
    height: 1,
  },
  petImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    marginTop: 8,
    color: '#999',
  },
  petDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  petDetailIcon: {
    marginRight: 8,
  },
  petDetailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
  },
  petDetailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
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
    marginVertical: 20,
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
  failedStep: {
    backgroundColor: '#F44336',
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
  failedLabel: {
    color: '#F44336',
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
  failedLine: {
    backgroundColor: '#F44336',
  },
  statusMessageBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  statusMessage: {
    lineHeight: 22,
  },
  reasonText: {
    marginTop: 8,
    color: '#F44336',
    fontStyle: 'italic',
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
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF66C4',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF66C4',
  },
  feedbackButton: {
    backgroundColor: '#FF66C4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF66C4',
  },
});

export default AdoptionTracker;