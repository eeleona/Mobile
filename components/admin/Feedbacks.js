import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Image, FlatList, StyleSheet } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import AppBar from '../design/AppBar';

const Feedbacks = ({}) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const fetchFeedbacks = () => {
    const dummyFeedbacks = [
      { id: 1, name: 'Zoe', text: 'Smooth transaction. Thank you! ❤️' },
      { id: 2, name: 'Lara', text: 'WOULD RECOMMEND 💯💯💯' },
      { id: 3, name: 'Jake', text: 'Thank you so much, Pasay Animal Shelter 🖤' },
    ];
    setFeedbacks(dummyFeedbacks);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Feedbacks</Text>
      </View>
        <FlatList
        data={feedbacks}
        renderItem={({ item }) => (
          <View style={styles.feedbackContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.feedbackItem}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.feedbackList}
      />
        <AdminNavbar></AdminNavbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  headerContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    fontSize: 30,
    marginLeft: 15,
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginLeft: 15,
    marginTop: 15,
  },
  feedbackList: {
    marginRight: 20,
    marginLeft: 20,
    flexGrow: 1,
  },
  feedbackContainer: {
    width: '100%',
    height: 80,
    marginTop:15,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    fontSize: 15,
  },
  feedbackItem: {
    fontSize: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    fontFamily: 'Inter_500Medium',
  },
});

export default Feedbacks;