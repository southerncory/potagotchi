/**
 * Potagotchi Action Buttons
 * Interaction UI for the virtual pet
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface PotagotchiActionsProps {
  onPlay: () => void;
  onRest: () => void;
  onToggleTheme: () => void;
  disabled?: boolean;
}

export function PotagotchiActions({
  onPlay,
  onRest,
  onToggleTheme,
  disabled = false,
}: PotagotchiActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.playButton, disabled && styles.disabled]}
        onPress={onPlay}
        disabled={disabled}
      >
        <Text style={styles.buttonIcon}>🎮</Text>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.restButton, disabled && styles.disabled]}
        onPress={onRest}
        disabled={disabled}
      >
        <Text style={styles.buttonIcon}>😴</Text>
        <Text style={styles.buttonText}>Rest</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.themeButton, disabled && styles.disabled]}
        onPress={onToggleTheme}
        disabled={disabled}
      >
        <Text style={styles.buttonIcon}>🌙</Text>
        <Text style={styles.buttonText}>Theme</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 80,
  },
  playButton: {
    backgroundColor: '#4ECDC4',
  },
  restButton: {
    backgroundColor: '#9B59B6',
  },
  themeButton: {
    backgroundColor: '#34495E',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default PotagotchiActions;
