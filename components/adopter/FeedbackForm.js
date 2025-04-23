import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../server/config/config';
import jwt_decode from 'jwt-decode';

const FeedbackForm = ({ navigation, route }) => {
  useEffect(() => {
    console.log("Route params:", route.params);
  }, []);
  
  // Fix: Correctly extract parameters with their actual names
  const { adoptionId, petId } = route.params || {};
  
  // Use these values for a_id and p_id in your component
  const a_id = adoptionId;
  const p_id = petId;

  const [ratings, setRatings] = useState({
    adoption: {
      requirementsClear: 0,
      petInfoClear: 0,
      teamHelpfulness: 0,
      processSmoothness: 0,
      petMatchedDescription: 0
    },
    website: {
      easyNavigation: 0,
      searchHelpful: 0,
      formUserFriendly: 0,
      goodPerformance: 0,
      recommend: 0
    }
  });

  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setAuthError('Please login to submit feedback');
          return;
        }

        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          await AsyncStorage.removeItem('authToken');
          setAuthError('Session expired. Please login again.');
          return;
        }

        const userIdFromToken = decoded.userId || decoded.id || decoded.sub;
        if (!userIdFromToken) {
          setAuthError('Invalid token format');
          return;
        }

        setUserId(userIdFromToken);
      } catch (err) {
        console.error("Auth error:", err);
        setAuthError('Failed to verify authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleRatingChange = (category, key, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (authError) {
      Alert.alert('Authentication Required', authError);
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User identification failed');
      return;
    }

    // Add validation for the required IDs
    if (!a_id || !p_id) {
      Alert.alert('Error', 'Missing adoption or pet identifiers');
      console.error("Missing required IDs:", { a_id, p_id });
      return;
    }
  
    // Validate all ratings are provided
    const allRatingsProvided = 
      Object.values(ratings.adoption).every(r => r > 0) && 
      Object.values(ratings.website).every(r => r > 0);
    
    if (!allRatingsProvided) {
      Alert.alert('Incomplete Form', 'Please provide ratings for all questions');
      return;
    }

    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token');

      const payload = {
        a_id,
        p_id,
        v_id: userId,
        adoptionRatings: {
          requirementsClear: ratings.adoption.requirementsClear,
          petInfoClear: ratings.adoption.petInfoClear,
          teamHelpfulness: ratings.adoption.teamHelpfulness,
          processSmoothness: ratings.adoption.processSmoothness,
          petMatchedDescription: ratings.adoption.petMatchedDescription
        },
        websiteRatings: {
          easyNavigation: ratings.website.easyNavigation,
          searchHelpful: ratings.website.searchHelpful,
          formUserFriendly: ratings.website.formUserFriendly, 
          goodPerformance: ratings.website.goodPerformance,
          recommend: ratings.website.recommend
        },
        feedbackText
      };

      console.log("Token:", token ? `${token.substring(0, 10)}...` : "No token");
      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${config.address}/api/submit/feedback`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      Alert.alert('Success', response.data.message || 'Feedback submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit feedback';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderRatingRow = (label, category, key) => (
    <View style={styles.ratingRow}>
      <Text style={styles.questionText}>{label}</Text>
      <View style={styles.optionsRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            style={[
              styles.optionButton,
              ratings[category][key] === val && styles.optionButtonSelected,
            ]}
            onPress={() => handleRatingChange(category, key, val)}
          >
            <Text style={[
              styles.optionText,
              ratings[category][key] === val && styles.optionTextSelected
            ]}>
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar title="Submit Feedback" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF66C4" />
        </View>
      </View>
    );
  }

  if (authError) {
    return (
      <View style={styles.container}>
        <AppBar title="Submit Feedback" />
        <View style={styles.center}>
          <Text style={styles.errorText}>{authError}</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AppBar title="Submit Feedback" />
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Adoption Process</Text>
        
        {renderRatingRow(
          'The adoption requirements were clear',
          'adoption',
          'requirementsClear'
        )}
        {renderRatingRow(
          "Pet's information was clearly provided",
          'adoption',
          'petInfoClear'
        )}
        {renderRatingRow(
          'The team was helpful throughout',
          'adoption',
          'teamHelpfulness'
        )}
        {renderRatingRow(
          'The process was smooth',
          'adoption',
          'processSmoothness'
        )}
        {renderRatingRow(
          'Pet matched the description',
          'adoption',
          'petMatchedDescription'
        )}

        <Text style={styles.sectionTitle}>Website Experience</Text>
        
        {renderRatingRow(
          'Easy to navigate',
          'website',
          'easyNavigation'
        )}
        {renderRatingRow(
          'Search filters were helpful',
          'website',
          'searchHelpful'
        )}
        {renderRatingRow(
          'Forms were user-friendly',
          'website',
          'formUserFriendly'
        )}
        {renderRatingRow(
          'Good performance',
          'website',
          'goodPerformance'
        )}
        {renderRatingRow(
          'Would recommend to others',
          'website',
          'recommend'
        )}

        <Text style={styles.sectionTitle}>Additional Comments</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          value={feedbackText}
          onChangeText={setFeedbackText}
          placeholder="Share your experience..."
        />

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <MaterialIcons name="send" size={20} color="white" />
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF66C4',
    marginTop: 20,
    marginBottom: 15,
  },
  ratingRow: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    backgroundColor: '#FF66C4',
    borderColor: '#FF66C4',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  optionTextSelected: {
    color: 'white',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#FF66C4',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FF66C4',
    padding: 12,
    borderRadius: 6,
    minWidth: 120,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FeedbackForm;