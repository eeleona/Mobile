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
  
      // Sort by timestamp descending (most recent first)
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
      setLogs(sortedData);
      setFilteredLogs(sortedData);
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
        style={[
          styles.dropdownItem,
          (selected === item || (!selected && item === 'All')) && styles.selectedDropdownItem
        ]}
        onPress={() => {
          setSelected(item === 'All' ? '' : item);
          visibleSetter(false);
        }}
      >
        <Text style={styles.dropdownItemText}>{item}</Text>
        {(selected === item || (!selected && item === 'All')) && (
          <MaterialIcons name="check" size={18} color="#ff69b4" />
        )}
      </TouchableOpacity>
    ))
  );

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <MaterialIcons 
          name={getActionIcon(item.action)} 
          size={20} 
          color="#ff69b4" 
          style={styles.logIcon}
        />
        <Text style={styles.logAction}>{item.action} {item.entity}</Text>
      </View>
      <View style={styles.logDetailRow}>
        <MaterialIcons name="person" size={16} color="#666" />
        <Text style={styles.logText}>{item.adminId?.a_username || 'N/A'}</Text>
      </View>
      <View style={styles.logDetailRow}>
        <MaterialIcons name="access-time" size={16} color="#666" />
        <Text style={styles.logText}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      {item.description && (
        <View style={styles.logDetailRow}>
          <MaterialIcons name="info" size={16} color="#666" />
          <Text style={styles.logText}>{item.description}</Text>
        </View>
      )}
    </View>
  );

  const getActionIcon = (action) => {
    switch(action.toLowerCase()) {
      case 'create': return 'add-circle-outline';
      case 'update': return 'edit';
      case 'delete': return 'delete-outline';
      case 'login': return 'login';
      case 'logout': return 'logout';
      default: return 'history';
    }
  };

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
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (selectedDate && selectedDate !== 'All') && styles.activeFilter
            ]}
            onPress={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowUserDropdown(false);
              setShowActionDropdown(false);
            }}
          >
            <MaterialIcons 
              name="event" 
              size={20} 
              color={(selectedDate && selectedDate !== 'All') ? "#fff" : "#ff69b4"} 
            />
            <Text style={[
              styles.filterText,
              (selectedDate && selectedDate !== 'All') && styles.activeFilterText
            ]}>
              {!selectedDate ? 'Date' : selectedDate === 'All' ? 'All Dates' : selectedDate}
            </Text>
            <MaterialIcons 
              name={showDateDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
              size={20} 
              color={(selectedDate && selectedDate !== 'All') ? "#fff" : "gray"} 
            />
          </TouchableOpacity>
          {showDateDropdown && (
            <View style={styles.dropdown}>
              {renderDropdown(uniqueDates, selectedDate, setSelectedDate, setShowDateDropdown)}
            </View>
          )}
        </View>

        {/* User Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (selectedUser && selectedUser !== 'All') && styles.activeFilter
            ]}
            onPress={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowDateDropdown(false);
              setShowActionDropdown(false);
            }}
          >
            <MaterialIcons 
              name="person" 
              size={20} 
              color={(selectedUser && selectedUser !== 'All') ? "#fff" : "#ff69b4"} 
            />
            <Text style={[
              styles.filterText,
              (selectedUser && selectedUser !== 'All') && styles.activeFilterText
            ]}>
              {!selectedUser ? 'User' : selectedUser === 'All' ? 'All Users' : selectedUser}
            </Text>
            <MaterialIcons 
              name={showUserDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
              size={20} 
              color={(selectedUser && selectedUser !== 'All') ? "#fff" : "gray"} 
            />
          </TouchableOpacity>
          {showUserDropdown && (
            <View style={styles.dropdown}>
              {renderDropdown(uniqueUsers, selectedUser, setSelectedUser, setShowUserDropdown)}
            </View>
          )}
        </View>

        {/* Action Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (selectedAction && selectedAction !== 'All') && styles.activeFilter
            ]}
            onPress={() => {
              setShowActionDropdown(!showActionDropdown);
              setShowDateDropdown(false);
              setShowUserDropdown(false);
            }}
          >
            <MaterialIcons 
              name="filter-list" 
              size={20} 
              color={(selectedAction && selectedAction !== 'All') ? "#fff" : "#ff69b4"} 
            />
            <Text style={[
              styles.filterText,
              (selectedAction && selectedAction !== 'All') && styles.activeFilterText
            ]}>
              {!selectedAction ? 'Action' : selectedAction === 'All' ? 'All Actions' : selectedAction}
            </Text>
            <MaterialIcons 
              name={showActionDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
              size={20} 
              color={(selectedAction && selectedAction !== 'All') ? "#fff" : "gray"} 
            />
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
            colors={['#6200ee']}
            tintColor="#6200ee"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No logs found matching your filters</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedDate('');
                setSelectedUser('');
                setSelectedAction('');
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff69b4',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  filterContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff69b4',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  activeFilter: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  filterText: {
    marginHorizontal: 6,
    fontSize: 14,
    color: '#ff69b4',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  dropdown: {
    backgroundColor: '#fff',
    elevation: 4,
    padding: 6,
    borderRadius: 8,
    position: 'absolute',
    top: 45,
    zIndex: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedDropdownItem: {
    backgroundColor: '#ffe4ef',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  listContent: {
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#ff69b4',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logIcon: {
    marginRight: 8,
  },
  logAction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  logDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
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
  resetButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff69b4',
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default AdminLogs;