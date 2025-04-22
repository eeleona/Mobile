import React, { useState, useEffect, useRef } from 'react';
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
  ScrollView,
  Animated,
  Easing,
  TextInput
} from 'react-native';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';
import AppBar from '../design/AppBar';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(50)).current;

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
      const sortedFeedbacks = response.data.sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      setFeedbacks(sortedFeedbacks);
      setFilteredFeedbacks(sortedFeedbacks);
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    const query = text.toLowerCase();
    const filtered = feedbacks.filter(feedback => {
      const adopterName = feedback.adopterUsername?.toLowerCase() || '';
      const petName = feedback.petName?.toLowerCase() || '';
      return adopterName.includes(query) || petName.includes(query);
    });
    setFilteredFeedbacks(filtered);
  };

  const openFeedbackModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeFeedbackModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedFeedback(null);
    });
  };

  const renderFeedbackItem = ({ item }) => (
    <TouchableOpacity onPress={() => openFeedbackModal(item)} activeOpacity={0.8}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.feedbackCard}
      >
        <View style={styles.feedbackHeader}>
          {item.userAvatar ? (
            <Image 
              source={{ uri: `${config.address}${item.userAvatar}` }} 
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Avatar.Text 
              size={50} 
              label={item.adopterUsername ? item.adopterUsername.charAt(0).toUpperCase() : 'A'} 
              style={styles.avatar}
            />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.adopterUsername || 'Anonymous User'}</Text>
            <Text style={styles.petName}>Pet: {item.petName || 'N/A'}</Text>
            <Text style={styles.dateText}>
              {new Date(item.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by adopter or pet name"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialIcons
          name="search"
          size={24}
          color="#FF66C4"
          style={styles.searchIcon}
        />
      </View>

      {filteredFeedbacks.length === 0 ? (
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
          data={filteredFeedbacks}
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
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeFeedbackModal}
      >
        <Animated.View style={[styles.modalBackdrop, { opacity: modalOpacity }]}>
          <TouchableOpacity 
            style={styles.modalBackdropTouchable}
            activeOpacity={1}
            onPress={closeFeedbackModal}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                { transform: [{ translateY: modalTranslateY }] }
              ]}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeFeedbackModal}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={28} color="#666" />
              </TouchableOpacity>

              {selectedFeedback && (
                <ScrollView 
                  contentContainerStyle={styles.modalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.modalHeader}>
                    {selectedFeedback.userAvatar ? (
                      <Image 
                        source={{ uri: `${config.address}${selectedFeedback.userAvatar}` }} 
                        style={styles.modalAvatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <Avatar.Text 
                        size={80} 
                        label={selectedFeedback.adopterUsername ? selectedFeedback.adopterUsername.charAt(0).toUpperCase() : 'A'} 
                        style={[styles.avatar, styles.modalAvatar]}
                      />
                    )}
                    <View style={styles.modalUserInfo}>
                      <Text style={styles.modalUserName}>{selectedFeedback.adopterUsername || 'Anonymous User'}</Text>
                      <Text style={styles.modalPetName}>Pet: {selectedFeedback.petName || 'N/A'}</Text>
                      <Text style={styles.modalDate}>
                        Submitted: {new Date(selectedFeedback.submittedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
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
                  </View>
                </ScrollView>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
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
    tintColor: '#FF66C4',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
    elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
  },
  feedbackCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#FF66C4',
    marginRight: 16,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FF66C4',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
  },
  petName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#FF66C4',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#718096',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBackdropTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FF66C4',
  },
  modalUserInfo: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
  },
  modalPetName: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FF66C4',
    marginTop: 4,
  },
  modalDate: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#718096',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF66C4',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#4A5568',
    flex: 1,
  },
  ratingValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#2D3748',
    width: 60,
    textAlign: 'right',
  },
});

export default Feedbacks;