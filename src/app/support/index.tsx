/**
 * Help Center screen - Support hub with FAQ sections
 * Provides self-service support options and contact information
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
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
import { useColorScheme } from '@/hooks/use-color-scheme';

// ============================================================================
// Types
// ============================================================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  faqs: FAQItem[];
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route?: string;
  action?: () => void;
}

// ============================================================================
// Mock Data
// ============================================================================

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'order-issues',
    title: 'Order Issues',
    icon: 'bag-handle-outline',
    description: 'Missing items, wrong orders, and delivery problems',
    faqs: [
      {
        id: 'missing-items',
        question: 'What should I do if my order is missing items?',
        answer:
          'If your order is missing items, go to your order history, select the order, and tap "Report Issue". Select "Missing items" and specify which items were not included. We\'ll review your request and process a refund for the missing items within 24-48 hours.',
      },
      {
        id: 'wrong-order',
        question: 'I received the wrong order. What now?',
        answer:
          "We apologize for the mix-up. Please report the issue through the app by going to Orders > Select the order > Report Issue > Wrong items. Include photos if possible. We'll arrange a refund or redelivery based on your preference.",
      },
      {
        id: 'order-late',
        question: 'My order is taking longer than expected',
        answer:
          'Delivery times can vary due to restaurant preparation time, traffic, or high demand. You can track your order in real-time through the app. If your order is significantly delayed beyond the estimated time, contact support for assistance.',
      },
      {
        id: 'order-never-arrived',
        question: 'My order never arrived',
        answer:
          "We're sorry to hear that. First, check the delivery instructions and contact information on your order. If the driver marked it as delivered but you didn't receive it, report the issue immediately through the app. We'll investigate and process a full refund if the delivery was not completed.",
      },
      {
        id: 'food-quality',
        question: 'The food quality was not as expected',
        answer:
          "We take food quality seriously. Please report quality issues through the app with photos if possible. Include details about what was wrong. We'll work with the restaurant to address the issue and may offer a refund or credit depending on the situation.",
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment Questions',
    icon: 'card-outline',
    description: 'Billing, refunds, and payment methods',
    faqs: [
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), as well as Cash on Delivery in select areas. You can save multiple payment methods in your profile for faster checkout.',
      },
      {
        id: 'refund-time',
        question: 'How long does a refund take?',
        answer:
          'Refunds are typically processed within 24-48 hours. However, it may take 3-10 business days for the refund to appear on your statement, depending on your bank or card issuer.',
      },
      {
        id: 'double-charge',
        question: 'I was charged twice for my order',
        answer:
          "Double charges are usually pending authorizations that will automatically disappear within 3-5 business days. If you see two actual charges after this period, please contact support with your order details and we'll resolve it immediately.",
      },
      {
        id: 'promo-code',
        question: "My promo code isn't working",
        answer:
          'Promo codes may have specific requirements such as minimum order amount, valid restaurants, or first-time user restrictions. Check the promo details for any conditions. If you believe the code should work, contact support with the promo code and your order details.',
      },
      {
        id: 'receipt',
        question: 'How can I get a receipt for my order?',
        answer:
          'You can find receipts for all orders in your order history. Tap on any order to view the full details including an itemized receipt. You can also request an email copy of any receipt through the order details screen.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account Settings',
    icon: 'person-outline',
    description: 'Profile, addresses, and preferences',
    faqs: [
      {
        id: 'change-email',
        question: 'How do I change my email address?',
        answer:
          "Go to Profile > Edit Profile to update your email address. You'll need to verify the new email address before the change takes effect.",
      },
      {
        id: 'delete-account',
        question: 'How do I delete my account?',
        answer:
          'To delete your account, go to Profile > Help Center > Contact Support. Request account deletion and our team will process it within 48 hours. Note that this action is irreversible and all your order history and saved data will be permanently deleted.',
      },
      {
        id: 'reset-password',
        question: 'I forgot my password. How do I reset it?',
        answer:
          'On the sign-in screen, tap "Forgot Password?" and enter your email address. We\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder or try again.',
      },
      {
        id: 'update-address',
        question: 'How do I add or edit delivery addresses?',
        answer:
          'Go to Profile > Edit Profile > Saved Addresses. You can add new addresses, edit existing ones, or set a default address. You can also add delivery instructions for each address.',
      },
      {
        id: 'notifications',
        question: 'How do I manage my notification settings?',
        answer:
          'Go to Profile > Notifications to customize which notifications you receive. You can control order updates, promotional messages, and special offers separately.',
      },
    ],
  },
  {
    id: 'restaurant',
    title: 'Restaurant Feedback',
    icon: 'restaurant-outline',
    description: 'Reviews, ratings, and suggestions',
    faqs: [
      {
        id: 'leave-review',
        question: 'How do I leave a review for a restaurant?',
        answer:
          "After your order is delivered, you'll receive a prompt to rate your experience. You can also go to Orders > Select an order > Rate Order. You can rate both the restaurant and the delivery experience separately.",
      },
      {
        id: 'edit-review',
        question: 'Can I edit or delete my review?',
        answer:
          'Currently, reviews can be edited within 24 hours of posting. After that, please contact support if you need to modify or remove a review.',
      },
      {
        id: 'report-restaurant',
        question: 'How do I report a problem with a restaurant?',
        answer:
          'You can report issues through your order history by selecting the specific order and tapping "Report Issue". For general concerns about a restaurant, contact our support team with the restaurant name and details.',
      },
      {
        id: 'suggest-restaurant',
        question: 'How can I suggest a new restaurant?',
        answer:
          "We're always looking to add new restaurants. Contact our support team with the restaurant name and location, and we'll reach out to them about joining Maestro.",
      },
      {
        id: 'allergen-info',
        question: 'Where can I find allergen information?',
        answer:
          'Allergen information is displayed on each menu item when available. If you have specific dietary requirements, we recommend contacting the restaurant directly or adding special instructions to your order.',
      },
    ],
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'recent-orders',
    title: 'View Recent Orders',
    icon: 'receipt-outline',
    description: 'Check your order history',
    route: '/(tabs)/orders',
  },
  {
    id: 'contact-support',
    title: 'Contact Support',
    icon: 'chatbubbles-outline',
    description: 'Chat with our team',
  },
  {
    id: 'report-issue',
    title: 'Report an Issue',
    icon: 'warning-outline',
    description: 'Report order problems',
    route: '/(tabs)/orders',
  },
];

// ============================================================================
// FAQ Accordion Item Component
// ============================================================================

interface FAQAccordionItemProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQAccordionItem({ faq, isExpanded, onToggle }: FAQAccordionItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(0);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = useCallback(() => {
    rotation.value = withSpring(isExpanded ? 0 : 180, { damping: 15, stiffness: 200 });
    onToggle();
  }, [isExpanded, onToggle, rotation]);

  // Update rotation when isExpanded changes externally
  rotation.value = withTiming(isExpanded ? 180 : 0, { duration: AnimationDurations.fast });

  return (
    <Animated.View layout={Layout.springify()} style={styles.faqItem}>
      <Pressable
        onPress={handleToggle}
        style={[styles.faqQuestionContainer, isExpanded && styles.faqQuestionExpanded]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={faq.question}
      >
        <Text
          style={[styles.faqQuestion, { color: colors.text }]}
          numberOfLines={isExpanded ? undefined : 2}
        >
          {faq.question}
        </Text>
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(AnimationDurations.fast)}
          exiting={FadeOut.duration(AnimationDurations.fast)}
        >
          <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ============================================================================
// FAQ Category Section Component
// ============================================================================

interface FAQCategorySectionProps {
  category: FAQCategory;
  isExpanded: boolean;
  expandedFAQId: string | null;
  onToggleCategory: () => void;
  onToggleFAQ: (faqId: string) => void;
  searchQuery: string;
}

function FAQCategorySection({
  category,
  isExpanded,
  expandedFAQId,
  onToggleCategory,
  onToggleFAQ,
  searchQuery,
}: FAQCategorySectionProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const rotation = useSharedValue(isExpanded ? 90 : 0);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = useCallback(() => {
    rotation.value = withSpring(isExpanded ? 0 : 90, { damping: 15, stiffness: 200 });
    onToggleCategory();
  }, [isExpanded, onToggleCategory, rotation]);

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return category.faqs;
    const query = searchQuery.toLowerCase();
    return category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
    );
  }, [category.faqs, searchQuery]);

  // Don't render if no matching FAQs when searching
  if (searchQuery && filteredFAQs.length === 0) {
    return null;
  }

  return (
    <Animated.View layout={Layout.springify()} style={styles.categorySection}>
      <Pressable
        onPress={handleToggle}
        style={[styles.categoryHeader, { backgroundColor: colors.backgroundSecondary }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${category.title}: ${category.description}`}
      >
        <View style={styles.categoryHeaderLeft}>
          <View style={[styles.categoryIconContainer, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name={category.icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
            <Text
              style={[styles.categoryDescription, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {category.description}
            </Text>
          </View>
        </View>
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(AnimationDurations.fast)}
          exiting={FadeOut.duration(AnimationDurations.fast)}
          style={[styles.faqList, { borderColor: colors.border }]}
        >
          {filteredFAQs.map((faq, index) => (
            <View key={faq.id}>
              <FAQAccordionItem
                faq={faq}
                isExpanded={expandedFAQId === faq.id}
                onToggle={() => onToggleFAQ(faq.id)}
              />
              {index < filteredFAQs.length - 1 && (
                <View style={[styles.faqDivider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ============================================================================
// Quick Action Card Component
// ============================================================================

interface QuickActionCardProps {
  action: QuickAction;
  onPress: () => void;
}

function QuickActionCard({ action, onPress }: QuickActionCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.quickActionCard, { backgroundColor: colors.card }, Shadows.sm]}
        accessibilityRole="button"
        accessibilityLabel={`${action.title}: ${action.description}`}
      >
        <View style={[styles.quickActionIconContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name={action.icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.quickActionTextContainer}>
          <Text style={[styles.quickActionTitle, { color: colors.text }]}>{action.title}</Text>
          <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
            {action.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Search Bar Component
// ============================================================================

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: isFocused ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons name="search" size={20} color={isFocused ? colors.primary : colors.textTertiary} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder="Search FAQs..."
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

// ============================================================================
// Main Help Center Screen
// ============================================================================

export default function HelpCenterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [expandedFAQId, setExpandedFAQId] = useState<string | null>(null);

  const handleToggleCategory = useCallback((categoryId: string) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    setExpandedFAQId(null); // Reset expanded FAQ when changing category
  }, []);

  const handleToggleFAQ = useCallback((faqId: string) => {
    setExpandedFAQId((prev) => (prev === faqId ? null : faqId));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      if (action.route) {
        router.push(action.route as never);
      } else if (action.id === 'contact-support') {
        // Mock contact support action - could open email, chat, etc.
        // For now, we'll just show an alert-like behavior through navigation
        router.push('/(tabs)/profile');
      }
    },
    [router]
  );

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Check if any FAQs match the search query
  const hasSearchResults = useMemo(() => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return FAQ_CATEGORIES.some((category) =>
      category.faqs.some(
        (faq) =>
          faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  // Expand all categories when searching
  const getIsCategoryExpanded = useCallback(
    (categoryId: string) => {
      if (searchQuery) return true; // Expand all when searching
      return expandedCategoryId === categoryId;
    },
    [searchQuery, expandedCategoryId]
  );

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help Center</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing[4] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}>
          <View style={styles.heroSection}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>How can we help you?</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Search our FAQ or browse topics below
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(150).duration(AnimationDurations.normal)}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={handleClearSearch}
          />
        </Animated.View>

        {/* Quick Actions */}
        {!searchQuery && (
          <Animated.View entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard
                  key={action.id}
                  action={action}
                  onPress={() => handleQuickAction(action)}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* FAQ Sections */}
        <Animated.View entering={FadeInDown.delay(250).duration(AnimationDurations.normal)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
          </Text>

          {hasSearchResults ? (
            <View style={styles.categoriesContainer}>
              {FAQ_CATEGORIES.map((category) => (
                <FAQCategorySection
                  key={category.id}
                  category={category}
                  isExpanded={getIsCategoryExpanded(category.id)}
                  expandedFAQId={expandedFAQId}
                  onToggleCategory={() => handleToggleCategory(category.id)}
                  onToggleFAQ={handleToggleFAQ}
                  searchQuery={searchQuery}
                />
              ))}
            </View>
          ) : (
            <View
              style={[styles.noResultsContainer, { backgroundColor: colors.backgroundSecondary }]}
            >
              <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.noResultsTitle, { color: colors.text }]}>No results found</Text>
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                Try searching with different keywords or browse our FAQ categories
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Contact Support Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(AnimationDurations.normal)}>
          <Card variant="filled" padding="lg" radius="lg" style={styles.contactCard}>
            <View style={styles.contactCardContent}>
              <View style={[styles.contactIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="headset-outline" size={28} color={colors.primary} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={[styles.contactTitle, { color: colors.text }]}>Still need help?</Text>
                <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                  Our support team is available 24/7 to assist you
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={() => handleQuickAction(QUICK_ACTIONS[1])}
              accessibilityRole="button"
              accessibilityLabel="Contact Support"
            >
              <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </Pressable>
          </Card>
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
    fontWeight: FontWeights.bold as '700',
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
  },

  // Hero Section
  heroSection: {
    marginBottom: Spacing[4],
    alignItems: 'center',
  },
  heroTitle: {
    ...Typography['2xl'],
    fontWeight: FontWeights.bold as '700',
    marginBottom: Spacing[1],
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.base,
    textAlign: 'center',
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2.5] || Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing[6],
    gap: Spacing[2],
  },
  searchInput: {
    flex: 1,
    ...Typography.base,
    padding: 0,
  },

  // Section Title
  sectionTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
    marginBottom: Spacing[3],
  },

  // Quick Actions
  quickActionsContainer: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[3],
  },
  quickActionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTextContainer: {
    flex: 1,
  },
  quickActionTitle: {
    ...Typography.base,
    fontWeight: FontWeights.medium as '500',
    marginBottom: Spacing[0.5],
  },
  quickActionDescription: {
    ...Typography.sm,
  },

  // FAQ Categories
  categoriesContainer: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  categorySection: {
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing[3],
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    marginBottom: Spacing[0.5],
  },
  categoryDescription: {
    ...Typography.sm,
  },

  // FAQ List
  faqList: {
    marginTop: Spacing[2],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqItem: {
    padding: Spacing[3],
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
  faqQuestionExpanded: {
    marginBottom: Spacing[2],
  },
  faqQuestion: {
    ...Typography.base,
    fontWeight: FontWeights.medium as '500',
    flex: 1,
  },
  faqAnswer: {
    ...Typography.sm,
    lineHeight: Typography.base.lineHeight,
  },
  faqDivider: {
    height: 1,
    marginHorizontal: Spacing[3],
  },

  // No Results
  noResultsContainer: {
    padding: Spacing[6],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[6],
  },
  noResultsTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
    marginTop: Spacing[2],
  },
  noResultsText: {
    ...Typography.base,
    textAlign: 'center',
  },

  // Contact Card
  contactCard: {
    marginBottom: Spacing[4],
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  contactIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
    marginBottom: Spacing[0.5],
  },
  contactDescription: {
    ...Typography.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    gap: Spacing[2],
  },
  contactButtonText: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
    color: '#FFFFFF',
  },
});

// Export for testing
export { FAQ_CATEGORIES, QUICK_ACTIONS };
export type { FAQCategory, FAQItem, QuickAction };
