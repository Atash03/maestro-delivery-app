/**
 * Order Tracking Map Component
 *
 * Displays an interactive map for order tracking with:
 * - Restaurant marker showing the pickup location
 * - Delivery address marker showing the destination
 * - Animated driver marker that moves along the route
 * - Route polyline connecting all points
 * - Re-center button to focus on the driver
 *
 * Uses react-native-maps for the map display with mock driver movement
 * for demonstration purposes.
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, type Region } from 'react-native-maps';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  SuccessColors,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Coordinates, Driver, VehicleType } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface OrderTrackingMapProps {
  /** Restaurant location coordinates */
  restaurantLocation: Coordinates;
  /** Restaurant name for marker callout */
  restaurantName: string;
  /** Delivery address coordinates */
  deliveryLocation: Coordinates;
  /** Delivery address for marker callout */
  deliveryAddress: string;
  /** Driver information (optional - shows when driver is assigned) */
  driver?: Driver;
  /** Whether the order has been picked up (affects route display) */
  isPickedUp?: boolean;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Constants
// ============================================================================

const MAP_PADDING = { top: 100, right: 50, bottom: 100, left: 50 };
const ANIMATION_DURATION = 1000;

// Vehicle icons based on type
const VEHICLE_ICONS: Record<VehicleType, keyof typeof Ionicons.glyphMap> = {
  car: 'car',
  motorcycle: 'bicycle',
  bicycle: 'bicycle',
  scooter: 'bicycle',
};

// Map style for dark mode
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate the region to fit all markers
 */
export function calculateRegion(points: Coordinates[]): Region {
  if (points.length === 0) {
    return {
      latitude: 40.7128,
      longitude: -74.006,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latDelta = (maxLat - minLat) * 1.5 || 0.01;
  const lngDelta = (maxLng - minLng) * 1.5 || 0.01;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
}

/**
 * Calculate bearing between two coordinates
 */
export function calculateBearing(start: Coordinates, end: Coordinates): number {
  const startLat = (start.latitude * Math.PI) / 180;
  const startLng = (start.longitude * Math.PI) / 180;
  const endLat = (end.latitude * Math.PI) / 180;
  const endLng = (end.longitude * Math.PI) / 180;

  const dLng = endLng - startLng;

  const x = Math.sin(dLng) * Math.cos(endLat);
  const y =
    Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface CustomMarkerProps {
  type: 'restaurant' | 'delivery' | 'driver';
  vehicleType?: VehicleType;
}

/**
 * Custom marker view for the map
 */
function CustomMarkerView({ type, vehicleType }: CustomMarkerProps) {
  const pulseAnim = useSharedValue(0);

  useEffect(() => {
    if (type === 'driver') {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: ANIMATION_DURATION }),
          withTiming(0, { duration: ANIMATION_DURATION })
        ),
        -1,
        false
      );
    }
  }, [pulseAnim, type]);

  const pulseStyle = useAnimatedStyle(() => {
    if (type !== 'driver') return {};

    const scale = interpolate(pulseAnim.value, [0, 1], [1, 1.6]);
    const opacity = interpolate(pulseAnim.value, [0, 1], [0.6, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const getMarkerConfig = () => {
    switch (type) {
      case 'restaurant':
        return {
          backgroundColor: PrimaryColors[500],
          icon: 'restaurant' as const,
          size: 40,
        };
      case 'delivery':
        return {
          backgroundColor: SuccessColors[500],
          icon: 'home' as const,
          size: 40,
        };
      case 'driver':
        return {
          backgroundColor: PrimaryColors[500],
          icon: vehicleType ? VEHICLE_ICONS[vehicleType] : ('car' as const),
          size: 44,
        };
    }
  };

  const config = getMarkerConfig();

  return (
    <View style={styles.markerContainer}>
      {type === 'driver' && (
        <Animated.View
          style={[
            styles.markerPulse,
            { backgroundColor: PrimaryColors[500], width: config.size, height: config.size },
            pulseStyle,
          ]}
        />
      )}
      <View
        style={[
          styles.markerView,
          {
            backgroundColor: config.backgroundColor,
            width: config.size,
            height: config.size,
            borderRadius: config.size / 2,
          },
        ]}
      >
        <Ionicons name={config.icon} size={config.size * 0.5} color={NeutralColors[0]} />
      </View>
    </View>
  );
}

interface RecenterButtonProps {
  onPress: () => void;
  colors: (typeof Colors)['light'];
}

/**
 * Button to recenter the map on the driver
 */
function RecenterButton({ onPress, colors }: RecenterButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.recenterButtonContainer, buttonStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.recenterButton, { backgroundColor: colors.card, ...Shadows.md }]}
        accessibilityLabel="Recenter map on driver"
        accessibilityRole="button"
        testID="recenter-button"
      >
        <Ionicons name="locate" size={24} color={PrimaryColors[500]} />
      </Pressable>
    </Animated.View>
  );
}

