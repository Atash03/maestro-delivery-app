/**
 * Mock category data for Maestro Food Delivery App
 * Categories represent cuisine types with associated icons
 */

import type { Category } from '@/types';

// ============================================================================
// Cuisine Categories
// ============================================================================

export const mockCategories: Category[] = [
  {
    id: 'cat-all',
    name: 'All',
    icon: 'restaurant',
    image: 'https://picsum.photos/seed/all-food/400/300',
  },
  {
    id: 'cat-pizza',
    name: 'Pizza',
    icon: 'pizza',
    image: 'https://picsum.photos/seed/pizza-cat/400/300',
  },
  {
    id: 'cat-burgers',
    name: 'Burgers',
    icon: 'fast-food',
    image: 'https://picsum.photos/seed/burger-cat/400/300',
  },
  {
    id: 'cat-sushi',
    name: 'Sushi',
    icon: 'fish',
    image: 'https://picsum.photos/seed/sushi-cat/400/300',
  },
  {
    id: 'cat-chinese',
    name: 'Chinese',
    icon: 'restaurant',
    image: 'https://picsum.photos/seed/chinese-cat/400/300',
  },
  {
    id: 'cat-indian',
    name: 'Indian',
    icon: 'flame',
    image: 'https://picsum.photos/seed/indian-cat/400/300',
  },
  {
    id: 'cat-mexican',
    name: 'Mexican',
    icon: 'cafe',
    image: 'https://picsum.photos/seed/mexican-cat/400/300',
  },
  {
    id: 'cat-thai',
    name: 'Thai',
    icon: 'leaf',
    image: 'https://picsum.photos/seed/thai-cat/400/300',
  },
  {
    id: 'cat-italian',
    name: 'Italian',
    icon: 'wine',
    image: 'https://picsum.photos/seed/italian-cat/400/300',
  },
  {
    id: 'cat-american',
    name: 'American',
    icon: 'american-football',
    image: 'https://picsum.photos/seed/american-cat/400/300',
  },
  {
    id: 'cat-mediterranean',
    name: 'Mediterranean',
    icon: 'sunny',
    image: 'https://picsum.photos/seed/mediterranean-cat/400/300',
  },
  {
    id: 'cat-healthy',
    name: 'Healthy',
    icon: 'heart',
    image: 'https://picsum.photos/seed/healthy-cat/400/300',
  },
  {
    id: 'cat-desserts',
    name: 'Desserts',
    icon: 'ice-cream',
    image: 'https://picsum.photos/seed/desserts-cat/400/300',
  },
  {
    id: 'cat-breakfast',
    name: 'Breakfast',
    icon: 'sunny',
    image: 'https://picsum.photos/seed/breakfast-cat/400/300',
  },
  {
    id: 'cat-coffee',
    name: 'Coffee',
    icon: 'cafe',
    image: 'https://picsum.photos/seed/coffee-cat/400/300',
  },
  {
    id: 'cat-korean',
    name: 'Korean',
    icon: 'flame',
    image: 'https://picsum.photos/seed/korean-cat/400/300',
  },
  {
    id: 'cat-japanese',
    name: 'Japanese',
    icon: 'fish',
    image: 'https://picsum.photos/seed/japanese-cat/400/300',
  },
  {
    id: 'cat-seafood',
    name: 'Seafood',
    icon: 'fish',
    image: 'https://picsum.photos/seed/seafood-cat/400/300',
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((category) => category.id === id);
}

/**
 * Get category by name
 */
export function getCategoryByName(name: string): Category | undefined {
  return mockCategories.find((category) => category.name.toLowerCase() === name.toLowerCase());
}

/**
 * Search categories by name
 */
export function searchCategories(query: string): Category[] {
  const lowerQuery = query.toLowerCase();
  return mockCategories.filter((category) => category.name.toLowerCase().includes(lowerQuery));
}

/**
 * Get popular categories (first 10 for display)
 */
export function getPopularCategories(): Category[] {
  return mockCategories.slice(0, 10);
}

/**
 * Simulates fetching categories with network delay
 */
export async function fetchCategories(delayMs: number = 200): Promise<Category[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategories), delayMs);
  });
}

