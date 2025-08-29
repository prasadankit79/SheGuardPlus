// File: components/FeatureButton.tsx

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface FeatureButtonProps {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.iconContainer}>{icon}</View>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '45%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    minHeight: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  iconContainer: {
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
});

export default FeatureButton; // <-- This line is crucial!