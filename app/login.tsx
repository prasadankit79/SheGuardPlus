import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
// Import the function for sending a password reset email
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .catch(error => {
        console.error("Login Error:", error);
        Alert.alert('Login Error', error.message);
      });
  };

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .catch(error => {
        console.error("Sign Up Error:", error);
        Alert.alert('Sign Up Error', error.message);
      });
  };

  // --- NEW FUNCTION for Forgot Password ---
  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address in the email field first.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Password Reset Email Sent', 'Please check your inbox (and spam folder) to reset your password.');
      })
      .catch(error => {
        console.error("Forgot Password Error:", error);
        // Provide a more user-friendly message for common errors
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'This email address is not registered. Please sign up.');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SheGuard+</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#8E44AD" />
        <Button title="Sign Up" onPress={handleSignUp} color="#4A0C6B" />
      </View>

      {/* --- NEW Pressable component for Forgot Password link --- */}
      <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3E5F5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#4A0C6B' },
  input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#fff' },
  buttonContainer: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' },
  // --- NEW STYLES for the link ---
  forgotPasswordContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#4A0C6B',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});