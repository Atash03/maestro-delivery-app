/**
 * Tests for Zustand stores
 *
 * Tests the auth, cart, and order stores for correct state management
 */

import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useOrderStore } from '@/stores/order-store';
import type {
  Address,
  Driver,
  MenuItem,
  Order,
  OrderStatus,
  Restaurant,
  SelectedCustomization,
  User,
} from '@/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  let storage: Record<string, string> = {};

  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key: string, value: string) => {
        storage[key] = value;
        return Promise.resolve();
      }),
      getItem: jest.fn((key: string) => {
        return Promise.resolve(storage[key] || null);
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        storage = {};
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => {
        return Promise.resolve(Object.keys(storage));
      }),
      multiGet: jest.fn((keys: string[]) => {
        return Promise.resolve(keys.map((key) => [key, storage[key] || null]));
      }),
      multiSet: jest.fn((keyValuePairs: [string, string][]) => {
        keyValuePairs.forEach(([key, value]) => {
          storage[key] = value;
        });
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: string[]) => {
        keys.forEach((key) => {
          delete storage[key];
        });
        return Promise.resolve();
      }),
    },
  };
});

// Helper to reset all stores between tests
function resetStores() {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isGuest: false,
    isLoading: false,
  });
  useCartStore.setState({
    items: [],
    restaurantId: null,
    restaurant: null,
  });
  useOrderStore.setState({
    currentOrder: null,
    orderHistory: [],
    isLoading: false,
  });
}

// ============================================================================
// Test Data Fixtures
// ============================================================================

const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg',
  addresses: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const createMockAddress = (overrides?: Partial<Address>): Address => ({
  id: 'addr-1',
  label: 'Home',
  street: '123 Main St',
  city: 'New York',
  zipCode: '10001',
  coordinates: { latitude: 40.7128, longitude: -74.006 },
  isDefault: false,
  ...overrides,
});

const createMockRestaurant = (overrides?: Partial<Restaurant>): Restaurant => ({
  id: 'restaurant-1',
  name: 'Test Restaurant',
  image: 'https://example.com/restaurant.jpg',
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: { min: 20, max: 30 },
  deliveryFee: 2.99,
  cuisine: ['Italian'],
  priceLevel: 2,
  isOpen: true,
  address: '456 Food St',
  ...overrides,
});

const createMockMenuItem = (overrides?: Partial<MenuItem>): MenuItem => ({
  id: 'item-1',
  restaurantId: 'restaurant-1',
  name: 'Test Item',
  description: 'A delicious test item',
  price: 9.99,
  image: 'https://example.com/item.jpg',
  category: 'Main Course',
  customizations: [],
  isAvailable: true,
  ...overrides,
});

const createMockDriver = (overrides?: Partial<Driver>): Driver => ({
  id: 'driver-1',
  name: 'Jane Driver',
  phone: '+1987654321',
  vehicle: { type: 'car', make: 'Toyota', model: 'Camry', color: 'Black' },
  rating: 4.8,
  ...overrides,
});

const createMockOrder = (overrides?: Partial<Order>): Order => ({
  id: 'order-1',
  userId: 'user-1',
  restaurant: createMockRestaurant(),
  items: [],
  status: 'PENDING' as OrderStatus,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  estimatedDelivery: new Date('2024-01-01T12:30:00'),
  address: createMockAddress(),
  paymentMethod: { id: 'pm-1', type: 'card', last4: '4242', brand: 'visa', isDefault: true },
  subtotal: 25.0,
  deliveryFee: 2.99,
  tax: 2.0,
  total: 29.99,
  ...overrides,
});

// ============================================================================
// Auth Store Tests
// ============================================================================

