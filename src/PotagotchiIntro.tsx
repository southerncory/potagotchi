/**
 * Potagotchi Intro Animation
 * Plays when app opens - potato runs in, waves, runs off
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const POTATO_SIZE = 200;

// Timing from the video (in milliseconds)
const TIMING = {
  runInStart: 0,
  runInEnd: 2000,        // Stops at 2 seconds
  waveStart: 2000,
  waveEnd: 4700,         // Starts running again at 4.7 seconds
  runOutStart: 5200,     // Begins transitioning off at 5.2 seconds
  totalDuration: 7000,   // Estimated total video length
};

// Positions
const OFF_SCREEN_LEFT = -POTATO_SIZE;
const CENTER = (SCREEN_WIDTH - POTATO_SIZE) / 2;
const OFF_SCREEN_RIGHT = SCREEN_WIDTH + POTATO_SIZE;

interface PotagotchiIntroProps {
  onComplete: () => void;
  videoSource?: any; // Allow custom video source
}

export function PotagotchiIntro({ 
  onComplete,
  videoSource = require('../assets/intro_wave.mp4'),
}: PotagotchiIntroProps) {
  const videoRef = useRef<Video>(null);
  const translateX = useRef(new Animated.Value(OFF_SCREEN_LEFT)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Phase 1: Run in (0 - 2s)
    Animated.timing(translateX, {
      toValue: CENTER,
      duration: TIMING.runInEnd - TIMING.runInStart,
      useNativeDriver: true,
    }).start();

    // Phase 2: Stay in center during wave (2s - 5.2s)
    // No animation needed, potato stays put

    // Phase 3: Run off (5.2s onwards)
    setTimeout(() => {
      Animated.timing(translateX, {
        toValue: OFF_SCREEN_RIGHT,
        duration: 1500, // Run off duration
        useNativeDriver: true,
      }).start();
    }, TIMING.runOutStart);

    // Fade out and complete
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, TIMING.runOutStart + 1200);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        // Video finished, trigger completion
        onComplete();
      }
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <StatusBar hidden />
      
      <Animated.View
        style={[
          styles.potatoContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          // For transparent video (if supported)
          videoStyle={styles.videoInner}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF9F0', // Match app background
    justifyContent: 'center',
    alignItems: 'center',
  },
  potatoContainer: {
    width: POTATO_SIZE,
    height: POTATO_SIZE,
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - POTATO_SIZE / 2,
  },
  video: {
    width: POTATO_SIZE,
    height: POTATO_SIZE,
  },
  videoInner: {
    backgroundColor: 'transparent',
  },
});

export default PotagotchiIntro;
