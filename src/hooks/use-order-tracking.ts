/**
 * useOrderTracking Hook
 *
 * Provides mock real-time order tracking functionality including:
 * - Automatic order status progression with configurable delays
 * - Driver location updates along a simulated route
 * - ETA updates as the driver moves closer to the destination
 * - Driver assignment when order is ready
 *
 * This hook simulates the real-time tracking experience that would
 * typically be powered by WebSockets or polling in production.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { mockDrivers } from '@/data/mock/users';
import { useOrderStore } from '@/stores';
import type { Coordinates, Driver, Order } from '@/types';
import { OrderStatus } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface OrderTrackingConfig {
  /** Delay between status updates in milliseconds (default: 5000) */
  statusUpdateInterval?: number;
  /** Delay between driver location updates in milliseconds (default: 3000) */
  locationUpdateInterval?: number;
  /** Whether to automatically progress through statuses (default: true) */
  autoProgress?: boolean;
  /** Whether to simulate driver movement (default: true) */
  simulateDriverMovement?: boolean;
}

export interface UseOrderTrackingReturn {
  /** The current order being tracked */
  order: Order | undefined;
  /** Current order status */
  status: OrderStatus | undefined;
  /** Assigned driver (if any) */
  driver: Driver | undefined;
  /** Current driver location (if assigned) */
  driverLocation: Coordinates | undefined;
  /** Estimated time remaining in minutes */
  etaMinutes: number;
  /** Formatted ETA string (e.g., "15 min" or "Arriving now") */
  etaFormatted: string;
  /** Whether the order has been picked up */
  isPickedUp: boolean;
  /** Whether tracking is active */
  isTracking: boolean;
  /** Whether the order is complete (delivered or cancelled) */
  isComplete: boolean;
  /** Start tracking the order */
  startTracking: () => void;
  /** Stop tracking the order */
  stopTracking: () => void;
  /** Manually advance to the next status (for testing) */
  advanceStatus: () => void;
  /** Get timestamps for all completed statuses */
  statusTimestamps: Partial<Record<OrderStatus, Date>>;
}

// ============================================================================
// Constants
// ============================================================================

/** Default configuration values */
const DEFAULT_CONFIG: Required<OrderTrackingConfig> = {
  statusUpdateInterval: 5000, // 5 seconds between status updates
  locationUpdateInterval: 3000, // 3 seconds between location updates
  autoProgress: true,
  simulateDriverMovement: true,
};

/** Order status progression sequence (excluding CANCELLED) */
const STATUS_SEQUENCE: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.PICKED_UP,
  OrderStatus.ON_THE_WAY,
  OrderStatus.DELIVERED,
];

/** Statuses that indicate the order has been picked up by driver */
const PICKED_UP_STATUSES: OrderStatus[] = [
  OrderStatus.PICKED_UP,
  OrderStatus.ON_THE_WAY,
  OrderStatus.DELIVERED,
];

/** Statuses that indicate the order is complete */
const COMPLETE_STATUSES: OrderStatus[] = [OrderStatus.DELIVERED, OrderStatus.CANCELLED];

/** Status at which driver is assigned */
const DRIVER_ASSIGNMENT_STATUS = OrderStatus.READY;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the next status in the order progression
 */
export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  const currentIndex = STATUS_SEQUENCE.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= STATUS_SEQUENCE.length - 1) {
    return null;
  }
  return STATUS_SEQUENCE[currentIndex + 1];
}

/**
 * Check if a status comes after the driver assignment status
 */
export function shouldHaveDriver(status: OrderStatus): boolean {
  const assignmentIndex = STATUS_SEQUENCE.indexOf(DRIVER_ASSIGNMENT_STATUS);
  const currentIndex = STATUS_SEQUENCE.indexOf(status);
  return currentIndex >= assignmentIndex;
}

/**
 * Calculate a random driver starting position near the restaurant
 */
export function getRandomDriverStartPosition(restaurantCoords: Coordinates): Coordinates {
  // Random offset between -0.01 and 0.01 degrees (roughly 1km)
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lngOffset = (Math.random() - 0.5) * 0.02;

  return {
    latitude: restaurantCoords.latitude + latOffset,
    longitude: restaurantCoords.longitude + lngOffset,
  };
}

