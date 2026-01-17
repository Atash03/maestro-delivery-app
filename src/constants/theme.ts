/**
 * Maestro Food Delivery App - Design System
 *
 * This file contains the comprehensive design tokens for the app including:
 * - Extended color palette (primary, secondary, semantic colors, neutral shades)
 * - Typography scale
 * - Spacing scale
 * - Border radius values
 * - Shadow definitions
 */

import { Platform, type ViewStyle } from 'react-native';

// ============================================================================
// COLOR PALETTE
// ============================================================================

/**
 * Primary brand colors - Used for main actions, CTAs, and brand identity
 */
export const PrimaryColors = {
  50: '#FFF5F0',
  100: '#FFE8DB',
  200: '#FFD0B8',
  300: '#FFB08A',
  400: '#FF8A5C',
  500: '#FF6B35', // Main primary color - vibrant orange
  600: '#E85A2A',
  700: '#C44A22',
  800: '#9E3B1B',
  900: '#7A2E15',
} as const;

/**
 * Secondary brand colors - Used for accents and complementary elements
 */
export const SecondaryColors = {
  50: '#F0F9FF',
  100: '#E0F2FE',
  200: '#BAE6FD',
  300: '#7DD3FC',
  400: '#38BDF8',
  500: '#0EA5E9', // Main secondary color - sky blue
  600: '#0284C7',
  700: '#0369A1',
  800: '#075985',
  900: '#0C4A6E',
} as const;

/**
 * Success colors - Used for positive feedback, confirmations
 */
export const SuccessColors = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E', // Main success color
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
} as const;

/**
 * Warning colors - Used for alerts and cautions
 */
export const WarningColors = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B', // Main warning color
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

/**
 * Error colors - Used for errors and destructive actions
 */
export const ErrorColors = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444', // Main error color
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const;

/**
 * Neutral colors - Used for text, backgrounds, borders
 */
export const NeutralColors = {
  0: '#FFFFFF',
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0A0A0A',
} as const;

/**
 * Theme-specific color configurations for light and dark modes
 */
export const Colors = {
  light: {
    // Base
    text: NeutralColors[900],
    textSecondary: NeutralColors[600],
    textTertiary: NeutralColors[400],
    background: NeutralColors[0],
    backgroundSecondary: NeutralColors[50],
    backgroundTertiary: NeutralColors[100],

    // Brand
    primary: PrimaryColors[500],
    primaryLight: PrimaryColors[100],
    primaryDark: PrimaryColors[700],
    secondary: SecondaryColors[500],
    secondaryLight: SecondaryColors[100],
    secondaryDark: SecondaryColors[700],

    // Semantic
    success: SuccessColors[500],
    successLight: SuccessColors[100],
    warning: WarningColors[500],
    warningLight: WarningColors[100],
    error: ErrorColors[500],
    errorLight: ErrorColors[100],

    // UI Elements
    border: NeutralColors[200],
    borderFocus: PrimaryColors[500],
    divider: NeutralColors[100],
    icon: NeutralColors[500],
    iconSecondary: NeutralColors[400],

    // Tab bar
    tint: PrimaryColors[500],
    tabIconDefault: NeutralColors[400],
    tabIconSelected: PrimaryColors[500],

    // Cards and surfaces
    card: NeutralColors[0],
    cardPressed: NeutralColors[50],
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Interactive states
    ripple: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Base
    text: NeutralColors[50],
    textSecondary: NeutralColors[400],
    textTertiary: NeutralColors[500],
    background: NeutralColors[950],
    backgroundSecondary: NeutralColors[900],
    backgroundTertiary: NeutralColors[800],

    // Brand
    primary: PrimaryColors[500],
    primaryLight: PrimaryColors[900],
    primaryDark: PrimaryColors[300],
    secondary: SecondaryColors[400],
    secondaryLight: SecondaryColors[900],
    secondaryDark: SecondaryColors[300],

    // Semantic
    success: SuccessColors[400],
    successLight: SuccessColors[900],
    warning: WarningColors[400],
    warningLight: WarningColors[900],
    error: ErrorColors[400],
    errorLight: ErrorColors[900],

    // UI Elements
    border: NeutralColors[800],
    borderFocus: PrimaryColors[500],
    divider: NeutralColors[800],
    icon: NeutralColors[400],
    iconSecondary: NeutralColors[500],

    // Tab bar
    tint: PrimaryColors[500],
    tabIconDefault: NeutralColors[500],
    tabIconSelected: PrimaryColors[500],

    // Cards and surfaces
    card: NeutralColors[900],
    cardPressed: NeutralColors[800],
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Interactive states
    ripple: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Font families for different text styles
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'SF Pro Rounded',
    mono: 'Menlo',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
  },
});

