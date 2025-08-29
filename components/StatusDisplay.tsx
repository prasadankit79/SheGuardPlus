import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface StatusDisplayProps {
  locationStatus: Location.PermissionStatus;
  onViewContacts: () => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ locationStatus, onViewContacts }) => {
  const isLocationGranted = locationStatus === 'granted';

  return (
    <View style={styles.statusBar}>
      <View style={styles.statusItem}>
        <Ionicons name="location-sharp" size={24} color={isLocationGranted ? '#4CAF50' : '#F44336'} />
        <Text style={styles.statusText}>Location {isLocationGranted ? 'ON' : 'OFF'}</Text>
      </View>
      <View style={styles.statusItem}>
        <MaterialCommunityIcons name="web" size={24} color="#4CAF50" />
        <Text style={styles.statusText}>Online</Text>
      </View>
      <TouchableOpacity style={styles.statusItem} onPress={onViewContacts}>
        <FontAwesome5 name="user-friends" size={20} color="#0288D1" />
        <Text style={styles.statusText}>View Contacts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
});

export default StatusDisplay;