describe('Auth Store', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isGuest).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('signIn', () => {
    it('should set user and isAuthenticated to true', () => {
      const user = createMockUser();
      useAuthStore.getState().signIn(user);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isGuest).toBe(false);
    });
  });

  describe('signUp', () => {
    it('should set user and isAuthenticated to true', () => {
      const user = createMockUser();
      useAuthStore.getState().signUp(user);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isGuest).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should reset state to initial values', () => {
      const user = createMockUser();
      useAuthStore.getState().signIn(user);
      useAuthStore.getState().signOut();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isGuest).toBe(false);
    });
  });

  describe('setGuest', () => {
    it('should set isGuest to true and isAuthenticated to false', () => {
      useAuthStore.getState().setGuest();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isGuest).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile fields', () => {
      const user = createMockUser();
      useAuthStore.getState().signIn(user);
      useAuthStore.getState().updateProfile({ name: 'Jane Doe', email: 'jane@example.com' });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('Jane Doe');
      expect(state.user?.email).toBe('jane@example.com');
      expect(state.user?.phone).toBe(user.phone);
    });

    it('should not update if no user is signed in', () => {
      useAuthStore.getState().updateProfile({ name: 'Jane Doe' });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('address management', () => {
    beforeEach(() => {
      const user = createMockUser();
      useAuthStore.getState().signIn(user);
    });

    it('should add an address', () => {
      const address = createMockAddress();
      useAuthStore.getState().addAddress(address);

      const state = useAuthStore.getState();
      expect(state.user?.addresses).toHaveLength(1);
      expect(state.user?.addresses[0]).toEqual({ ...address, isDefault: true });
    });

    it('should set first address as default', () => {
      const address = createMockAddress({ isDefault: false });
      useAuthStore.getState().addAddress(address);

      const state = useAuthStore.getState();
      expect(state.user?.addresses[0].isDefault).toBe(true);
    });

    it('should update an address', () => {
      const address = createMockAddress();
      useAuthStore.getState().addAddress(address);
      useAuthStore.getState().updateAddress(address.id, { street: '789 New St' });

      const state = useAuthStore.getState();
      expect(state.user?.addresses[0].street).toBe('789 New St');
    });

    it('should remove an address', () => {
      const address = createMockAddress();
      useAuthStore.getState().addAddress(address);
      useAuthStore.getState().removeAddress(address.id);

      const state = useAuthStore.getState();
      expect(state.user?.addresses).toHaveLength(0);
    });

    it('should set default address', () => {
      const address1 = createMockAddress({ id: 'addr-1', isDefault: true });
      const address2 = createMockAddress({ id: 'addr-2', isDefault: false });
      useAuthStore.getState().addAddress(address1);
      useAuthStore.getState().addAddress(address2);
      useAuthStore.getState().setDefaultAddress('addr-2');

      const state = useAuthStore.getState();
      const addr1 = state.user?.addresses.find((a) => a.id === 'addr-1');
      const addr2 = state.user?.addresses.find((a) => a.id === 'addr-2');
      expect(addr1?.isDefault).toBe(false);
      expect(addr2?.isDefault).toBe(true);
    });
  });

  describe('convertGuestToUser', () => {
    it('should convert guest to authenticated user', () => {
      useAuthStore.getState().setGuest();
      const user = createMockUser();
      useAuthStore.getState().convertGuestToUser(user);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isGuest).toBe(false);
    });
  });
});

// ============================================================================
// Cart Store Tests
// ============================================================================

