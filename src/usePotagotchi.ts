/**
 * Potagotchi State Management Hook
 * Handles all game logic, persistence, and state updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PotatoData,
  PotatoStage,
  PotatoEmotion,
  PotatoState,
  PotatoStats,
  Accessory,
  STAGE_THRESHOLDS,
  DECAY_RATES,
  STATE_THRESHOLDS,
  ACHIEVEMENT_REWARDS,
} from './types';

const STORAGE_KEY = '@potagotchi_data';
const TICK_INTERVAL = 60000; // Update every minute

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Default new potato
const createNewPotato = (name: string = 'Spud'): PotatoData => ({
  id: generateId(),
  name,
  createdAt: new Date(),
  stage: 'baby',
  emotion: 'happy',
  state: 'healthy',
  stats: {
    hunger: 100,
    happiness: 100,
    energy: 100,
  },
  progress: {
    totalCred: 0,
    oxoAccumulated: 0,
    daysActive: 0,
    lastFed: new Date(),
    lastInteraction: new Date(),
    streak: 0,
  },
  achievements: {
    firstPurchase: false,
    tenPurchases: false,
    hundredPurchases: false,
    firstReferral: false,
    weekStreak: false,
    monthStreak: false,
    thousandCred: false,
    tenThousandCred: false,
  },
  accessory: null,
  theme: 'light',
});

// Calculate stage from total Cred
const calculateStage = (totalCred: number): PotatoStage => {
  if (totalCred >= STAGE_THRESHOLDS.golden) return 'golden';
  if (totalCred >= STAGE_THRESHOLDS.adult) return 'adult';
  return 'baby';
};

// Calculate emotion from stats
const calculateEmotion = (stats: PotatoStats): PotatoEmotion => {
  const avg = (stats.hunger + stats.happiness + stats.energy) / 3;
  
  if (stats.energy < 30) return 'sleepy';
  if (stats.happiness < 30) return 'sad';
  if (stats.hunger < 30) return 'angry';
  if (avg > 70) return 'happy';
  if (avg < 40) return 'sad';
  
  return 'happy';
};

// Calculate state from stats
const calculateState = (stats: PotatoStats): PotatoState => {
  const minStat = Math.min(stats.hunger, stats.happiness, stats.energy);
  
  if (minStat < STATE_THRESHOLDS.sick) return 'sick';
  if (minStat < STATE_THRESHOLDS.wilted) return 'wilted';
  return 'healthy';
};

// Calculate stat decay based on time elapsed
const calculateDecay = (
  stats: PotatoStats,
  lastInteraction: Date
): PotatoStats => {
  const hoursElapsed = (Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60);
  
  return {
    hunger: Math.max(0, stats.hunger - hoursElapsed * DECAY_RATES.hunger),
    happiness: Math.max(0, stats.happiness - hoursElapsed * DECAY_RATES.happiness),
    energy: Math.max(0, stats.energy - hoursElapsed * DECAY_RATES.energy),
  };
};

export interface UsePotagotchiReturn {
  potato: PotatoData | null;
  isLoading: boolean;
  
  // Actions
  createPotato: (name?: string) => Promise<void>;
  feed: (credAmount: number) => void;
  play: () => void;
  rest: () => void;
  rename: (name: string) => void;
  setAccessory: (accessory: Accessory) => void;
  toggleTheme: () => void;
  
  // For integration with Loop app
  onPurchase: (credEarned: number) => void;
  onReferral: () => void;
  syncProgress: (totalCred: number, oxo: number) => void;
}

export function usePotagotchi(): UsePotagotchiReturn {
  const [potato, setPotato] = useState<PotatoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Load from storage
  useEffect(() => {
    loadPotato();
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Start tick timer when potato exists
  useEffect(() => {
    if (potato && !tickRef.current) {
      tickRef.current = setInterval(tick, TICK_INTERVAL);
    }
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [potato?.id]);

  const loadPotato = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as PotatoData;
        // Recalculate stats based on time elapsed
        const updatedStats = calculateDecay(data.stats, data.progress.lastInteraction);
        const updated: PotatoData = {
          ...data,
          stats: updatedStats,
          emotion: calculateEmotion(updatedStats),
          state: calculateState(updatedStats),
          progress: {
            ...data.progress,
            lastInteraction: new Date(),
          },
        };
        setPotato(updated);
        await savePotato(updated);
      }
    } catch (error) {
      console.error('Failed to load Potagotchi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePotato = async (data: PotatoData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save Potagotchi:', error);
    }
  };

  const updatePotato = useCallback((updater: (prev: PotatoData) => PotatoData) => {
    setPotato((prev) => {
      if (!prev) return null;
      const updated = updater(prev);
      // Recalculate derived states
      updated.emotion = calculateEmotion(updated.stats);
      updated.state = calculateState(updated.stats);
      updated.stage = calculateStage(updated.progress.totalCred);
      savePotato(updated);
      return updated;
    });
  }, []);

  // Periodic tick - decay stats
  const tick = useCallback(() => {
    updatePotato((prev) => ({
      ...prev,
      stats: {
        hunger: Math.max(0, prev.stats.hunger - DECAY_RATES.hunger / 60),
        happiness: Math.max(0, prev.stats.happiness - DECAY_RATES.happiness / 60),
        energy: Math.max(0, prev.stats.energy - DECAY_RATES.energy / 60),
      },
    }));
  }, [updatePotato]);

  // Create new potato
  const createPotato = async (name?: string) => {
    const newPotato = createNewPotato(name);
    setPotato(newPotato);
    await savePotato(newPotato);
  };

  // Feed the potato (from purchases)
  const feed = useCallback((credAmount: number) => {
    updatePotato((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        hunger: Math.min(100, prev.stats.hunger + credAmount * 2),
        happiness: Math.min(100, prev.stats.happiness + credAmount),
      },
      progress: {
        ...prev.progress,
        lastFed: new Date(),
      },
    }));
  }, [updatePotato]);

  // Play with potato
  const play = useCallback(() => {
    updatePotato((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + 15),
        energy: Math.max(0, prev.stats.energy - 5),
      },
      progress: {
        ...prev.progress,
        lastInteraction: new Date(),
      },
    }));
  }, [updatePotato]);

  // Rest the potato
  const rest = useCallback(() => {
    updatePotato((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        energy: Math.min(100, prev.stats.energy + 20),
      },
      progress: {
        ...prev.progress,
        lastInteraction: new Date(),
      },
    }));
  }, [updatePotato]);

  // Rename potato
  const rename = useCallback((name: string) => {
    updatePotato((prev) => ({ ...prev, name }));
  }, [updatePotato]);

  // Set accessory
  const setAccessory = useCallback((accessory: Accessory) => {
    updatePotato((prev) => ({ ...prev, accessory }));
  }, [updatePotato]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    updatePotato((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'cyberpunk' : 'light',
    }));
  }, [updatePotato]);

  // Called when user makes a purchase at Loop merchant
  const onPurchase = useCallback((credEarned: number) => {
    feed(credEarned);
    updatePotato((prev) => {
      const newAchievements = { ...prev.achievements };
      
      // Check achievements
      if (!newAchievements.firstPurchase) {
        newAchievements.firstPurchase = true;
      }
      
      return {
        ...prev,
        achievements: newAchievements,
        progress: {
          ...prev.progress,
          totalCred: prev.progress.totalCred + credEarned,
        },
      };
    });
  }, [feed, updatePotato]);

  // Called when user refers someone
  const onReferral = useCallback(() => {
    updatePotato((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + 25),
      },
      achievements: {
        ...prev.achievements,
        firstReferral: true,
      },
    }));
  }, [updatePotato]);

  // Sync with actual Loop progress
  const syncProgress = useCallback((totalCred: number, oxo: number) => {
    updatePotato((prev) => {
      const newAchievements = { ...prev.achievements };
      
      // Check Cred milestones
      if (totalCred >= 1000) newAchievements.thousandCred = true;
      if (totalCred >= 10000) newAchievements.tenThousandCred = true;
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          totalCred,
          oxoAccumulated: oxo,
        },
        achievements: newAchievements,
      };
    });
  }, [updatePotato]);

  return {
    potato,
    isLoading,
    createPotato,
    feed,
    play,
    rest,
    rename,
    setAccessory,
    toggleTheme,
    onPurchase,
    onReferral,
    syncProgress,
  };
}
