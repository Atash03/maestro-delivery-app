/**
 * Profile screen - User profile and settings
 * Shows limited UI for guests with prompts to sign up
 * Full profile editing with address management
 */

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { GuestPromptBanner } from '@/components/guest-prompt-banner';
import { ThemedText } from '@/components/themed-text';
import { Avatar, Button, Card, Input } from '@/components/ui';
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
import { useAuthStore } from '@/stores';
import type { Address, AddressLabel } from '@/types';

// ============================================================================
// Types
// ============================================================================

type ProfileMode = 'view' | 'edit';

// ============================================================================
// Validation Schemas
// ============================================================================

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d+\-\s()]+$/.test(val), 'Please enter a valid phone number'),
});

const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other'] as const),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  instructions: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

// ============================================================================
// Menu Item Component
// ============================================================================

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showBadge?: boolean;
  danger?: boolean;
  rightContent?: React.ReactNode;
}

function MenuItem({ icon, label, onPress, showBadge, danger, rightContent }: MenuItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: danger ? `${colors.error}15` : colors.backgroundSecondary },
          ]}
        >
          <Ionicons name={icon} size={20} color={danger ? colors.error : colors.textSecondary} />
        </View>
        <ThemedText style={[styles.menuItemLabel, danger && { color: colors.error }]}>
          {label}
        </ThemedText>
        {showBadge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.badgeText}>New</ThemedText>
          </View>
        )}
      </View>
      {rightContent || <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />}
    </Pressable>
  );
}

