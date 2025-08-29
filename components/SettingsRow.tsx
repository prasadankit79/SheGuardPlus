import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, title, onPress }) => {
  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.leftContent}>
        <Ionicons name={icon} size={24} color="#1E88E5" style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#B0BEC5" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5', // A light grey background for the row
    padding: 15,
    borderRadius: 12,
    marginVertical: 8, // Space between rows
  },
  pressed: {
    opacity: 0.7,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsRow;