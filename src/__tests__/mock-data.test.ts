/**
 * Tests for mock data
 */

import {
  authenticateUser,
  defaultUser,
  fetchMenuItems,
  fetchOrders,
  fetchRestaurantById,
  fetchRestaurants,
  getActiveOrders,
  getCategoryById,
  getCategoryByName,
  getDefaultPaymentMethod,
  getDriverById,
  getEstimatedTimeRemaining,
  getMenuByCategory,
  getMenuItemById,
  getMenuItemsByRestaurant,
  getNextOrderStatus,
  getOpenRestaurants,
  getOrderById,
  getOrderStatusText,
  getOrdersByStatus,
  getOrdersByUser,
  getPastOrders,
  getPopularCategories,
  getPopularItems,
  getRandomDelay,
  getRandomDriver,
  getRestaurantById,
  getRestaurantsByCuisine,
  getUserByEmail,
  getUserById,
  // Categories
  mockCategories,
  mockDietaryFilters,
  mockDrivers,
  mockFeaturedCollections,
  // Menu Items
  mockMenuItems,
  // Orders
  mockOrders,
  mockPaymentMethods,
  // Restaurants
  mockRestaurants,
  mockSortOptions,
  // Users
  mockUsers,
  // Utilities
  NETWORK_DELAYS,
  orderStatusSequence,
  searchCategories,
  searchMenuItems,
  searchRestaurantsByName,
  simulateDriverMovement,
  simulateNetworkDelay,
  withNetworkDelay,
} from '@/data/mock';
import type { Category, Driver, MenuItem, Order, Restaurant, User } from '@/types';
import { OrderStatus } from '@/types';

// ============================================================================
// Restaurant Tests
// ============================================================================