// ============================================================================
// Featured Collections
// ============================================================================

export interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  categoryIds: string[];
}

export const mockFeaturedCollections: FeaturedCollection[] = [
  {
    id: 'collection-quick-eats',
    title: 'Quick Eats',
    subtitle: 'Under 30 minutes',
    image: 'https://picsum.photos/seed/quick-eats/800/400',
    categoryIds: ['cat-burgers', 'cat-pizza', 'cat-mexican'],
  },
  {
    id: 'collection-healthy',
    title: 'Healthy Choices',
    subtitle: 'Feel-good food',
    image: 'https://picsum.photos/seed/healthy-choices/800/400',
    categoryIds: ['cat-healthy', 'cat-mediterranean'],
  },
  {
    id: 'collection-asian',
    title: 'Asian Favorites',
    subtitle: 'Flavors of the East',
    image: 'https://picsum.photos/seed/asian-favorites/800/400',
    categoryIds: ['cat-chinese', 'cat-japanese', 'cat-thai', 'cat-korean', 'cat-sushi'],
  },
  {
    id: 'collection-late-night',
    title: 'Late Night Cravings',
    subtitle: 'Open past midnight',
    image: 'https://picsum.photos/seed/late-night/800/400',
    categoryIds: ['cat-pizza', 'cat-burgers', 'cat-mexican'],
  },
  {
    id: 'collection-sweet-tooth',
    title: 'Sweet Treats',
    subtitle: 'Desserts & more',
    image: 'https://picsum.photos/seed/sweet-treats/800/400',
    categoryIds: ['cat-desserts', 'cat-coffee'],
  },
];

/**
 * Get featured collection by ID
 */
export function getFeaturedCollectionById(id: string): FeaturedCollection | undefined {
  return mockFeaturedCollections.find((collection) => collection.id === id);
}

/**
 * Simulates fetching featured collections with network delay
 */
export async function fetchFeaturedCollections(
  delayMs: number = 300
): Promise<FeaturedCollection[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockFeaturedCollections), delayMs);
  });
}

// ============================================================================
// Dietary Filters
// ============================================================================

export interface DietaryFilter {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const mockDietaryFilters: DietaryFilter[] = [
  {
    id: 'diet-vegetarian',
    name: 'Vegetarian',
    icon: 'leaf',
    description: 'No meat or fish',
  },
  {
    id: 'diet-vegan',
    name: 'Vegan',
    icon: 'leaf',
    description: 'No animal products',
  },
  {
    id: 'diet-gluten-free',
    name: 'Gluten-Free',
    icon: 'ban',
    description: 'No gluten-containing ingredients',
  },
  {
    id: 'diet-halal',
    name: 'Halal',
    icon: 'checkmark-circle',
    description: 'Halal certified',
  },
  {
    id: 'diet-kosher',
    name: 'Kosher',
    icon: 'checkmark-circle',
    description: 'Kosher certified',
  },
];

/**
 * Get dietary filter by ID
 */
export function getDietaryFilterById(id: string): DietaryFilter | undefined {
  return mockDietaryFilters.find((filter) => filter.id === id);
}

// ============================================================================
// Sort Options
// ============================================================================

export interface SortOption {
  id: string;
  name: string;
  description: string;
}

export const mockSortOptions: SortOption[] = [
  {
    id: 'sort-recommended',
    name: 'Recommended',
    description: 'Our top picks for you',
  },
  {
    id: 'sort-fastest',
    name: 'Fastest Delivery',
    description: 'Get food faster',
  },
  {
    id: 'sort-rating',
    name: 'Rating',
    description: 'Highest rated first',
  },
  {
    id: 'sort-distance',
    name: 'Distance',
    description: 'Closest to you',
  },
  {
    id: 'sort-price-low',
    name: 'Price: Low to High',
    description: 'Budget-friendly first',
  },
  {
    id: 'sort-price-high',
    name: 'Price: High to Low',
    description: 'Premium options first',
  },
];

/**
 * Get sort option by ID
 */
export function getSortOptionById(id: string): SortOption | undefined {
  return mockSortOptions.find((option) => option.id === id);
}
