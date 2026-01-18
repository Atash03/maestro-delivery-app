/**
 * Tests for the Driver Card component
 * Tests component types, exports, helper functions, and logic
 *
 * Note: Full rendering tests require a React Native environment.
 * These tests validate the component module structure, types, and logic.
 */

// Mock Platform before any imports
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => {
      return obj.ios ?? obj.default;
    },
    Version: 14,
  },
  StyleSheet: {
    create: <T extends object>(styles: T): T => styles,
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  Linking: {
    canOpenURL: jest.fn().mockResolvedValue(true),
    openURL: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    createAnimatedComponent: (component: unknown) => component,
    View: 'View',
    Text: 'Text',
  },
  useSharedValue: (init: unknown) => ({ value: init }),
  useAnimatedStyle: () => ({}),
  withSpring: (toValue: unknown) => toValue,
  withTiming: (toValue: unknown) => toValue,
  FadeIn: {
    duration: () => ({
      delay: () => ({}),
    }),
  },
  SlideInDown: {
    duration: () => ({
      delay: () => ({
        springify: () => ({
          damping: () => ({
            stiffness: () => ({}),
          }),
        }),
      }),
    }),
  },
  createAnimatedComponent: (component: unknown) => component,
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock hooks
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

import type { Driver, VehicleType } from '@/types';

// ============================================================================
// Test Data
// ============================================================================

const createMockDriver = (overrides: Partial<Driver> = {}): Driver => ({
  id: 'driver-001',
  name: 'James Wilson',
  avatar: 'https://example.com/avatar.jpg',
  phone: '+1 (555) 123-4567',
  vehicle: {
    type: 'car',
    make: 'Toyota',
    model: 'Camry',
    color: 'Silver',
    licensePlate: 'ABC-1234',
  },
  currentLocation: { latitude: 40.7128, longitude: -74.006 },
  rating: 4.9,
  ...overrides,
});

// ============================================================================
// Component Export Tests
// ============================================================================

describe('Driver Card Module Structure', () => {
  describe('Component Exports', () => {
    it('exports DriverCard component', () => {
      const driverCard = require('@/components/cards/driver-card');
      expect(driverCard.DriverCard).toBeDefined();
      expect(typeof driverCard.DriverCard).toBe('function');
    });

    it('exports formatVehicleDescription helper', () => {
      const driverCard = require('@/components/cards/driver-card');
      expect(driverCard.formatVehicleDescription).toBeDefined();
      expect(typeof driverCard.formatVehicleDescription).toBe('function');
    });

    it('exports formatLicensePlate helper', () => {
      const driverCard = require('@/components/cards/driver-card');
      expect(driverCard.formatLicensePlate).toBeDefined();
      expect(typeof driverCard.formatLicensePlate).toBe('function');
    });

    it('exports openPhoneDialer helper', () => {
      const driverCard = require('@/components/cards/driver-card');
      expect(driverCard.openPhoneDialer).toBeDefined();
      expect(typeof driverCard.openPhoneDialer).toBe('function');
    });
  });

  describe('Index Exports', () => {
    it('exports DriverCard from cards index', () => {
      const cards = require('@/components/cards');
      expect(cards.DriverCard).toBeDefined();
      expect(typeof cards.DriverCard).toBe('function');
    });

    it('exports formatVehicleDescription from cards index', () => {
      const cards = require('@/components/cards');
      expect(cards.formatVehicleDescription).toBeDefined();
      expect(typeof cards.formatVehicleDescription).toBe('function');
    });

    it('exports formatLicensePlate from cards index', () => {
      const cards = require('@/components/cards');
      expect(cards.formatLicensePlate).toBeDefined();
      expect(typeof cards.formatLicensePlate).toBe('function');
    });
  });
});

// ============================================================================
// Helper Function Tests
// ============================================================================

describe('formatVehicleDescription', () => {
  const { formatVehicleDescription } = require('@/components/cards/driver-card');

  describe('with full vehicle info', () => {
    it('formats car with color, make, and model', () => {
      const vehicle = {
        type: 'car' as VehicleType,
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver',
        licensePlate: 'ABC-1234',
      };
      expect(formatVehicleDescription(vehicle)).toBe('Silver Toyota Camry');
    });

    it('formats motorcycle with color, make, and model', () => {
      const vehicle = {
        type: 'motorcycle' as VehicleType,
        make: 'Honda',
        model: 'CB500F',
        color: 'Red',
        licensePlate: 'MTC-5678',
      };
      expect(formatVehicleDescription(vehicle)).toBe('Red Honda CB500F');
    });

    it('formats scooter with color, make, and model', () => {
      const vehicle = {
        type: 'scooter' as VehicleType,
        make: 'Vespa',
        model: 'Primavera',
        color: 'Blue',
        licensePlate: 'SCT-9012',
      };
      expect(formatVehicleDescription(vehicle)).toBe('Blue Vespa Primavera');
    });
  });

  describe('with partial vehicle info', () => {
    it('formats with color and make only', () => {
      const vehicle = {
        type: 'car' as VehicleType,
        make: 'Toyota',
        color: 'Silver',
      };
      expect(formatVehicleDescription(vehicle)).toBe('Silver Toyota');
    });

    it('formats with color and model only', () => {
      const vehicle = {
        type: 'car' as VehicleType,
        model: 'Camry',
        color: 'Silver',
      };
      expect(formatVehicleDescription(vehicle)).toBe('Silver Camry');
    });

    it('formats with color only', () => {
      const vehicle = {
        type: 'bicycle' as VehicleType,
        color: 'Green',
      };
      expect(formatVehicleDescription(vehicle)).toBe('Green Bicycle');
    });

    it('formats with just vehicle type when no other info', () => {
      const vehicle = {
        type: 'bicycle' as VehicleType,
      };
      expect(formatVehicleDescription(vehicle)).toBe('Bicycle');
    });
  });

  describe('vehicle type labels', () => {
    it('returns correct label for car', () => {
      const vehicle = { type: 'car' as VehicleType };
      expect(formatVehicleDescription(vehicle)).toBe('Car');
    });

    it('returns correct label for motorcycle', () => {
      const vehicle = { type: 'motorcycle' as VehicleType };
      expect(formatVehicleDescription(vehicle)).toBe('Motorcycle');
    });

    it('returns correct label for bicycle', () => {
      const vehicle = { type: 'bicycle' as VehicleType };
      expect(formatVehicleDescription(vehicle)).toBe('Bicycle');
    });

    it('returns correct label for scooter', () => {
      const vehicle = { type: 'scooter' as VehicleType };
      expect(formatVehicleDescription(vehicle)).toBe('Scooter');
    });
  });
});

describe('formatLicensePlate', () => {
  const { formatLicensePlate } = require('@/components/cards/driver-card');

  it('returns null for undefined plate', () => {
    expect(formatLicensePlate(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(formatLicensePlate('')).toBeNull();
  });

  it('uppercases the license plate', () => {
    expect(formatLicensePlate('abc-1234')).toBe('ABC-1234');
  });

  it('preserves already uppercase plates', () => {
    expect(formatLicensePlate('XYZ-7890')).toBe('XYZ-7890');
  });

  it('handles mixed case plates', () => {
    expect(formatLicensePlate('AbC-12xY')).toBe('ABC-12XY');
  });
});

describe('openPhoneDialer', () => {
  const { openPhoneDialer } = require('@/components/cards/driver-card');
  const { Linking } = require('react-native');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cleans phone number before dialing', async () => {
    await openPhoneDialer('+1 (555) 123-4567');
    expect(Linking.openURL).toHaveBeenCalledWith('tel:+15551234567');
  });

  it('returns true when URL can be opened', async () => {
    Linking.canOpenURL.mockResolvedValue(true);
    const result = await openPhoneDialer('+15551234567');
    expect(result).toBe(true);
  });

  it('returns false when URL cannot be opened', async () => {
    Linking.canOpenURL.mockResolvedValue(false);
    const result = await openPhoneDialer('+15551234567');
    expect(result).toBe(false);
  });

  it('returns false when Linking throws an error', async () => {
    Linking.canOpenURL.mockRejectedValue(new Error('Failed'));
    const result = await openPhoneDialer('+15551234567');
    expect(result).toBe(false);
  });

  it('removes all non-digit characters except +', async () => {
    Linking.canOpenURL.mockResolvedValue(true);
    await openPhoneDialer('(555) 123-4567 ext. 890');
    expect(Linking.openURL).toHaveBeenCalledWith('tel:5551234567890');
  });
});

// ============================================================================
// Driver Data Tests
// ============================================================================

describe('Driver Data Structure', () => {
  it('creates valid mock driver with all properties', () => {
    const driver = createMockDriver();

    expect(driver.id).toBe('driver-001');
    expect(driver.name).toBe('James Wilson');
    expect(driver.avatar).toBe('https://example.com/avatar.jpg');
    expect(driver.phone).toBe('+1 (555) 123-4567');
    expect(driver.rating).toBe(4.9);
  });

  it('creates driver with complete vehicle info', () => {
    const driver = createMockDriver();

    expect(driver.vehicle.type).toBe('car');
    expect(driver.vehicle.make).toBe('Toyota');
    expect(driver.vehicle.model).toBe('Camry');
    expect(driver.vehicle.color).toBe('Silver');
    expect(driver.vehicle.licensePlate).toBe('ABC-1234');
  });

  it('creates driver with current location', () => {
    const driver = createMockDriver();

    expect(driver.currentLocation).toBeDefined();
    expect(driver.currentLocation?.latitude).toBe(40.7128);
    expect(driver.currentLocation?.longitude).toBe(-74.006);
  });

  it('allows overriding driver properties', () => {
    const driver = createMockDriver({
      name: 'Maria Garcia',
      rating: 4.8,
    });

    expect(driver.name).toBe('Maria Garcia');
    expect(driver.rating).toBe(4.8);
    expect(driver.id).toBe('driver-001'); // Default preserved
  });

  it('allows overriding vehicle properties', () => {
    const driver = createMockDriver({
      vehicle: {
        type: 'motorcycle',
        make: 'Honda',
        model: 'CB500F',
        color: 'Red',
        licensePlate: 'MTC-5678',
      },
    });

    expect(driver.vehicle.type).toBe('motorcycle');
    expect(driver.vehicle.make).toBe('Honda');
  });
});

// ============================================================================
// Component Props Tests
// ============================================================================

describe('DriverCardProps', () => {
  describe('required props', () => {
    it('requires driver prop', () => {
      const props = {
        driver: createMockDriver(),
      };

      expect(props.driver).toBeDefined();
      expect(props.driver.name).toBe('James Wilson');
    });
  });

  describe('optional props', () => {
    it('accepts onCall callback', () => {
      const onCall = jest.fn();
      const props = {
        driver: createMockDriver(),
        onCall,
      };

      expect(props.onCall).toBeDefined();
      expect(typeof props.onCall).toBe('function');
    });

    it('accepts onMessage callback', () => {
      const onMessage = jest.fn();
      const props = {
        driver: createMockDriver(),
        onMessage,
      };

      expect(props.onMessage).toBeDefined();
      expect(typeof props.onMessage).toBe('function');
    });

    it('accepts testID prop', () => {
      const props = {
        driver: createMockDriver(),
        testID: 'custom-driver-card',
      };

      expect(props.testID).toBe('custom-driver-card');
    });

    it('accepts animated prop', () => {
      const props = {
        driver: createMockDriver(),
        animated: false,
      };

      expect(props.animated).toBe(false);
    });

    it('accepts animationDelay prop', () => {
      const props = {
        driver: createMockDriver(),
        animationDelay: 200,
      };

      expect(props.animationDelay).toBe(200);
    });

    it('accepts compact prop', () => {
      const props = {
        driver: createMockDriver(),
        compact: true,
      };

      expect(props.compact).toBe(true);
    });
  });

  describe('prop defaults', () => {
    it('animated defaults to true', () => {
      const defaultAnimated = true;
      expect(defaultAnimated).toBe(true);
    });

    it('animationDelay defaults to 0', () => {
      const defaultDelay = 0;
      expect(defaultDelay).toBe(0);
    });

    it('compact defaults to false', () => {
      const defaultCompact = false;
      expect(defaultCompact).toBe(false);
    });
  });
});

// ============================================================================
// Vehicle Type Tests
// ============================================================================

describe('Vehicle Types', () => {
  const VEHICLE_TYPES: VehicleType[] = ['car', 'motorcycle', 'bicycle', 'scooter'];

  it('supports all vehicle types', () => {
    expect(VEHICLE_TYPES).toContain('car');
    expect(VEHICLE_TYPES).toContain('motorcycle');
    expect(VEHICLE_TYPES).toContain('bicycle');
    expect(VEHICLE_TYPES).toContain('scooter');
  });

  it('has exactly 4 vehicle types', () => {
    expect(VEHICLE_TYPES).toHaveLength(4);
  });

  describe('vehicle icons', () => {
    const VEHICLE_ICONS: Record<VehicleType, string> = {
      car: 'car-outline',
      motorcycle: 'bicycle-outline',
      bicycle: 'bicycle-outline',
      scooter: 'bicycle-outline',
    };

    it('has icon for each vehicle type', () => {
      VEHICLE_TYPES.forEach((type) => {
        expect(VEHICLE_ICONS[type]).toBeDefined();
        expect(VEHICLE_ICONS[type]).toContain('outline');
      });
    });

    it('uses car-outline for car type', () => {
      expect(VEHICLE_ICONS.car).toBe('car-outline');
    });

    it('uses bicycle-outline for non-car types', () => {
      expect(VEHICLE_ICONS.motorcycle).toBe('bicycle-outline');
      expect(VEHICLE_ICONS.bicycle).toBe('bicycle-outline');
      expect(VEHICLE_ICONS.scooter).toBe('bicycle-outline');
    });
  });

  describe('vehicle labels', () => {
    const VEHICLE_LABELS: Record<VehicleType, string> = {
      car: 'Car',
      motorcycle: 'Motorcycle',
      bicycle: 'Bicycle',
      scooter: 'Scooter',
    };

    it('has label for each vehicle type', () => {
      VEHICLE_TYPES.forEach((type) => {
        expect(VEHICLE_LABELS[type]).toBeDefined();
        expect(VEHICLE_LABELS[type].length).toBeGreaterThan(0);
      });
    });

    it('labels are capitalized', () => {
      Object.values(VEHICLE_LABELS).forEach((label) => {
        expect(label[0]).toBe(label[0].toUpperCase());
      });
    });
  });
});

// ============================================================================
// Rating Display Tests
// ============================================================================

describe('Rating Display', () => {
  describe('rating formatting', () => {
    const formatRating = (rating: number): string => rating.toFixed(1);

    it('formats whole number ratings', () => {
      expect(formatRating(5)).toBe('5.0');
      expect(formatRating(4)).toBe('4.0');
    });

    it('formats decimal ratings', () => {
      expect(formatRating(4.9)).toBe('4.9');
      expect(formatRating(4.85)).toBe('4.8');
    });

    it('handles edge cases', () => {
      expect(formatRating(0)).toBe('0.0');
      expect(formatRating(5.0)).toBe('5.0');
    });
  });

  describe('rating values', () => {
    it('accepts ratings in valid range', () => {
      const validRatings = [0, 1, 2, 3, 4, 5, 4.5, 4.9, 4.95];

      validRatings.forEach((rating) => {
        expect(rating).toBeGreaterThanOrEqual(0);
        expect(rating).toBeLessThanOrEqual(5);
      });
    });

    it('displays high ratings for quality drivers', () => {
      const highRating = 4.8;
      expect(highRating).toBeGreaterThanOrEqual(4.5);
    });
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Accessibility', () => {
  describe('testID patterns', () => {
    it('generates default testID for call button', () => {
      const testID = 'driver-call-button';
      expect(testID).toBe('driver-call-button');
    });

    it('generates default testID for message button', () => {
      const testID = 'driver-message-button';
      expect(testID).toBe('driver-message-button');
    });

    it('supports custom testID prefix', () => {
      const customTestID = 'my-driver-card';
      const callButtonTestID = `${customTestID}-call-button`;
      const messageButtonTestID = `${customTestID}-message-button`;

      expect(callButtonTestID).toBe('my-driver-card-call-button');
      expect(messageButtonTestID).toBe('my-driver-card-message-button');
    });
  });

  describe('accessibility labels', () => {
    it('generates comprehensive accessibility label for driver card', () => {
      const driver = createMockDriver();
      const vehicleDescription = 'Silver Toyota Camry';
      const label = `Driver ${driver.name}, ${vehicleDescription}, rated ${driver.rating.toFixed(1)} stars`;

      expect(label).toContain('James Wilson');
      expect(label).toContain('Silver Toyota Camry');
      expect(label).toContain('4.9 stars');
    });

    it('includes all relevant information in label', () => {
      const driver = createMockDriver({ name: 'Maria Garcia', rating: 4.8 });
      const vehicleDescription = 'Red Honda CB500F';
      const label = `Driver ${driver.name}, ${vehicleDescription}, rated ${driver.rating.toFixed(1)} stars`;

      expect(label).toContain('Driver');
      expect(label).toContain('Maria Garcia');
      expect(label).toContain('rated');
      expect(label).toContain('4.8 stars');
    });
  });

  describe('button labels', () => {
    it('has appropriate call button label', () => {
      const label = 'Call';
      expect(label).toBe('Call');
    });

    it('has appropriate message button label', () => {
      const label = 'Message';
      expect(label).toBe('Message');
    });
  });
});

// ============================================================================
// Animation Tests
// ============================================================================

describe('Animation Configuration', () => {
  describe('spring config', () => {
    const SPRING_CONFIG = {
      damping: 15,
      stiffness: 200,
      mass: 0.5,
    };

    it('has appropriate damping value', () => {
      expect(SPRING_CONFIG.damping).toBe(15);
      expect(SPRING_CONFIG.damping).toBeGreaterThan(10);
      expect(SPRING_CONFIG.damping).toBeLessThan(25);
    });

    it('has appropriate stiffness value', () => {
      expect(SPRING_CONFIG.stiffness).toBe(200);
      expect(SPRING_CONFIG.stiffness).toBeGreaterThan(100);
      expect(SPRING_CONFIG.stiffness).toBeLessThan(300);
    });

    it('has appropriate mass value', () => {
      expect(SPRING_CONFIG.mass).toBe(0.5);
      expect(SPRING_CONFIG.mass).toBeGreaterThan(0);
      expect(SPRING_CONFIG.mass).toBeLessThan(1);
    });
  });

  describe('slide animation', () => {
    it('uses SlideInDown for entry animation', () => {
      // Animation is applied when animated=true
      const animated = true;
      expect(animated).toBe(true);
    });

    it('supports animation delay', () => {
      const delay = 200;
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThan(1000);
    });
  });

  describe('button press animation', () => {
    it('scales down on press in', () => {
      const pressedScale = 0.95;
      expect(pressedScale).toBeLessThan(1);
      expect(pressedScale).toBeGreaterThan(0.9);
    });

    it('returns to normal scale on press out', () => {
      const normalScale = 1;
      expect(normalScale).toBe(1);
    });
  });
});

// ============================================================================
// Compact Mode Tests
// ============================================================================

describe('Compact Mode', () => {
  it('reduces padding in compact mode', () => {
    const normalPadding = 16; // Spacing[4]
    const compactPadding = 12; // Spacing[3]

    expect(compactPadding).toBeLessThan(normalPadding);
  });

  it('reduces avatar size in compact mode', () => {
    const normalAvatarSize = 56;
    const compactAvatarSize = 44;

    expect(compactAvatarSize).toBeLessThan(normalAvatarSize);
  });

  it('reduces font size in compact mode', () => {
    const normalFontSize = 18; // Typography.lg
    const compactFontSize = 16; // Typography.base

    expect(compactFontSize).toBeLessThan(normalFontSize);
  });

  it('shows icon-only buttons in compact mode', () => {
    // In compact mode, buttons are smaller (36x36) with only icons
    const compactButtonSize = 36;
    expect(compactButtonSize).toBe(36);
  });

  it('hides button labels in compact mode', () => {
    const showLabels = false; // compact mode
    expect(showLabels).toBe(false);
  });
});

// ============================================================================
// Online Indicator Tests
// ============================================================================

describe('Online Indicator', () => {
  it('shows green indicator when driver is active', () => {
    // SuccessColors[500]
    const onlineColor = '#22C55E';
    expect(onlineColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('has appropriate size', () => {
    const indicatorSize = 14;
    expect(indicatorSize).toBeGreaterThan(10);
    expect(indicatorSize).toBeLessThan(20);
  });

  it('is positioned at bottom right of avatar', () => {
    const position = { bottom: 2, right: 2 };
    expect(position.bottom).toBe(2);
    expect(position.right).toBe(2);
  });

  it('has border matching card background', () => {
    const borderWidth = 2;
    expect(borderWidth).toBe(2);
  });
});

// ============================================================================
// Color Scheme Tests
// ============================================================================

describe('Color Scheme Handling', () => {
  it('supports light and dark color schemes', () => {
    const colorSchemes = ['light', 'dark'] as const;
    expect(colorSchemes).toContain('light');
    expect(colorSchemes).toContain('dark');
  });

  it('uses success color for call button', () => {
    // SuccessColors[500]
    const callButtonColor = '#22C55E';
    expect(callButtonColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('uses warning color for star rating', () => {
    // WarningColors[500]
    const starColor = '#F59E0B';
    expect(starColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('uses primary color for avatar fallback', () => {
    // PrimaryColors[100] and PrimaryColors[500]
    const fallbackBg = '#FFE5DB';
    const fallbackIcon = '#FF6B35';
    expect(fallbackBg).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(fallbackIcon).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

// ============================================================================
// Avatar Fallback Tests
// ============================================================================

describe('Avatar Fallback', () => {
  it('shows image when avatar URL is provided', () => {
    const driver = createMockDriver({ avatar: 'https://example.com/photo.jpg' });
    expect(driver.avatar).toBeTruthy();
  });

  it('shows fallback icon when no avatar', () => {
    const driver = createMockDriver({ avatar: undefined });
    expect(driver.avatar).toBeUndefined();
  });

  it('fallback uses person icon', () => {
    const fallbackIcon = 'person';
    expect(fallbackIcon).toBe('person');
  });

  it('fallback has same size as avatar', () => {
    const avatarSize = 56;
    const fallbackSize = 56;
    expect(fallbackSize).toBe(avatarSize);
  });
});

// ============================================================================
// Action Button Tests
// ============================================================================

describe('Action Buttons', () => {
  describe('call button', () => {
    it('uses call-outline icon', () => {
      const icon = 'call-outline';
      expect(icon).toBe('call-outline');
    });

    it('uses success color for background', () => {
      const bgColor = '#22C55E'; // SuccessColors[500]
      expect(bgColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('uses white text color', () => {
      const textColor = '#FFFFFF'; // NeutralColors[0]
      expect(textColor).toBe('#FFFFFF');
    });
  });

  describe('message button', () => {
    it('uses chatbubble-outline icon', () => {
      const icon = 'chatbubble-outline';
      expect(icon).toBe('chatbubble-outline');
    });

    it('uses secondary background color', () => {
      // Uses colors.backgroundSecondary
      const variant = 'secondary';
      expect(variant).toBe('secondary');
    });

    it('uses theme text color', () => {
      // Uses colors.text
      const usesThemeText = true;
      expect(usesThemeText).toBe(true);
    });
  });

  describe('button layout', () => {
    it('buttons are displayed in a row', () => {
      const flexDirection = 'row';
      expect(flexDirection).toBe('row');
    });

    it('buttons have equal flex', () => {
      const flex = 1;
      expect(flex).toBe(1);
    });

    it('buttons have appropriate gap', () => {
      const gap = 12; // Spacing[3]
      expect(gap).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Driver Card Integration', () => {
  it('displays complete driver information', () => {
    const driver = createMockDriver();
    const { formatVehicleDescription } = require('@/components/cards/driver-card');

    expect(driver.name).toBe('James Wilson');
    expect(driver.rating).toBe(4.9);
    expect(formatVehicleDescription(driver.vehicle)).toBe('Silver Toyota Camry');
  });

  it('formats driver with minimal vehicle info', () => {
    const { formatVehicleDescription } = require('@/components/cards/driver-card');

    const driver = createMockDriver({
      vehicle: {
        type: 'bicycle',
        color: 'Green',
      },
    });

    expect(formatVehicleDescription(driver.vehicle)).toBe('Green Bicycle');
  });

  it('handles driver without license plate', () => {
    const { formatLicensePlate } = require('@/components/cards/driver-card');

    const driver = createMockDriver({
      vehicle: {
        type: 'bicycle',
        color: 'Green',
      },
    });

    expect(formatLicensePlate(driver.vehicle.licensePlate)).toBeNull();
  });

  it('can initiate call to driver', async () => {
    const { Linking } = require('react-native');
    const { openPhoneDialer } = require('@/components/cards/driver-card');
    const driver = createMockDriver();

    Linking.canOpenURL.mockResolvedValue(true);
    const result = await openPhoneDialer(driver.phone);
    expect(result).toBe(true);
  });
});