interface DriverInfoBadgeProps {
  driver: Driver;
  colors: (typeof Colors)['light'];
}

/**
 * Badge showing driver info on the map
 */
function DriverInfoBadge({ driver, colors }: DriverInfoBadgeProps) {
  return (
    <View
      style={[styles.driverBadge, { backgroundColor: colors.card, ...Shadows.md }]}
      testID="driver-info-badge"
    >
      <Ionicons name={VEHICLE_ICONS[driver.vehicle.type]} size={16} color={PrimaryColors[500]} />
      <Text style={[styles.driverName, { color: colors.text }]} numberOfLines={1}>
        {driver.name}
      </Text>
      {driver.vehicle.color && (
        <Text style={[styles.vehicleInfo, { color: colors.textSecondary }]}>
          {driver.vehicle.color} {driver.vehicle.model || driver.vehicle.type}
        </Text>
      )}
    </View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Order Tracking Map
 *
 * Displays an interactive map showing the order delivery progress
 * with restaurant, delivery location, and driver markers.
 */
export function OrderTrackingMap({
  restaurantLocation,
  restaurantName,
  deliveryLocation,
  deliveryAddress,
  driver,
  isPickedUp = false,
  testID = 'order-tracking-map',
}: OrderTrackingMapProps) {
  const mapRef = useRef<MapView>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  // Calculate initial region to fit all markers
  const initialRegion = useMemo(() => {
    const points: Coordinates[] = [restaurantLocation, deliveryLocation];
    if (driver?.currentLocation) {
      points.push(driver.currentLocation);
    }
    return calculateRegion(points);
  }, [restaurantLocation, deliveryLocation, driver?.currentLocation]);

  // Build the route polyline coordinates
  const routeCoordinates = useMemo(() => {
    const coords: Coordinates[] = [];

    if (isPickedUp && driver?.currentLocation) {
      // After pickup: driver -> delivery
      coords.push(driver.currentLocation, deliveryLocation);
    } else if (driver?.currentLocation) {
      // Before pickup: driver -> restaurant -> delivery
      coords.push(driver.currentLocation, restaurantLocation, deliveryLocation);
    } else {
      // No driver: restaurant -> delivery
      coords.push(restaurantLocation, deliveryLocation);
    }

    return coords;
  }, [restaurantLocation, deliveryLocation, driver?.currentLocation, isPickedUp]);

  // Recenter map on driver
  const handleRecenter = useCallback(() => {
    if (driver?.currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...driver.currentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    } else if (mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: MAP_PADDING,
        animated: true,
      });
    }
  }, [driver?.currentLocation, routeCoordinates]);

  // Fit map to show all markers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current && routeCoordinates.length > 0) {
        mapRef.current.fitToCoordinates(routeCoordinates, {
          edgePadding: MAP_PADDING,
          animated: true,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [routeCoordinates]);

  return (
    <View style={styles.container} testID={testID}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        rotateEnabled={false}
        pitchEnabled={false}
        customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
        testID="map-view"
      >
        {/* Route Polyline */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={PrimaryColors[500]}
          strokeWidth={4}
          lineDashPattern={isPickedUp ? undefined : [10, 5]}
          testID="route-polyline"
        />

        {/* Restaurant Marker - only show if not picked up */}
        {!isPickedUp && (
          <Marker
            coordinate={restaurantLocation}
            title={restaurantName}
            description="Pickup Location"
            testID="restaurant-marker"
          >
            <CustomMarkerView type="restaurant" />
          </Marker>
        )}

        {/* Delivery Address Marker */}
        <Marker
          coordinate={deliveryLocation}
          title="Delivery Location"
          description={deliveryAddress}
          testID="delivery-marker"
        >
          <CustomMarkerView type="delivery" />
        </Marker>

        {/* Driver Marker */}
        {driver?.currentLocation && (
          <Marker
            coordinate={driver.currentLocation}
            title={driver.name}
            description={`${driver.vehicle.color || ''} ${driver.vehicle.model || driver.vehicle.type}`.trim()}
            testID="driver-marker"
          >
            <CustomMarkerView type="driver" vehicleType={driver.vehicle.type} />
          </Marker>
        )}
      </MapView>

      {/* Driver Info Badge */}
      {driver && <DriverInfoBadge driver={driver} colors={colors} />}

      {/* Recenter Button */}
      <RecenterButton onPress={handleRecenter} colors={colors} />
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
  },
  map: {
    flex: 1,
    minHeight: 250,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPulse: {
    position: 'absolute',
    borderRadius: 100,
  },
  markerView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: NeutralColors[0],
  },
  recenterButtonContainer: {
    position: 'absolute',
    bottom: Spacing[4],
    right: Spacing[4],
  },
  recenterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverBadge: {
    position: 'absolute',
    top: Spacing[4],
    left: Spacing[4],
    right: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  driverName: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    flex: 1,
  },
  vehicleInfo: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
});

export default OrderTrackingMap;