// ============================================================================
// Address Card Component
// ============================================================================

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getLabelIcon = (label: AddressLabel): keyof typeof Ionicons.glyphMap => {
    switch (label) {
      case 'Home':
        return 'home-outline';
      case 'Work':
        return 'briefcase-outline';
      default:
        return 'location-outline';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(AnimationDurations.normal)}
      exiting={FadeOut.duration(AnimationDurations.fast)}
    >
      <Card variant="outlined" padding="md" radius="lg" style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <View style={styles.addressLabelContainer}>
            <View style={[styles.addressIconContainer, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name={getLabelIcon(address.label)} size={16} color={colors.primary} />
            </View>
            <Text style={[styles.addressLabel, { color: colors.text }]}>{address.label}</Text>
            {address.isDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.defaultBadgeText, { color: colors.success }]}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.addressActions}>
            <Pressable
              onPress={onEdit}
              style={styles.addressActionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={styles.addressActionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </Pressable>
          </View>
        </View>

        <Text style={[styles.addressStreet, { color: colors.text }]}>{address.street}</Text>
        <Text style={[styles.addressCity, { color: colors.textSecondary }]}>
          {address.city}, {address.zipCode}
        </Text>

        {address.instructions && (
          <Text style={[styles.addressInstructions, { color: colors.textTertiary }]}>
            {address.instructions}
          </Text>
        )}

        {!address.isDefault && (
          <Pressable onPress={onSetDefault} style={styles.setDefaultButton}>
            <Text style={[styles.setDefaultText, { color: colors.primary }]}>Set as default</Text>
          </Pressable>
        )}
      </Card>
    </Animated.View>
  );
}

// ============================================================================
// Address Label Selector Component
// ============================================================================

interface AddressLabelSelectorProps {
  value: AddressLabel;
  onChange: (label: AddressLabel) => void;
}

function AddressLabelSelector({ value, onChange }: AddressLabelSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const labels: { label: AddressLabel; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Home', icon: 'home-outline' },
    { label: 'Work', icon: 'briefcase-outline' },
    { label: 'Other', icon: 'location-outline' },
  ];

  return (
    <View style={styles.labelSelectorContainer}>
      <Text style={[styles.labelSelectorTitle, { color: colors.text }]}>Address Label</Text>
      <View style={styles.labelOptions}>
        {labels.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => onChange(item.label)}
            style={[
              styles.labelOption,
              {
                backgroundColor: value === item.label ? colors.primary : colors.backgroundSecondary,
                borderColor: value === item.label ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={value === item.label ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.labelOptionText,
                { color: value === item.label ? '#FFFFFF' : colors.text },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============================================================================
// Add/Edit Address Modal
// ============================================================================

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  initialData?: Address;
  isEditing?: boolean;
}

function AddressModal({ visible, onClose, onSave, initialData, isEditing }: AddressModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          street: initialData.street,
          city: initialData.city,
          zipCode: initialData.zipCode,
          instructions: initialData.instructions || '',
          isDefault: initialData.isDefault,
        }
      : {
          label: 'Home',
          street: '',
          city: '',
          zipCode: '',
          instructions: '',
          isDefault: false,
        },
    mode: 'onChange',
  });

  const handleSave = useCallback(
    (data: AddressFormData) => {
      onSave(data);
      form.reset();
      onClose();
    },
    [onSave, onClose, form]
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalContent, { paddingTop: insets.top || Spacing[4] }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Pressable
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {isEditing ? 'Edit Address' : 'Add New Address'}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Address Label Selector */}
              <Controller
                control={form.control}
                name="label"
                render={({ field: { onChange, value } }) => (
                  <AddressLabelSelector value={value} onChange={onChange} />
                )}
              />

              {/* Street Address */}
              <Controller
                control={form.control}
                name="street"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="Street Address"
                    placeholder="123 Main Street, Apt 4B"
                    leftIcon="location-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    autoCapitalize="words"
                    containerStyle={styles.modalInput}
                  />
                )}
              />

              {/* City */}
              <Controller
                control={form.control}
                name="city"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="City"
                    placeholder="New York"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    autoCapitalize="words"
                    containerStyle={styles.modalInput}
                  />
                )}
              />

              {/* ZIP Code */}
              <Controller
                control={form.control}
                name="zipCode"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="ZIP Code"
                    placeholder="10001"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    keyboardType="number-pad"
                    containerStyle={styles.modalInput}
                  />
                )}
              />

              {/* Delivery Instructions */}
              <Controller
                control={form.control}
                name="instructions"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Delivery Instructions (Optional)"
                    placeholder="Buzz apartment 4B, leave at door, etc."
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={2}
                    containerStyle={styles.modalInput}
                  />
                )}
              />

              {/* Set as Default Toggle */}
              <Controller
                control={form.control}
                name="isDefault"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.defaultToggleContainer}>
                    <View style={styles.defaultToggleTextContainer}>
                      <Text style={[styles.defaultToggleLabel, { color: colors.text }]}>
                        Set as default address
                      </Text>
                      <Text
                        style={[styles.defaultToggleDescription, { color: colors.textSecondary }]}
                      >
                        This address will be selected by default for deliveries
                      </Text>
                    </View>
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                )}
              />
            </ScrollView>

            {/* Save Button */}
            <View style={[styles.modalFooter, { paddingBottom: insets.bottom || Spacing[4] }]}>
              <Button onPress={form.handleSubmit(handleSave)} fullWidth size="lg">
                {isEditing ? 'Save Changes' : 'Add Address'}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ============================================================================
// Profile Edit View
// ============================================================================

interface ProfileEditViewProps {
  onClose: () => void;
}

