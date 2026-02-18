/**
 * Potagotchi Component
 * Main visual component with animations
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { PotatoData, PotatoStage, PotatoEmotion, PotatoState, ThemeMode } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POTATO_SIZE = Math.min(SCREEN_WIDTH * 0.6, 250);

// Asset paths - adjust based on your bundler
const SPRITES = {
  light: {
    baby: {
      happy: require('../assets/baby/happy.png'),
      sad: require('../assets/baby/sad.png'),
      angry: require('../assets/baby/angry.png'),
      sleepy: require('../assets/baby/sleepy.png'),
    },
    adult: {
      happy: require('../assets/adult/happy.png'),
      sad: require('../assets/adult/sad.png'),
      angry: require('../assets/adult/angry.png'),
      sleepy: require('../assets/adult/sleepy.png'),
    },
    golden: {
      happy: require('../assets/golden/happy.png'),
      sad: require('../assets/golden/sad.png'),
      angry: require('../assets/golden/angry.png'),
      sleepy: require('../assets/golden/sleepy.png'),
    },
    states: {
      wilted: require('../assets/states/wilted.png'),
      sick: require('../assets/states/sick.png'),
    },
    accessories: {
      hat: require('../assets/accessories/hat.png'),
      sunglasses: require('../assets/accessories/sunglasses.png'),
      crown: require('../assets/accessories/crown.png'),
    },
  },
  cyberpunk: {
    happy: require('../assets/cyberpunk/happy.png'),
    sad: require('../assets/cyberpunk/sad.png'),
    angry: require('../assets/cyberpunk/angry.png'),
    sleepy: require('../assets/cyberpunk/sleepy.png'),
  },
};

interface PotagotchiProps {
  potato: PotatoData;
  onTap?: () => void;
  showStats?: boolean;
}

export function Potagotchi({ potato, onTap, showStats = true }: PotagotchiProps) {
  // Animation values
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  // Breathing animation
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, []);

  // Glow animation for golden stage
  useEffect(() => {
    if (potato.stage === 'golden') {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [potato.stage]);

  // Bounce on tap
  const handleTap = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
    
    onTap?.();
  };

  // Get the right sprite
  const getSprite = () => {
    // Check state overrides first
    if (potato.state === 'sick') {
      return SPRITES.light.states.sick;
    }
    if (potato.state === 'wilted') {
      return SPRITES.light.states.wilted;
    }

    // Cyberpunk theme
    if (potato.theme === 'cyberpunk') {
      return SPRITES.cyberpunk[potato.emotion];
    }

    // Normal sprites by stage
    return SPRITES.light[potato.stage][potato.emotion];
  };

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <View style={styles.statContainer}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statValue}>{Math.round(value)}</Text>
    </View>
  );

  return (
    <View style={[
      styles.container,
      potato.theme === 'cyberpunk' && styles.containerCyberpunk
    ]}>
      {/* Golden glow effect */}
      {potato.stage === 'golden' && (
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowAnim,
              transform: [{ scale: breatheAnim }],
            },
          ]}
        />
      )}

      {/* Main potato */}
      <TouchableOpacity onPress={handleTap} activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.potatoContainer,
            {
              transform: [
                { scale: breatheAnim },
                { translateY: bounceAnim },
              ],
            },
          ]}
        >
          <Image
            source={getSprite()}
            style={styles.potato}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Name */}
      <Text style={[
        styles.name,
        potato.theme === 'cyberpunk' && styles.nameCyberpunk
      ]}>
        {potato.name}
      </Text>

      {/* Stage badge */}
      <View style={[styles.badge, styles[`badge${potato.stage}`]]}>
        <Text style={styles.badgeText}>
          {potato.stage.charAt(0).toUpperCase() + potato.stage.slice(1)}
        </Text>
      </View>

      {/* Stats */}
      {showStats && (
        <View style={styles.statsContainer}>
          <StatBar label="🍟" value={potato.stats.hunger} color="#FF6B6B" />
          <StatBar label="😊" value={potato.stats.happiness} color="#4ECDC4" />
          <StatBar label="⚡" value={potato.stats.energy} color="#FFE66D" />
        </View>
      )}

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          ${potato.progress.totalCred.toFixed(2)} Cred
        </Text>
        <Text style={styles.progressSubtext}>
          {potato.progress.oxoAccumulated.toFixed(4)} OXO
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF9F0',
    borderRadius: 24,
  },
  containerCyberpunk: {
    backgroundColor: '#0D0D1A',
  },
  glow: {
    position: 'absolute',
    width: POTATO_SIZE * 1.5,
    height: POTATO_SIZE * 1.5,
    borderRadius: POTATO_SIZE,
    backgroundColor: '#FFD700',
    top: 20,
  },
  potatoContainer: {
    width: POTATO_SIZE,
    height: POTATO_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  potato: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  nameCyberpunk: {
    color: '#00FFFF',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  badgebaby: {
    backgroundColor: '#FFE4C4',
  },
  badgeadult: {
    backgroundColor: '#DEB887',
  },
  badgegolden: {
    backgroundColor: '#FFD700',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
    gap: 8,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 16,
    width: 24,
  },
  statBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  progressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4D3E',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#D4AF37',
    marginTop: 4,
  },
});

export default Potagotchi;
