/**
 * DeliveryAddressHeader component
 *
 * Displays the current delivery address in the home screen header.
 * Tappable to open an address picker modal for selecting a different address.
 * Features animated dropdown arrow and smooth press feedback.
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ScalePress } from '@/components/animations';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores';
import type { Address } from '@/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface DeliveryAddressHeaderProps {
  /** Called when user selects a new address */
  onAddressChange?: (address: Address) => void;
  /** Called when user taps to add a new address */
  onAddNewAddress?: () => void;
}

/**
 * DeliveryAddressHeader - Header component for selecting delivery address
 *
 * @example
 * <DeliveryAddressHeader
 *   onAddressChange={(address) => console.log('Selected:', address)}
 *   onAddNewAddress={() => navigation.navigate('AddAddress')}
 * />
 */
export function DeliveryAddressHeader({
  onAddressChange,
  onAddNewAddress,
}: DeliveryAddressHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { user, isGuest, setDefaultAddress } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animated rotation for dropdown arrow
  const arrowRotation = useSharedValue(0);

  // Get the current default address
  const currentAddress = user?.addresses.find((addr) => addr.isDefault);

  // Get display text for address
  const getDisplayText = () => {
    if (isGuest) {
      return 'Set delivery location';
    }
    if (!currentAddress) {
      return 'Add delivery address';
    }
    return currentAddress.street;
  };

  const getSubText = () => {
    if (isGuest || !currentAddress) {
      return 'Tap to select';
    }
    return `${currentAddress.city}, ${currentAddress.zipCode}`;
  };

  const handlePress = useCallback(() => {
    setIsModalOpen(true);
    arrowRotation.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [arrowRotation]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    arrowRotation.value = withSpring(0, { damping: 15, stiffness: 200 });
  }, [arrowRotation]);

  const handleSelectAddress = useCallback(
    (address: Address) => {
      setDefaultAddress(address.id);
      onAddressChange?.(address);
      handleClose();
    },
    [setDefaultAddress, onAddressChange, handleClose]
  );

  const handleAddNew = useCallback(() => {
    handleClose();
    onAddNewAddress?.();
  }, [handleClose, onAddNewAddress]);

  // Animated style for dropdown arrow
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(arrowRotation.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  // Press animation
  const scale = useSharedValue(1);
  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: AnimationDurations.instant });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, pressAnimatedStyle]}
        accessibilityRole="button"
        accessibilityLabel="Select delivery address"
        accessibilityHint="Opens address selection modal"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={24} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Deliver to</Text>
          <View style={styles.addressRow}>
            <Text
              style={[styles.addressText, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {getDisplayText()}
            </Text>
            <Animated.View style={arrowStyle}>
              <Ionicons name="chevron-down" size={18} color={colors.text} />
            </Animated.View>
          </View>
          <Text style={[styles.subText, { color: colors.textTertiary }]} numberOfLines={1}>
            {getSubText()}
          </Text>
        </View>
      </AnimatedPressable>

      {/* Address Picker Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <AddressPickerModal
          addresses={user?.addresses || []}
          currentAddressId={currentAddress?.id}
          onSelect={handleSelectAddress}
          onAddNew={handleAddNew}
          onClose={handleClose}
          isGuest={isGuest}
        />
      </Modal>
    </>
  );
}

// ============================================================================
// Address Picker Modal
// ============================================================================

interface AddressPickerModalProps {
  addresses: Address[];
  currentAddressId?: string;
  onSelect: (address: Address) => void;
  onAddNew: () => void;
  onClose: () => void;
  isGuest: boolean;
}

function AddressPickerModal({
  addresses,
  currentAddressId,
  onSelect,
  onAddNew,
  onClose,
  isGuest,
}: AddressPickerModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getLabelIcon = (label: Address['label']): keyof typeof Ionicons.glyphMap => {
    switch (label) {
      case 'Home':
        return 'home';
      case 'Work':
        return 'briefcase';
      default:
        return 'location';
    }
  };

  return (
    <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Delivery Address</Text>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close address picker"
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Address List */}
      <ScrollView
        style={styles.addressList}
        contentContainerStyle={styles.addressListContent}
        showsVerticalScrollIndicator={false}
      >
        {isGuest ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <Ionicons name="location-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved addresses</Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Sign in to save your delivery addresses for faster checkout.
              </Text>
            </View>
          </Animated.View>
        ) : addresses.length === 0 ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <Ionicons name="location-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No addresses yet</Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Add your first delivery address to get started.
              </Text>
            </View>
          </Animated.View>
        ) : (
          addresses.map((address, index) => (
            <Animated.View
              key={address.id}
              entering={FadeIn.duration(300).delay(index * 50)}
              exiting={FadeOut.duration(200)}
            >
              <ScalePress onPress={() => onSelect(address)} pressedScale={0.98}>
                <View
                  style={[
                    styles.addressCard,
                    { backgroundColor: colors.card },
                    address.id === currentAddressId && {
                      borderColor: colors.primary,
                      borderWidth: 2,
                    },
                    Shadows.sm,
                  ]}
                >
                  <View
                    style={[
                      styles.addressIconContainer,
                      {
                        backgroundColor:
                          address.id === currentAddressId
                            ? PrimaryColors[100]
                            : colors.backgroundSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={getLabelIcon(address.label)}
                      size={20}
                      color={
                        address.id === currentAddressId ? colors.primary : colors.textSecondary
                      }
                    />
                  </View>

                  <View style={styles.addressInfo}>
                    <View style={styles.addressLabelRow}>
                      <Text style={[styles.addressLabel, { color: colors.text }]}>
                        {address.label}
                      </Text>
                      {address.isDefault && (
                        <View
                          style={[styles.defaultBadge, { backgroundColor: colors.primaryLight }]}
                        >
                          <Text style={[styles.defaultBadgeText, { color: colors.primary }]}>
                            Default
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[styles.addressStreet, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {address.street}
                    </Text>
                    <Text
                      style={[styles.addressCity, { color: colors.textTertiary }]}
                      numberOfLines={1}
                    >
                      {address.city}, {address.zipCode}
                    </Text>
                    {address.instructions && (
                      <Text
                        style={[styles.addressInstructions, { color: colors.textTertiary }]}
                        numberOfLines={1}
                      >
                        Note: {address.instructions}
                      </Text>
                    )}
                  </View>

                  {address.id === currentAddressId && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </View>
              </ScalePress>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Add New Address Button */}
      {!isGuest && (
        <View style={[styles.addButtonContainer, { borderTopColor: colors.border }]}>
          <ScalePress onPress={onAddNew} pressedScale={0.98}>
            <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </View>
          </ScalePress>
        </View>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: PrimaryColors[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[3],
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing[2],
  },
  label: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  addressText: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
    flex: 1,
  },
  subText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    marginTop: 2,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: '600',
  },
  addressList: {
    flex: 1,
  },
  addressListContent: {
    padding: Spacing[4],
    gap: Spacing[3],
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: Typography.lg.fontSize,
    lineHeight: Typography.lg.lineHeight,
    fontWeight: '600',
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  emptyDescription: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
  },

  // Address card
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[3],
  },
  addressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[3],
  },
  addressInfo: {
    flex: 1,
    marginRight: Spacing[2],
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[0.5],
  },
  addressLabel: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
  defaultBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: '600',
  },
  addressStreet: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  addressCity: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  addressInstructions: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginTop: Spacing[1],
    fontStyle: 'italic',
  },

  // Add button
  addButtonContainer: {
    padding: Spacing[4],
    borderTopWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: '600',
  },
});
