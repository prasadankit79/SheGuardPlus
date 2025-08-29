import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal, TextInput, Pressable } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import CurvedButton from './CurvedButton';

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  contactId?: string;
}

export const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const userId = auth.currentUser?.uid;

  const getContactsCollection = useCallback(() => {
    if (!userId) throw new Error("User not authenticated");
    return collection(db, 'users', userId, 'emergencyContacts');
  }, [userId]);

  const loadContactsFromFirestore = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(getContactsCollection());
      const fetchedContacts: EmergencyContact[] = [];
      querySnapshot.forEach((doc) => {
        fetchedContacts.push({ id: doc.id, ...doc.data() } as EmergencyContact);
      });
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error loading contacts: ", error);
    }
  }, [getContactsCollection]);

  useEffect(() => {
    loadContactsFromFirestore();
  }, [loadContactsFromFirestore]);

  const openModal = (contact: EmergencyContact | null) => {
    setSelectedContact(contact);
    setName(contact ? contact.name : '');
    setPhone(contact ? contact.phoneNumber : '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!userId) { Alert.alert('Error', 'You must be logged in.'); return; }
    if (!name.trim() || !phone.trim()) { Alert.alert('Error', 'Name and phone are required.'); return; }
    try {
      if (selectedContact) {
        const contactDoc = doc(db, 'users', userId, 'emergencyContacts', selectedContact.id);
        await updateDoc(contactDoc, { name, phoneNumber: phone });
      } else {
        await addDoc(getContactsCollection(), { name, phoneNumber: phone });
      }
      await loadContactsFromFirestore();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving contact:", error);
      Alert.alert("Save Error", "Could not save the contact.");
    }
  };
  
  const handleDelete = () => {
    if (!selectedContact) return;
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${selectedContact.name}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeContact(selectedContact.id) }
      ]
    );
  };

  const removeContact = async (docId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'users', userId, 'emergencyContacts', docId));
      await loadContactsFromFirestore();
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not delete contact.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => openModal(item)} style={styles.contactItem}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
            </View>
            <Ionicons name="pencil" size={24} color="#B0BEC5" />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No emergency contacts found.</Text>}
      />
      <View style={styles.addButtonContainer}>
        <CurvedButton title="Add New Contact" onPress={() => openModal(null)} />
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedContact ? 'Edit Contact' : 'Add Contact'}</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <View style={styles.buttonRow}>
              <CurvedButton title="Cancel" onPress={() => setModalVisible(false)} color="#E0E0E0" textColor="#333" />
              <CurvedButton title="Save" onPress={handleSave} />
            </View>
            
            {/* The Delete button now appears here when editing */}
            {selectedContact && (
              <View style={styles.deleteButtonContainer}>
                 <CurvedButton title="Delete" onPress={handleDelete} color="#D32F2F" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contactItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  contactName: { fontSize: 16, fontWeight: '500' },
  contactNumber: { fontSize: 14, color: 'gray' },
  emptyText: { textAlign: 'center', color: 'gray', marginVertical: 20, fontSize: 16 },
  addButtonContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 },
  deleteButtonContainer: {
      marginTop: 20,
      width: '100%',
      alignItems: 'center'
  }
});