describe('Mock Restaurants', () => {
  describe('mockRestaurants', () => {
    it('should have at least 15 restaurants', () => {
      expect(mockRestaurants.length).toBeGreaterThanOrEqual(15);
    });

    it('should have valid restaurant structure', () => {
      mockRestaurants.forEach((restaurant: Restaurant) => {
        expect(restaurant.id).toBeDefined();
        expect(restaurant.name).toBeDefined();
        expect(restaurant.image).toBeDefined();
        expect(restaurant.rating).toBeGreaterThanOrEqual(0);
        expect(restaurant.rating).toBeLessThanOrEqual(5);
        expect(restaurant.reviewCount).toBeGreaterThanOrEqual(0);
        expect(restaurant.deliveryTime).toBeDefined();
        expect(restaurant.deliveryTime.min).toBeLessThanOrEqual(restaurant.deliveryTime.max);
        expect(restaurant.deliveryFee).toBeGreaterThanOrEqual(0);
        expect(restaurant.cuisine).toBeInstanceOf(Array);
        expect(restaurant.cuisine.length).toBeGreaterThan(0);
        expect([1, 2, 3, 4]).toContain(restaurant.priceLevel);
        expect(typeof restaurant.isOpen).toBe('boolean');
        expect(restaurant.address).toBeDefined();
      });
    });

    it('should have unique IDs', () => {
      const ids = mockRestaurants.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have both open and closed restaurants', () => {
      const openCount = mockRestaurants.filter((r) => r.isOpen).length;
      const closedCount = mockRestaurants.filter((r) => !r.isOpen).length;
      expect(openCount).toBeGreaterThan(0);
      expect(closedCount).toBeGreaterThan(0);
    });
  });

  describe('getRestaurantById', () => {
    it('should return restaurant for valid ID', () => {
      const restaurant = getRestaurantById('rest-001');
      expect(restaurant).toBeDefined();
      expect(restaurant?.id).toBe('rest-001');
    });

    it('should return undefined for invalid ID', () => {
      const restaurant = getRestaurantById('invalid-id');
      expect(restaurant).toBeUndefined();
    });
  });

  describe('getRestaurantsByCuisine', () => {
    it('should return restaurants matching cuisine', () => {
      const italianRestaurants = getRestaurantsByCuisine('Italian');
      expect(italianRestaurants.length).toBeGreaterThan(0);
      italianRestaurants.forEach((r) => {
        expect(r.cuisine.some((c) => c.toLowerCase() === 'italian')).toBeTruthy();
      });
    });

    it('should be case insensitive', () => {
      const result1 = getRestaurantsByCuisine('PIZZA');
      const result2 = getRestaurantsByCuisine('pizza');
      expect(result1.length).toBe(result2.length);
    });

    it('should return empty array for non-existent cuisine', () => {
      const restaurants = getRestaurantsByCuisine('NonExistentCuisine');
      expect(restaurants).toEqual([]);
    });
  });

  describe('getOpenRestaurants', () => {
    it('should return only open restaurants', () => {
      const openRestaurants = getOpenRestaurants();
      openRestaurants.forEach((r) => {
        expect(r.isOpen).toBe(true);
      });
    });
  });

  describe('searchRestaurantsByName', () => {
    it('should find restaurants by partial name match', () => {
      const results = searchRestaurantsByName('Bella');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Bella');
    });

    it('should be case insensitive', () => {
      const results = searchRestaurantsByName('BURGER');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('fetchRestaurants', () => {
    it('should return restaurants after delay', async () => {
      const start = Date.now();
      const restaurants = await fetchRestaurants(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(restaurants).toEqual(mockRestaurants);
    });
  });

  describe('fetchRestaurantById', () => {
    it('should return restaurant after delay', async () => {
      const restaurant = await fetchRestaurantById('rest-001', 50);
      expect(restaurant).toBeDefined();
      expect(restaurant?.id).toBe('rest-001');
    });
  });
});

// ============================================================================
// Menu Item Tests
// ============================================================================

describe('Mock Menu Items', () => {
  describe('mockMenuItems', () => {
    it('should have menu items for multiple restaurants', () => {
      const restaurantIds = new Set(mockMenuItems.map((item) => item.restaurantId));
      expect(restaurantIds.size).toBeGreaterThan(5);
    });

    it('should have valid menu item structure', () => {
      mockMenuItems.forEach((item: MenuItem) => {
        expect(item.id).toBeDefined();
        expect(item.restaurantId).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.description).toBeDefined();
        expect(item.price).toBeGreaterThan(0);
        expect(item.category).toBeDefined();
        expect(item.customizations).toBeInstanceOf(Array);
        expect(typeof item.isAvailable).toBe('boolean');
      });
    });

    it('should have unique IDs', () => {
      const ids = mockMenuItems.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have some popular items', () => {
      const popularItems = mockMenuItems.filter((item) => item.isPopular);
      expect(popularItems.length).toBeGreaterThan(0);
    });

    it('should have some spicy items', () => {
      const spicyItems = mockMenuItems.filter((item) => item.isSpicy);
      expect(spicyItems.length).toBeGreaterThan(0);
    });
  });

  describe('getMenuItemsByRestaurant', () => {
    it('should return items for a valid restaurant', () => {
      const items = getMenuItemsByRestaurant('rest-001');
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(item.restaurantId).toBe('rest-001');
      });
    });

    it('should return empty array for invalid restaurant', () => {
      const items = getMenuItemsByRestaurant('invalid-id');
      expect(items).toEqual([]);
    });
  });

  describe('getMenuItemById', () => {
    it('should return item for valid ID', () => {
      const item = getMenuItemById('menu-001-01');
      expect(item).toBeDefined();
      expect(item?.id).toBe('menu-001-01');
    });

    it('should return undefined for invalid ID', () => {
      const item = getMenuItemById('invalid-id');
      expect(item).toBeUndefined();
    });
  });

  describe('getMenuByCategory', () => {
    it('should group items by category', () => {
      const menu = getMenuByCategory('rest-001');
      expect(Object.keys(menu).length).toBeGreaterThan(0);
      Object.entries(menu).forEach(([category, items]) => {
        expect(category).toBeDefined();
        expect(items.length).toBeGreaterThan(0);
        items.forEach((item) => {
          expect(item.category).toBe(category);
        });
      });
    });
  });

  describe('getPopularItems', () => {
    it('should return only popular items for restaurant', () => {
      const items = getPopularItems('rest-001');
      items.forEach((item) => {
        expect(item.isPopular).toBe(true);
        expect(item.restaurantId).toBe('rest-001');
      });
    });
  });

  describe('searchMenuItems', () => {
    it('should find items by name', () => {
      const results = searchMenuItems('Pizza');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find items by description', () => {
      const results = searchMenuItems('mozzarella');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('fetchMenuItems', () => {
    it('should return menu items after delay', async () => {
      const items = await fetchMenuItems('rest-001', 50);
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(item.restaurantId).toBe('rest-001');
      });
    });
  });
});

// ============================================================================
// User Tests
// ============================================================================

describe('Mock Users', () => {
  describe('mockUsers', () => {
    it('should have at least one user', () => {
      expect(mockUsers.length).toBeGreaterThan(0);
    });

    it('should have valid user structure', () => {
      mockUsers.forEach((user: User) => {
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.phone).toBeDefined();
        expect(user.addresses).toBeInstanceOf(Array);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should have users with addresses', () => {
      const usersWithAddresses = mockUsers.filter((user) => user.addresses.length > 0);
      expect(usersWithAddresses.length).toBeGreaterThan(0);
    });
  });

  describe('defaultUser', () => {
    it('should be the first user', () => {
      expect(defaultUser).toBe(mockUsers[0]);
    });
  });

  describe('getUserById', () => {
    it('should return user for valid ID', () => {
      const user = getUserById('user-001');
      expect(user).toBeDefined();
      expect(user?.id).toBe('user-001');
    });

    it('should return undefined for invalid ID', () => {
      const user = getUserById('invalid-id');
      expect(user).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should find user by email', () => {
      const user = getUserByEmail('john.smith@email.com');
      expect(user).toBeDefined();
    });

    it('should be case insensitive', () => {
      const user = getUserByEmail('JOHN.SMITH@EMAIL.COM');
      expect(user).toBeDefined();
    });
  });

  describe('mockPaymentMethods', () => {
    it('should have multiple payment methods', () => {
      expect(mockPaymentMethods.length).toBeGreaterThan(1);
    });

    it('should have exactly one default payment method', () => {
      const defaults = mockPaymentMethods.filter((pm) => pm.isDefault);
      expect(defaults.length).toBe(1);
    });

    it('should have both card and cash options', () => {
      const cards = mockPaymentMethods.filter((pm) => pm.type === 'card');
      const cash = mockPaymentMethods.filter((pm) => pm.type === 'cash');
      expect(cards.length).toBeGreaterThan(0);
      expect(cash.length).toBeGreaterThan(0);
    });
  });

  describe('getDefaultPaymentMethod', () => {
    it('should return the default payment method', () => {
      const defaultPm = getDefaultPaymentMethod();
      expect(defaultPm).toBeDefined();
      expect(defaultPm?.isDefault).toBe(true);
    });
  });

  describe('mockDrivers', () => {
    it('should have multiple drivers', () => {
      expect(mockDrivers.length).toBeGreaterThan(1);
    });

    it('should have valid driver structure', () => {
      mockDrivers.forEach((driver: Driver) => {
        expect(driver.id).toBeDefined();
        expect(driver.name).toBeDefined();
        expect(driver.phone).toBeDefined();
        expect(driver.vehicle).toBeDefined();
        expect(driver.rating).toBeGreaterThanOrEqual(0);
        expect(driver.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have drivers with different vehicle types', () => {
      const vehicleTypes = new Set(mockDrivers.map((d) => d.vehicle.type));
      expect(vehicleTypes.size).toBeGreaterThan(1);
    });
  });

  describe('getDriverById', () => {
    it('should return driver for valid ID', () => {
      const driver = getDriverById('driver-001');
      expect(driver).toBeDefined();
      expect(driver?.id).toBe('driver-001');
    });
  });

  describe('getRandomDriver', () => {
    it('should return a valid driver', () => {
      const driver = getRandomDriver();
      expect(driver).toBeDefined();
      expect(mockDrivers).toContain(driver);
    });
  });

  describe('simulateDriverMovement', () => {
    it('should move driver closer to destination', () => {
      const driver = mockDrivers[0];
      const destination = { latitude: 40.8, longitude: -73.9 };
      const movedDriver = simulateDriverMovement(driver, destination);

      // Driver should have moved closer (not exact, but direction should be correct)
      expect(movedDriver.currentLocation).toBeDefined();
      if (driver.currentLocation && movedDriver.currentLocation) {
        const originalDistance =
          Math.abs(destination.latitude - driver.currentLocation.latitude) +
          Math.abs(destination.longitude - driver.currentLocation.longitude);
        const newDistance =
          Math.abs(destination.latitude - movedDriver.currentLocation.latitude) +
          Math.abs(destination.longitude - movedDriver.currentLocation.longitude);
        expect(newDistance).toBeLessThan(originalDistance);
      }
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate existing user', async () => {
      const user = await authenticateUser('john.smith@email.com', 'password', 50);
      expect(user).toBeDefined();
    });

    it('should return null for non-existent user', async () => {
      const user = await authenticateUser('nonexistent@email.com', 'password', 50);
      expect(user).toBeNull();
    });
  });
});

// ============================================================================
// Order Tests
// ============================================================================

describe('Mock Orders', () => {
  describe('mockOrders', () => {
    it('should have multiple orders', () => {
      expect(mockOrders.length).toBeGreaterThan(1);
    });

    it('should have valid order structure', () => {
      mockOrders.forEach((order: Order) => {
        expect(order.id).toBeDefined();
        expect(order.userId).toBeDefined();
        expect(order.restaurant).toBeDefined();
        expect(order.items).toBeInstanceOf(Array);
        expect(order.items.length).toBeGreaterThan(0);
        expect(Object.values(OrderStatus)).toContain(order.status);
        expect(order.createdAt).toBeInstanceOf(Date);
        expect(order.updatedAt).toBeInstanceOf(Date);
        expect(order.estimatedDelivery).toBeInstanceOf(Date);
        expect(order.address).toBeDefined();
        expect(order.paymentMethod).toBeDefined();
        expect(order.subtotal).toBeGreaterThan(0);
        expect(order.deliveryFee).toBeGreaterThanOrEqual(0);
        expect(order.tax).toBeGreaterThanOrEqual(0);
        expect(order.total).toBeGreaterThan(0);
      });
    });

    it('should have orders with various statuses', () => {
      const statuses = new Set(mockOrders.map((order) => order.status));
      expect(statuses.size).toBeGreaterThan(2);
    });

    it('should have at least one delivered order', () => {
      const delivered = mockOrders.filter((order) => order.status === OrderStatus.DELIVERED);
      expect(delivered.length).toBeGreaterThan(0);
    });

    it('should have at least one active order', () => {
      const activeStatuses = [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.PICKED_UP,
        OrderStatus.ON_THE_WAY,
      ];
      const active = mockOrders.filter((order) => activeStatuses.includes(order.status));
      expect(active.length).toBeGreaterThan(0);
    });
  });

  describe('getOrdersByUser', () => {
    it('should return orders for a user', () => {
      const orders = getOrdersByUser('user-001');
      expect(orders.length).toBeGreaterThan(0);
      orders.forEach((order) => {
        expect(order.userId).toBe('user-001');
      });
    });

    it('should return empty array for user with no orders', () => {
      const orders = getOrdersByUser('nonexistent-user');
      expect(orders).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('should return order for valid ID', () => {
      const order = getOrderById('order-001');
      expect(order).toBeDefined();
      expect(order?.id).toBe('order-001');
    });

    it('should return undefined for invalid ID', () => {
      const order = getOrderById('invalid-id');
      expect(order).toBeUndefined();
    });
  });

  describe('getActiveOrders', () => {
    it('should return only active orders', () => {
      const activeOrders = getActiveOrders('user-001');
      activeOrders.forEach((order) => {
        expect(order.status).not.toBe(OrderStatus.DELIVERED);
        expect(order.status).not.toBe(OrderStatus.CANCELLED);
      });
    });
  });

  describe('getPastOrders', () => {
    it('should return only past orders (delivered or cancelled)', () => {
      const pastOrders = getPastOrders('user-001');
      pastOrders.forEach((order) => {
        expect([OrderStatus.DELIVERED, OrderStatus.CANCELLED]).toContain(order.status);
      });
    });
  });

  describe('getOrdersByStatus', () => {
    it('should return orders with specific status', () => {
      const deliveredOrders = getOrdersByStatus('user-001', OrderStatus.DELIVERED);
      deliveredOrders.forEach((order) => {
        expect(order.status).toBe(OrderStatus.DELIVERED);
      });
    });
  });

  describe('fetchOrders', () => {
    it('should return orders after delay', async () => {
      const orders = await fetchOrders('user-001', 50);
      expect(orders.length).toBeGreaterThan(0);
    });
  });

  describe('orderStatusSequence', () => {
    it('should have correct status sequence', () => {
      expect(orderStatusSequence).toEqual([
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.PICKED_UP,
        OrderStatus.ON_THE_WAY,
        OrderStatus.DELIVERED,
      ]);
    });
  });

  describe('getNextOrderStatus', () => {
    it('should return next status in sequence', () => {
      expect(getNextOrderStatus(OrderStatus.PENDING)).toBe(OrderStatus.CONFIRMED);
      expect(getNextOrderStatus(OrderStatus.PREPARING)).toBe(OrderStatus.READY);
    });

    it('should return null for DELIVERED', () => {
      expect(getNextOrderStatus(OrderStatus.DELIVERED)).toBeNull();
    });

    it('should return null for CANCELLED', () => {
      expect(getNextOrderStatus(OrderStatus.CANCELLED)).toBeNull();
    });
  });

  describe('getOrderStatusText', () => {
    it('should return display text for each status', () => {
      Object.values(OrderStatus).forEach((status) => {
        const text = getOrderStatusText(status);
        expect(text).toBeDefined();
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getEstimatedTimeRemaining', () => {
    it('should return non-negative number', () => {
      const order = mockOrders[0];
      const time = getEstimatedTimeRemaining(order);
      expect(time).toBeGreaterThanOrEqual(0);
    });
  });
});

// ============================================================================
// Category Tests
// ============================================================================

describe('Mock Categories', () => {
  describe('mockCategories', () => {
    it('should have multiple categories', () => {
      expect(mockCategories.length).toBeGreaterThan(10);
    });

    it('should have valid category structure', () => {
      mockCategories.forEach((category: Category) => {
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(category.icon).toBeDefined();
      });
    });

    it('should have unique IDs', () => {
      const ids = mockCategories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have "All" as first category', () => {
      expect(mockCategories[0].name).toBe('All');
    });
  });

  describe('getCategoryById', () => {
    it('should return category for valid ID', () => {
      const category = getCategoryById('cat-pizza');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Pizza');
    });
  });

  describe('getCategoryByName', () => {
    it('should find category by name', () => {
      const category = getCategoryByName('Pizza');
      expect(category).toBeDefined();
      expect(category?.id).toBe('cat-pizza');
    });

    it('should be case insensitive', () => {
      const category = getCategoryByName('PIZZA');
      expect(category).toBeDefined();
    });
  });

  describe('searchCategories', () => {
    it('should find categories by partial match', () => {
      const results = searchCategories('burg');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getPopularCategories', () => {
    it('should return first 10 categories', () => {
      const popular = getPopularCategories();
      expect(popular.length).toBe(10);
    });
  });

  describe('mockFeaturedCollections', () => {
    it('should have multiple collections', () => {
      expect(mockFeaturedCollections.length).toBeGreaterThan(0);
    });

    it('should have valid collection structure', () => {
      mockFeaturedCollections.forEach((collection) => {
        expect(collection.id).toBeDefined();
        expect(collection.title).toBeDefined();
        expect(collection.subtitle).toBeDefined();
        expect(collection.image).toBeDefined();
        expect(collection.categoryIds).toBeInstanceOf(Array);
        expect(collection.categoryIds.length).toBeGreaterThan(0);
      });
    });
  });

  describe('mockDietaryFilters', () => {
    it('should have multiple dietary filters', () => {
      expect(mockDietaryFilters.length).toBeGreaterThan(0);
    });

    it('should include common dietary options', () => {
      const names = mockDietaryFilters.map((f) => f.name);
      expect(names).toContain('Vegetarian');
      expect(names).toContain('Vegan');
      expect(names).toContain('Gluten-Free');
    });
  });

  describe('mockSortOptions', () => {
    it('should have multiple sort options', () => {
      expect(mockSortOptions.length).toBeGreaterThan(0);
    });

    it('should have Recommended as first option', () => {
      expect(mockSortOptions[0].name).toBe('Recommended');
    });
  });
});

// ============================================================================
// Network Delay Utility Tests
// ============================================================================

describe('Network Delay Utilities', () => {
  describe('NETWORK_DELAYS', () => {
    it('should have valid delay ranges', () => {
      expect(NETWORK_DELAYS.FAST.min).toBeLessThan(NETWORK_DELAYS.FAST.max);
      expect(NETWORK_DELAYS.NORMAL.min).toBeLessThan(NETWORK_DELAYS.NORMAL.max);
      expect(NETWORK_DELAYS.SLOW.min).toBeLessThan(NETWORK_DELAYS.SLOW.max);
    });
  });

  describe('getRandomDelay', () => {
    it('should return value within range', () => {
      const range = { min: 100, max: 200 };
      for (let i = 0; i < 10; i++) {
        const delay = getRandomDelay(range);
        expect(delay).toBeGreaterThanOrEqual(range.min);
        expect(delay).toBeLessThanOrEqual(range.max);
      }
    });
  });

  describe('simulateNetworkDelay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await simulateNetworkDelay({ min: 50, max: 100 });
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(45);
    });
  });

  describe('withNetworkDelay', () => {
    it('should execute function after delay', async () => {
      const start = Date.now();
      const result = await withNetworkDelay(() => 'test', { min: 50, max: 100 });
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(45);
      expect(result).toBe('test');
    });
  });
});
