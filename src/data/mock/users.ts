/**
 * Mock user data for Maestro Food Delivery App
 */

import type { Address, Driver, PaymentMethod, User } from '@/types';

// ============================================================================
// Mock Users
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://picsum.photos/seed/john/200/200',
    addresses: [
      {
        id: 'addr-001',
        label: 'Home',
        street: '123 Oak Street, Apt 4B',
        city: 'New York',
        zipCode: '10001',
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        isDefault: true,
        instructions: 'Buzz apartment 4B, third floor',
      },
      {
        id: 'addr-002',
        label: 'Work',
        street: '456 Business Plaza, Suite 200',
        city: 'New York',
        zipCode: '10018',
        coordinates: { latitude: 40.7549, longitude: -73.984 },
        isDefault: false,
        instructions: 'Leave with reception desk',
      },
    ],
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-12-01T15:30:00Z'),
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    addresses: [
      {
        id: 'addr-003',
        label: 'Home',
        street: '789 Maple Avenue',
        city: 'Brooklyn',
        zipCode: '11201',
        coordinates: { latitude: 40.6892, longitude: -73.9857 },
        isDefault: true,
      },
    ],
    createdAt: new Date('2024-03-22T08:00:00Z'),
    updatedAt: new Date('2024-11-15T12:00:00Z'),
  },
  {
    id: 'user-003',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://picsum.photos/seed/michael/200/200',
    addresses: [
      {
        id: 'addr-004',
        label: 'Home',
        street: '321 Pine Road',
        city: 'Queens',
        zipCode: '11375',
        coordinates: { latitude: 40.7282, longitude: -73.8317 },
        isDefault: true,
        instructions: 'Gate code: 1234',
      },
      {
        id: 'addr-005',
        label: 'Work',
        street: '555 Tech Park Drive',
        city: 'Manhattan',
        zipCode: '10003',
        coordinates: { latitude: 40.7317, longitude: -73.9892 },
        isDefault: false,
      },
      {
        id: 'addr-006',
        label: 'Other',
        street: '999 Gym Street',
        city: 'Manhattan',
        zipCode: '10010',
        coordinates: { latitude: 40.7394, longitude: -73.9825 },
        isDefault: false,
        instructions: 'Meet at lobby',
      },
    ],
    createdAt: new Date('2023-11-01T09:00:00Z'),
    updatedAt: new Date('2025-01-10T18:00:00Z'),
  },
];

/**
 * Default user for testing (first user)
 */
export const defaultUser = mockUsers[0];

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

// ============================================================================
// Mock Addresses (standalone for guest/new users)
// ============================================================================

export const mockAddresses: Address[] = [
  {
    id: 'addr-demo-001',
    label: 'Home',
    street: '100 Demo Street',
    city: 'New York',
    zipCode: '10001',
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    isDefault: true,
  },
  {
    id: 'addr-demo-002',
    label: 'Work',
    street: '200 Office Boulevard',
    city: 'New York',
    zipCode: '10018',
    coordinates: { latitude: 40.7549, longitude: -73.984 },
    isDefault: false,
  },
];

// ============================================================================
// Mock Payment Methods
// ============================================================================

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pay-001',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2027,
    isDefault: true,
  },
  {
    id: 'pay-002',
    type: 'card',
    last4: '5555',
    brand: 'mastercard',
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false,
  },
  {
    id: 'pay-003',
    type: 'card',
    last4: '0005',
    brand: 'amex',
    expiryMonth: 3,
    expiryYear: 2028,
    isDefault: false,
  },
  {
    id: 'pay-004',
    type: 'cash',
    isDefault: false,
  },
];

/**
 * Get default payment method
 */
export function getDefaultPaymentMethod(): PaymentMethod | undefined {
  return mockPaymentMethods.find((method) => method.isDefault);
}

/**
 * Get payment method by ID
 */
export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return mockPaymentMethods.find((method) => method.id === id);
}

// ============================================================================
// Mock Drivers
// ============================================================================

export const mockDrivers: Driver[] = [
  {
    id: 'driver-001',
    name: 'James Wilson',
    avatar: 'https://picsum.photos/seed/james/200/200',
    phone: '+1 (555) 111-2222',
    vehicle: {
      type: 'car',
      make: 'Toyota',
      model: 'Camry',
      color: 'Silver',
      licensePlate: 'ABC-1234',
    },
    currentLocation: { latitude: 40.7148, longitude: -74.008 },
    rating: 4.9,
  },
  {
    id: 'driver-002',
    name: 'Maria Garcia',
    avatar: 'https://picsum.photos/seed/maria/200/200',
    phone: '+1 (555) 333-4444',
    vehicle: {
      type: 'motorcycle',
      make: 'Honda',
      model: 'CB500F',
      color: 'Red',
      licensePlate: 'MTC-5678',
    },
    currentLocation: { latitude: 40.7108, longitude: -74.012 },
    rating: 4.8,
  },
  {
    id: 'driver-003',
    name: 'David Kim',
    avatar: 'https://picsum.photos/seed/david/200/200',
    phone: '+1 (555) 555-6666',
    vehicle: {
      type: 'bicycle',
      color: 'Green',
    },
    currentLocation: { latitude: 40.7188, longitude: -74.002 },
    rating: 4.7,
  },
  {
    id: 'driver-004',
    name: 'Emily Brown',
    avatar: 'https://picsum.photos/seed/emily/200/200',
    phone: '+1 (555) 777-8888',
    vehicle: {
      type: 'scooter',
      make: 'Vespa',
      model: 'Primavera',
      color: 'Blue',
      licensePlate: 'SCT-9012',
    },
    currentLocation: { latitude: 40.7058, longitude: -74.018 },
    rating: 4.95,
  },
  {
    id: 'driver-005',
    name: 'Robert Taylor',
    avatar: 'https://picsum.photos/seed/robert/200/200',
    phone: '+1 (555) 999-0000',
    vehicle: {
      type: 'car',
      make: 'Honda',
      model: 'Civic',
      color: 'Black',
      licensePlate: 'XYZ-7890',
    },
    currentLocation: { latitude: 40.7168, longitude: -74.004 },
    rating: 4.6,
  },
];

/**
 * Get driver by ID
 */
export function getDriverById(id: string): Driver | undefined {
  return mockDrivers.find((driver) => driver.id === id);
}

/**
 * Get a random available driver
 */
export function getRandomDriver(): Driver {
  const randomIndex = Math.floor(Math.random() * mockDrivers.length);
  return mockDrivers[randomIndex];
}

/**
 * Simulate driver location update (moves driver closer to destination)
 */
export function simulateDriverMovement(
  driver: Driver,
  destination: { latitude: number; longitude: number }
): Driver {
  if (!driver.currentLocation) {
    return { ...driver, currentLocation: destination };
  }

  const latDiff = destination.latitude - driver.currentLocation.latitude;
  const lngDiff = destination.longitude - driver.currentLocation.longitude;

  // Move 20% closer to destination
  const moveRatio = 0.2;

  return {
    ...driver,
    currentLocation: {
      latitude: driver.currentLocation.latitude + latDiff * moveRatio,
      longitude: driver.currentLocation.longitude + lngDiff * moveRatio,
    },
  };
}

/**
 * Simulates fetching user with network delay
 */
export async function fetchUser(userId: string, delayMs: number = 300): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getUserById(userId)), delayMs);
  });
}

/**
 * Simulates user authentication
 */
export async function authenticateUser(
  email: string,
  _password: string,
  delayMs: number = 500
): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getUserByEmail(email);
      // In mock, any password works if user exists
      resolve(user || null);
    }, delayMs);
  });
}