function ProfileEditView({ onClose }: ProfileEditViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { user, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    mode: 'onChange',
  });

  const handlePickImage = useCallback(async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    Alert.alert('Update Profile Photo', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync(options);
            if (!result.canceled && result.assets[0]) {
              updateProfile({ avatar: result.assets[0].uri });
            }
          } else {
            Alert.alert('Permission Required', 'Camera permission is required to take a photo.');
          }
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled && result.assets[0]) {
              updateProfile({ avatar: result.assets[0].uri });
            }
          } else {
            Alert.alert('Permission Required', 'Photo library permission is required.');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [updateProfile]);

  const handleSaveProfile = useCallback(
    async (data: ProfileFormData) => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      setIsLoading(false);
      onClose();
    },
    [updateProfile, onClose]
  );

  const handleAddAddress = useCallback(
    (data: AddressFormData) => {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        label: data.label,
        street: data.street,
        city: data.city,
        zipCode: data.zipCode,
        instructions: data.instructions,
        isDefault: data.isDefault,
        coordinates: { latitude: 0, longitude: 0 }, // Would be set by geocoding in real app
      };
      addAddress(newAddress);
    },
    [addAddress]
  );

  const handleEditAddress = useCallback(
    (data: AddressFormData) => {
      if (editingAddress) {
        updateAddress(editingAddress.id, {
          label: data.label,
          street: data.street,
          city: data.city,
          zipCode: data.zipCode,
          instructions: data.instructions,
          isDefault: data.isDefault,
        });
        setEditingAddress(null);
      }
    },
    [editingAddress, updateAddress]
  );

  const handleDeleteAddress = useCallback(
    (address: Address) => {
      Alert.alert('Delete Address', `Are you sure you want to delete "${address.label}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeAddress(address.id),
        },
      ]);
    },
    [removeAddress]
  );

  const openEditAddress = useCallback((address: Address) => {
    setEditingAddress(address);
    setAddressModalVisible(true);
  }, []);

  const closeAddressModal = useCallback(() => {
    setAddressModalVisible(false);
    setEditingAddress(null);
  }, []);

  return (
    <Animated.View
      entering={SlideInRight.duration(AnimationDurations.normal)}
      exiting={SlideOutRight.duration(AnimationDurations.fast)}
      style={[styles.editContainer, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.editHeader, { paddingTop: insets.top + Spacing[2] }]}>
        <Pressable
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.editTitle, { color: colors.text }]}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.editScrollView}
        contentContainerStyle={styles.editScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Photo Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(AnimationDurations.normal)}>
          <View style={styles.photoSection}>
            <Pressable onPress={handlePickImage} style={styles.photoContainer}>
              <Avatar
                source={user?.avatar ? { uri: user.avatar } : undefined}
                name={user?.name || ''}
                size={100}
              />
              <View style={[styles.editPhotoButton, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </Pressable>
            <Pressable onPress={handlePickImage}>
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                Change Profile Photo
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Profile Fields */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(AnimationDurations.normal)}
          style={styles.fieldsSection}
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Full Name"
                placeholder="Your name"
                leftIcon="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                autoCapitalize="words"
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Email Address"
                placeholder="your@email.com"
                leftIcon="mail-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Controller
            control={form.control}
            name="phone"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                leftIcon="call-outline"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                keyboardType="phone-pad"
                containerStyle={styles.inputContainer}
              />
            )}
          />
        </Animated.View>

        {/* Saved Addresses Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(AnimationDurations.normal)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Addresses</Text>
            <Pressable
              onPress={() => setAddressModalVisible(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.addButton}>
                <Ionicons name="add" size={18} color={colors.primary} />
                <Text style={[styles.addButtonText, { color: colors.primary }]}>Add</Text>
              </View>
            </Pressable>
          </View>

          {user?.addresses && user.addresses.length > 0 ? (
            <View style={styles.addressesList}>
              {user.addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => openEditAddress(address)}
                  onDelete={() => handleDeleteAddress(address)}
                  onSetDefault={() => setDefaultAddress(address.id)}
                />
              ))}
            </View>
          ) : (
            <Animated.View
              entering={FadeIn.duration(AnimationDurations.fast)}
              style={[styles.emptyAddresses, { backgroundColor: colors.backgroundSecondary }]}
            >
              <Ionicons name="location-outline" size={40} color={colors.textTertiary} />
              <Text style={[styles.emptyAddressesText, { color: colors.textSecondary }]}>
                No saved addresses yet
              </Text>
              <Pressable onPress={() => setAddressModalVisible(true)}>
                <Text style={[styles.addFirstAddressText, { color: colors.primary }]}>
                  Add your first address
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>

        {/* Payment Methods Section (Placeholder) */}
        <Animated.View entering={FadeInDown.delay(400).duration(AnimationDurations.normal)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Methods</Text>
          </View>
          <Card variant="outlined" padding="md" radius="lg">
            <View style={styles.paymentPlaceholder}>
              <Ionicons name="card-outline" size={40} color={colors.textTertiary} />
              <Text style={[styles.paymentPlaceholderText, { color: colors.textSecondary }]}>
                Payment methods will be available in a future update
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveButtonContainer, { paddingBottom: insets.bottom || Spacing[4] }]}>
        <Button
          onPress={form.handleSubmit(handleSaveProfile)}
          loading={isLoading}
          fullWidth
          size="lg"
        >
          Save Changes
        </Button>
      </View>

      {/* Address Modal */}
      <AddressModal
        visible={addressModalVisible}
        onClose={closeAddressModal}
        onSave={editingAddress ? handleEditAddress : handleAddAddress}
        initialData={editingAddress || undefined}
        isEditing={!!editingAddress}
      />
    </Animated.View>
  );
}

// ============================================================================
// Main Profile Screen
// ============================================================================

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isGuest, signOut } = useAuthStore();
  const [mode, setMode] = useState<ProfileMode>('view');

  // Animation for avatar press
  const avatarScale = useSharedValue(1);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const handleAvatarPressIn = useCallback(() => {
    avatarScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [avatarScale]);

  const handleAvatarPressOut = useCallback(() => {
    avatarScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [avatarScale]);

  // Guest mode: show full-screen prompt to sign up
  if (isGuest) {
    return <GuestPromptBanner type="profile" fullScreen />;
  }

  // Not authenticated and not guest: should redirect to auth
  // This is a fallback case
  if (!user) {
    return <GuestPromptBanner type="general" fullScreen />;
  }

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  // Show edit view
  if (mode === 'edit') {
    return <ProfileEditView onClose={() => setMode('view')} />;
  }

  // View mode
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing[4] }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.header}>
        <Pressable onPressIn={handleAvatarPressIn} onPressOut={handleAvatarPressOut}>
          <Animated.View style={avatarAnimatedStyle}>
            <Avatar
              source={user.avatar ? { uri: user.avatar } : undefined}
              name={user.name}
              size={80}
            />
          </Animated.View>
        </Pressable>
        <ThemedText type="title" style={styles.userName}>
          {user.name}
        </ThemedText>
        <ThemedText style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user.email}
        </ThemedText>
        {user.phone && (
          <ThemedText style={[styles.userPhone, { color: colors.textTertiary }]}>
            {user.phone}
          </ThemedText>
        )}
      </Animated.View>

      {/* Account Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.sectionTitleSmall, { color: colors.textSecondary }]}
        >
          Account
        </ThemedText>
        <Card variant="elevated" padding="none" radius="lg">
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => setMode('edit')} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem
            icon="location-outline"
            label="Saved Addresses"
            onPress={() => setMode('edit')}
            rightContent={
              user.addresses.length > 0 ? (
                <View style={styles.addressCountContainer}>
                  <Text style={[styles.addressCount, { color: colors.textSecondary }]}>
                    {user.addresses.length}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
              ) : undefined
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="card-outline" label="Payment Methods" onPress={() => setMode('edit')} />
        </Card>
      </Animated.View>

      {/* Preferences Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.sectionTitleSmall, { color: colors.textSecondary }]}
        >
          Preferences
        </ThemedText>
        <Card variant="elevated" padding="none" radius="lg">
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="moon-outline" label="Appearance" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="language-outline" label="Language" onPress={() => {}} />
        </Card>
      </Animated.View>

      {/* Support Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.sectionTitleSmall, { color: colors.textSecondary }]}
        >
          Support
        </ThemedText>
        <Card variant="elevated" padding="none" radius="lg">
          <MenuItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => router.push('/support')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="chatbubble-outline" label="Contact Us" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="document-text-outline" label="Terms & Privacy" onPress={() => {}} />
        </Card>
      </Animated.View>

      {/* Sign Out */}
      <Animated.View entering={FadeInDown.duration(400).delay(500)}>
        <Card variant="elevated" padding="none" radius="lg" style={styles.signOutCard}>
          <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleSignOut} danger />
        </Card>
      </Animated.View>

      {/* App Version */}
      <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.versionContainer}>
        <ThemedText style={[styles.versionText, { color: colors.textTertiary }]}>
          Maestro v1.0.0
        </ThemedText>
      </Animated.View>
    </ScrollView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  userName: {
    marginTop: Spacing[3],
  },
  userEmail: {
    fontSize: Typography.base.fontSize,
    marginTop: Spacing[1],
  },
  userPhone: {
    fontSize: Typography.sm.fontSize,
    marginTop: Spacing[0.5],
  },
  sectionTitleSmall: {
    fontSize: Typography.sm.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing[6],
    marginBottom: Spacing[2],
    marginLeft: Spacing[1],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[3],
  },
  menuItemLabel: {
    fontSize: Typography.base.fontSize,
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.full,
    marginLeft: Spacing[2],
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: Typography.xs.fontSize,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: Spacing[4] + 36 + Spacing[3],
  },
  signOutCard: {
    marginTop: Spacing[6],
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Spacing[6],
  },
  versionText: {
    fontSize: Typography.sm.fontSize,
  },
  addressCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  addressCount: {
    fontSize: Typography.sm.fontSize,
  },

  // Edit View Styles
  editContainer: {
    flex: 1,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  backButton: {
    padding: Spacing[1],
  },
  editTitle: {
    ...Typography['2xl'],
    fontWeight: FontWeights.bold as '700',
  },
  editScrollView: {
    flex: 1,
  },
  editScrollContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: Spacing[6],
    marginTop: Spacing[4],
  },
  photoContainer: {
    position: 'relative',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  changePhotoText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
    marginTop: Spacing[2],
  },
  fieldsSection: {
    marginBottom: Spacing[6],
  },
  inputContainer: {
    marginBottom: Spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
    marginTop: Spacing[4],
  },
  sectionTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[0.5],
  },
  addButtonText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  addressesList: {
    gap: Spacing[3],
  },
  addressCard: {
    marginBottom: Spacing[0],
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  addressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  addressIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressLabel: {
    ...Typography.base,
    fontWeight: FontWeights.semibold as '600',
  },
  defaultBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: BorderRadius.sm,
  },
  defaultBadgeText: {
    ...Typography.xs,
    fontWeight: FontWeights.medium as '500',
  },
  addressActions: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  addressActionButton: {
    padding: Spacing[1],
  },
  addressStreet: {
    ...Typography.base,
    marginBottom: Spacing[0.5],
  },
  addressCity: {
    ...Typography.sm,
  },
  addressInstructions: {
    ...Typography.sm,
    fontStyle: 'italic',
    marginTop: Spacing[2],
  },
  setDefaultButton: {
    marginTop: Spacing[3],
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  setDefaultText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  emptyAddresses: {
    padding: Spacing[6],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing[2],
  },
  emptyAddressesText: {
    ...Typography.base,
    textAlign: 'center',
  },
  addFirstAddressText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
    marginTop: Spacing[1],
  },
  paymentPlaceholder: {
    alignItems: 'center',
    padding: Spacing[4],
    gap: Spacing[2],
  },
  paymentPlaceholderText: {
    ...Typography.sm,
    textAlign: 'center',
  },
  saveButtonContainer: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  modalTitle: {
    ...Typography.lg,
    fontWeight: FontWeights.semibold as '600',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
  },
  modalInput: {
    marginBottom: Spacing[4],
  },
  modalFooter: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  labelSelectorContainer: {
    marginBottom: Spacing[4],
  },
  labelSelectorTitle: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
    marginBottom: Spacing[2],
  },
  labelOptions: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  labelOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2.5] || 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    gap: Spacing[1],
  },
  labelOptionText: {
    ...Typography.sm,
    fontWeight: FontWeights.medium as '500',
  },
  defaultToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    marginTop: Spacing[2],
  },
  defaultToggleTextContainer: {
    flex: 1,
    marginRight: Spacing[3],
  },
  defaultToggleLabel: {
    ...Typography.base,
    fontWeight: FontWeights.medium as '500',
    marginBottom: Spacing[0.5],
  },
  defaultToggleDescription: {
    ...Typography.sm,
  },
});

// Export for testing
export { addressSchema, profileSchema };
export type { AddressFormData, ProfileFormData, ProfileMode };
