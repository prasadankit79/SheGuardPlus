import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface CurvedButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
}

const CurvedButton: React.FC<CurvedButtonProps> = ({ title, onPress, color = '#8E44AD', textColor = '#fff' }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: color, opacity: pressed ? 0.8 : 1 }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, // This creates the curve!
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 120, // Give buttons a nice minimum width
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CurvedButton;