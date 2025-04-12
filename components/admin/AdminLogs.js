import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${config.address}/api/logs/all`);
      const data = response.data;
      setLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  useEffect(() => {
    filterLogs();
  }, [selectedDate, selectedUser, selectedAction]);

  const filterLogs = () => {
    const filtered = logs.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      const matchDate = selectedDate === 'All' || !selectedDate ? true : logDate === selectedDate;
      const matchUser = selectedUser === 'All' || !selectedUser ? true : 
        (log.adminId?.a_username || 'N/A') === selectedUser;
      const matchAction = selectedAction === 'All' || !selectedAction ? true : log.action === selectedAction;
      return matchDate && matchUser && matchAction;
    });
    setFilteredLogs(filtered);
  };

  const renderDropdown = (options, selected, setSelected, visibleSetter) => (
    options.map((item, idx) => (
      <TouchableOpacity
        key={idx}
        style={styles.dropdownItem}
        onPress={() => {
          setSelected(item);
          visibleSetter(false);
        }}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    ))
  );

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}><Text style={styles.bold}>Action:</Text> {item.action} {item.entity}</Text>
      <Text style={styles.logText}><Text style={styles.bold}>User:</Text> {item.adminId?.a_username || 'N/A'}</Text>
      <Text style={styles.logText}><Text style={styles.bold}>Time:</Text> {new Date(item.timestamp).toLocaleString()}</Text>
      {item.description && (
        <Text style={styles.logText}>
          <Text style={styles.bold}>Details:</Text> {item.description}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loadingText}>Fetching Admin Logs...</Text>
      </View>
    );
  }

  const uniqueDates = ['All', ...new Set(logs.map(log => new Date(log.timestamp).toISOString().split('T')[0]))];
  const uniqueUsers = ['All', ...new Set(logs.map(log => log.adminId?.a_username || 'N/A'))];
  const uniqueActions = ['All', ...new Set(logs.map(log => log.action))];

  return (
    <View style={styles.container}>
      <AppBar />

      <View style={styles.filterRow}>
        {/* Date Filter */}
        <View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowDateDropdown(!showDateDropdown)}
          >
            <Icon name="calendar" size={20} color="#333" />
            <Text style={styles.filterText}>
              {selectedDate === 'All' || !selectedDate ? 'Filter by Date' : selectedDate}
            </Text>
          </TouchableOpacity>
          {showDateDropdown && (
            <View style={styles.dropdown}>
              {renderDropdown(uniqueDates, selectedDate, setSelectedDate, setShowDateDropdown)}
            </View>
          )}
        </View>

        {/* User Filter */}
        <View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowUserDropdown(!showUserDropdown)}
          >
            <Icon name="account" size={20} color="#333" />
            <Text style={styles.filterText}>
              {selectedUser === 'All' || !selectedUser ? 'Filter by User' : selectedUser}
            </Text>
          </TouchableOpacity>
          {showUserDropdown && (
            <View style={styles.dropdown}>
              {renderDropdown(uniqueUsers, selectedUser, setSelectedUser, setShowUserDropdown)}
            </View>
          )}
        </View>

        {/* Action Filter */}
        <View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowActionDropdown(!showActionDropdown)}
          >
            <Icon name="filter-variant" size={20} color="#333" />
            <Text style={styles.filterText}>
              {selectedAction === 'All' || !selectedAction ? 'Filter by Action' : selectedAction}
            </Text>
          </TouchableOpacity>
          {showActionDropdown && (
            <View style={styles.dropdown}>
              {renderDropdown(uniqueActions, selectedAction, setSelectedAction, setShowActionDropdown)}
            </View>
          )}
        </View>
      </View>

      <FlatList
        data={filteredLogs}
        renderItem={renderLogItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff69b4']}
            tintColor="#ff69b4"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No logs found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAF9F6' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#ff69b4',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FAF9F6',
    zIndex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#fff',
    elevation: 3,
    padding: 6,
    borderRadius: 6,
    position: 'absolute',
    top: 45,
    zIndex: 10,
    width: 180,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  listContent: { 
    padding: 16,
    paddingBottom: 32,
  },
  logItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  logText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default AdminLogs;