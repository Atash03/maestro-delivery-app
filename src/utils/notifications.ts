/**
 * Push Notification Utilities
 *
 * This module provides placeholder functionality for push notifications including:
 * - Permission request handling
 * - Mock notification triggers for order events
 * - In-app notification toast system
 *
 * In production, this would integrate with expo-notifications or a native
 * push notification service (FCM, APNs).
 */

import { Platform } from 'react-native';

import type { Notification, NotificationType, Order } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface NotificationPermissionStatus {
  /** Whether notifications are granted */
  granted: boolean;
  /** iOS-specific: Whether provisional authorization was granted */
  provisional?: boolean;
  /** Whether the user explicitly denied permissions */
  denied: boolean;
  /** Whether the permission request can be retried */
  canAskAgain: boolean;
}

export interface InAppNotification {
  /** Unique identifier */
  id: string;
  /** Notification type for styling and icon selection */
  type: NotificationType;
  /** Main notification title */
  title: string;
  /** Notification body text */
  body: string;
  /** Duration to show in milliseconds (default: 4000) */
  duration?: number;
  /** Optional action callback when notification is tapped */
  onPress?: () => void;
  /** Optional data payload */
  data?: Record<string, unknown>;
  /** Timestamp when notification was created */
  createdAt: Date;
}

export interface NotificationConfig {
  /** Whether sound should play (default: true) */
  sound?: boolean;
  /** Whether vibration should occur (default: true) */
  vibration?: boolean;
  /** Priority level for Android (default: 'high') */
  priority?: 'default' | 'high' | 'max';
}

