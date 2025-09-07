import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// A small component to display each contact in the list
const ContactItem = ({ item, onDelete }) => (
  <View style={styles.contactItem}>
    <View>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactNumber}>{item.phone}</Text>
    </View>
    <Pressable onPress={() => onDelete(item.id)}>
      <Ionicons name="trash-bin" size={24} color="#E74C3C" />
    </Pressable>
  </View>
);

export default function EmergencyContactsScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([]);

  // When the screen opens, it will load previously saved contacts
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('emergencyContacts');
      if (savedContacts !== null) {
        setContacts(JSON.parse(savedContacts));
      }
    } catch (e) {
      console.error('Failed to load contacts.', e);
    }
  };

  const handleAddContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number.');
      return;
    }
    // Phone number should only contain digits
    if (!/^\d+$/.test(phone.trim())) {
        Alert.alert('Error', 'Phone number can only contain digits.');
        return;
    }

    const newContact = { id: Date.now().toString(), name: name.trim(), phone: phone.trim() };
    const updatedContacts = [...contacts, newContact];

    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
      setContacts(updatedContacts);
      setName('');
      setPhone('');
      Alert.alert('Success', 'Contact added successfully!');
    } catch (e) {
      console.error('Failed to save contact.', e);
    }
  };

  const handleDeleteContact = async (id) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
      setContacts(updatedContacts);
    } catch (e) {
      console.error('Failed to delete contact.', e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Your Guardians</Text>
      <Text style={styles.subHeader}>Add people you trust. Pressing SOS will send them a message with your location.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contact Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (e.g., 9876543210)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Pressable style={styles.addButton} onPress={handleAddContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </Pressable>
      </View>

      <Text style={styles.listHeader}>Saved Contacts</Text>
      {contacts.length === 0 ? (
        <Text style={styles.noContactsText}>No contacts added yet.</Text>
      ) : (
        <FlatList
          data={contacts}
          renderItem={({ item }) => <ContactItem item={item} onDelete={handleDeleteContact} />}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A0C6B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#6A1B9A',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#8E44AD',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A0C6B',
    marginBottom: 15,
  },
  contactItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#555',
  },
  noContactsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  }
});