/**
 * Potagotchi Types
 * Core type definitions for the virtual pet system
 */

export type PotatoStage = 'baby' | 'adult' | 'golden';

export type PotatoEmotion = 'happy' | 'sad' | 'angry' | 'sleepy';

export type PotatoState = 'healthy' | 'wilted' | 'sick';

export type Accessory = 'hat' | 'sunglasses' | 'crown' | null;

export type ThemeMode = 'light' | 'cyberpunk';

export interface PotatoStats {
  hunger: number;      // 0-100, decreases over time
  happiness: number;   // 0-100, affected by user activity
  energy: number;      // 0-100, decreases without rest
}

export interface PotatoProgress {
  totalCred: number;           // Total Cred earned (drives stage)
  oxoAccumulated: number;      // OXO tokens accumulated
  daysActive: number;          // Days since creation
  lastFed: Date;               // Last purchase at Loop merchant
  lastInteraction: Date;       // Last app open
  streak: number;              // Consecutive days active
}

export interface PotatoAchievements {
  firstPurchase: boolean;
  tenPurchases: boolean;
  hundredPurchases: boolean;
  firstReferral: boolean;
  weekStreak: boolean;
  monthStreak: boolean;
  thousandCred: boolean;
  tenThousandCred: boolean;
}

export interface PotatoData {
  id: string;
  name: string;
  createdAt: Date;
  stage: PotatoStage;
  emotion: PotatoEmotion;
  state: PotatoState;
  stats: PotatoStats;
  progress: PotatoProgress;
  achievements: PotatoAchievements;
  accessory: Accessory;
  theme: ThemeMode;
}

// Stage thresholds (total Cred)
export const STAGE_THRESHOLDS = {
  baby: 0,
  adult: 100,    // $100 Cred to evolve
  golden: 1000,  // $1000 Cred to reach golden
} as const;

// Achievement unlock conditions
export const ACHIEVEMENT_REWARDS: Record<keyof PotatoAchievements, Accessory> = {
  firstPurchase: null,
  tenPurchases: 'hat',
  hundredPurchases: 'sunglasses',
  firstReferral: null,
  weekStreak: null,
  monthStreak: 'crown',
  thousandCred: null,
  tenThousandCred: null,
};

// Stat decay rates (per hour)
export const DECAY_RATES = {
  hunger: 2,      // Lose 2 hunger per hour without purchase
  happiness: 1,   // Lose 1 happiness per hour without interaction
  energy: 0.5,    // Lose 0.5 energy per hour
} as const;

// State thresholds
export const STATE_THRESHOLDS = {
  wilted: 20,  // Any stat below 20 = wilted
  sick: 10,    // Any stat below 10 = sick
} as const;
