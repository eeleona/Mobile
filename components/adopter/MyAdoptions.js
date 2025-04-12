import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import config from '../../server/config/config';

const MyAdoptions = () => {
  const navigation = useNavigation();
  const [adoptions, setAdoptions] = useState([]);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackExists, setFeedbackExists] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useContext(AuthContext) || {};

  const [adoptionRatings, setAdoptionRatings] = useState({
    adoptionRequirements: 0,
    petInfoProvided: 0,
    teamHelpfulness: 0,
    processSmoothness: 0,
    petMatchedDescription: 0
  });
  
  const [websiteRatings, setWebsiteRatings] = useState({
    easyNavigation: 0,
    searchFiltering: 0,
    formUserFriendly: 0,
    goodPerformance: 0,
    recommend: 0
  });
  
  const [feedbackText, setFeedbackText] = useState("");

  // Verify navigation is available
  useEffect(() => {
    if (!navigation) {
      console.error('Navigation prop is missing!');
    }
  }, [navigation]);

  // Custom Stepper Component
  const CustomStepper = ({ steps, activeStep }) => {
    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isLast = index === steps.length - 1;
    
          return (
            <React.Fragment key={index}>
              <View style={styles.stepContainer}>
                <View
                  style={[
                    styles.stepCircle,
                    isActive && styles.activeStepCircle,
                    isCompleted && styles.completedStepCircle,
                  ]}
                >
                  {isCompleted ? (
                    <Icon name="check" size={16} color="white" />
                  ) : (
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.activeStepLabel,
                    isCompleted && styles.completedStepLabel,
                  ]}
                >
                  {step}
                </Text>
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.stepLine,
                    isCompleted && styles.completedStepLine,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  // Get authentication headers
  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.navigate('Login');
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Check token validity periodically
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
      }
    };
    
    const interval = setInterval(checkToken, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [navigation]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = await getAuthHeaders();
        if (!headers.Authorization) return;
        
        const response = await axios.get(`${config.address}/api/user/profile`, { headers });
    
        setUserProfile(response.data.user || {});
        if (response.data.user?.profileImage) {
          setUserProfileImage(`${config.address}${response.data.user.profileImage}`);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 403) {
          await AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        }
        setError(error.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch adoptions
  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const headers = await getAuthHeaders();
        if (!headers.Authorization) return;
        
        const response = await axios.get(`${config.address}/api/my/adoptions`, { headers });

        const sortedAdoptions = (response.data || []).sort((a, b) => 
          new Date(b.a_submitted_at) - new Date(a.a_submitted_at));
        setAdoptions(sortedAdoptions);

        if (sortedAdoptions.length > 0) {
          const firstAdoptionId = sortedAdoptions[0]._id;
          await checkFeedbackExists(firstAdoptionId);
        }
      } catch (error) {
        console.error('Error fetching adoptions:', error);
        if (error.response?.status === 403) {
          await AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        }
        setError(error.response?.data?.message || 'Failed to fetch adoptions');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, []);

  // Check if feedback exists for an adoption
  const checkFeedbackExists = async (adoptionId) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) return;
      
      const response = await axios.get(
        `${config.address}/api/feedback/check/${adoptionId}`, 
        { headers }
      );
      setFeedbackExists(response.data?.exists || false); 
    } catch (error) {
      console.error('Error checking feedback:', error);
      setFeedbackExists(false);
    }
  };

  // Handle rating changes
  const handleRatingChange = (category, value, type) => {
    if (type === "adoption") {
      setAdoptionRatings(prev => ({ ...prev, [category]: value }));
    } else {
      setWebsiteRatings(prev => ({ ...prev, [category]: value }));
    }
  };

  // Fetch pet details
  const fetchPetById = async (petId) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) return;
      
      const response = await axios.get(`${config.address}/api/pet/${petId}`, { headers });
      setSelectedPet(response.data?.thePet || null);
    } catch (error) {
      console.error('Error fetching pet:', error);
      setError('Failed to fetch pet details');
    }
  };

  // Handle adoption selection - Updated with better navigation handling
  const handleAdoptionClick = async (adoption) => {
    try {
      console.log('Attempting navigation to AdoptionDetails...');
      
      if (!navigation || !navigation.navigate) {
        throw new Error('Navigation not available');
      }

      setSelectedAdoption(adoption || null);
      if (adoption?.p_id?._id) {
        await fetchPetById(adoption.p_id._id);
      }
      if (adoption?._id) {
        await checkFeedbackExists(adoption._id);
      }

      // Navigate to AdoptionDetails screen
      navigation.navigate('AdoptionDetails', {
        adoptionId: adoption._id,
        petId: adoption.p_id?._id,
        status: adoption.status,
        visitDate: adoption.visitDate,
        visitTime: adoption.visitTime
      });
      
    } catch (error) {
      console.error('Navigation failed:', error);
      Alert.alert('Error', 'Could not navigate to adoption details');
    }
  };

  // Get status message
  const getStatusMessage = (status, visitDate = '', visitTime = '') => {
    const formattedDate = visitDate ? new Date(visitDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
    
    const formatTime = (time) => {
      const [hours, minutes] = time?.split(':') || [];
      const date = new Date();
      date.setHours(parseInt(hours, 10) || 0);
      date.setMinutes(parseInt(minutes, 10) || 0);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formattedTime = visitTime ? formatTime(visitTime) : 'N/A';

    switch (status) {
      case 'pending':
        return 'Your application is being reviewed. Please wait for updates.';
      case 'accepted':
        return `Your request was accepted! Visit scheduled for ${formattedDate} at ${formattedTime}.`;
      case 'rejected':
        return 'Your request was rejected. Contact us for more information.';
      case 'failed':
        return 'There was an issue processing your request. Please try again.';
      case 'complete':
        return feedbackExists
          ? 'Thank you for adopting!' 
          : 'Thank you for adopting! Please share your feedback.';
      default:
        return 'Status unknown. Please contact support.';
    }
  };

  // Get step labels for stepper
  const getStepLabels = (status) => {
    switch (status) {
      case 'pending': return ['Submitted', 'Under Review', 'Decision', 'Complete'];
      case 'accepted': return ['Submitted', 'Approved', 'Scheduled', 'Complete'];
      case 'rejected': return ['Submitted', 'Rejected'];
      case 'complete': return ['Submitted', 'Approved', 'Completed'];
      case 'failed': return ['Submitted', 'Processing Failed'];
      default: return ['Submitted', 'In Progress', 'Complete'];
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    setLoading(true);
  
    // Get user ID from either the adoption object or AuthContext
    const userId = selectedAdoption?.user?.id || user?.id;
    
    if (!userId) {
      Alert.alert("Error", "User ID missing. Please log in again.");
      setLoading(false);
      return;
    }

    const feedbackData = {
      a_id: selectedAdoption?._id,
      p_id: selectedAdoption?.p_id?._id,
      v_id: userId,
      adoptionRatings,
      websiteRatings,
      feedbackText
    };

    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) return;
      
      const response = await axios.post(
        `${config.address}/api/submit/feedback`, 
        feedbackData,
        { headers }
      );
      
      Alert.alert("Success", response.data?.message || 'Feedback submitted successfully');
      setShowFeedbackModal(false);
      setFeedbackExists(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Star rating component
  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => onRatingChange(star)}
            activeOpacity={0.7}
          >
            <Icon 
              name={star <= rating ? 'star' : 'star-border'} 
              size={24} 
              color="#FFD700" 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Get active step for stepper
  const getActiveStep = (status) => {
    switch (status) {
      case 'submitted': return 0;
      case 'pending': return 1;
      case 'accepted': return 2; 
      case 'rejected': return 1;
      case 'complete': return 3;
      case 'failed': return 2;
      default: return 0; 
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  // Filter adoptions by status
  const filteredAdoptions = statusFilter
    ? adoptions.filter(adoption => adoption.status === statusFilter)
    : adoptions;

  // Get status badge styles
  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FFA500' }; 
      case 'accepted': return { backgroundColor: '#4CAF50' }; 
      case 'complete': return { backgroundColor: '#2196F3' };
      case 'rejected': 
      case 'failed': return { backgroundColor: '#F44336' }; 
      default: return { backgroundColor: '#9E9E9E' };
    }
  };

  // Render adoption item
  const renderAdoptionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.adoptionItem}
      onPress={() => handleAdoptionClick(item)}
    >
      {item.p_id?.pet_img?.length > 0 && (
        <Image
          source={{ uri: `${config.address}${item.p_id.pet_img[0]}` }}
          style={styles.petImage}
        />
      )}
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.p_id?.p_name || 'Unknown'}</Text>
        <Text style={styles.petDetails}>
          {item.p_id ? `${item.p_id.p_gender} ${item.p_id.p_type}` : 'No details'}
        </Text>
      </View>
      <View style={[styles.statusBadge, getStatusStyles(item.status)]}>
        <Text style={styles.statusText}>{item.status?.toUpperCase() || 'UNKNOWN'}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render feedback question
  const renderFeedbackQuestion = (question, key, type) => {
    return (
      <View style={styles.feedbackQuestion}>
        <Text style={styles.questionText}>{question}</Text>
        <StarRating 
          rating={type === "adoption" ? adoptionRatings[key] : websiteRatings[key]}
          onRatingChange={(value) => handleRatingChange(key, value, type)}
        />
      </View>
    );
  };

  // Get step labels for stepper
  const steps = selectedAdoption ? getStepLabels(selectedAdoption.status) : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image 
            source={userProfileImage ? 
              { uri: userProfileImage } : 
              require('../../assets/Images/user.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.userName}>
              {userProfile?.firstName || ''} {userProfile?.lastName || ''}
            </Text>
            <Text style={styles.userRole}>PET ADOPTER</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>MY ADOPTIONS</Text>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={statusFilter}
          onValueChange={handleStatusFilterChange}
          style={styles.picker}
          dropdownIconColor="#FF66C4"
        >
          <Picker.Item label="All Adoptions" value="" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Accepted" value="accepted" />
          <Picker.Item label="Completed" value="complete" />
          <Picker.Item label="Rejected" value="rejected" />
          <Picker.Item label="Failed" value="failed" />
        </Picker>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Adoption List */}
        <View style={styles.adoptionList}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF66C4" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : filteredAdoptions.length > 0 ? (
            <FlatList
              data={filteredAdoptions}
              renderItem={renderAdoptionItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <Text style={styles.noAdoptionsText}>No adoptions found</Text>
          )}
        </View>

        {/* Adoption Details */}
        <View style={styles.adoptionDetails}>
          {selectedPet ? (
            <ScrollView contentContainerStyle={styles.detailContent}>
              <Text style={styles.detailTitle}>ADOPTION STATUS</Text>
              
              {/* Pet Info */}
              <View style={styles.petDetailHeader}>
                {selectedPet.pet_img?.length > 0 && (
                  <Image
                    source={{ uri: `${config.address}${selectedPet.pet_img[0]}` }}
                    style={styles.detailPetImage}
                  />
                )}
                <View style={styles.petDetailInfo}>
                  <Text style={styles.detailPetName}>{selectedPet.p_name}</Text>
                  <Text>Age: {selectedPet.p_age}</Text>
                  <Text>Gender: {selectedPet.p_gender}</Text>
                  <Text>Type: {selectedPet.p_type}</Text>
                  <Text>Breed: {selectedPet.p_breed || 'N/A'}</Text>
                </View>
              </View>

              {/* Custom Stepper */}
              {selectedAdoption && (
                <CustomStepper 
                  steps={steps}
                  activeStep={getActiveStep(selectedAdoption.status)}
                />
              )}

              {/* Status Message */}
              <View style={styles.statusMessage}>
                <Text style={styles.statusTitle}>
                  Status: <Text style={{ 
                    color: getStatusStyles(selectedAdoption?.status).backgroundColor 
                  }}>
                    {selectedAdoption?.status?.toUpperCase() || 'UNKNOWN'}
                  </Text>
                </Text>
                <Text style={styles.messageText}>
                  {getStatusMessage(
                    selectedAdoption?.status, 
                    selectedAdoption?.visitDate, 
                    selectedAdoption?.visitTime
                  )}
                </Text>

                {selectedAdoption?.status === 'complete' && !feedbackExists && (
                  <TouchableOpacity
                    style={styles.feedbackButton}
                    onPress={() => setShowFeedbackModal(true)}
                  >
                    <Text style={styles.feedbackButtonText}>SUBMIT FEEDBACK</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyDetails}>
              <Text style={styles.emptyTitle}>Your Adoption Status</Text>
              <Text style={styles.emptyText}>will appear here</Text>
              <Text style={styles.emptyText}>Select a pet to view details</Text>
            </View>
          )}
        </View>
      </View>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SUBMIT FEEDBACK</Text>
            <TouchableOpacity 
              onPress={() => setShowFeedbackModal(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionHeader}>ADOPTION PROCESS</Text>
            
            {renderFeedbackQuestion(
              "The adoption requirements were easy to understand.",
              "adoptionRequirements",
              "adoption"
            )}
            
            {renderFeedbackQuestion(
              "The pet's information was clearly provided.",
              "petInfoProvided",
              "adoption"
            )}
            
            {renderFeedbackQuestion(
              "The adoption team was helpful.",
              "teamHelpfulness",
              "adoption"
            )}
            
            {renderFeedbackQuestion(
              "The process was smooth.",
              "processSmoothness",
              "adoption"
            )}
            
            {renderFeedbackQuestion(
              "The pet matched the description.",
              "petMatchedDescription",
              "adoption"
            )}

            <Text style={styles.sectionHeader}>WEBSITE USABILITY</Text>
            
            {renderFeedbackQuestion(
              "Navigating the website was easy.",
              "easyNavigation",
              "website"
            )}
            
            {renderFeedbackQuestion(
              "Search and filtering options were helpful.",
              "searchFiltering",
              "website"
            )}
            
            {renderFeedbackQuestion(
              "The application form was user-friendly.",
              "formUserFriendly",
              "website"
            )}
            
            {renderFeedbackQuestion(
              "The website performed well.",
              "goodPerformance",
              "website"
            )}
            
            {renderFeedbackQuestion(
              "I would recommend this website.",
              "recommend",
              "website"
            )}

            <Text style={styles.commentLabel}>ADDITIONAL COMMENTS</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Share your experience..."
              placeholderTextColor="#888"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>SUBMIT FEEDBACK</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF66C4',
    textTransform: 'uppercase',
  },
  filterContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  adoptionList: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#EEE',
  },
  listContent: {
    paddingBottom: 20,
  },
  adoptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontWeight: 'bold',
  },
  petDetails: {
    color: '#666',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adoptionDetails: {
    flex: 2,
    padding: 15,
  },
  detailContent: {
    paddingBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FF66C4',
    textTransform: 'uppercase',
  },
  petDetailHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailPetImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  petDetailInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailPetName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
  activeStepCircle: {
    backgroundColor: '#FF66C4',
  },
  completedStepCircle: {
    backgroundColor: '#4CAF50',
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
  activeStepLabel: {
    color: '#FF66C4',
    fontWeight: 'bold',
  },
  completedStepLabel: {
    color: '#4CAF50',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  completedStepLine: {
    backgroundColor: '#4CAF50',
  },
  statusMessage: {
    marginTop: 20,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    marginTop: 10,
    lineHeight: 22,
  },
  feedbackButton: {
    marginTop: 20,
    backgroundColor: '#FF66C4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptyText: {
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF66C4',
  },
  closeButton: {
    padding: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#FF66C4',
  },
  feedbackQuestion: {
    marginBottom: 15,
  },
  questionText: {
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
  },
  commentLabel: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalFooter: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#FF66C4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noAdoptionsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default MyAdoptions;