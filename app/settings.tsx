import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import SettingsRow from '../components/SettingsRow'; // Import our new component

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth).catch(error => Alert.alert("Logout Error", error.message));
  };

  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{auth.currentUser?.email?.[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </View>

      {/* Settings List */}
      <View style={styles.listSection}>
        <SettingsRow
          icon="chatbox-ellipses-outline"
          title="Customize SOS Message"
          onPress={() => Alert.alert("Navigate", "This would open the message customization screen.")}
        />
        <SettingsRow
          icon="people-outline"
          title="Emergency Contacts"
          onPress={() => Alert.alert("Navigate", "This would open the contacts management screen.")}
        />
        <SettingsRow
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => router.push('/privacy-policy')}
        />
        <SettingsRow
          icon="log-out-outline"
          title="Log Out"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    backgroundColor: '#F5F5F5',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#37474F',
  },
  listSection: {
    padding: 20,
  },
});