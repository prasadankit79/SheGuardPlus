// File: app/privacy-policy.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.paragraph}>
        Your privacy is important to us. It is SheGuard+'s policy to respect your privacy regarding any information we may collect from you through our app.
      </Text>
      <Text style={styles.subTitle}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We only ask for personal information when we truly need it to provide a service to you. This includes your email for login and your contacts for emergency services. Your location is only accessed when you trigger an SOS alert.
      </Text>
      {/* Add more placeholder text as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  paragraph: { fontSize: 16, lineHeight: 24 },
});