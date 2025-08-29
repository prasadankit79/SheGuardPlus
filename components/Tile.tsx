import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TileProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  iconColor?: string; // New prop for icon circle color
  textColor?: string; // New prop for text color
}

const Tile: React.FC<TileProps> = ({
  icon,
  title,
  onPress,
  iconColor = '#1E88E5', // Default icon circle color (Sky Blue)
  textColor = '#333', // Default text color
}) => {
  return (
    <Pressable style={({ pressed }) => [styles.tile, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
        <Ionicons name={icon} size={30} color="#fff" />
      </View>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '45%', // Still two tiles per row
    aspectRatio: 1, // Still a square shape
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: '2.5%', // Spacing between tiles
    borderRadius: 24, // Our new smooth radius!
    backgroundColor: '#fff',
    elevation: 6, // Increased shadow for a more premium look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  pressed: {
    opacity: 0.8, // Slight visual feedback on press
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Tile;