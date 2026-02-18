# 🥔 Potagotchi

A virtual pet gamification module for the Loop rewards app. Your potato grows as you shop locally and earn rewards.

## Features

- **Growth Stages**: Baby → Adult → Golden (based on Cred earned)
- **Emotions**: Happy, Sad, Angry, Sleepy (based on stats)
- **States**: Healthy, Wilted, Sick (neglect detection)
- **Stats**: Hunger, Happiness, Energy (decay over time)
- **Themes**: Light mode and Cyberpunk/neon mode
- **Accessories**: Hat, Sunglasses, Crown (unlocked via achievements)
- **Animations**: Breathing, bounce on tap, golden glow

## Installation

Copy the `potagotchi` folder into your project and install peer dependencies:

```bash
npm install @react-native-async-storage/async-storage
```

## Usage

```tsx
import { 
  Potagotchi, 
  PotagotchiActions, 
  PotagotchiOnboarding,
  usePotagotchi 
} from './potagotchi';

function PotagotchiScreen() {
  const { 
    potato, 
    isLoading, 
    createPotato, 
    play, 
    rest, 
    toggleTheme,
    onPurchase,
    syncProgress,
  } = usePotagotchi();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!potato) {
    return <PotagotchiOnboarding onCreate={createPotato} />;
  }

  return (
    <View>
      <Potagotchi potato={potato} onTap={play} />
      <PotagotchiActions 
        onPlay={play} 
        onRest={rest} 
        onToggleTheme={toggleTheme} 
      />
    </View>
  );
}
```

## Integration with Loop

### When user makes a purchase:
```tsx
const { onPurchase } = usePotagotchi();

// Called from your purchase handler
onPurchase(credEarned); // e.g., 5.00 for $5 in Cred
```

### Sync with actual balances:
```tsx
const { syncProgress } = usePotagotchi();

// Called when fetching user data
syncProgress(totalCred, oxoBalance);
```

### When user refers someone:
```tsx
const { onReferral } = usePotagotchi();

onReferral(); // Boosts happiness, unlocks achievement
```

## Game Mechanics

### Stages
| Stage | Cred Required | Appearance |
|-------|---------------|------------|
| Baby | $0 | Small, simple |
| Adult | $100 | Larger, with limbs |
| Golden | $1,000 | Glowing, radiant |

### Stat Decay (per hour)
| Stat | Decay Rate | Boosted By |
|------|------------|------------|
| Hunger | -2/hr | Purchases |
| Happiness | -1/hr | Playing, interactions |
| Energy | -0.5/hr | Resting |

### States
| State | Condition | Visual |
|-------|-----------|--------|
| Healthy | All stats > 20 | Normal sprite |
| Wilted | Any stat < 20 | Green, droopy |
| Sick | Any stat < 10 | Green with thermometer |

### Achievements & Unlocks
| Achievement | Condition | Reward |
|-------------|-----------|--------|
| First Purchase | 1 purchase | - |
| 10 Purchases | 10 purchases | 🎩 Hat |
| 100 Purchases | 100 purchases | 🕶️ Sunglasses |
| First Referral | Refer someone | - |
| Week Streak | 7 days active | - |
| Month Streak | 30 days active | 👑 Crown |
| $1,000 Club | 1000 Cred | - |
| $10,000 Club | 10000 Cred | - |

## Asset Structure

```
assets/
├── baby/
│   ├── happy.png
│   ├── sad.png
│   ├── angry.png
│   └── sleepy.png
├── adult/
│   └── (same emotions)
├── golden/
│   └── (same emotions)
├── cyberpunk/
│   └── (same emotions, neon style)
├── animation/
│   ├── frame1.png
│   ├── frame2.png
│   └── frame3.png
├── accessories/
│   ├── hat.png
│   ├── sunglasses.png
│   └── crown.png
└── states/
    ├── wilted.png
    └── sick.png
```

## Customization

### Adding new accessories
1. Add sprite to `assets/accessories/`
2. Update `SPRITES.light.accessories` in `Potagotchi.tsx`
3. Add to `Accessory` type in `types.ts`

### Adjusting difficulty
Edit constants in `types.ts`:
- `DECAY_RATES` - How fast stats decrease
- `STATE_THRESHOLDS` - When potato becomes wilted/sick
- `STAGE_THRESHOLDS` - Cred needed to evolve

## Credits

Art generated with Grok AI, cyberpunk style inspired by "The Last Night".