describe('Cart Store', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.restaurantId).toBeNull();
      expect(state.restaurant).toBeNull();
    });
  });

  describe('addItem', () => {
    it('should add an item to the cart', () => {
      const menuItem = createMockMenuItem();
      const restaurant = createMockRestaurant();
      useCartStore.getState().addItem(menuItem, 1, [], undefined, restaurant);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].menuItem).toEqual(menuItem);
      expect(state.items[0].quantity).toBe(1);
      expect(state.restaurantId).toBe(menuItem.restaurantId);
      expect(state.restaurant).toEqual(restaurant);
    });

    it('should calculate total price correctly', () => {
      const menuItem = createMockMenuItem({ price: 10.0 });
      useCartStore.getState().addItem(menuItem, 2, []);

      const state = useCartStore.getState();
      expect(state.items[0].totalPrice).toBe(20.0);
    });

    it('should include customization prices in total', () => {
      const menuItem = createMockMenuItem({ price: 10.0 });
      const customizations: SelectedCustomization[] = [
        {
          customizationId: 'c-1',
          customizationName: 'Size',
          selectedOptions: [{ optionId: 'o-1', optionName: 'Large', price: 2.0 }],
        },
      ];
      useCartStore.getState().addItem(menuItem, 1, customizations);

      const state = useCartStore.getState();
      expect(state.items[0].totalPrice).toBe(12.0);
    });

    it('should clear cart when adding from different restaurant', () => {
      const menuItem1 = createMockMenuItem({ id: 'item-1', restaurantId: 'r-1' });
      const menuItem2 = createMockMenuItem({ id: 'item-2', restaurantId: 'r-2' });

      useCartStore.getState().addItem(menuItem1, 1, []);
      useCartStore.getState().addItem(menuItem2, 1, []);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].menuItem.id).toBe('item-2');
      expect(state.restaurantId).toBe('r-2');
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', () => {
      const menuItem = createMockMenuItem();
      useCartStore.getState().addItem(menuItem, 1, []);
      const cartItemId = useCartStore.getState().items[0].id;
      useCartStore.getState().removeItem(cartItemId);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should clear restaurant info when cart becomes empty', () => {
      const menuItem = createMockMenuItem();
      const restaurant = createMockRestaurant();
      useCartStore.getState().addItem(menuItem, 1, [], undefined, restaurant);
      const cartItemId = useCartStore.getState().items[0].id;
      useCartStore.getState().removeItem(cartItemId);

      const state = useCartStore.getState();
      expect(state.restaurantId).toBeNull();
      expect(state.restaurant).toBeNull();
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const menuItem = createMockMenuItem({ price: 10.0 });
      useCartStore.getState().addItem(menuItem, 1, []);
      const cartItemId = useCartStore.getState().items[0].id;
      useCartStore.getState().updateQuantity(cartItemId, 3);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3);
      expect(state.items[0].totalPrice).toBe(30.0);
    });

    it('should remove item when quantity is zero', () => {
      const menuItem = createMockMenuItem();
      useCartStore.getState().addItem(menuItem, 1, []);
      const cartItemId = useCartStore.getState().items[0].id;
      useCartStore.getState().updateQuantity(cartItemId, 0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('updateItem', () => {
    it('should update item with new customizations', () => {
      const menuItem = createMockMenuItem({ price: 10.0 });
      useCartStore.getState().addItem(menuItem, 1, []);
      const cartItemId = useCartStore.getState().items[0].id;

      const newCustomizations: SelectedCustomization[] = [
        {
          customizationId: 'c-1',
          customizationName: 'Extras',
          selectedOptions: [{ optionId: 'o-1', optionName: 'Cheese', price: 1.5 }],
        },
      ];
      useCartStore.getState().updateItem(cartItemId, {
        quantity: 2,
        selectedCustomizations: newCustomizations,
      });

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[0].selectedCustomizations).toEqual(newCustomizations);
      expect(state.items[0].totalPrice).toBe(23.0); // (10 + 1.5) * 2
    });
  });

  describe('clearCart', () => {
    it('should clear all items and restaurant info', () => {
      const menuItem = createMockMenuItem();
      const restaurant = createMockRestaurant();
      useCartStore.getState().addItem(menuItem, 1, [], undefined, restaurant);
      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.restaurantId).toBeNull();
      expect(state.restaurant).toBeNull();
    });
  });

  describe('getSubtotal', () => {
    it('should return correct subtotal', () => {
      const menuItem1 = createMockMenuItem({ id: 'item-1', price: 10.0 });
      const menuItem2 = createMockMenuItem({ id: 'item-2', price: 15.0 });
      useCartStore.getState().addItem(menuItem1, 2, []);
      useCartStore.getState().addItem(menuItem2, 1, []);

      const subtotal = useCartStore.getState().getSubtotal();
      expect(subtotal).toBe(35.0);
    });
  });

  describe('getItemCount', () => {
    it('should return correct item count', () => {
      const menuItem1 = createMockMenuItem({ id: 'item-1' });
      const menuItem2 = createMockMenuItem({ id: 'item-2' });
      useCartStore.getState().addItem(menuItem1, 2, []);
      useCartStore.getState().addItem(menuItem2, 3, []);

      const count = useCartStore.getState().getItemCount();
      expect(count).toBe(5);
    });
  });

  describe('canAddFromRestaurant', () => {
    it('should return true for empty cart', () => {
      expect(useCartStore.getState().canAddFromRestaurant('any-restaurant')).toBe(true);
    });

    it('should return true for same restaurant', () => {
      const menuItem = createMockMenuItem({ restaurantId: 'r-1' });
      useCartStore.getState().addItem(menuItem, 1, []);

      expect(useCartStore.getState().canAddFromRestaurant('r-1')).toBe(true);
    });

    it('should return false for different restaurant', () => {
      const menuItem = createMockMenuItem({ restaurantId: 'r-1' });
      useCartStore.getState().addItem(menuItem, 1, []);

      expect(useCartStore.getState().canAddFromRestaurant('r-2')).toBe(false);
    });
  });
});

