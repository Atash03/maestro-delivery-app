/**
 * Tests for the notification utilities
 *
 * Tests the push notification placeholder functionality including:
 * - Permission request handling
 * - Mock notification triggers for order events
 * - In-app notification toast system
 * - Notification scheduling
 * - Utility functions
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
}));

// AsyncStorage is mocked globally via jest.config.js moduleNameMapper

import type { Order } from '@/types';
import { OrderStatus } from '@/types';
import {
  areNotificationsEnabled,
  cancelAllScheduledNotifications,
  cancelScheduledNotification,
  clearAllNotifications,
  clearNotificationListeners,
  createInAppNotification,
  createNotification,
  DEFAULT_NOTIFICATION_DURATION,
  dismissCurrentNotification,
  formatNotificationTime,
  generateNotificationId,
  getCurrentNotification,
  getNotificationColor,
  getNotificationIcon,
  getNotificationPermissionStatus,
  getNotificationQueue,
  getScheduledNotifications,
  handleNotificationPress,
  MAX_NOTIFICATION_DURATION,
  MIN_NOTIFICATION_DURATION,
  ORDER_NOTIFICATION_MESSAGES,
  registerNotificationListeners,
  requestNotificationPermissions,
  resetNotificationPermissions,
  scheduleNotification,
  showInAppNotification,
  triggerDriverAssignedNotification,
  triggerDriverNearbyNotification,
  triggerGeneralNotification,
  triggerOrderConfirmedNotification,
  triggerOrderDeliveredNotification,
  triggerPromoNotification,
} from '@/utils/notifications';

// ============================================================================
// Test Setup
// ============================================================================

// Mock order for testing
const mockOrder: Order = {
  id: 'order_123',
  userId: 'user_1',
  restaurant: {
    id: 'rest_1',
    name: 'Test Restaurant',
    image: 'https://example.com/image.jpg',
    rating: 4.5,
    reviewCount: 100,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 2.99,
    cuisine: ['Italian'],
    priceLevel: 2,
    isOpen: true,
    address: '123 Test St',
  },
  items: [],
  status: OrderStatus.CONFIRMED,
  createdAt: new Date(),
  updatedAt: new Date(),
  estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
  address: {
    id: 'addr_1',
    label: 'Home',
    street: '456 Delivery St',
    city: 'Test City',
    zipCode: '12345',
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    isDefault: true,
  },
  paymentMethod: {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    isDefault: true,
  },
  subtotal: 25.0,
  deliveryFee: 2.99,
  tax: 2.25,
  total: 30.24,
  driver: {
    id: 'driver_1',
    name: 'John Driver',
    phone: '+1234567890',
    vehicle: { type: 'car', make: 'Toyota', model: 'Camry', color: 'Silver' },
    rating: 4.8,
  },
};

// Reset state before each test
beforeEach(() => {
  resetNotificationPermissions();
  clearAllNotifications();
  clearNotificationListeners();
  cancelAllScheduledNotifications();
});

// ============================================================================
// Permission Tests
// ============================================================================

describe('Notification Permissions', () => {
  describe('getNotificationPermissionStatus', () => {
    it('returns initial permission status as not granted', () => {
      const status = getNotificationPermissionStatus();

      expect(status.granted).toBe(false);
      expect(status.denied).toBe(false);
      expect(status.canAskAgain).toBe(true);
    });

    it('returns a copy of the status (not reference)', () => {
      const status1 = getNotificationPermissionStatus();
      const status2 = getNotificationPermissionStatus();

      expect(status1).not.toBe(status2);
      expect(status1).toEqual(status2);
    });
  });

  describe('requestNotificationPermissions', () => {
    it('grants permission after request', async () => {
      const status = await requestNotificationPermissions();

      expect(status.granted).toBe(true);
      expect(status.denied).toBe(false);
    });

    it('sets provisional to true on iOS', async () => {
      const status = await requestNotificationPermissions();

      expect(status.provisional).toBe(true);
    });

    it('updates areNotificationsEnabled after grant', async () => {
      expect(areNotificationsEnabled()).toBe(false);

      await requestNotificationPermissions();

      expect(areNotificationsEnabled()).toBe(true);
    });
  });

  describe('areNotificationsEnabled', () => {
    it('returns false when not granted', () => {
      expect(areNotificationsEnabled()).toBe(false);
    });

    it('returns true after permissions granted', async () => {
      await requestNotificationPermissions();

      expect(areNotificationsEnabled()).toBe(true);
    });
  });

  describe('resetNotificationPermissions', () => {
    it('resets permission status to initial state', async () => {
      await requestNotificationPermissions();
      expect(areNotificationsEnabled()).toBe(true);

      resetNotificationPermissions();

      expect(areNotificationsEnabled()).toBe(false);
      const status = getNotificationPermissionStatus();
      expect(status.granted).toBe(false);
      expect(status.canAskAgain).toBe(true);
    });
  });
});

// ============================================================================
// Notification Listener Tests
// ============================================================================

describe('Notification Listeners', () => {
  describe('registerNotificationListeners', () => {
    it('registers onReceive listener', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      const notification = createNotification('general', {
        title: 'Test',
        body: 'Test body',
      });
      showInAppNotification(createInAppNotification(notification));

      expect(onReceive).toHaveBeenCalledTimes(1);
    });

    it('returns cleanup function', () => {
      const onReceive = jest.fn();
      const cleanup = registerNotificationListeners({ onReceive });

      expect(typeof cleanup).toBe('function');

      // First notification should trigger listener
      const notification1 = createNotification('general', {
        title: 'Test 1',
        body: 'Test body 1',
      });
      showInAppNotification(createInAppNotification(notification1));
      expect(onReceive).toHaveBeenCalledTimes(1);

      // Cleanup the listener
      cleanup();

      // After cleanup, listener should not fire for new notifications
      clearAllNotifications();
      const notification2 = createNotification('general', {
        title: 'Test 2',
        body: 'Test body 2',
      });
      showInAppNotification(createInAppNotification(notification2));

      // Should still be 1 (not called again after cleanup)
      expect(onReceive).toHaveBeenCalledTimes(1);
    });

    it('registers multiple listeners', () => {
      const onReceive = jest.fn();
      const onDismiss = jest.fn();
      const onPress = jest.fn();

      registerNotificationListeners({ onReceive, onDismiss, onPress });

      const notification = createNotification('general', {
        title: 'Test',
        body: 'Test body',
      });
      const inAppNotification = createInAppNotification(notification);
      showInAppNotification(inAppNotification);

      expect(onReceive).toHaveBeenCalledTimes(1);

      // Dismiss the notification
      dismissCurrentNotification();
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearNotificationListeners', () => {
    it('clears all registered listeners', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      clearNotificationListeners();

      const notification = createNotification('general', {
        title: 'Test',
        body: 'Test body',
      });
      showInAppNotification(createInAppNotification(notification));

      expect(onReceive).not.toHaveBeenCalled();
    });
  });
});

// ============================================================================
// Notification Generation Tests
// ============================================================================

describe('Notification Generation', () => {
  describe('generateNotificationId', () => {
    it('generates unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateNotificationId());
      }

      expect(ids.size).toBe(100);
    });

    it('generates IDs with correct prefix', () => {
      const id = generateNotificationId();

      expect(id.startsWith('notification_')).toBe(true);
    });
  });

  describe('createNotification', () => {
    it('creates notification with correct type', () => {
      const notification = createNotification('order_confirmed');

      expect(notification.type).toBe('order_confirmed');
    });

    it('creates notification with default messages for order_confirmed', () => {
      const notification = createNotification('order_confirmed');

      expect(notification.title).toBe('Order Confirmed!');
      expect(notification.body).toContain('being prepared');
    });

    it('creates notification with default messages for driver_assigned', () => {
      const notification = createNotification('driver_assigned');

      expect(notification.title).toBe('Driver Assigned');
    });

    it('creates notification with default messages for driver_nearby', () => {
      const notification = createNotification('driver_nearby');

      expect(notification.title).toBe('Driver Nearby');
    });

    it('creates notification with default messages for order_delivered', () => {
      const notification = createNotification('order_delivered');

      expect(notification.title).toBe('Order Delivered!');
      expect(notification.body).toContain('Enjoy');
    });

    it('creates notification with default messages for promo', () => {
      const notification = createNotification('promo');

      expect(notification.title).toBe('Special Offer');
    });

    it('creates notification with default messages for general', () => {
      const notification = createNotification('general');

      expect(notification.title).toBe('Maestro');
    });

    it('allows custom title and body', () => {
      const notification = createNotification('general', {
        title: 'Custom Title',
        body: 'Custom Body',
      });

      expect(notification.title).toBe('Custom Title');
      expect(notification.body).toBe('Custom Body');
    });

    it('includes custom data', () => {
      const notification = createNotification('general', {
        data: { customKey: 'customValue' },
      });

      expect(notification.data).toEqual({ customKey: 'customValue' });
    });

    it('sets read to false', () => {
      const notification = createNotification('general');

      expect(notification.read).toBe(false);
    });

    it('sets createdAt to current time', () => {
      const before = new Date();
      const notification = createNotification('general');
      const after = new Date();

      expect(notification.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(notification.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('createInAppNotification', () => {
    it('creates in-app notification from base notification', () => {
      const base = createNotification('general', {
        title: 'Test',
        body: 'Test body',
      });
      const inApp = createInAppNotification(base);

      expect(inApp.id).toBe(base.id);
      expect(inApp.type).toBe(base.type);
      expect(inApp.title).toBe(base.title);
      expect(inApp.body).toBe(base.body);
    });

    it('uses default duration when not specified', () => {
      const base = createNotification('general');
      const inApp = createInAppNotification(base);

      expect(inApp.duration).toBe(DEFAULT_NOTIFICATION_DURATION);
    });

    it('allows custom duration', () => {
      const base = createNotification('general');
      const inApp = createInAppNotification(base, { duration: 5000 });

      expect(inApp.duration).toBe(5000);
    });

    it('includes onPress callback', () => {
      const base = createNotification('general');
      const onPress = jest.fn();
      const inApp = createInAppNotification(base, { onPress });

      expect(inApp.onPress).toBe(onPress);
    });
  });
});

// ============================================================================
// In-App Notification Display Tests
// ============================================================================

describe('In-App Notification Display', () => {
  // These tests use fake timers for auto-dismiss functionality
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('showInAppNotification', () => {
    it('shows notification immediately', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' })
      );

      showInAppNotification(notification);

      expect(getCurrentNotification()).toEqual(notification);
    });

    it('queues multiple notifications', () => {
      const notification1 = createInAppNotification(
        createNotification('general', { title: 'Test 1', body: 'Body 1' })
      );
      const notification2 = createInAppNotification(
        createNotification('general', { title: 'Test 2', body: 'Body 2' })
      );

      showInAppNotification(notification1);
      showInAppNotification(notification2);

      expect(getCurrentNotification()).toEqual(notification1);
      expect(getNotificationQueue()).toHaveLength(1);
      expect(getNotificationQueue()[0]).toEqual(notification2);
    });

    it('auto-dismisses after duration', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' }),
        { duration: 2000 }
      );

      showInAppNotification(notification);
      expect(getCurrentNotification()).not.toBeNull();

      jest.advanceTimersByTime(2001);

      expect(getCurrentNotification()).toBeNull();
    });

    it('respects MIN_NOTIFICATION_DURATION', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' }),
        { duration: 100 } // Less than MIN
      );

      showInAppNotification(notification);

      // Should still be visible before MIN_NOTIFICATION_DURATION
      jest.advanceTimersByTime(500);
      expect(getCurrentNotification()).not.toBeNull();

      // Should be dismissed at MIN_NOTIFICATION_DURATION
      jest.advanceTimersByTime(MIN_NOTIFICATION_DURATION);
      expect(getCurrentNotification()).toBeNull();
    });

    it('respects MAX_NOTIFICATION_DURATION', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' }),
        { duration: 999999 } // Greater than MAX
      );

      showInAppNotification(notification);

      // Should still be visible before MAX_NOTIFICATION_DURATION
      jest.advanceTimersByTime(MAX_NOTIFICATION_DURATION - 100);
      expect(getCurrentNotification()).not.toBeNull();

      // Should be dismissed at MAX_NOTIFICATION_DURATION
      jest.advanceTimersByTime(200);
      expect(getCurrentNotification()).toBeNull();
    });
  });

  describe('dismissCurrentNotification', () => {
    it('dismisses the current notification', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' })
      );

      showInAppNotification(notification);
      expect(getCurrentNotification()).not.toBeNull();

      dismissCurrentNotification();

      expect(getCurrentNotification()).toBeNull();
    });

    it('shows next notification in queue after dismiss', () => {
      const notification1 = createInAppNotification(
        createNotification('general', { title: 'Test 1', body: 'Body 1' })
      );
      const notification2 = createInAppNotification(
        createNotification('general', { title: 'Test 2', body: 'Body 2' })
      );

      showInAppNotification(notification1);
      showInAppNotification(notification2);

      dismissCurrentNotification();

      expect(getCurrentNotification()).toEqual(notification2);
      expect(getNotificationQueue()).toHaveLength(0);
    });

    it('triggers onDismiss callback', () => {
      const onDismiss = jest.fn();
      registerNotificationListeners({ onDismiss });

      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' })
      );

      showInAppNotification(notification);
      dismissCurrentNotification();

      expect(onDismiss).toHaveBeenCalledWith(notification.id);
    });
  });

  describe('handleNotificationPress', () => {
    it('triggers onPress callback from listener', () => {
      const onPress = jest.fn();
      registerNotificationListeners({ onPress });

      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' })
      );

      showInAppNotification(notification);
      handleNotificationPress(notification);

      expect(onPress).toHaveBeenCalledWith(notification);
    });

    it('triggers notification-specific onPress callback', () => {
      const onPressCallback = jest.fn();
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' }),
        { onPress: onPressCallback }
      );

      showInAppNotification(notification);
      handleNotificationPress(notification);

      expect(onPressCallback).toHaveBeenCalled();
    });

    it('dismisses notification after press', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' })
      );

      showInAppNotification(notification);
      handleNotificationPress(notification);

      expect(getCurrentNotification()).toBeNull();
    });
  });

  describe('clearAllNotifications', () => {
    it('clears current notification', () => {
      const notification = createInAppNotification(
        createNotification('general', { title: 'Test', body: 'Test body' })
      );

      showInAppNotification(notification);
      clearAllNotifications();

      expect(getCurrentNotification()).toBeNull();
    });

    it('clears notification queue', () => {
      const notification1 = createInAppNotification(
        createNotification('general', { title: 'Test 1', body: 'Body 1' })
      );
      const notification2 = createInAppNotification(
        createNotification('general', { title: 'Test 2', body: 'Body 2' })
      );

      showInAppNotification(notification1);
      showInAppNotification(notification2);
      clearAllNotifications();

      expect(getCurrentNotification()).toBeNull();
      expect(getNotificationQueue()).toHaveLength(0);
    });
  });
});

// ============================================================================
// Order Event Trigger Tests
// ============================================================================

describe('Order Event Notifications', () => {
  describe('triggerOrderConfirmedNotification', () => {
    it('shows notification with restaurant name', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerOrderConfirmedNotification(mockOrder);

      expect(onReceive).toHaveBeenCalled();
      const notification = onReceive.mock.calls[0][0];
      expect(notification.title).toBe('Order Confirmed!');
      expect(notification.body).toContain('Test Restaurant');
    });

    it('includes order ID in data', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerOrderConfirmedNotification(mockOrder);

      const notification = onReceive.mock.calls[0][0];
      expect(notification.data).toEqual({ orderId: 'order_123' });
    });

    it('triggers onPress callback when provided', () => {
      const onPressCallback = jest.fn();
      triggerOrderConfirmedNotification(mockOrder, onPressCallback);

      const current = getCurrentNotification();
      if (current?.onPress) {
        current.onPress();
      }

      expect(onPressCallback).toHaveBeenCalled();
    });
  });

  describe('triggerDriverAssignedNotification', () => {
    it('shows notification with driver name', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerDriverAssignedNotification(mockOrder);

      const notification = onReceive.mock.calls[0][0];
      expect(notification.title).toBe('Driver Assigned');
      expect(notification.body).toContain('John Driver');
    });

    it('includes order and driver ID in data', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerDriverAssignedNotification(mockOrder);

      const notification = onReceive.mock.calls[0][0];
      expect(notification.data).toEqual({
        orderId: 'order_123',
        driverId: 'driver_1',
      });
    });
  });

  describe('triggerDriverNearbyNotification', () => {
    it('shows notification with nearby message', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerDriverNearbyNotification(mockOrder);

      const notification = onReceive.mock.calls[0][0];
      expect(notification.title).toBe('Driver Nearby');
      expect(notification.body).toContain('almost there');
    });
  });

  describe('triggerOrderDeliveredNotification', () => {
    it('shows notification with delivery message', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerOrderDeliveredNotification(mockOrder);

      const notification = onReceive.mock.calls[0][0];
      expect(notification.title).toBe('Order Delivered!');
      expect(notification.body).toContain('Enjoy');
    });
  });

  describe('triggerPromoNotification', () => {
    it('shows notification with custom promo content', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerPromoNotification('Flash Sale!', '50% off all orders', { promoCode: 'FLASH50' });

      const notification = onReceive.mock.calls[0][0];
      expect(notification.title).toBe('Flash Sale!');
      expect(notification.body).toBe('50% off all orders');
      expect(notification.data).toEqual({ promoCode: 'FLASH50' });
    });
  });

  describe('triggerGeneralNotification', () => {
    it('shows notification with custom content', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      triggerGeneralNotification('System Update', 'App updated successfully');

      const notification = onReceive.mock.calls[0][0];
      expect(notification.title).toBe('System Update');
      expect(notification.body).toBe('App updated successfully');
    });
  });
});

// ============================================================================
// Notification Scheduling Tests
// ============================================================================

describe('Notification Scheduling', () => {
  // These tests use fake timers for scheduling functionality
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('scheduleNotification', () => {
    it('schedules notification for future delivery', () => {
      const notification = createNotification('general', {
        title: 'Scheduled',
        body: 'This is scheduled',
      });
      const futureTime = new Date(Date.now() + 5000);

      const id = scheduleNotification(notification, futureTime);

      expect(id).toBe(notification.id);
      expect(getScheduledNotifications()).toHaveLength(1);
    });

    it('delivers notification at scheduled time', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      const notification = createNotification('general', {
        title: 'Scheduled',
        body: 'This is scheduled',
      });
      const futureTime = new Date(Date.now() + 5000);

      scheduleNotification(notification, futureTime);

      // Not delivered yet
      expect(onReceive).not.toHaveBeenCalled();

      // Advance time
      jest.advanceTimersByTime(5001);

      expect(onReceive).toHaveBeenCalled();
      expect(getScheduledNotifications()).toHaveLength(0);
    });
  });

  describe('cancelScheduledNotification', () => {
    it('cancels a scheduled notification', () => {
      const notification = createNotification('general', {
        title: 'Scheduled',
        body: 'This is scheduled',
      });
      const futureTime = new Date(Date.now() + 5000);

      const id = scheduleNotification(notification, futureTime);
      const result = cancelScheduledNotification(id);

      expect(result).toBe(true);
      expect(getScheduledNotifications()).toHaveLength(0);
    });

    it('returns false for non-existent notification', () => {
      const result = cancelScheduledNotification('non_existent_id');

      expect(result).toBe(false);
    });

    it('prevents scheduled notification from firing', () => {
      const onReceive = jest.fn();
      registerNotificationListeners({ onReceive });

      const notification = createNotification('general', {
        title: 'Scheduled',
        body: 'This is scheduled',
      });
      const futureTime = new Date(Date.now() + 5000);

      const id = scheduleNotification(notification, futureTime);
      cancelScheduledNotification(id);

      jest.advanceTimersByTime(6000);

      expect(onReceive).not.toHaveBeenCalled();
    });
  });

  describe('cancelAllScheduledNotifications', () => {
    it('cancels all scheduled notifications', () => {
      const notification1 = createNotification('general', { title: '1', body: '1' });
      const notification2 = createNotification('general', { title: '2', body: '2' });

      scheduleNotification(notification1, new Date(Date.now() + 5000));
      scheduleNotification(notification2, new Date(Date.now() + 10000));

      expect(getScheduledNotifications()).toHaveLength(2);

      cancelAllScheduledNotifications();

      expect(getScheduledNotifications()).toHaveLength(0);
    });
  });
});

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('Notification Utility Functions', () => {
  describe('getNotificationIcon', () => {
    it('returns correct icon for order_confirmed', () => {
      expect(getNotificationIcon('order_confirmed')).toBe('checkmark-circle');
    });

    it('returns correct icon for driver_assigned', () => {
      expect(getNotificationIcon('driver_assigned')).toBe('car');
    });

    it('returns correct icon for driver_nearby', () => {
      expect(getNotificationIcon('driver_nearby')).toBe('location');
    });

    it('returns correct icon for order_delivered', () => {
      expect(getNotificationIcon('order_delivered')).toBe('gift');
    });

    it('returns correct icon for promo', () => {
      expect(getNotificationIcon('promo')).toBe('pricetag');
    });

    it('returns correct icon for general', () => {
      expect(getNotificationIcon('general')).toBe('notifications');
    });
  });

  describe('getNotificationColor', () => {
    it('returns green for order_confirmed', () => {
      expect(getNotificationColor('order_confirmed')).toBe('#22C55E');
    });

    it('returns blue for driver_assigned', () => {
      expect(getNotificationColor('driver_assigned')).toBe('#0EA5E9');
    });

    it('returns orange for driver_nearby', () => {
      expect(getNotificationColor('driver_nearby')).toBe('#F59E0B');
    });

    it('returns green for order_delivered', () => {
      expect(getNotificationColor('order_delivered')).toBe('#22C55E');
    });

    it('returns primary orange for promo', () => {
      expect(getNotificationColor('promo')).toBe('#FF6B35');
    });

    it('returns gray for general', () => {
      expect(getNotificationColor('general')).toBe('#6B7280');
    });
  });

  describe('formatNotificationTime', () => {
    it('returns "Just now" for recent notifications', () => {
      const now = new Date();
      expect(formatNotificationTime(now)).toBe('Just now');

      const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
      expect(formatNotificationTime(thirtySecondsAgo)).toBe('Just now');
    });

    it('returns minutes for notifications under an hour', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatNotificationTime(fiveMinutesAgo)).toBe('5 min ago');

      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      expect(formatNotificationTime(thirtyMinutesAgo)).toBe('30 min ago');
    });

    it('returns hours for notifications under a day', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      expect(formatNotificationTime(oneHourAgo)).toBe('1 hour ago');

      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(formatNotificationTime(threeHoursAgo)).toBe('3 hours ago');
    });

    it('returns "Yesterday" for one day ago', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(formatNotificationTime(yesterday)).toBe('Yesterday');
    });

    it('returns days for notifications under a week', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatNotificationTime(threeDaysAgo)).toBe('3 days ago');

      const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      expect(formatNotificationTime(sixDaysAgo)).toBe('6 days ago');
    });

    it('returns formatted date for older notifications', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const result = formatNotificationTime(twoWeeksAgo);

      // Should contain date format
      expect(result).toMatch(/\d/);
      expect(result).not.toContain('ago');
    });
  });
});

// ============================================================================
// ORDER_NOTIFICATION_MESSAGES Tests
// ============================================================================

describe('ORDER_NOTIFICATION_MESSAGES', () => {
  it('has all required notification types', () => {
    expect(ORDER_NOTIFICATION_MESSAGES.order_confirmed).toBeDefined();
    expect(ORDER_NOTIFICATION_MESSAGES.driver_assigned).toBeDefined();
    expect(ORDER_NOTIFICATION_MESSAGES.driver_nearby).toBeDefined();
    expect(ORDER_NOTIFICATION_MESSAGES.order_delivered).toBeDefined();
  });

  it('has title and body for each type', () => {
    const types: Array<
      'order_confirmed' | 'driver_assigned' | 'driver_nearby' | 'order_delivered'
    > = ['order_confirmed', 'driver_assigned', 'driver_nearby', 'order_delivered'];

    types.forEach((type) => {
      expect(ORDER_NOTIFICATION_MESSAGES[type].title).toBeTruthy();
      expect(typeof ORDER_NOTIFICATION_MESSAGES[type].body).toBe('function');
    });
  });

  it('body functions return strings', () => {
    expect(typeof ORDER_NOTIFICATION_MESSAGES.order_confirmed.body()).toBe('string');
    expect(typeof ORDER_NOTIFICATION_MESSAGES.driver_assigned.body()).toBe('string');
    expect(typeof ORDER_NOTIFICATION_MESSAGES.driver_nearby.body()).toBe('string');
    expect(typeof ORDER_NOTIFICATION_MESSAGES.order_delivered.body()).toBe('string');
  });

  it('body functions can use order data', () => {
    const confirmedBody = ORDER_NOTIFICATION_MESSAGES.order_confirmed.body(mockOrder);
    expect(confirmedBody).toContain('Test Restaurant');

    const driverBody = ORDER_NOTIFICATION_MESSAGES.driver_assigned.body(mockOrder);
    expect(driverBody).toContain('John Driver');
  });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Notification Constants', () => {
  it('DEFAULT_NOTIFICATION_DURATION is reasonable', () => {
    expect(DEFAULT_NOTIFICATION_DURATION).toBeGreaterThan(0);
    expect(DEFAULT_NOTIFICATION_DURATION).toBeLessThanOrEqual(10000);
  });

  it('MIN_NOTIFICATION_DURATION is less than MAX', () => {
    expect(MIN_NOTIFICATION_DURATION).toBeLessThan(MAX_NOTIFICATION_DURATION);
  });

  it('MIN_NOTIFICATION_DURATION is at least 1 second', () => {
    expect(MIN_NOTIFICATION_DURATION).toBeGreaterThanOrEqual(1000);
  });

  it('MAX_NOTIFICATION_DURATION is at most 10 seconds', () => {
    expect(MAX_NOTIFICATION_DURATION).toBeLessThanOrEqual(10000);
  });
});

// ============================================================================
// Module Export Tests
// ============================================================================

describe('Module Exports', () => {
  it('exports all permission functions', () => {
    const module = require('@/utils/notifications');

    expect(module.getNotificationPermissionStatus).toBeDefined();
    expect(module.requestNotificationPermissions).toBeDefined();
    expect(module.areNotificationsEnabled).toBeDefined();
    expect(module.resetNotificationPermissions).toBeDefined();
  });

  it('exports all listener functions', () => {
    const module = require('@/utils/notifications');

    expect(module.registerNotificationListeners).toBeDefined();
    expect(module.clearNotificationListeners).toBeDefined();
  });

  it('exports all notification generation functions', () => {
    const module = require('@/utils/notifications');

    expect(module.generateNotificationId).toBeDefined();
    expect(module.createNotification).toBeDefined();
    expect(module.createInAppNotification).toBeDefined();
  });

  it('exports all display functions', () => {
    const module = require('@/utils/notifications');

    expect(module.showInAppNotification).toBeDefined();
    expect(module.dismissCurrentNotification).toBeDefined();
    expect(module.handleNotificationPress).toBeDefined();
    expect(module.getCurrentNotification).toBeDefined();
    expect(module.getNotificationQueue).toBeDefined();
    expect(module.clearAllNotifications).toBeDefined();
  });

  it('exports all trigger functions', () => {
    const module = require('@/utils/notifications');

    expect(module.triggerOrderConfirmedNotification).toBeDefined();
    expect(module.triggerDriverAssignedNotification).toBeDefined();
    expect(module.triggerDriverNearbyNotification).toBeDefined();
    expect(module.triggerOrderDeliveredNotification).toBeDefined();
    expect(module.triggerPromoNotification).toBeDefined();
    expect(module.triggerGeneralNotification).toBeDefined();
  });

  it('exports all scheduling functions', () => {
    const module = require('@/utils/notifications');

    expect(module.scheduleNotification).toBeDefined();
    expect(module.cancelScheduledNotification).toBeDefined();
    expect(module.getScheduledNotifications).toBeDefined();
    expect(module.cancelAllScheduledNotifications).toBeDefined();
  });

  it('exports all utility functions', () => {
    const module = require('@/utils/notifications');

    expect(module.getNotificationIcon).toBeDefined();
    expect(module.getNotificationColor).toBeDefined();
    expect(module.formatNotificationTime).toBeDefined();
  });

  it('exports constants', () => {
    const module = require('@/utils/notifications');

    expect(module.DEFAULT_NOTIFICATION_DURATION).toBeDefined();
    expect(module.MIN_NOTIFICATION_DURATION).toBeDefined();
    expect(module.MAX_NOTIFICATION_DURATION).toBeDefined();
    expect(module.ORDER_NOTIFICATION_MESSAGES).toBeDefined();
  });
});
