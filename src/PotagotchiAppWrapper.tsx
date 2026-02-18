/**
 * Potagotchi App Wrapper
 * Handles intro animation on first load, then shows main content
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PotagotchiIntro } from './PotagotchiIntro';

const INTRO_SHOWN_KEY = '@potagotchi_intro_shown_today';

interface PotagotchiAppWrapperProps {
  children: React.ReactNode;
  showIntroOnce?: boolean;      // Only show once per day
  alwaysShowIntro?: boolean;    // Always show intro (for testing)
  skipIntro?: boolean;          // Never show intro
  onIntroComplete?: () => void;
}

export function PotagotchiAppWrapper({
  children,
  showIntroOnce = true,
  alwaysShowIntro = false,
  skipIntro = false,
  onIntroComplete,
}: PotagotchiAppWrapperProps) {
  const [showIntro, setShowIntro] = useState(!skipIntro);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkIntroStatus();
  }, []);

  const checkIntroStatus = async () => {
    if (skipIntro) {
      setShowIntro(false);
      setIsChecking(false);
      return;
    }

    if (alwaysShowIntro) {
      setShowIntro(true);
      setIsChecking(false);
      return;
    }

    if (showIntroOnce) {
      try {
        const lastShown = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
        const today = new Date().toDateString();
        
        if (lastShown === today) {
          // Already shown today, skip
          setShowIntro(false);
        } else {
          // Show intro and mark as shown
          setShowIntro(true);
          await AsyncStorage.setItem(INTRO_SHOWN_KEY, today);
        }
      } catch (error) {
        console.error('Failed to check intro status:', error);
        setShowIntro(true);
      }
    }

    setIsChecking(false);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    onIntroComplete?.();
  };

  // Still checking storage
  if (isChecking) {
    return <View style={styles.loading} />;
  }

  // Show intro
  if (showIntro) {
    return <PotagotchiIntro onComplete={handleIntroComplete} />;
  }

  // Show main content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
});

export default PotagotchiAppWrapper;
