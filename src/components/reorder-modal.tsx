/**
 * Reorder Modal Component
 *
 * Displays a modal when reordering shows that some items are unavailable.
 * Allows the user to:
 * - See which items are unavailable
 * - Choose to proceed with available items only
 * - Cancel the reorder
 *
 * Features:
 * - Animated modal presentation
 * - Clear list of unavailable items
 * - Prominent action buttons
 * - Theme support
 */

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BorderRadius,
  Colors,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  Shadows,
  Spacing,
  Typography,
  WarningColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { AvailabilityCheckResult } from '@/hooks/use-reorder';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};

interface ReorderModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Availability check result containing available/unavailable items */
  availabilityResult: AvailabilityCheckResult | null;
  /** Called when user chooses to proceed with available items */
  onProceed: () => void;
  /** Called when user cancels the reorder */
  onCancel: () => void;
  /** Whether the reorder is in progress */
  isLoading?: boolean;
}

/**
 * Modal shown when some items in a reorder are unavailable
 */
export function ReorderModal({
  visible,
  availabilityResult,
  onProceed,
  onCancel,
  isLoading = false,
}: ReorderModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Animation values for buttons
  const proceedScale = useSharedValue(1);
  const cancelScale = useSharedValue(1);

  // Memoized data
  const unavailableItems = useMemo(
    () => availabilityResult?.unavailableItems ?? [],
    [availabilityResult]
  );

  const availableCount = useMemo(
    () => availabilityResult?.availableItems.length ?? 0,
    [availabilityResult]
  );

  // Button press handlers
  const handleProceedPressIn = useCallback(() => {
    proceedScale.value = withSpring(0.95, SPRING_CONFIG);
  }, [proceedScale]);

  const handleProceedPressOut = useCallback(() => {
    proceedScale.value = withSpring(1, SPRING_CONFIG);
  }, [proceedScale]);

  const handleCancelPressIn = useCallback(() => {
    cancelScale.value = withSpring(0.95, SPRING_CONFIG);
  }, [cancelScale]);

  const handleCancelPressOut = useCallback(() => {
    cancelScale.value = withSpring(1, SPRING_CONFIG);
  }, [cancelScale]);

  // Animated styles
  const proceedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: proceedScale.value }],
  }));

  const cancelButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelScale.value }],
  }));

  if (!availabilityResult) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        {/* Background overlay with fade animation */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.backdrop}
        >
          <Pressable style={styles.backdropPressable} onPress={onCancel} />
        </Animated.View>

        {/* Modal content with slide animation */}
        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(300)}
          exiting={SlideOutDown.duration(200)}
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              paddingBottom: insets.bottom + Spacing[4],
            },
          ]}
        >
          {/* Warning Icon */}
          <View style={[styles.iconContainer, { backgroundColor: WarningColors[100] }]}>
            <Ionicons name="alert-circle-outline" size={32} color={WarningColors[600]} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>Some Items Unavailable</Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {unavailableItems.length === 1
              ? '1 item from your order is currently unavailable.'
              : `${unavailableItems.length} items from your order are currently unavailable.`}
          </Text>

          {/* Unavailable items list */}
          <View style={[styles.itemsContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.itemsHeader, { color: colors.textSecondary }]}>
              Unavailable Items:
            </Text>
            <ScrollView
              style={styles.itemsList}
              contentContainerStyle={styles.itemsListContent}
              showsVerticalScrollIndicator={false}
            >
              {unavailableItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemBullet}>
                    <Ionicons name="close-circle" size={16} color={WarningColors[500]} />
                  </View>
                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                    {item.quantity}x {item.menuItem.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Available items count */}
          {availableCount > 0 && (
            <View style={styles.availableInfo}>
              <Ionicons name="checkmark-circle" size={18} color={PrimaryColors[500]} />
              <Text style={[styles.availableText, { color: colors.textSecondary }]}>
                {availableCount} {availableCount === 1 ? 'item is' : 'items are'} still available
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonsContainer}>
            {/* Cancel button */}
            <AnimatedPressable
              onPress={onCancel}
              onPressIn={handleCancelPressIn}
              onPressOut={handleCancelPressOut}
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border },
                cancelButtonStyle,
              ]}
              accessibilityLabel="Cancel reorder"
              accessibilityRole="button"
              testID="reorder-modal-cancel"
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </AnimatedPressable>

            {/* Proceed button */}
            {availableCount > 0 && (
              <AnimatedPressable
                onPress={onProceed}
                onPressIn={handleProceedPressIn}
                onPressOut={handleProceedPressOut}
                disabled={isLoading}
                style={[
                  styles.button,
                  styles.proceedButton,
                  { backgroundColor: PrimaryColors[500] },
                  isLoading && styles.buttonDisabled,
                  proceedButtonStyle,
                ]}
                accessibilityLabel="Proceed with available items"
                accessibilityRole="button"
                testID="reorder-modal-proceed"
              >
                {isLoading ? (
                  <Text style={styles.proceedButtonText}>Adding...</Text>
                ) : (
                  <Text style={styles.proceedButtonText}>
                    Add {availableCount} {availableCount === 1 ? 'Item' : 'Items'}
                  </Text>
                )}
              </AnimatedPressable>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing[6],
    alignItems: 'center',
    ...Shadows.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  description: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: 'center',
    marginBottom: Spacing[4],
  },
  itemsContainer: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    maxHeight: 200,
  },
  itemsHeader: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[2],
  },
  itemsList: {
    maxHeight: 150,
  },
  itemsListContent: {
    gap: Spacing[2],
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  itemBullet: {
    width: 20,
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  availableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  availableText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing[3],
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  proceedButton: {},
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
  },
  proceedButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    color: NeutralColors[0],
  },
});
