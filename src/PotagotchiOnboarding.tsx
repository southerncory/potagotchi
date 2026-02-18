/**
 * Potagotchi Onboarding
 * Screen shown when user doesn't have a potato yet
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';

interface PotagotchiOnboardingProps {
  onCreate: (name: string) => void;
}

export function PotagotchiOnboarding({ onCreate }: PotagotchiOnboardingProps) {
  const [name, setName] = useState('');
  const [bounceAnim] = useState(new Animated.Value(1));

  // Gentle bounce animation
  React.useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();
    return () => bounce.stop();
  }, []);

  const handleCreate = () => {
    onCreate(name.trim() || 'Spud');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Potagotchi!</Text>
      <Text style={styles.subtitle}>
        Your very own digital potato companion
      </Text>

      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <View style={styles.eggContainer}>
          <Text style={styles.eggEmoji}>🥔</Text>
        </View>
      </Animated.View>

      <Text style={styles.description}>
        Your potato will grow as you earn rewards.{'\n'}
        Shop locally, watch it thrive!
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name your potato:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Spud"
          placeholderTextColor="#AAA"
          maxLength={20}
          autoCapitalize="words"
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Hatch My Potato! 🌱</Text>
      </TouchableOpacity>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🛒</Text>
          <Text style={styles.featureText}>Shop to feed</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📈</Text>
          <Text style={styles.featureText}>Watch it grow</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✨</Text>
          <Text style={styles.featureText}>Unlock rewards</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF9F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4D3E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  eggContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  eggEmoji: {
    fontSize: 80,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  createButton: {
    backgroundColor: '#1B4D3E',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 32,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    flexDirection: 'row',
    gap: 24,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PotagotchiOnboarding;
