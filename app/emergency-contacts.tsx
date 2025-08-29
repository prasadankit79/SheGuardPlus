import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EmergencyContacts } from '../components/EmergencyContacts'; // We will be upgrading this component

export default function EmergencyContactsScreen() {
  return (
    <View style={styles.container}>
      {/* This screen is now dedicated to the EmergencyContacts component.
        We've moved all the logic for adding, editing, and showing contacts
        inside the component itself to keep it organized.
      */}
      <EmergencyContacts />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});