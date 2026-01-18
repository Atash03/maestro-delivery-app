/**
 * Issue Status Tracking Screen
 *
 * Displays the current status and timeline of a reported issue.
 * Features:
 * - Issue summary (category, description, photos)
 * - Status timeline with animations:
 *   - Reported
 *   - Under Review
 *   - Resolved/Refunded
 * - Resolution details when complete
 * - Contact support option
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, type TextStyle, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  FontWeights,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { getOrderById } from '@/data/mock/orders';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useIssueStore } from '@/stores';
import type { Issue, IssueStatus, Order } from '@/types';

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_TITLES: Record<string, string> = {
  missing_items: 'Missing Items',
  wrong_items: 'Wrong Items',
  food_quality: 'Food Quality',
  late_delivery: 'Late Delivery',
  order_never_arrived: 'Order Never Arrived',
  other: 'Other Issue',
};

const STATUS_CONFIG: Record<
  IssueStatus,
  {
    label: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
  }
> = {
  reported: {
    label: 'Reported',
    description: 'Your issue has been submitted',
    icon: 'document-text-outline',
    isActive: true,
  },
  under_review: {
    label: 'Under Review',
    description: 'Our team is reviewing your report',
    icon: 'search-outline',
    isActive: true,
  },
  resolved: {
    label: 'Resolved',
    description: 'Your issue has been resolved',
    icon: 'checkmark-circle-outline',
    isActive: true,
  },
  refunded: {
    label: 'Refunded',
    description: 'A refund has been processed',
    icon: 'card-outline',
    isActive: true,
  },
};

const STATUS_ORDER: IssueStatus[] = ['reported', 'under_review', 'resolved'];

// ============================================================================
// Helper Functions
// ============================================================================

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStatusIndex(status: IssueStatus): number {
  if (status === 'refunded') return 2; // Same position as resolved
  return STATUS_ORDER.indexOf(status);
}

// ============================================================================
// Timeline Step Component
// ============================================================================

interface TimelineStepProps {
  status: IssueStatus;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
  timestamp?: Date;
  index: number;
}

function TimelineStep({
  label,
  description,
  icon,
  isCompleted,
  isCurrent,
  isLast,
  timestamp,
  index,
}: TimelineStepProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const pulseScale = useSharedValue(1);

  // Pulse animation for current step
  useEffect(() => {
    if (isCurrent) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.1, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [isCurrent, pulseScale]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const getIconColor = () => {
    if (isCompleted) return colors.success;
    if (isCurrent) return colors.primary;
    return colors.textTertiary;
  };

  const getBackgroundColor = () => {
    if (isCompleted) return colors.successLight;
    if (isCurrent) return colors.primaryLight;
    return colors.backgroundSecondary;
  };

  const getLineColor = () => {
    if (isCompleted) return colors.success;
    return colors.border;
  };

  return (
    <Animated.View
      entering={FadeInLeft.delay(300 + index * 150).duration(AnimationDurations.normal)}
      style={styles.timelineStep}
    >
      {/* Icon and Line */}
      <View style={styles.timelineIconColumn}>
        <Animated.View
          style={[
            styles.timelineIconContainer,
            { backgroundColor: getBackgroundColor() },
            isCurrent && pulseAnimatedStyle,
          ]}
        >
          <Ionicons name={isCompleted ? 'checkmark' : icon} size={20} color={getIconColor()} />
        </Animated.View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: getLineColor() }]} />}
      </View>

      {/* Content */}
      <View style={styles.timelineContent}>
        <Text
          style={[
            styles.timelineLabel,
            {
              color: isCompleted || isCurrent ? colors.text : colors.textTertiary,
              fontWeight: isCurrent
                ? (FontWeights.bold as TextStyle['fontWeight'])
                : (FontWeights.medium as TextStyle['fontWeight']),
            },
          ]}
        >
          {label}
        </Text>
        <Text style={[styles.timelineDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
        {timestamp && (isCompleted || isCurrent) && (
          <Text style={[styles.timelineTimestamp, { color: colors.textTertiary }]}>
            {formatDate(timestamp)}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Issue Summary Card Component
// ============================================================================

interface IssueSummaryCardProps {
  issue: Issue;
  order: Order | null;
}

function IssueSummaryCard({ issue, order }: IssueSummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}>
      <Card variant="outlined" padding="md" radius="lg">
        {/* Category Badge */}
        <View style={styles.categoryBadgeRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="alert-circle" size={14} color={colors.primary} />
            <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
              {CATEGORY_TITLES[issue.category] || 'Issue'}
            </Text>
          </View>
          <Text style={[styles.issueId, { color: colors.textTertiary }]}>{issue.id}</Text>
        </View>

        {/* Restaurant Info */}
        {order && (
          <View style={styles.restaurantRow}>
            <Image
              source={{ uri: order.restaurant.image }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
                {order.restaurant.name}
              </Text>
              <Text style={[styles.orderMeta, { color: colors.textSecondary }]}>
                Order #{order.id.slice(-4)}
              </Text>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={[styles.descriptionSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.descriptionLabel, { color: colors.textSecondary }]}>
            Description
          </Text>
          <Text style={[styles.descriptionText, { color: colors.text }]}>{issue.description}</Text>
        </View>

        {/* Photos */}
        {issue.photos && issue.photos.length > 0 && (
          <View style={styles.photosSection}>
            <Text style={[styles.photosLabel, { color: colors.textSecondary }]}>
              Attached Photos ({issue.photos.length})
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosContainer}
            >
              {issue.photos.map((uri, index) => (
                <Image
                  key={`photo-${index}`}
                  source={{ uri }}
                  style={styles.photoThumbnail}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Reported Date */}
        <View style={styles.reportedDateRow}>
          <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.reportedDateText, { color: colors.textTertiary }]}>
            Reported on {formatDate(issue.createdAt)}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}

// ============================================================================
// Resolution Card Component
// ============================================================================

interface ResolutionCardProps {
  issue: Issue;
}

function ResolutionCard({ issue }: ResolutionCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const isResolved = issue.status === 'resolved' || issue.status === 'refunded';
  if (!isResolved) return null;

  return (
    <Animated.View entering={FadeInDown.delay(600).duration(AnimationDurations.normal)}>
      <Card
        variant="filled"
        padding="md"
        radius="lg"
        style={{ backgroundColor: colors.successLight }}
      >
        <View style={styles.resolutionHeader}>
          <View style={[styles.resolutionIconContainer, { backgroundColor: colors.success }]}>
            <Ionicons
              name={issue.status === 'refunded' ? 'card' : 'checkmark-circle'}
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.resolutionHeaderText}>
            <Text style={[styles.resolutionTitle, { color: colors.success }]}>
              {issue.status === 'refunded' ? 'Refund Processed' : 'Issue Resolved'}
            </Text>
            {issue.resolvedAt && (
              <Text style={[styles.resolutionDate, { color: colors.textSecondary }]}>
                {formatDate(issue.resolvedAt)}
              </Text>
            )}
          </View>
        </View>

        {issue.resolution && (
          <View style={[styles.resolutionDetails, { borderTopColor: colors.border }]}>
            <Text style={[styles.resolutionLabel, { color: colors.textSecondary }]}>
              Resolution Details
            </Text>
            <Text style={[styles.resolutionText, { color: colors.text }]}>{issue.resolution}</Text>
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

// ============================================================================
// Contact Support Card Component
// ============================================================================

interface ContactSupportCardProps {
  onPress: () => void;
}

function ContactSupportCard({ onPress }: ContactSupportCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <Animated.View
      entering={FadeInDown.delay(700).duration(AnimationDurations.normal)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.contactCard, { backgroundColor: colors.card }, Shadows.sm]}
        accessibilityRole="button"
        accessibilityLabel="Contact support for help with this issue"
      >
        <View style={[styles.contactIconContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.contactTextContainer}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Need more help?</Text>
          <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
            Contact our support team
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Issue Status Screen
// ============================================================================

export default function IssueStatusScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { issueId } = useLocalSearchParams<{ issueId: string }>();

  // Stores
  const { getIssueById, setCurrentIssue } = useIssueStore();

  // State
  const [issue, setIssue] = useState<Issue | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch issue and order data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const fetchedIssue = getIssueById(issueId || '');
      if (fetchedIssue) {
        setIssue(fetchedIssue);
        setCurrentIssue(fetchedIssue);
        const fetchedOrder = getOrderById(fetchedIssue.orderId);
        setOrder(fetchedOrder || null);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [issueId, getIssueById, setCurrentIssue]);

  // Get current status index
  const currentStatusIndex = useMemo(() => {
    if (!issue) return -1;
    return getStatusIndex(issue.status);
  }, [issue]);

  // Handlers
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleContactSupport = useCallback(() => {
    router.push('/support');
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
          <Pressable
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Issue Status</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(AnimationDurations.normal)}
            style={[styles.loadingSpinner, { borderColor: colors.primary }]}
          />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading issue details...
          </Text>
        </View>
      </View>
    );
  }

  // Issue not found state
  if (!issue) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
          <Pressable
            onPress={handleGoBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Issue Status</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <View style={[styles.errorIconContainer, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Issue Not Found</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            We couldn't find the issue you're looking for. It may have been removed or the link is
            invalid.
          </Text>
          <Pressable
            onPress={handleGoBack}
            style={[styles.errorButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
        <Pressable
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Issue Status</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing[4] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Issue Summary */}
        <IssueSummaryCard issue={issue} order={order} />

        {/* Status Timeline */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}
          style={styles.timelineSection}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Status Timeline</Text>

          <View style={styles.timelineContainer}>
            {STATUS_ORDER.map((status, index) => {
              const config = STATUS_CONFIG[status];
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isLast = index === STATUS_ORDER.length - 1;

              // For resolved status, check if it's actually refunded
              const displayLabel =
                status === 'resolved' && issue.status === 'refunded'
                  ? STATUS_CONFIG.refunded.label
                  : config.label;
              const displayDescription =
                status === 'resolved' && issue.status === 'refunded'
                  ? STATUS_CONFIG.refunded.description
                  : config.description;
              const displayIcon =
                status === 'resolved' && issue.status === 'refunded'
                  ? STATUS_CONFIG.refunded.icon
                  : config.icon;

              // Get timestamp based on status
              let timestamp: Date | undefined;
              if (status === 'reported') {
                timestamp = issue.createdAt;
              } else if (status === 'resolved' && (isCompleted || isCurrent)) {
                timestamp = issue.resolvedAt;
              } else if (isCurrent) {
                timestamp = issue.updatedAt;
              }

              return (
                <TimelineStep
                  key={status}
                  status={status}
                  label={displayLabel}
                  description={displayDescription}
                  icon={displayIcon}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isLast={isLast}
                  timestamp={timestamp}
                  index={index}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Resolution Details */}
        <ResolutionCard issue={issue} />

        {/* Contact Support */}
        <ContactSupportCard onPress={handleContactSupport} />

        {/* Info Note */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(AnimationDurations.normal)}
          style={[styles.infoNote, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.infoNoteText, { color: colors.textSecondary }]}>
            We typically respond to issues within 24-48 hours. You'll receive a notification when
            there's an update.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  backButton: {
    padding: Spacing[1],
  },
  headerTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    gap: Spacing[5],
  },

  // Section Title
  sectionTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[4],
  },

  // Issue Summary Card
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.md,
    gap: Spacing[1],
  },
  categoryBadgeText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
  },
  issueId: {
    ...Typography.xs,
    fontFamily: 'monospace',
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  orderMeta: {
    ...Typography.sm,
  },
  descriptionSection: {
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    marginTop: Spacing[1],
  },
  descriptionLabel: {
    ...Typography.xs,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[1],
  },
  descriptionText: {
    ...Typography.base,
    lineHeight: 22,
  },
  photosSection: {
    marginTop: Spacing[3],
  },
  photosLabel: {
    ...Typography.xs,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
  },
  photosContainer: {
    gap: Spacing[2],
  },
  photoThumbnail: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
  },
  reportedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    marginTop: Spacing[3],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  reportedDateText: {
    ...Typography.xs,
  },

  // Timeline
  timelineSection: {
    marginTop: Spacing[1],
  },
  timelineContainer: {
    gap: 0,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  timelineIconColumn: {
    alignItems: 'center',
    width: 40,
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginVertical: Spacing[1],
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing[4],
  },
  timelineLabel: {
    ...Typography.base,
    marginBottom: Spacing[0.5],
  },
  timelineDescription: {
    ...Typography.sm,
    marginBottom: Spacing[1],
  },
  timelineTimestamp: {
    ...Typography.xs,
  },

  // Resolution Card
  resolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  resolutionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolutionHeaderText: {
    flex: 1,
  },
  resolutionTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  resolutionDate: {
    ...Typography.sm,
  },
  resolutionDetails: {
    marginTop: Spacing[3],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
  },
  resolutionLabel: {
    ...Typography.xs,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[1],
  },
  resolutionText: {
    ...Typography.base,
    lineHeight: 22,
  },

  // Contact Card
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[3],
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    ...Typography.base,
    fontWeight: FontWeights.medium as TextStyle['fontWeight'],
    marginBottom: Spacing[0.5],
  },
  contactDescription: {
    ...Typography.sm,
  },

  // Info Note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  infoNoteText: {
    ...Typography.sm,
    flex: 1,
    lineHeight: 20,
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[4],
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderTopColor: 'transparent',
  },
  loadingText: {
    ...Typography.base,
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    gap: Spacing[3],
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  errorTitle: {
    ...Typography.xl,
    fontWeight: FontWeights.bold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  errorText: {
    ...Typography.base,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  errorButton: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[2],
  },
  errorButtonText: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as TextStyle['fontWeight'],
    color: '#FFFFFF',
  },
});

// Export for testing
export { STATUS_CONFIG, STATUS_ORDER, CATEGORY_TITLES, formatDate, getStatusIndex };