// ============================================================================
// Order Store Tests
// ============================================================================

describe('Order Store', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useOrderStore.getState();
      expect(state.currentOrder).toBeNull();
      expect(state.orderHistory).toEqual([]);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('createOrder', () => {
    it('should set current order and add to history', () => {
      const order = createMockOrder();
      useOrderStore.getState().createOrder(order);

      const state = useOrderStore.getState();
      expect(state.currentOrder).toEqual(order);
      expect(state.orderHistory).toHaveLength(1);
      expect(state.orderHistory[0]).toEqual(order);
    });

    it('should prepend new orders to history', () => {
      const order1 = createMockOrder({ id: 'order-1' });
      const order2 = createMockOrder({ id: 'order-2' });
      useOrderStore.getState().createOrder(order1);
      useOrderStore.getState().createOrder(order2);

      const state = useOrderStore.getState();
      expect(state.orderHistory[0].id).toBe('order-2');
      expect(state.orderHistory[1].id).toBe('order-1');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status in current order', () => {
      const order = createMockOrder({ status: 'PENDING' as OrderStatus });
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().updateOrderStatus(order.id, 'CONFIRMED' as OrderStatus);

      const state = useOrderStore.getState();
      expect(state.currentOrder?.status).toBe('CONFIRMED');
    });

    it('should update status in order history', () => {
      const order = createMockOrder({ status: 'PENDING' as OrderStatus });
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().updateOrderStatus(order.id, 'PREPARING' as OrderStatus);

      const state = useOrderStore.getState();
      expect(state.orderHistory[0].status).toBe('PREPARING');
    });
  });

  describe('assignDriver', () => {
    it('should assign driver to order', () => {
      const order = createMockOrder();
      const driver = createMockDriver();
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().assignDriver(order.id, driver);

      const state = useOrderStore.getState();
      expect(state.currentOrder?.driver).toEqual(driver);
      expect(state.orderHistory[0].driver).toEqual(driver);
    });
  });

  describe('updateDriverLocation', () => {
    it('should update driver location', () => {
      const order = createMockOrder();
      const driver = createMockDriver();
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().assignDriver(order.id, driver);

      const newLocation = { latitude: 40.7, longitude: -74.0 };
      useOrderStore.getState().updateDriverLocation(order.id, newLocation);

      const state = useOrderStore.getState();
      expect(state.currentOrder?.driver?.currentLocation).toEqual(newLocation);
    });
  });

  describe('completeOrder', () => {
    it('should mark order as delivered', () => {
      const order = createMockOrder({ status: 'ON_THE_WAY' as OrderStatus });
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().completeOrder(order.id);

      const state = useOrderStore.getState();
      expect(state.currentOrder?.status).toBe('DELIVERED');
      expect(state.currentOrder?.actualDelivery).toBeDefined();
    });
  });

  describe('cancelOrder', () => {
    it('should mark order as cancelled', () => {
      const order = createMockOrder({ status: 'PENDING' as OrderStatus });
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().cancelOrder(order.id);

      const state = useOrderStore.getState();
      expect(state.currentOrder?.status).toBe('CANCELLED');
    });
  });

  describe('getOrderById', () => {
    it('should return current order if matching', () => {
      const order = createMockOrder({ id: 'order-1' });
      useOrderStore.getState().createOrder(order);

      const result = useOrderStore.getState().getOrderById('order-1');
      expect(result?.id).toBe('order-1');
    });

    it('should return order from history', () => {
      const order1 = createMockOrder({ id: 'order-1' });
      const order2 = createMockOrder({ id: 'order-2' });
      useOrderStore.getState().createOrder(order1);
      useOrderStore.getState().createOrder(order2);
      useOrderStore.getState().clearCurrentOrder();

      const result = useOrderStore.getState().getOrderById('order-1');
      expect(result?.id).toBe('order-1');
    });

    it('should return undefined for non-existent order', () => {
      const result = useOrderStore.getState().getOrderById('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getActiveOrders', () => {
    it('should return orders with active statuses', () => {
      const activeOrder = createMockOrder({ id: 'active', status: 'PREPARING' as OrderStatus });
      const deliveredOrder = createMockOrder({
        id: 'delivered',
        status: 'DELIVERED' as OrderStatus,
      });
      useOrderStore.getState().createOrder(activeOrder);
      useOrderStore.getState().createOrder(deliveredOrder);

      const activeOrders = useOrderStore.getState().getActiveOrders();
      expect(activeOrders).toHaveLength(1);
      expect(activeOrders[0].id).toBe('active');
    });
  });

  describe('getPastOrders', () => {
    it('should return orders with completed statuses', () => {
      const activeOrder = createMockOrder({ id: 'active', status: 'PREPARING' as OrderStatus });
      const deliveredOrder = createMockOrder({
        id: 'delivered',
        status: 'DELIVERED' as OrderStatus,
      });
      const cancelledOrder = createMockOrder({
        id: 'cancelled',
        status: 'CANCELLED' as OrderStatus,
      });
      useOrderStore.getState().createOrder(activeOrder);
      useOrderStore.getState().createOrder(deliveredOrder);
      useOrderStore.getState().createOrder(cancelledOrder);

      const pastOrders = useOrderStore.getState().getPastOrders();
      expect(pastOrders).toHaveLength(2);
      expect(pastOrders.map((o) => o.id)).toContain('delivered');
      expect(pastOrders.map((o) => o.id)).toContain('cancelled');
    });
  });

  describe('clearCurrentOrder', () => {
    it('should clear current order without affecting history', () => {
      const order = createMockOrder();
      useOrderStore.getState().createOrder(order);
      useOrderStore.getState().clearCurrentOrder();

      const state = useOrderStore.getState();
      expect(state.currentOrder).toBeNull();
      expect(state.orderHistory).toHaveLength(1);
    });
  });

  describe('fetchOrderHistory', () => {
    it('should set and reset loading state', async () => {
      const fetchPromise = useOrderStore.getState().fetchOrderHistory();

      // Loading state should be set to true (async operation)
      // After completion, it should be false
      await fetchPromise;

      const state = useOrderStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });
});
