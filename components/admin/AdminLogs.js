import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar'; // Assuming you have an AppBar component

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${config.address}/api/logs/all`);
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching logs:', err);
      }
    };

    fetchLogs();
  }, []);

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}>
        <Text style={styles.boldText}>Action:</Text> {item.action}
      </Text>
      <Text style={styles.logText}>
        <Text style={styles.boldText}>User:</Text> {item.userId || 'N/A'}
      </Text>
      <Text style={styles.logText}>
        <Text style={styles.boldText}>Timestamp:</Text> {new Date(item.timestamp).toLocaleString()}
      </Text>
      {item.details && (
        <Text style={styles.logText}>
          <Text style={styles.boldText}>Details:</Text> {JSON.stringify(item.details)}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar />
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No logs available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  logItem: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default AdminLogs;