/**
 * Typography scale - Font sizes and line heights
 * Following a modular scale for visual harmony
 */
export const Typography = {
  /** Extra small - 10px - Used for labels, badges */
  xs: {
    fontSize: 10,
    lineHeight: 14,
  },
  /** Small - 12px - Used for captions, metadata */
  sm: {
    fontSize: 12,
    lineHeight: 16,
  },
  /** Base - 14px - Default body text */
  base: {
    fontSize: 14,
    lineHeight: 20,
  },
  /** Large - 16px - Emphasized body text */
  lg: {
    fontSize: 16,
    lineHeight: 24,
  },
  /** Extra large - 18px - Subheadings */
  xl: {
    fontSize: 18,
    lineHeight: 26,
  },
  /** 2XL - 20px - Section headings */
  '2xl': {
    fontSize: 20,
    lineHeight: 28,
  },
  /** 3XL - 24px - Page titles */
  '3xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  /** 4XL - 30px - Large headings */
  '4xl': {
    fontSize: 30,
    lineHeight: 38,
  },
  /** 5XL - 36px - Hero text */
  '5xl': {
    fontSize: 36,
    lineHeight: 44,
  },
} as const;

/**
 * Font weights for different text emphasis levels
 */
export const FontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing scale - Used for margins, padding, gaps
 * Based on 4px base unit for consistency
 */
export const Spacing = {
  /** 0px */
  0: 0,
  /** 2px */
  0.5: 2,
  /** 4px */
  1: 4,
  /** 6px */
  1.5: 6,
  /** 8px */
  2: 8,
  /** 12px */
  3: 12,
  /** 16px */
  4: 16,
  /** 20px */
  5: 20,
  /** 24px */
  6: 24,
  /** 32px */
  8: 32,
  /** 40px */
  10: 40,
  /** 48px */
  12: 48,
  /** 64px */
  16: 64,
  /** 80px */
  20: 80,
  /** 96px */
  24: 96,
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius scale for rounded corners
 */
export const BorderRadius = {
  /** 0px - No rounding */
  none: 0,
  /** 2px - Subtle rounding */
  xs: 2,
  /** 4px - Small rounding */
  sm: 4,
  /** 8px - Medium rounding (default for cards) */
  md: 8,
  /** 12px - Large rounding */
  lg: 12,
  /** 16px - Extra large rounding */
  xl: 16,
  /** 24px - 2XL rounding */
  '2xl': 24,
  /** 32px - 3XL rounding */
  '3xl': 32,
  /** 9999px - Full rounding (circles, pills) */
  full: 9999,
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Shadow definitions for elevation
 * Using platform-specific implementations for best results
 */
export const Shadows = {
  /** Small shadow - For subtle elevation like buttons */
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
  }),
  /** Medium shadow - For cards and floating elements */
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  }),
  /** Large shadow - For modals and overlays */
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
  }),
  /** Extra large shadow - For emphasized floating elements */
  xl: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
    },
    android: {
      elevation: 16,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
    },
  }),
} as const;

// ============================================================================
// ANIMATION DURATIONS
// ============================================================================

/**
 * Animation duration presets in milliseconds
 */
export const AnimationDurations = {
  /** 100ms - Instant feedback */
  instant: 100,
  /** 150ms - Quick transitions */
  fast: 150,
  /** 250ms - Normal transitions */
  normal: 250,
  /** 350ms - Slow transitions */
  slow: 350,
  /** 500ms - Very slow transitions */
  slower: 500,
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

/**
 * Z-index scale for layering elements
 */
export const ZIndex = {
  /** Below content */
  behind: -1,
  /** Base level */
  base: 0,
  /** Slightly elevated */
  raised: 10,
  /** Dropdown menus */
  dropdown: 100,
  /** Sticky headers */
  sticky: 200,
  /** Fixed elements like tab bars */
  fixed: 300,
  /** Modals and dialogs */
  modal: 400,
  /** Popovers and tooltips */
  popover: 500,
  /** Toast notifications */
  toast: 600,
  /** Maximum - overlays everything */
  max: 9999,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorTheme = keyof typeof Colors;
export type ColorToken = keyof (typeof Colors)['light'];
export type TypographySize = keyof typeof Typography;
export type SpacingSize = keyof typeof Spacing;
export type BorderRadiusSize = keyof typeof BorderRadius;
export type ShadowSize = keyof typeof Shadows;
export type FontWeight = keyof typeof FontWeights;