export interface NotificationListeners {
  /** Callback when a notification is received in foreground */
  onReceive?: (notification: InAppNotification) => void;
  /** Callback when a notification is dismissed */
  onDismiss?: (notificationId: string) => void;
  /** Callback when a notification is pressed */
  onPress?: (notification: InAppNotification) => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Default duration for in-app notifications in milliseconds */
export const DEFAULT_NOTIFICATION_DURATION = 4000;

/** Minimum duration for notifications */
export const MIN_NOTIFICATION_DURATION = 1000;

/** Maximum duration for notifications */
export const MAX_NOTIFICATION_DURATION = 10000;

/** Order event notification messages */
export const ORDER_NOTIFICATION_MESSAGES: Record<
  Extract<
    NotificationType,
    'order_confirmed' | 'driver_assigned' | 'driver_nearby' | 'order_delivered'
  >,
  { title: string; body: (order?: Order) => string }
> = {
  order_confirmed: {
    title: 'Order Confirmed!',
    body: (order) =>
      order ? `${order.restaurant.name} is preparing your order` : 'Your order is being prepared',
  },
  driver_assigned: {
    title: 'Driver Assigned',
    body: (order) =>
      order?.driver
        ? `${order.driver.name} is on the way to pick up your order`
        : 'A driver has been assigned to your order',
  },
  driver_nearby: {
    title: 'Driver Nearby',
    body: () => 'Your driver is almost there! Get ready to receive your order',
  },
  order_delivered: {
    title: 'Order Delivered!',
    body: () => 'Enjoy your meal! Bon appétit!',
  },
};

// ============================================================================
// State Management (Mock)
// ============================================================================

/** Mock permission state */
let mockPermissionStatus: NotificationPermissionStatus = {
  granted: false,
  provisional: false,
  denied: false,
  canAskAgain: true,
};

/** Registered notification listeners */
let notificationListeners: NotificationListeners = {};

/** Queue of pending notifications */
const notificationQueue: InAppNotification[] = [];

/** Currently displayed notification */
let currentNotification: InAppNotification | null = null;

// ============================================================================
// Permission Functions
// ============================================================================

/**
 * Check if notification permissions are granted
 * @returns Current permission status
 */
export function getNotificationPermissionStatus(): NotificationPermissionStatus {
  return { ...mockPermissionStatus };
}

/**
 * Request notification permissions from the user
 *
 * In production, this would:
 * 1. Check current permission status
 * 2. Show system permission dialog if needed
 * 3. Store permission status
 * 4. Register for push token if granted
 *
 * @returns Promise resolving to permission status
 */
export async function requestNotificationPermissions(): Promise<NotificationPermissionStatus> {
  // Simulate permission request delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock: Always grant permissions for demo purposes
  // In production, this would show the system dialog
  mockPermissionStatus = {
    granted: true,
    provisional: Platform.OS === 'ios' ? true : undefined,
    denied: false,
    canAskAgain: true,
  };

  return { ...mockPermissionStatus };
}

/**
 * Check if notifications are currently enabled
 * @returns boolean indicating if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  return mockPermissionStatus.granted;
}

/**
 * Reset notification permission state (for testing)
 */
export function resetNotificationPermissions(): void {
  mockPermissionStatus = {
    granted: false,
    provisional: false,
    denied: false,
    canAskAgain: true,
  };
}

// ============================================================================
// Notification Listener Functions
// ============================================================================

/**
 * Register notification event listeners
 * @param listeners Object containing callback functions for notification events
 * @returns Cleanup function to remove listeners
 */
export function registerNotificationListeners(listeners: NotificationListeners): () => void {
  notificationListeners = { ...notificationListeners, ...listeners };

  return () => {
    // Remove the registered listeners
    if (listeners.onReceive && notificationListeners.onReceive === listeners.onReceive) {
      delete notificationListeners.onReceive;
    }
    if (listeners.onDismiss && notificationListeners.onDismiss === listeners.onDismiss) {
      delete notificationListeners.onDismiss;
    }
    if (listeners.onPress && notificationListeners.onPress === listeners.onPress) {
      delete notificationListeners.onPress;
    }
  };
}

/**
 * Clear all notification listeners
 */
export function clearNotificationListeners(): void {
  notificationListeners = {};
}

// ============================================================================
// Notification Generation Functions
// ============================================================================

/**
 * Generate a unique notification ID
 * @returns Unique string identifier
 */
export function generateNotificationId(): string {
  return `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a notification object from type and optional data
 * @param type Notification type
 * @param data Optional data to include
 * @returns Notification object (matches the Notification type from types/index.ts)
 */
export function createNotification(
  type: NotificationType,
  data?: {
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
  }
): Notification {
  const id = generateNotificationId();

  // Get default title and body based on type
  let defaultTitle = 'Notification';
  let defaultBody = '';

  if (type === 'order_confirmed') {
    defaultTitle = ORDER_NOTIFICATION_MESSAGES.order_confirmed.title;
    defaultBody = ORDER_NOTIFICATION_MESSAGES.order_confirmed.body();
  } else if (type === 'driver_assigned') {
    defaultTitle = ORDER_NOTIFICATION_MESSAGES.driver_assigned.title;
    defaultBody = ORDER_NOTIFICATION_MESSAGES.driver_assigned.body();
  } else if (type === 'driver_nearby') {
    defaultTitle = ORDER_NOTIFICATION_MESSAGES.driver_nearby.title;
    defaultBody = ORDER_NOTIFICATION_MESSAGES.driver_nearby.body();
  } else if (type === 'order_delivered') {
    defaultTitle = ORDER_NOTIFICATION_MESSAGES.order_delivered.title;
    defaultBody = ORDER_NOTIFICATION_MESSAGES.order_delivered.body();
  } else if (type === 'promo') {
    defaultTitle = 'Special Offer';
    defaultBody = 'Check out our latest deals!';
  } else {
    defaultTitle = 'Maestro';
    defaultBody = 'You have a new notification';
  }

  return {
    id,
    type,
    title: data?.title ?? defaultTitle,
    body: data?.body ?? defaultBody,
    data: data?.data,
    read: false,
    createdAt: new Date(),
  };
}

/**
 * Create an in-app notification for display
 * @param notification Base notification
 * @param options Additional options for in-app display
 * @returns InAppNotification for display
 */
export function createInAppNotification(
  notification: Notification,
  options?: {
    duration?: number;
    onPress?: () => void;
  }
): InAppNotification {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    duration: options?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    onPress: options?.onPress,
    data: notification.data,
    createdAt: notification.createdAt,
  };
}

// ============================================================================
// Notification Trigger Functions
// ============================================================================

/**
 * Show an in-app notification toast
 * @param notification The notification to display
 */
export function showInAppNotification(notification: InAppNotification): void {
  // Add to queue
  notificationQueue.push(notification);

  // Trigger the onReceive callback
  if (notificationListeners.onReceive) {
    notificationListeners.onReceive(notification);
  }

  // If no notification is currently showing, process the queue
  if (!currentNotification) {
    processNotificationQueue();
  }
}

/**
 * Process the notification queue
 */
function processNotificationQueue(): void {
  if (notificationQueue.length === 0) {
    currentNotification = null;
    return;
  }

  currentNotification = notificationQueue.shift() ?? null;

  if (currentNotification) {
    const duration = Math.min(
      MAX_NOTIFICATION_DURATION,
      Math.max(
        MIN_NOTIFICATION_DURATION,
        currentNotification.duration ?? DEFAULT_NOTIFICATION_DURATION
      )
    );

    // Auto-dismiss after duration
    setTimeout(() => {
      if (currentNotification) {
        dismissCurrentNotification();
      }
    }, duration);
  }
}

/**
 * Dismiss the currently displayed notification
 */
export function dismissCurrentNotification(): void {
  if (currentNotification) {
    const dismissedId = currentNotification.id;

    // Trigger dismiss callback
    if (notificationListeners.onDismiss) {
      notificationListeners.onDismiss(dismissedId);
    }

    currentNotification = null;

    // Process next notification in queue
    processNotificationQueue();
  }
}

/**
 * Handle notification press
 * @param notification The notification that was pressed
 */
export function handleNotificationPress(notification: InAppNotification): void {
  // Trigger press callback
  if (notificationListeners.onPress) {
    notificationListeners.onPress(notification);
  }

  // Also trigger the notification's own onPress if defined
  if (notification.onPress) {
    notification.onPress();
  }

  // Dismiss the notification
  if (currentNotification?.id === notification.id) {
    dismissCurrentNotification();
  }
}

/**
 * Get the currently displayed notification
 * @returns Current notification or null
 */
export function getCurrentNotification(): InAppNotification | null {
  return currentNotification;
}

/**
 * Get the notification queue
 * @returns Array of pending notifications
 */
export function getNotificationQueue(): InAppNotification[] {
  return [...notificationQueue];
}

/**
 * Clear all notifications (current and queued)
 */
export function clearAllNotifications(): void {
  currentNotification = null;
  notificationQueue.length = 0;
}

// ============================================================================
// Order Event Notification Triggers
// ============================================================================

/**
 * Trigger notification when order is confirmed
 * @param order The confirmed order
 * @param onPress Optional callback when notification is pressed
 */
export function triggerOrderConfirmedNotification(order: Order, onPress?: () => void): void {
  const messages = ORDER_NOTIFICATION_MESSAGES.order_confirmed;
  const notification = createNotification('order_confirmed', {
    title: messages.title,
    body: messages.body(order),
    data: { orderId: order.id },
  });

  showInAppNotification(createInAppNotification(notification, { onPress }));
}

/**
 * Trigger notification when driver is assigned
 * @param order The order with driver assigned
 * @param onPress Optional callback when notification is pressed
 */
export function triggerDriverAssignedNotification(order: Order, onPress?: () => void): void {
  const messages = ORDER_NOTIFICATION_MESSAGES.driver_assigned;
  const notification = createNotification('driver_assigned', {
    title: messages.title,
    body: messages.body(order),
    data: { orderId: order.id, driverId: order.driver?.id },
  });

  showInAppNotification(createInAppNotification(notification, { onPress }));
}

/**
 * Trigger notification when driver is nearby
 * @param order The order being delivered
 * @param onPress Optional callback when notification is pressed
 */
export function triggerDriverNearbyNotification(order: Order, onPress?: () => void): void {
  const messages = ORDER_NOTIFICATION_MESSAGES.driver_nearby;
  const notification = createNotification('driver_nearby', {
    title: messages.title,
    body: messages.body(order),
    data: { orderId: order.id, driverId: order.driver?.id },
  });

  showInAppNotification(createInAppNotification(notification, { onPress }));
}

/**
 * Trigger notification when order is delivered
 * @param order The delivered order
 * @param onPress Optional callback when notification is pressed
 */
export function triggerOrderDeliveredNotification(order: Order, onPress?: () => void): void {
  const messages = ORDER_NOTIFICATION_MESSAGES.order_delivered;
  const notification = createNotification('order_delivered', {
    title: messages.title,
    body: messages.body(order),
    data: { orderId: order.id },
  });

  showInAppNotification(createInAppNotification(notification, { onPress }));
}

/**
 * Trigger a promo notification
 * @param title Promo title
 * @param body Promo description
 * @param data Optional data payload
 * @param onPress Optional callback when notification is pressed
 */
export function triggerPromoNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
  onPress?: () => void
): void {
  const notification = createNotification('promo', {
    title,
    body,
    data,
  });

  showInAppNotification(createInAppNotification(notification, { onPress }));
}

/**
 * Trigger a general notification
 * @param title Notification title
 * @param body Notification body
 * @param data Optional data payload
 * @param onPress Optional callback when notification is pressed
 */
export function triggerGeneralNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
  onPress?: () => void
): void {
  const notification = createNotification('general', {
    title,
    body,
    data,
  });

  showInAppNotification(createInAppNotification(notification, { onPress }));
}

// ============================================================================
// Push Notification Scheduling (Mock)
// ============================================================================

export interface ScheduledNotification {
  id: string;
  notification: Notification;
  scheduledFor: Date;
  config?: NotificationConfig;
}

/** Scheduled notifications storage */
const scheduledNotifications: ScheduledNotification[] = [];

/**
 * Schedule a notification for future delivery
 * @param notification The notification to schedule
 * @param scheduledFor When to deliver the notification
 * @param config Optional notification configuration
 * @returns The scheduled notification ID
 */
export function scheduleNotification(
  notification: Notification,
  scheduledFor: Date,
  config?: NotificationConfig
): string {
  const scheduled: ScheduledNotification = {
    id: notification.id,
    notification,
    scheduledFor,
    config,
  };

  scheduledNotifications.push(scheduled);

  // In production, this would use expo-notifications or native scheduling
  const delay = scheduledFor.getTime() - Date.now();
  if (delay > 0) {
    setTimeout(() => {
      const index = scheduledNotifications.findIndex((s) => s.id === scheduled.id);
      if (index !== -1) {
        scheduledNotifications.splice(index, 1);
        showInAppNotification(createInAppNotification(notification));
      }
    }, delay);
  }

  return scheduled.id;
}

/**
 * Cancel a scheduled notification
 * @param notificationId The ID of the notification to cancel
 * @returns boolean indicating if the notification was found and cancelled
 */
export function cancelScheduledNotification(notificationId: string): boolean {
  const index = scheduledNotifications.findIndex((s) => s.id === notificationId);
  if (index !== -1) {
    scheduledNotifications.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Get all scheduled notifications
 * @returns Array of scheduled notifications
 */
export function getScheduledNotifications(): ScheduledNotification[] {
  return [...scheduledNotifications];
}

/**
 * Cancel all scheduled notifications
 */
export function cancelAllScheduledNotifications(): void {
  scheduledNotifications.length = 0;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get icon name for notification type
 * @param type Notification type
 * @returns Icon name from Ionicons
 */
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'order_confirmed':
      return 'checkmark-circle';
    case 'driver_assigned':
      return 'car';
    case 'driver_nearby':
      return 'location';
    case 'order_delivered':
      return 'gift';
    case 'promo':
      return 'pricetag';
    default:
      return 'notifications';
  }
}

/**
 * Get color for notification type
 * @param type Notification type
 * @returns Color hex string
 */
export function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'order_confirmed':
      return '#22C55E'; // Success green
    case 'driver_assigned':
      return '#0EA5E9'; // Secondary blue
    case 'driver_nearby':
      return '#F59E0B'; // Warning orange
    case 'order_delivered':
      return '#22C55E'; // Success green
    case 'promo':
      return '#FF6B35'; // Primary orange
    default:
      return '#6B7280'; // Neutral gray
  }
}

/**
 * Format notification timestamp for display
 * @param date The notification date
 * @returns Formatted string (e.g., "Just now", "5 min ago", "1 hour ago")
 */
export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  if (diffDays < 7) {
    return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
  }

  // For older notifications, show the date
  return date.toLocaleDateString();
}
