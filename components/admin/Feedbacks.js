import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { Card, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';
import AppBar from '../design/AppBar';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${config.address}/api/feedback`);
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const openFeedbackModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const closeFeedbackModal = () => {
    setModalVisible(false);
    setSelectedFeedback(null);
  };

  const renderFeedbackItem = ({ item }) => (
    <TouchableOpacity onPress={() => openFeedbackModal(item)}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.feedbackCard}
      >
        <View style={styles.feedbackHeader}>
          {item.userAvatar ? (
            <Image 
              source={{ uri: `${config.address}${item.p_img}` }} 
              style={styles.avatarImage}
            />
          ) : (
            <Avatar.Text 
              size={40} 
              label={item.adopterUsername ? item.adopterUsername.charAt(0).toUpperCase() : 'A'} 
              style={styles.avatar}
            />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.adopterUsername || 'Anonymous User'}</Text>
            <Text style={styles.dateText}>
              {new Date(item.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>
        <Text style={styles.feedbackText} numberOfLines={2}>
          {item.feedbackText || 'No feedback text provided'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF66C4" />
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF66C4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={50} color="#FF66C4" />
        <Text style={styles.errorText}>Oops! Couldn't load feedbacks</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchFeedbacks}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar />
      
      {feedbacks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Image 
            source={require('../../assets/Images/pawicon2.png')} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No feedbacks yet</Text>
          <Text style={styles.emptySubText}>Be the first to share your experience!</Text>
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF66C4']}
              tintColor="#FF66C4"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Feedback Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeFeedbackModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeFeedbackModal}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {selectedFeedback && (
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.modalHeader}>
                  {selectedFeedback.userAvatar ? (
                    <Image 
                      source={{ uri: `${config.address}/${selectedFeedback.userAvatar}` }} 
                      style={styles.modalAvatar}
                    />
                  ) : (
                    <Avatar.Text 
                      size={60} 
                      label={selectedFeedback.adopterUsername ? selectedFeedback.adopterUsername.charAt(0).toUpperCase() : 'A'} 
                      style={[styles.avatar, styles.modalAvatar]}
                    />
                  )}
                  <View style={styles.modalUserInfo}>
                    <Text style={styles.modalUserName}>{selectedFeedback.adopterUsername || 'Anonymous User'}</Text>
                    <Text style={styles.modalPetName}>Pet: {selectedFeedback.petName || 'N/A'}</Text>
                    <Text style={styles.modalDate}>
                      Submitted: {new Date(selectedFeedback.submittedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Adoption Ratings</Text>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Requirements clarity:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.adoptionRatings?.requirementsClear ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Pet information:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.adoptionRatings?.petInfoClear ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Team helpfulness:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.adoptionRatings?.teamHelpfulness ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Process smoothness:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.adoptionRatings?.processSmoothness ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Pet matched description:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.adoptionRatings?.petMatchedDescription ?? "N/A"}
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Website Ratings</Text>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Easy navigation:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.websiteRatings?.easyNavigation ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Search helpfulness:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.websiteRatings?.searchHelpful ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Form user-friendly:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.websiteRatings?.formUserFriendly ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Website performance:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.websiteRatings?.goodPerformance ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Would recommend:</Text>
                    <Text style={styles.ratingValue}>
                      {selectedFeedback.websiteRatings?.recommend ?? "N/A"}
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Additional Comments</Text>
                  <Text style={styles.commentsText}>
                    {selectedFeedback.feedbackText || "No additional comments provided"}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    color: '#4A5568',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#718096',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF66C4',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 30,
  },
  feedbackCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#FF66C4',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#718096',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#D69E2E',
    marginLeft: 4,
  },
  feedbackText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#4A5568',
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  modalUserInfo: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
  },
  modalPetName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4A5568',
    marginTop: 2,
  },
  modalDate: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#718096',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF66C4',
    marginBottom: 10,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4A5568',
    flex: 1,
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
    width: 40,
    textAlign: 'right',
  },
  commentsText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4A5568',
    lineHeight: 20,
    marginTop: 5,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

});

export default Feedbacks;