/**
 * Mock restaurant data for Maestro Food Delivery App
 */

import type { Restaurant } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-001',
    name: 'Bella Italia',
    image: 'https://picsum.photos/seed/bella/400/300',
    coverImage: 'https://picsum.photos/seed/bella-cover/800/400',
    rating: 4.7,
    reviewCount: 324,
    deliveryTime: { min: 25, max: 35 },
    deliveryFee: 2.99,
    minOrder: 15.0,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    priceLevel: 2,
    isOpen: true,
    address: '123 Main Street, Downtown',
    description:
      'Authentic Italian cuisine made with imported ingredients and traditional family recipes passed down through generations.',
    hours: {
      monday: { open: '11:00', close: '22:00', isClosed: false },
      tuesday: { open: '11:00', close: '22:00', isClosed: false },
      wednesday: { open: '11:00', close: '22:00', isClosed: false },
      thursday: { open: '11:00', close: '22:00', isClosed: false },
      friday: { open: '11:00', close: '23:00', isClosed: false },
      saturday: { open: '12:00', close: '23:00', isClosed: false },
      sunday: { open: '12:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7128, longitude: -74.006 },
  },
  {
    id: 'rest-002',
    name: 'Tokyo Ramen House',
    image: 'https://picsum.photos/seed/ramen/400/300',
    coverImage: 'https://picsum.photos/seed/ramen-cover/800/400',
    rating: 4.8,
    reviewCount: 512,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 1.99,
    minOrder: 12.0,
    cuisine: ['Japanese', 'Ramen', 'Asian'],
    priceLevel: 2,
    isOpen: true,
    address: '456 Oak Avenue, Midtown',
    description:
      'Serving authentic Japanese ramen with rich, slow-cooked broths and fresh noodles made in-house daily.',
    hours: {
      monday: { open: '11:30', close: '21:30', isClosed: false },
      tuesday: { open: '11:30', close: '21:30', isClosed: false },
      wednesday: { open: '11:30', close: '21:30', isClosed: false },
      thursday: { open: '11:30', close: '21:30', isClosed: false },
      friday: { open: '11:30', close: '22:30', isClosed: false },
      saturday: { open: '12:00', close: '22:30', isClosed: false },
      sunday: { open: '12:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7148, longitude: -74.008 },
  },
  {
    id: 'rest-003',
    name: 'Burger Barn',
    image: 'https://picsum.photos/seed/burger/400/300',
    coverImage: 'https://picsum.photos/seed/burger-cover/800/400',
    rating: 4.5,
    reviewCount: 876,
    deliveryTime: { min: 15, max: 25 },
    deliveryFee: 0.99,
    minOrder: 10.0,
    cuisine: ['American', 'Burgers', 'Fast Food'],
    priceLevel: 1,
    isOpen: true,
    address: '789 Maple Drive, Westside',
    description:
      'Gourmet burgers made with 100% Angus beef, fresh toppings, and our signature secret sauce.',
    hours: {
      monday: { open: '10:00', close: '23:00', isClosed: false },
      tuesday: { open: '10:00', close: '23:00', isClosed: false },
      wednesday: { open: '10:00', close: '23:00', isClosed: false },
      thursday: { open: '10:00', close: '23:00', isClosed: false },
      friday: { open: '10:00', close: '00:00', isClosed: false },
      saturday: { open: '10:00', close: '00:00', isClosed: false },
      sunday: { open: '11:00', close: '22:00', isClosed: false },
    },
    coordinates: { latitude: 40.7108, longitude: -74.012 },
  },
  {
    id: 'rest-004',
    name: 'Spice Garden',
    image: 'https://picsum.photos/seed/indian/400/300',
    coverImage: 'https://picsum.photos/seed/indian-cover/800/400',
    rating: 4.6,
    reviewCount: 289,
    deliveryTime: { min: 30, max: 45 },
    deliveryFee: 2.49,
    minOrder: 20.0,
    cuisine: ['Indian', 'Curry', 'Vegetarian'],
    priceLevel: 2,
    isOpen: true,
    address: '321 Spice Lane, Eastside',
    description:
      'Traditional Indian cuisine featuring aromatic spices, tandoori specialties, and a wide selection of vegetarian options.',
    hours: {
      monday: { open: '11:00', close: '22:00', isClosed: false },
      tuesday: { open: '11:00', close: '22:00', isClosed: false },
      wednesday: { open: '11:00', close: '22:00', isClosed: false },
      thursday: { open: '11:00', close: '22:00', isClosed: false },
      friday: { open: '11:00', close: '23:00', isClosed: false },
      saturday: { open: '11:00', close: '23:00', isClosed: false },
      sunday: { open: '12:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7188, longitude: -74.002 },
  },
  {
    id: 'rest-005',
    name: 'Sushi Master',
    image: 'https://picsum.photos/seed/sushi/400/300',
    coverImage: 'https://picsum.photos/seed/sushi-cover/800/400',
    rating: 4.9,
    reviewCount: 445,
    deliveryTime: { min: 25, max: 40 },
    deliveryFee: 3.99,
    minOrder: 25.0,
    cuisine: ['Japanese', 'Sushi', 'Seafood'],
    priceLevel: 3,
    isOpen: true,
    address: '555 Harbor Boulevard, Marina',
    description:
      'Premium sushi crafted by master chefs using the freshest fish flown in daily from Tokyo fish markets.',
    hours: {
      monday: { open: '12:00', close: '22:00', isClosed: false },
      tuesday: { open: '12:00', close: '22:00', isClosed: false },
      wednesday: { open: '12:00', close: '22:00', isClosed: false },
      thursday: { open: '12:00', close: '22:00', isClosed: false },
      friday: { open: '12:00', close: '23:00', isClosed: false },
      saturday: { open: '12:00', close: '23:00', isClosed: false },
      sunday: { open: '13:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7058, longitude: -74.018 },
  },
  {
    id: 'rest-006',
    name: 'Taco Loco',
    image: 'https://picsum.photos/seed/tacos/400/300',
    coverImage: 'https://picsum.photos/seed/tacos-cover/800/400',
    rating: 4.4,
    reviewCount: 632,
    deliveryTime: { min: 15, max: 25 },
    deliveryFee: 1.49,
    minOrder: 8.0,
    cuisine: ['Mexican', 'Tacos', 'Burritos'],
    priceLevel: 1,
    isOpen: true,
    address: '888 Fiesta Street, Centro',
    description:
      'Authentic Mexican street food with handmade tortillas, fresh salsas, and traditional recipes from Oaxaca.',
    hours: {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '10:00', close: '00:00', isClosed: false },
      saturday: { open: '10:00', close: '00:00', isClosed: false },
      sunday: { open: '11:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7168, longitude: -74.004 },
  },
  {
    id: 'rest-007',
    name: 'Dragon Palace',
    image: 'https://picsum.photos/seed/chinese/400/300',
    coverImage: 'https://picsum.photos/seed/chinese-cover/800/400',
    rating: 4.3,
    reviewCount: 521,
    deliveryTime: { min: 20, max: 35 },
    deliveryFee: 1.99,
    minOrder: 15.0,
    cuisine: ['Chinese', 'Asian', 'Dim Sum'],
    priceLevel: 2,
    isOpen: true,
    address: '168 Lucky Dragon Road, Chinatown',
    description:
      'Traditional Cantonese and Szechuan cuisine with authentic dim sum, wok-fried dishes, and Peking duck.',
    hours: {
      monday: { open: '11:00', close: '22:30', isClosed: false },
      tuesday: { open: '11:00', close: '22:30', isClosed: false },
      wednesday: { open: '11:00', close: '22:30', isClosed: false },
      thursday: { open: '11:00', close: '22:30', isClosed: false },
      friday: { open: '11:00', close: '23:30', isClosed: false },
      saturday: { open: '10:30', close: '23:30', isClosed: false },
      sunday: { open: '10:30', close: '22:00', isClosed: false },
    },
    coordinates: { latitude: 40.7138, longitude: -74.0 },
  },
  {
    id: 'rest-008',
    name: 'Thai Orchid',
    image: 'https://picsum.photos/seed/thai/400/300',
    coverImage: 'https://picsum.photos/seed/thai-cover/800/400',
    rating: 4.6,
    reviewCount: 378,
    deliveryTime: { min: 25, max: 40 },
    deliveryFee: 2.49,
    minOrder: 18.0,
    cuisine: ['Thai', 'Asian', 'Curry'],
    priceLevel: 2,
    isOpen: true,
    address: '234 Orchid Way, Riverside',
    description:
      'Authentic Thai flavors with fresh herbs, aromatic curries, and the perfect balance of sweet, sour, salty, and spicy.',
    hours: {
      monday: { open: '11:30', close: '21:30', isClosed: false },
      tuesday: { open: '11:30', close: '21:30', isClosed: false },
      wednesday: { open: '11:30', close: '21:30', isClosed: false },
      thursday: { open: '11:30', close: '21:30', isClosed: false },
      friday: { open: '11:30', close: '22:30', isClosed: false },
      saturday: { open: '12:00', close: '22:30', isClosed: false },
      sunday: { open: '12:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7098, longitude: -74.015 },
  },
  {
    id: 'rest-009',
    name: 'Mediterranean Grill',
    image: 'https://picsum.photos/seed/mediterranean/400/300',
    coverImage: 'https://picsum.photos/seed/mediterranean-cover/800/400',
    rating: 4.7,
    reviewCount: 267,
    deliveryTime: { min: 25, max: 35 },
    deliveryFee: 2.99,
    minOrder: 20.0,
    cuisine: ['Mediterranean', 'Greek', 'Healthy'],
    priceLevel: 2,
    isOpen: true,
    address: '567 Olive Grove Lane, Hillside',
    description:
      'Fresh Mediterranean cuisine featuring grilled meats, falafel, hummus, and healthy salads made with olive oil.',
    hours: {
      monday: { open: '11:00', close: '21:30', isClosed: false },
      tuesday: { open: '11:00', close: '21:30', isClosed: false },
      wednesday: { open: '11:00', close: '21:30', isClosed: false },
      thursday: { open: '11:00', close: '21:30', isClosed: false },
      friday: { open: '11:00', close: '22:30', isClosed: false },
      saturday: { open: '11:00', close: '22:30', isClosed: false },
      sunday: { open: '12:00', close: '21:00', isClosed: false },
    },
    coordinates: { latitude: 40.7178, longitude: -74.01 },
  },
  {
    id: 'rest-010',
    name: 'Le Petit Bistro',
    image: 'https://picsum.photos/seed/french/400/300',
    coverImage: 'https://picsum.photos/seed/french-cover/800/400',
    rating: 4.8,
    reviewCount: 189,
    deliveryTime: { min: 35, max: 50 },
    deliveryFee: 4.99,
    minOrder: 35.0,
    cuisine: ['French', 'European', 'Fine Dining'],
    priceLevel: 4,
    isOpen: true,
    address: '12 Champs Avenue, Uptown',
    description:
      'Classic French bistro cuisine featuring coq au vin, beef bourguignon, and exquisite pastries from our Parisian-trained chef.',
    hours: {
      monday: { open: '12:00', close: '22:00', isClosed: false },
      tuesday: { open: '12:00', close: '22:00', isClosed: false },
      wednesday: { open: '12:00', close: '22:00', isClosed: false },
      thursday: { open: '12:00', close: '22:00', isClosed: false },
      friday: { open: '12:00', close: '23:00', isClosed: false },
      saturday: { open: '17:00', close: '23:00', isClosed: false },
      sunday: { open: '00:00', close: '00:00', isClosed: true },
    },
    coordinates: { latitude: 40.7218, longitude: -74.003 },
  },
  {
    id: 'rest-011',
    name: 'Pizza Paradise',
    image: 'https://picsum.photos/seed/pizza/400/300',
    coverImage: 'https://picsum.photos/seed/pizza-cover/800/400',
    rating: 4.5,
    reviewCount: 743,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 1.99,
    minOrder: 12.0,
    cuisine: ['Italian', 'Pizza'],
    priceLevel: 1,
    isOpen: true,
    address: '999 Slice Street, Downtown',
    description:
      'New York style pizza with hand-tossed dough, tangy tomato sauce, and generous cheese toppings baked in a brick oven.',
    hours: {
      monday: { open: '11:00', close: '23:00', isClosed: false },
      tuesday: { open: '11:00', close: '23:00', isClosed: false },
      wednesday: { open: '11:00', close: '23:00', isClosed: false },
      thursday: { open: '11:00', close: '23:00', isClosed: false },
      friday: { open: '11:00', close: '01:00', isClosed: false },
      saturday: { open: '11:00', close: '01:00', isClosed: false },
      sunday: { open: '12:00', close: '22:00', isClosed: false },
    },
    coordinates: { latitude: 40.7118, longitude: -74.007 },
  },
  {
    id: 'rest-012',
    name: 'Green Bowl',
    image: 'https://picsum.photos/seed/healthy/400/300',
    coverImage: 'https://picsum.photos/seed/healthy-cover/800/400',
    rating: 4.6,
    reviewCount: 234,
    deliveryTime: { min: 15, max: 25 },
    deliveryFee: 2.49,
    minOrder: 14.0,
    cuisine: ['Healthy', 'Salads', 'Vegan'],
    priceLevel: 2,
    isOpen: true,
    address: '456 Wellness Way, Midtown',
    description:
      'Fresh, nutritious bowls and salads made with organic ingredients, superfoods, and plant-based proteins.',
    hours: {
      monday: { open: '08:00', close: '20:00', isClosed: false },
      tuesday: { open: '08:00', close: '20:00', isClosed: false },
      wednesday: { open: '08:00', close: '20:00', isClosed: false },
      thursday: { open: '08:00', close: '20:00', isClosed: false },
      friday: { open: '08:00', close: '21:00', isClosed: false },
      saturday: { open: '09:00', close: '21:00', isClosed: false },
      sunday: { open: '09:00', close: '19:00', isClosed: false },
    },
    coordinates: { latitude: 40.7158, longitude: -74.009 },
  },
  {
    id: 'rest-013',
    name: 'Sweet Dreams Bakery',
    image: 'https://picsum.photos/seed/bakery/400/300',
    coverImage: 'https://picsum.photos/seed/bakery-cover/800/400',
    rating: 4.9,
    reviewCount: 412,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 3.49,
    minOrder: 15.0,
    cuisine: ['Desserts', 'Bakery', 'Coffee'],
    priceLevel: 2,
    isOpen: true,
    address: '777 Sugar Lane, Sweetville',
    description:
      'Artisanal cakes, pastries, and desserts baked fresh daily with premium ingredients and creative flavors.',
    hours: {
      monday: { open: '07:00', close: '20:00', isClosed: false },
      tuesday: { open: '07:00', close: '20:00', isClosed: false },
      wednesday: { open: '07:00', close: '20:00', isClosed: false },
      thursday: { open: '07:00', close: '20:00', isClosed: false },
      friday: { open: '07:00', close: '21:00', isClosed: false },
      saturday: { open: '08:00', close: '21:00', isClosed: false },
      sunday: { open: '08:00', close: '19:00', isClosed: false },
    },
    coordinates: { latitude: 40.7078, longitude: -74.013 },
  },
  {
    id: 'rest-014',
    name: 'Seoul Kitchen',
    image: 'https://picsum.photos/seed/korean/400/300',
    coverImage: 'https://picsum.photos/seed/korean-cover/800/400',
    rating: 4.7,
    reviewCount: 356,
    deliveryTime: { min: 25, max: 40 },
    deliveryFee: 2.99,
    minOrder: 18.0,
    cuisine: ['Korean', 'BBQ', 'Asian'],
    priceLevel: 2,
    isOpen: true,
    address: '432 Gangnam Street, Koreatown',
    description:
      'Authentic Korean BBQ, bibimbap, and classic Korean comfort food with homemade kimchi and banchan.',
    hours: {
      monday: { open: '11:30', close: '22:00', isClosed: false },
      tuesday: { open: '11:30', close: '22:00', isClosed: false },
      wednesday: { open: '11:30', close: '22:00', isClosed: false },
      thursday: { open: '11:30', close: '22:00', isClosed: false },
      friday: { open: '11:30', close: '23:00', isClosed: false },
      saturday: { open: '12:00', close: '23:00', isClosed: false },
      sunday: { open: '12:00', close: '21:30', isClosed: false },
    },
    coordinates: { latitude: 40.7198, longitude: -74.001 },
  },
  {
    id: 'rest-015',
    name: 'Breakfast Club',
    image: 'https://picsum.photos/seed/breakfast/400/300',
    coverImage: 'https://picsum.photos/seed/breakfast-cover/800/400',
    rating: 4.4,
    reviewCount: 567,
    deliveryTime: { min: 20, max: 35 },
    deliveryFee: 2.49,
    minOrder: 12.0,
    cuisine: ['Breakfast', 'American', 'Brunch'],
    priceLevel: 2,
    isOpen: true,
    address: '123 Morning Glory Ave, Sunrise District',
    description:
      'All-day breakfast and brunch favorites including fluffy pancakes, eggs benedict, and avocado toast.',
    hours: {
      monday: { open: '06:00', close: '15:00', isClosed: false },
      tuesday: { open: '06:00', close: '15:00', isClosed: false },
      wednesday: { open: '06:00', close: '15:00', isClosed: false },
      thursday: { open: '06:00', close: '15:00', isClosed: false },
      friday: { open: '06:00', close: '16:00', isClosed: false },
      saturday: { open: '07:00', close: '16:00', isClosed: false },
      sunday: { open: '07:00', close: '15:00', isClosed: false },
    },
    coordinates: { latitude: 40.7088, longitude: -74.016 },
  },
  {
    id: 'rest-016',
    name: 'The Steakhouse',
    image: 'https://picsum.photos/seed/steak/400/300',
    coverImage: 'https://picsum.photos/seed/steak-cover/800/400',
    rating: 4.8,
    reviewCount: 298,
    deliveryTime: { min: 35, max: 50 },
    deliveryFee: 4.99,
    minOrder: 40.0,
    cuisine: ['American', 'Steakhouse', 'Fine Dining'],
    priceLevel: 4,
    isOpen: false,
    address: '1 Prime Cut Boulevard, Financial District',
    description:
      'Premium aged steaks, fresh seafood, and classic sides in an elegant setting. USDA Prime beef dry-aged in house.',
    hours: {
      monday: { open: '17:00', close: '22:00', isClosed: false },
      tuesday: { open: '17:00', close: '22:00', isClosed: false },
      wednesday: { open: '17:00', close: '22:00', isClosed: false },
      thursday: { open: '17:00', close: '22:00', isClosed: false },
      friday: { open: '17:00', close: '23:00', isClosed: false },
      saturday: { open: '17:00', close: '23:00', isClosed: false },
      sunday: { open: '00:00', close: '00:00', isClosed: true },
    },
    coordinates: { latitude: 40.7068, longitude: -74.02 },
  },
];

/**
 * Helper function to get a restaurant by ID
 */
export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((restaurant) => restaurant.id === id);
}

/**
 * Helper function to get restaurants by cuisine
 */
export function getRestaurantsByCuisine(cuisine: string): Restaurant[] {
  return mockRestaurants.filter((restaurant) =>
    restaurant.cuisine.some((c) => c.toLowerCase() === cuisine.toLowerCase())
  );
}

/**
 * Helper function to get open restaurants only
 */
export function getOpenRestaurants(): Restaurant[] {
  return mockRestaurants.filter((restaurant) => restaurant.isOpen);
}

/**
 * Helper function to search restaurants by name
 */
export function searchRestaurantsByName(query: string): Restaurant[] {
  const lowerQuery = query.toLowerCase();
  return mockRestaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(lowerQuery));
}

/**
 * Simulates network delay for fetching restaurants
 */
export async function fetchRestaurants(delayMs: number = 500): Promise<Restaurant[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRestaurants), delayMs);
  });
}

/**
 * Simulates fetching a single restaurant with network delay
 */
export async function fetchRestaurantById(
  id: string,
  delayMs: number = 300
): Promise<Restaurant | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getRestaurantById(id)), delayMs);
  });
}
