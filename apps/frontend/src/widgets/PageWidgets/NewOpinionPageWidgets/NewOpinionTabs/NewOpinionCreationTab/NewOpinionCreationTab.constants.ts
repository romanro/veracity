/**
 * Animation configuration for argument reuse animation
 */

export const ANIMATION_DURATION_MS = 600;

/**
 * Debounce delay for saving tree state to localStorage (in milliseconds)
 */
export const TREE_SAVE_DEBOUNCE_MS = 500;

export const ANIMATION_CONFIG = {
  // Initial position offsets from click point
  initialOffset: {
    x: 140,
    y: 50,
  },
  // Target position
  target: {
    leftFactor: 0.25,
    leftMax: 400,
    topFactor: 0.65,
  },
  // Scale values
  scale: {
    initial: 0.7,
    animate: 0.9,
    exit: 0.4,
  },
  // Opacity values
  opacity: {
    initial: 1,
    animate: 0.9,
    exit: 0,
  },
  // Motion settings
  motion: {
    duration: ANIMATION_DURATION_MS / 1000, // Convert to seconds for framer-motion
    ease: 'easeOut' as const,
    type: 'spring' as const,
    damping: 20,
    stiffness: 100,
  },
  // Card dimensions
  card: {
    width: 280,
    rotation: 2,
  },
} as const;
