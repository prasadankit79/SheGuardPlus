// File: app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  // The redirect logic has been removed from here.

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch(error => Alert.alert('Login Error', error.message));
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .catch(error => Alert.alert('Sign Up Error', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SheGuard+</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#8E44AD" />
        <Button title="Sign Up" onPress={handleSignUp} color="#4A0C6B" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3E5F5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#4A0C6B' },
  input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#fff' },
  buttonContainer: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' },
});