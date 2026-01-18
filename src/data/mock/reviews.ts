/**
 * Mock Reviews Data
 *
 * Contains sample review data for restaurants and drivers.
 * Reviews are linked to restaurants and include user info, ratings, comments, and photos.
 */

import type { Review } from '@/types';

// ============================================================================
// Mock Reviews
// ============================================================================

export const mockReviews: Review[] = [
  // Bella Italia reviews
  {
    id: 'review-1',
    userId: 'user-1',
    userName: 'Sarah M.',
    userAvatar: 'https://picsum.photos/seed/user1/100/100',
    restaurantId: '1',
    orderId: 'order-1',
    rating: 5,
    comment:
      'Amazing pasta! The carbonara was perfectly creamy and the portion size was generous. Will definitely order again.',
    photos: [
      'https://picsum.photos/seed/review1-1/400/300',
      'https://picsum.photos/seed/review1-2/400/300',
    ],
    createdAt: new Date('2026-01-15T18:30:00'),
  },
  {
    id: 'review-2',
    userId: 'user-2',
    userName: 'Mike D.',
    userAvatar: 'https://picsum.photos/seed/user2/100/100',
    restaurantId: '1',
    orderId: 'order-2',
    rating: 4,
    comment:
      'Great food, delivery was a bit late but the quality made up for it. The tiramisu was excellent!',
    createdAt: new Date('2026-01-14T12:45:00'),
  },
  {
    id: 'review-3',
    userId: 'user-3',
    userName: 'Emily R.',
    userAvatar: 'https://picsum.photos/seed/user3/100/100',
    restaurantId: '1',
    orderId: 'order-3',
    rating: 5,
    comment: 'Best Italian food in the area. The bruschetta was fresh and flavorful.',
    photos: ['https://picsum.photos/seed/review3-1/400/300'],
    createdAt: new Date('2026-01-10T19:15:00'),
  },

  // Sakura Sushi reviews
  {
    id: 'review-4',
    userId: 'user-4',
    userName: 'James L.',
    userAvatar: 'https://picsum.photos/seed/user4/100/100',
    restaurantId: '2',
    orderId: 'order-4',
    rating: 5,
    comment:
      'The sashimi was incredibly fresh! You can tell they use quality ingredients. The dragon roll was a work of art.',
    photos: [
      'https://picsum.photos/seed/review4-1/400/300',
      'https://picsum.photos/seed/review4-2/400/300',
      'https://picsum.photos/seed/review4-3/400/300',
    ],
    createdAt: new Date('2026-01-16T20:00:00'),
  },
  {
    id: 'review-5',
    userId: 'user-5',
    userName: 'Linda K.',
    userAvatar: 'https://picsum.photos/seed/user5/100/100',
    restaurantId: '2',
    orderId: 'order-5',
    rating: 4,
    comment: 'Solid sushi, good value for money. Would have liked more wasabi though.',
    createdAt: new Date('2026-01-12T13:30:00'),
  },
  {
    id: 'review-6',
    userId: 'user-6',
    userName: 'David W.',
    userAvatar: undefined,
    restaurantId: '2',
    orderId: 'order-6',
    rating: 5,
    comment: 'Outstanding quality! The chef clearly knows what they are doing.',
    createdAt: new Date('2026-01-08T18:45:00'),
  },

  // Burger Barn reviews
  {
    id: 'review-7',
    userId: 'user-7',
    userName: 'Chris P.',
    userAvatar: 'https://picsum.photos/seed/user7/100/100',
    restaurantId: '3',
    orderId: 'order-7',
    rating: 5,
    comment:
      'Best burgers in town! The patties are juicy and the buns are perfectly toasted. The truffle fries are addictive.',
    photos: ['https://picsum.photos/seed/review7-1/400/300'],
    createdAt: new Date('2026-01-17T12:00:00'),
  },
  {
    id: 'review-8',
    userId: 'user-8',
    userName: 'Jessica H.',
    userAvatar: 'https://picsum.photos/seed/user8/100/100',
    restaurantId: '3',
    orderId: 'order-8',
    rating: 4,
    comment: 'Really good burger! The bacon was crispy and the cheese was melted perfectly.',
    createdAt: new Date('2026-01-15T19:30:00'),
  },
  {
    id: 'review-9',
    userId: 'user-9',
    userName: 'Tom B.',
    userAvatar: undefined,
    restaurantId: '3',
    orderId: 'order-9',
    rating: 3,
    comment: 'Decent burgers but a bit overpriced for what you get. Fries were cold.',
    createdAt: new Date('2026-01-13T13:15:00'),
  },

  // Spice Route reviews
  {
    id: 'review-10',
    userId: 'user-10',
    userName: 'Priya S.',
    userAvatar: 'https://picsum.photos/seed/user10/100/100',
    restaurantId: '4',
    orderId: 'order-10',
    rating: 5,
    comment:
      'Authentic Indian flavors! The butter chicken was rich and creamy. Naan bread was fluffy and fresh.',
    photos: [
      'https://picsum.photos/seed/review10-1/400/300',
      'https://picsum.photos/seed/review10-2/400/300',
    ],
    createdAt: new Date('2026-01-16T19:00:00'),
  },
  {
    id: 'review-11',
    userId: 'user-11',
    userName: 'Robert J.',
    userAvatar: 'https://picsum.photos/seed/user11/100/100',
    restaurantId: '4',
    orderId: 'order-11',
    rating: 4,
    comment: 'Great spice levels. The biryani was fragrant and well-seasoned.',
    createdAt: new Date('2026-01-14T20:30:00'),
  },

  // Taco Loco reviews
  {
    id: 'review-12',
    userId: 'user-12',
    userName: 'Maria G.',
    userAvatar: 'https://picsum.photos/seed/user12/100/100',
    restaurantId: '5',
    orderId: 'order-12',
    rating: 5,
    comment:
      'Reminded me of home! The street tacos are authentic and delicious. Churros were perfect.',
    photos: ['https://picsum.photos/seed/review12-1/400/300'],
    createdAt: new Date('2026-01-17T14:00:00'),
  },
  {
    id: 'review-13',
    userId: 'user-13',
    userName: 'Alex M.',
    userAvatar: undefined,
    restaurantId: '5',
    orderId: 'order-13',
    rating: 4,
    comment: 'Solid tacos with generous fillings. The guac was fresh!',
    createdAt: new Date('2026-01-11T18:45:00'),
  },

  // Bangkok Kitchen reviews
  {
    id: 'review-14',
    userId: 'user-14',
    userName: 'Kevin T.',
    userAvatar: 'https://picsum.photos/seed/user14/100/100',
    restaurantId: '6',
    orderId: 'order-14',
    rating: 5,
    comment:
      'The pad thai was perfect! Not too sweet, not too sour. Green curry had just the right amount of heat.',
    photos: [
      'https://picsum.photos/seed/review14-1/400/300',
      'https://picsum.photos/seed/review14-2/400/300',
    ],
    createdAt: new Date('2026-01-16T12:30:00'),
  },
  {
    id: 'review-15',
    userId: 'user-15',
    userName: 'Nancy W.',
    userAvatar: 'https://picsum.photos/seed/user15/100/100',
    restaurantId: '6',
    orderId: 'order-15',
    rating: 4,
    comment: 'Love their spring rolls. Fresh and crispy every time.',
    createdAt: new Date('2026-01-09T19:00:00'),
  },

  // Dragon Palace reviews
  {
    id: 'review-16',
    userId: 'user-16',
    userName: 'Steven C.',
    userAvatar: 'https://picsum.photos/seed/user16/100/100',
    restaurantId: '7',
    orderId: 'order-16',
    rating: 5,
    comment: 'Best dim sum delivery experience! Everything arrived hot and fresh.',
    photos: ['https://picsum.photos/seed/review16-1/400/300'],
    createdAt: new Date('2026-01-15T11:00:00'),
  },
  {
    id: 'review-17',
    userId: 'user-17',
    userName: 'Amanda L.',
    userAvatar: undefined,
    restaurantId: '7',
    orderId: 'order-17',
    rating: 4,
    comment: 'Generous portions and authentic taste. The kung pao chicken was amazing.',
    createdAt: new Date('2026-01-13T18:30:00'),
  },

  // Mediterranean Grill reviews
  {
    id: 'review-18',
    userId: 'user-18',
    userName: 'George A.',
    userAvatar: 'https://picsum.photos/seed/user18/100/100',
    restaurantId: '8',
    orderId: 'order-18',
    rating: 5,
    comment: 'The lamb kebab was cooked to perfection. Hummus was creamy and flavorful.',
    photos: [
      'https://picsum.photos/seed/review18-1/400/300',
      'https://picsum.photos/seed/review18-2/400/300',
    ],
    createdAt: new Date('2026-01-17T20:00:00'),
  },
  {
    id: 'review-19',
    userId: 'user-19',
    userName: 'Helen P.',
    userAvatar: 'https://picsum.photos/seed/user19/100/100',
    restaurantId: '8',
    orderId: 'order-19',
    rating: 4,
    comment: 'Fresh ingredients and great flavors. The falafel was crispy outside, soft inside.',
    createdAt: new Date('2026-01-10T19:15:00'),
  },

  // Pizza Palace reviews
  {
    id: 'review-20',
    userId: 'user-20',
    userName: 'Tony R.',
    userAvatar: 'https://picsum.photos/seed/user20/100/100',
    restaurantId: '9',
    orderId: 'order-20',
    rating: 5,
    comment:
      'Finally, a place that gets New York style pizza right! Thin crust, perfect sauce, generous toppings.',
    photos: ['https://picsum.photos/seed/review20-1/400/300'],
    createdAt: new Date('2026-01-16T21:00:00'),
  },
  {
    id: 'review-21',
    userId: 'user-21',
    userName: 'Beth S.',
    userAvatar: undefined,
    restaurantId: '9',
    orderId: 'order-21',
    rating: 4,
    comment: 'Great pizza for the price. Delivery was quick and the pizza arrived hot.',
    createdAt: new Date('2026-01-14T18:30:00'),
  },
  {
    id: 'review-22',
    userId: 'user-22',
    userName: 'Frank D.',
    userAvatar: 'https://picsum.photos/seed/user22/100/100',
    restaurantId: '9',
    orderId: 'order-22',
    rating: 3,
    comment: 'Decent pizza but nothing special. The pepperoni was a bit too greasy.',
    createdAt: new Date('2026-01-08T20:00:00'),
  },

  // Green Bowl reviews
  {
    id: 'review-23',
    userId: 'user-23',
    userName: 'Lisa V.',
    userAvatar: 'https://picsum.photos/seed/user23/100/100',
    restaurantId: '10',
    orderId: 'order-23',
    rating: 5,
    comment: 'So refreshing! The quinoa bowl was packed with flavor. Perfect for a healthy lunch.',
    photos: ['https://picsum.photos/seed/review23-1/400/300'],
    createdAt: new Date('2026-01-17T12:30:00'),
  },
  {
    id: 'review-24',
    userId: 'user-24',
    userName: 'Mark H.',
    userAvatar: 'https://picsum.photos/seed/user24/100/100',
    restaurantId: '10',
    orderId: 'order-24',
    rating: 4,
    comment: 'Great healthy options. The smoothie bowl was delicious and filling.',
    createdAt: new Date('2026-01-12T13:00:00'),
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all reviews for a specific restaurant
 */
export function getReviewsByRestaurantId(restaurantId: string): Review[] {
  return mockReviews
    .filter((review) => review.restaurantId === restaurantId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get a specific review by ID
 */
export function getReviewById(reviewId: string): Review | undefined {
  return mockReviews.find((review) => review.id === reviewId);
}

/**
 * Get reviews by user ID
 */
export function getReviewsByUserId(userId: string): Review[] {
  return mockReviews
    .filter((review) => review.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get the average rating for a restaurant
 */
export function getAverageRating(restaurantId: string): number {
  const reviews = getReviewsByRestaurantId(restaurantId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/**
 * Get rating distribution for a restaurant (count of each star rating)
 */
export function getRatingDistribution(restaurantId: string): Record<number, number> {
  const reviews = getReviewsByRestaurantId(restaurantId);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const review of reviews) {
    distribution[review.rating]++;
  }
  return distribution;
}

/**
 * Get recent reviews for a restaurant (limited count)
 */
export function getRecentReviews(restaurantId: string, limit: number = 3): Review[] {
  return getReviewsByRestaurantId(restaurantId).slice(0, limit);
}

/**
 * Format review date for display
 */
export function formatReviewDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// ============================================================================
// Async Functions (with network delay simulation)
// ============================================================================

/**
 * Fetch reviews for a restaurant (simulates network delay)
 */
export async function fetchReviewsByRestaurantId(
  restaurantId: string,
  delay: number = 400
): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return getReviewsByRestaurantId(restaurantId);
}

/**
 * Fetch recent reviews for a restaurant (simulates network delay)
 */
export async function fetchRecentReviews(
  restaurantId: string,
  limit: number = 3,
  delay: number = 300
): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return getRecentReviews(restaurantId, limit);
}
