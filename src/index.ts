/**
 * Potagotchi - Virtual Pet Rewards Companion
 * 
 * A standalone gamification module for the Loop rewards app.
 * 
 * Usage:
 * ```tsx
 * import { 
 *   Potagotchi, 
 *   PotagotchiActions, 
 *   PotagotchiOnboarding,
 *   usePotagotchi 
 * } from './potagotchi';
 * 
 * function MyScreen() {
 *   const { potato, isLoading, createPotato, play, rest, toggleTheme } = usePotagotchi();
 * 
 *   if (isLoading) return <Loading />;
 *   if (!potato) return <PotagotchiOnboarding onCreate={createPotato} />;
 * 
 *   return (
 *     <>
 *       <Potagotchi potato={potato} onTap={play} />
 *       <PotagotchiActions onPlay={play} onRest={rest} onToggleTheme={toggleTheme} />
 *     </>
 *   );
 * }
 * ```
 * 
 * Integration with Loop:
 * - Call `onPurchase(credAmount)` when user earns Cred
 * - Call `syncProgress(totalCred, oxo)` to sync with actual balances
 * - Call `onReferral()` when user refers someone
 */

// Components
export { Potagotchi } from './Potagotchi';
export { PotagotchiActions } from './PotagotchiActions';
export { PotagotchiOnboarding } from './PotagotchiOnboarding';
export { PotagotchiIntro } from './PotagotchiIntro';
export { PotagotchiAppWrapper } from './PotagotchiAppWrapper';

// Hook
export { usePotagotchi } from './usePotagotchi';
export type { UsePotagotchiReturn } from './usePotagotchi';

// Types
export * from './types';
