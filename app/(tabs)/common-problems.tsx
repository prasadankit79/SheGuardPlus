import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This "export default" line is what makes the file a screen.
export default function CommonProblemsScreen() { 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Problems & FAQs</Text>
      <Text style={styles.subtitle}>This is the Frequently Asked Questions screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
});