/**
 * Interpolate between two coordinates
 * @param start Starting coordinate
 * @param end Ending coordinate
 * @param progress Progress from 0 to 1
 */
export function interpolateCoordinates(
  start: Coordinates,
  end: Coordinates,
  progress: number
): Coordinates {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * clampedProgress,
    longitude: start.longitude + (end.longitude - start.longitude) * clampedProgress,
  };
}

/**
 * Calculate distance between two coordinates in km (Haversine formula)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate ETA in minutes based on distance
 * Assumes average speed of 30 km/h for delivery
 */
export function calculateETAMinutes(distanceKm: number, speedKmh: number = 30): number {
  return Math.round((distanceKm / speedKmh) * 60);
}

/**
 * Get a random driver from mock data
 */
export function getRandomDriver(): Driver {
  const randomIndex = Math.floor(Math.random() * mockDrivers.length);
  return { ...mockDrivers[randomIndex] };
}

/**
 * Format ETA for display
 */
export function formatETA(minutes: number): string {
  if (minutes <= 0) {
    return 'Arriving now';
  }
  if (minutes === 1) {
    return '1 min';
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for managing mock real-time order tracking
 *
 * @param orderId The order ID to track
 * @param config Optional configuration for tracking behavior
 */
export function useOrderTracking(
  orderId: string | undefined,
  config: OrderTrackingConfig = {}
): UseOrderTrackingReturn {
  // Merge config with defaults
  const mergedConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
    }),
    [config]
  );

  // Store actions
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const assignDriver = useOrderStore((state) => state.assignDriver);
  const updateDriverLocation = useOrderStore((state) => state.updateDriverLocation);
  const updateEstimatedDelivery = useOrderStore((state) => state.updateEstimatedDelivery);

  // Get current order
  const order = useMemo(() => {
    if (!orderId) return undefined;
    return getOrderById(orderId);
  }, [orderId, getOrderById]);

  // Local state
  const [isTracking, setIsTracking] = useState(false);
  const [statusTimestamps, setStatusTimestamps] = useState<Partial<Record<OrderStatus, Date>>>({});

  // Refs for intervals
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track movement progress (0 to 1)
  const movementProgressRef = useRef(0);

  // Track route phase: 'to_restaurant' or 'to_delivery'
  const routePhaseRef = useRef<'to_restaurant' | 'to_delivery'>('to_restaurant');

  // Derived values
  const status = order?.status;
  const driver = order?.driver;
  const driverLocation = driver?.currentLocation;

  const isPickedUp = useMemo(() => {
    if (!status) return false;
    return PICKED_UP_STATUSES.includes(status);
  }, [status]);

  const isComplete = useMemo(() => {
    if (!status) return false;
    return COMPLETE_STATUSES.includes(status);
  }, [status]);

  // Calculate ETA
  const etaMinutes = useMemo(() => {
    if (!order || isComplete) return 0;

    const estimatedDelivery = new Date(order.estimatedDelivery);
    const now = new Date();
    const diffMs = estimatedDelivery.getTime() - now.getTime();
    return Math.max(0, Math.round(diffMs / (60 * 1000)));
  }, [order, isComplete]);

  const etaFormatted = useMemo(() => formatETA(etaMinutes), [etaMinutes]);

  // Get restaurant coordinates
  const restaurantCoords = useMemo((): Coordinates => {
    if (order?.restaurant.coordinates) {
      return order.restaurant.coordinates;
    }
    return { latitude: 40.7128, longitude: -74.006 };
  }, [order?.restaurant.coordinates]);

  // Get delivery coordinates
  const deliveryCoords = useMemo((): Coordinates => {
    if (order?.address.coordinates) {
      return order.address.coordinates;
    }
    return { latitude: 40.72, longitude: -73.99 };
  }, [order?.address.coordinates]);

  // Initialize status timestamp for current status
  useEffect(() => {
    if (status && !statusTimestamps[status]) {
      setStatusTimestamps((prev) => ({
        ...prev,
        [status]: new Date(),
      }));
    }
  }, [status, statusTimestamps]);

  /**
   * Advance to the next order status
   */
  const advanceStatus = useCallback(() => {
    if (!orderId || !status) return;

    const nextStatus = getNextStatus(status);
    if (!nextStatus) return;

    // Update the status
    updateOrderStatus(orderId, nextStatus);

    // Record timestamp for new status
    setStatusTimestamps((prev) => ({
      ...prev,
      [nextStatus]: new Date(),
    }));

    // Assign driver when order becomes READY
    if (nextStatus === DRIVER_ASSIGNMENT_STATUS) {
      const newDriver = getRandomDriver();
      // Set driver's starting position near restaurant
      newDriver.currentLocation = getRandomDriverStartPosition(restaurantCoords);
      assignDriver(orderId, newDriver);
      // Reset movement tracking for new driver
      movementProgressRef.current = 0;
      routePhaseRef.current = 'to_restaurant';
    }

    // Update route phase when picked up
    if (nextStatus === OrderStatus.PICKED_UP) {
      routePhaseRef.current = 'to_delivery';
      movementProgressRef.current = 0;
    }
  }, [orderId, status, updateOrderStatus, assignDriver, restaurantCoords]);

  /**
   * Update driver location along the route
   */
  const updateLocation = useCallback(() => {
    if (!orderId || !driver?.currentLocation) return;

    // Determine target based on current phase
    const targetCoords =
      routePhaseRef.current === 'to_restaurant' ? restaurantCoords : deliveryCoords;

    // Increment progress (0.15 per update = ~7 updates to complete)
    movementProgressRef.current = Math.min(1, movementProgressRef.current + 0.15);

    // Calculate new position
    const newLocation = interpolateCoordinates(
      driver.currentLocation,
      targetCoords,
      movementProgressRef.current
    );

    // Update driver location in store
    updateDriverLocation(orderId, newLocation);

    // Update ETA based on remaining distance
    const distanceToDelivery = calculateDistance(newLocation, deliveryCoords);
    const newETAMinutes = calculateETAMinutes(distanceToDelivery);
    const newEstimatedDelivery = new Date(Date.now() + newETAMinutes * 60 * 1000);
    updateEstimatedDelivery(orderId, newEstimatedDelivery);
  }, [
    orderId,
    driver?.currentLocation,
    restaurantCoords,
    deliveryCoords,
    updateDriverLocation,
    updateEstimatedDelivery,
  ]);

  /**
   * Start tracking the order
   */
  const startTracking = useCallback(() => {
    if (!orderId || isTracking || isComplete) return;

    setIsTracking(true);

    // Start status progression interval
    if (mergedConfig.autoProgress) {
      statusIntervalRef.current = setInterval(() => {
        advanceStatus();
      }, mergedConfig.statusUpdateInterval);
    }

    // Start location update interval (only if driver is assigned)
    if (mergedConfig.simulateDriverMovement) {
      locationIntervalRef.current = setInterval(() => {
        updateLocation();
      }, mergedConfig.locationUpdateInterval);
    }
  }, [
    orderId,
    isTracking,
    isComplete,
    mergedConfig.autoProgress,
    mergedConfig.simulateDriverMovement,
    mergedConfig.statusUpdateInterval,
    mergedConfig.locationUpdateInterval,
    advanceStatus,
    updateLocation,
  ]);

  /**
   * Stop tracking the order
   */
  const stopTracking = useCallback(() => {
    setIsTracking(false);

    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }

    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  }, []);

  // Stop tracking when order is complete
  useEffect(() => {
    if (isComplete && isTracking) {
      stopTracking();
    }
  }, [isComplete, isTracking, stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  return {
    order,
    status,
    driver,
    driverLocation,
    etaMinutes,
    etaFormatted,
    isPickedUp,
    isTracking,
    isComplete,
    startTracking,
    stopTracking,
    advanceStatus,
    statusTimestamps,
  };
}

// ============================================================================
// Export Types
// ============================================================================

export type { Coordinates, Driver, Order, OrderStatus };
