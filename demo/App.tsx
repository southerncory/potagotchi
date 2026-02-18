/**
 * Potagotchi Demo App
 * Run with: npx expo start
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PotagotchiIntro } from '../src/PotagotchiIntro';
import { Potagotchi } from '../src/Potagotchi';
import { PotagotchiActions } from '../src/PotagotchiActions';
import { usePotagotchi } from '../src/usePotagotchi';
import { PotagotchiOnboarding } from '../src/PotagotchiOnboarding';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const { 
    potato, 
    isLoading, 
    createPotato, 
    play, 
    rest, 
    toggleTheme,
    feed,
  } = usePotagotchi();

  // Show intro first
  if (showIntro) {
    return (
      <PotagotchiIntro 
        onComplete={() => setShowIntro(false)} 
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // No potato yet - show onboarding
  if (!potato) {
    return <PotagotchiOnboarding onCreate={createPotato} />;
  }

  // Main view
  return (
    <View style={styles.container}>
      <Potagotchi potato={potato} onTap={play} />
      
      <PotagotchiActions
        onPlay={play}
        onRest={rest}
        onToggleTheme={toggleTheme}
      />

      {/* Test buttons */}
      <View style={styles.testButtons}>
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => feed(10)}
        >
          <Text style={styles.testButtonText}>+$10 Cred (Feed)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => setShowIntro(true)}
        >
          <Text style={styles.testButtonText}>Replay Intro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  testButtons: {
    marginTop: 30,
    gap: 12,
  },
  testButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
