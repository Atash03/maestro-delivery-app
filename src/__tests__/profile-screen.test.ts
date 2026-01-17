/**
 * Profile Screen Tests
 *
 * Tests for Task 1.7: Build profile creation/edit screen
 * - Profile photo picker (camera/gallery)
 * - Name, email, phone fields
 * - Manage saved addresses section
 * - Add new address modal
 * - Payment methods section (placeholder)
 */

import * as fs from 'node:fs';

const profileScreenPath = './src/app/(tabs)/profile.tsx';

describe('Task 1.7: Profile Creation/Edit Screen', () => {
  describe('File Structure and Exports', () => {
    it('should exist in tabs directory', () => {
      expect(fs.existsSync(profileScreenPath)).toBe(true);
    });

    it('should export default ProfileScreen component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('export default function ProfileScreen');
    });

    it('should export profileSchema for validation', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('export { addressSchema, profileSchema }');
    });

    it('should export addressSchema for validation', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('addressSchema');
    });

    it('should export ProfileFormData type', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('export type { AddressFormData, ProfileFormData, ProfileMode }');
    });

    it('should export AddressFormData type', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('AddressFormData');
    });

    it('should export ProfileMode type', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('ProfileMode');
    });
  });

  describe('Profile Mode States', () => {
    it('should define view mode', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("type ProfileMode = 'view' | 'edit'");
    });

    it('should define edit mode', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("'edit'");
    });

    it('should have mode state with useState', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("useState<ProfileMode>('view')");
    });

    it('should render ProfileEditView when mode is edit', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("if (mode === 'edit')");
      expect(content).toContain('<ProfileEditView');
    });
  });

  describe('Profile Validation Schema', () => {
    it('should validate name with min length', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('name: z');
      expect(content).toContain(".min(2, 'Name must be at least 2 characters')");
    });

    it('should validate name with max length', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain(".max(50, 'Name must be less than 50 characters')");
    });

    it('should validate email format', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("email: z.string().email('Please enter a valid email address')");
    });

    it('should validate phone as optional', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('phone: z');
      expect(content).toContain('.optional()');
    });

    it('should validate phone format with regex', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Please enter a valid phone number');
    });
  });

  describe('Address Validation Schema', () => {
    it('should validate label as enum', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("label: z.enum(['Home', 'Work', 'Other']");
    });

    it('should validate street with min length', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("street: z.string().min(5, 'Street address is required')");
    });

    it('should validate city with min length', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("city: z.string().min(2, 'City is required')");
    });

    it('should validate zipCode with min length', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain(
        "zipCode: z.string().min(5, 'ZIP code must be at least 5 characters')"
      );
    });

    it('should have optional instructions field', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('instructions: z.string().optional()');
    });

    it('should have isDefault field with default false', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('isDefault: z.boolean().default(false)');
    });
  });

  describe('Profile Photo Picker', () => {
    it('should import expo-image-picker', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("import * as ImagePicker from 'expo-image-picker'");
    });

    it('should have handlePickImage function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('handlePickImage');
    });

    it('should show alert with Camera and Photo Library options', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("Alert.alert('Update Profile Photo'");
      expect(content).toContain("text: 'Camera'");
      expect(content).toContain("text: 'Photo Library'");
    });

    it('should request camera permissions', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('ImagePicker.requestCameraPermissionsAsync()');
    });

    it('should request media library permissions', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('ImagePicker.requestMediaLibraryPermissionsAsync()');
    });

    it('should launch camera when permission granted', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('ImagePicker.launchCameraAsync');
    });

    it('should launch image library when permission granted', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('ImagePicker.launchImageLibraryAsync');
    });

    it('should configure image picker with square aspect', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('aspect: [1, 1]');
    });

    it('should allow image editing', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('allowsEditing: true');
    });

    it('should set image quality to 0.8', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('quality: 0.8');
    });

    it('should update profile avatar on image selection', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('updateProfile({ avatar: result.assets[0].uri })');
    });

    it('should show permission denied alert', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("Alert.alert('Permission Required'");
    });
  });

  describe('Profile Edit View Component', () => {
    it('should define ProfileEditView function component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('function ProfileEditView');
    });

    it('should accept onClose prop', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('interface ProfileEditViewProps');
      expect(content).toContain('onClose: () => void');
    });

    it('should have back button with arrow icon', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('name="arrow-back"');
    });

    it('should have Edit Profile title', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Edit Profile');
    });

    it('should have photo section with camera button', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('photoSection');
      expect(content).toContain('editPhotoButton');
      expect(content).toContain('name="camera"');
    });

    it('should have Change Profile Photo text', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Change Profile Photo');
    });
  });

  describe('Profile Form Fields', () => {
    it('should have Full Name input field', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('label="Full Name"');
      expect(content).toContain('placeholder="Your name"');
    });

    it('should have Email Address input field', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('label="Email Address"');
      expect(content).toContain('placeholder="your@email.com"');
    });

    it('should have Phone Number input field', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('label="Phone Number"');
      expect(content).toContain('placeholder="+1 (555) 123-4567"');
    });

    it('should use Controller from react-hook-form', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Controller');
      expect(content).toContain("from 'react-hook-form'");
    });

    it('should use zodResolver for form validation', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("import { zodResolver } from '@hookform/resolvers/zod'");
      expect(content).toContain('resolver: zodResolver(profileSchema)');
    });

    it('should have appropriate icons for input fields', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('leftIcon="person-outline"');
      expect(content).toContain('leftIcon="mail-outline"');
      expect(content).toContain('leftIcon="call-outline"');
    });
  });

  describe('Saved Addresses Section', () => {
    it('should have Saved Addresses section header', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Saved Addresses');
    });

    it('should have Add button next to section header', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('addButton');
      expect(content).toContain('name="add"');
    });

    it('should render AddressCard for each address', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('AddressCard');
      expect(content).toContain('user.addresses.map');
    });

    it('should have empty state for no addresses', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('emptyAddresses');
      expect(content).toContain('No saved addresses yet');
    });

    it('should have Add your first address link', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Add your first address');
    });
  });

  describe('Address Card Component', () => {
    it('should define AddressCard function component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('function AddressCard');
    });

    it('should accept address, onEdit, onDelete, onSetDefault props', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('interface AddressCardProps');
      expect(content).toContain('address: Address');
      expect(content).toContain('onEdit: () => void');
      expect(content).toContain('onDelete: () => void');
      expect(content).toContain('onSetDefault: () => void');
    });

    it('should have edit button with pencil icon', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('name="pencil-outline"');
    });

    it('should have delete button with trash icon', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('name="trash-outline"');
    });

    it('should display address street', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('address.street');
    });

    it('should display address city and zipCode', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('address.city');
      expect(content).toContain('address.zipCode');
    });

    it('should display address instructions if present', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('address.instructions');
    });

    it('should show Default badge when isDefault', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('address.isDefault');
      expect(content).toContain('defaultBadge');
      expect(content).toContain('>Default<');
    });

    it('should show Set as default button when not default', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('!address.isDefault');
      expect(content).toContain('Set as default');
    });

    it('should have icons for different address labels', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("'home-outline'");
      expect(content).toContain("'briefcase-outline'");
      expect(content).toContain("'location-outline'");
    });
  });

  describe('Address Label Selector Component', () => {
    it('should define AddressLabelSelector function component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('function AddressLabelSelector');
    });

    it('should accept value and onChange props', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('interface AddressLabelSelectorProps');
      expect(content).toContain('value: AddressLabel');
      expect(content).toContain('onChange: (label: AddressLabel) => void');
    });

    it('should have Address Label title', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Address Label');
    });

    it('should have Home, Work, and Other options', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("{ label: 'Home'");
      expect(content).toContain("{ label: 'Work'");
      expect(content).toContain("{ label: 'Other'");
    });
  });

  describe('Address Modal Component', () => {
    it('should define AddressModal function component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('function AddressModal');
    });

    it('should accept required props', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('interface AddressModalProps');
      expect(content).toContain('visible: boolean');
      expect(content).toContain('onClose: () => void');
      expect(content).toContain('onSave: (address: AddressFormData) => void');
    });

    it('should accept optional initialData and isEditing props', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('initialData?: Address');
      expect(content).toContain('isEditing?: boolean');
    });

    it('should use React Native Modal component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('import {');
      expect(content).toContain('Modal,');
      expect(content).toContain('<Modal');
    });

    it('should have close button with X icon', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('name="close"');
    });

    it('should show Add New Address or Edit Address title', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("isEditing ? 'Edit Address' : 'Add New Address'");
    });

    it('should have Street Address input', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('label="Street Address"');
    });

    it('should have City input', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('label="City"');
    });

    it('should have ZIP Code input', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('label="ZIP Code"');
    });

    it('should have Delivery Instructions input', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Delivery Instructions');
    });

    it('should have Set as default toggle with Switch', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Switch');
      expect(content).toContain('Set as default address');
    });

    it('should have Save button with conditional text', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("isEditing ? 'Save Changes' : 'Add Address'");
    });
  });

  describe('Address Management Functions', () => {
    it('should have handleAddAddress function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('handleAddAddress');
    });

    it('should have handleEditAddress function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('handleEditAddress');
    });

    it('should have handleDeleteAddress function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('handleDeleteAddress');
    });

    it('should call addAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('addAddress(newAddress)');
    });

    it('should call updateAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('updateAddress(editingAddress.id');
    });

    it('should call removeAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('removeAddress(address.id)');
    });

    it('should call setDefaultAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('setDefaultAddress(address.id)');
    });

    it('should show delete confirmation alert', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("Alert.alert('Delete Address'");
    });

    it('should generate unique address ID on add', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('`addr-${Date.now()}`');
    });
  });

  describe('Payment Methods Section (Placeholder)', () => {
    it('should have Payment Methods section header', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('>Payment Methods<');
    });

    it('should have placeholder message', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Payment methods will be available in a future update');
    });

    it('should have card icon in placeholder', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toMatch(/paymentPlaceholder[\s\S]*?card-outline/);
    });
  });

  describe('Save Profile Functionality', () => {
    it('should have handleSaveProfile function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('handleSaveProfile');
    });

    it('should call updateProfile from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('updateProfile({');
      expect(content).toContain('name: data.name');
      expect(content).toContain('email: data.email');
      expect(content).toContain('phone: data.phone');
    });

    it('should have loading state during save', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('isLoading');
      expect(content).toContain('setIsLoading(true)');
      expect(content).toContain('setIsLoading(false)');
    });

    it('should have Save Changes button with loading state', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('loading={isLoading}');
      // Button uses children prop
      expect(content).toMatch(/Button[\s\S]*?Save Changes/);
    });

    it('should call onClose after save', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('onClose()');
    });
  });

  describe('Sign Out Functionality', () => {
    it('should have handleSignOut function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('handleSignOut');
    });

    it('should show confirmation alert before sign out', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("Alert.alert('Sign Out', 'Are you sure you want to sign out?'");
    });

    it('should call signOut from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('signOut()');
    });

    it('should navigate to sign-in after sign out', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("router.replace('/(auth)/sign-in')");
    });
  });

  describe('View Mode Content', () => {
    it('should display user name', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('{user.name}');
    });

    it('should display user email', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('{user.email}');
    });

    it('should display user phone if available', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('user.phone &&');
      expect(content).toContain('{user.phone}');
    });

    it('should display user avatar with Avatar component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('<Avatar');
      expect(content).toContain('source={user.avatar');
      expect(content).toContain('name={user.name}');
    });

    it('should have Edit Profile menu item', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toMatch(/MenuItem[\s\S]*?Edit Profile/);
    });

    it('should have Saved Addresses menu item with count', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('user.addresses.length');
      expect(content).toContain('addressCount');
    });

    it('should have app version footer', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Maestro v1.0.0');
    });
  });

  describe('Guest Mode Handling', () => {
    it('should check isGuest from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('isGuest');
    });

    it('should render GuestPromptBanner when isGuest', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('if (isGuest)');
      expect(content).toContain('<GuestPromptBanner type="profile" fullScreen />');
    });

    it('should handle null user case', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('if (!user)');
      expect(content).toContain('<GuestPromptBanner type="general" fullScreen />');
    });
  });

  describe('Animations', () => {
    it('should use FadeInDown for profile header', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('FadeInDown');
    });

    it('should use FadeIn for empty addresses', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('FadeIn');
    });

    it('should use FadeOut for address card removal', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('FadeOut');
    });

    it('should use SlideInRight for edit view', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('SlideInRight');
    });

    it('should use SlideOutRight for edit view exit', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('SlideOutRight');
    });

    it('should have staggered animation delays', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('.delay(100)');
      expect(content).toContain('.delay(200)');
      expect(content).toContain('.delay(300)');
      expect(content).toContain('.delay(400)');
    });

    it('should have avatar press animation', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('avatarScale');
      expect(content).toContain('handleAvatarPressIn');
      expect(content).toContain('handleAvatarPressOut');
    });
  });

  describe('Keyboard Handling', () => {
    it('should import KeyboardAvoidingView', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('KeyboardAvoidingView');
    });

    it('should import TouchableWithoutFeedback for keyboard dismiss', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('TouchableWithoutFeedback');
    });

    it('should import Keyboard', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Keyboard');
    });

    it('should dismiss keyboard on touch', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Keyboard.dismiss');
    });

    it('should have keyboardShouldPersistTaps on ScrollViews', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('keyboardShouldPersistTaps="handled"');
    });
  });

  describe('Store Integration', () => {
    it('should import useAuthStore from stores', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('useAuthStore');
      expect(content).toContain("from '@/stores'");
    });

    it('should destructure user from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('user');
    });

    it('should destructure updateProfile from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('updateProfile');
    });

    it('should destructure addAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('addAddress');
    });

    it('should destructure updateAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('updateAddress');
    });

    it('should destructure removeAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('removeAddress');
    });

    it('should destructure setDefaultAddress from auth store', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('setDefaultAddress');
    });
  });

  describe('Styling', () => {
    it('should use Spacing constants', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Spacing');
    });

    it('should use Typography constants', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Typography');
    });

    it('should use BorderRadius constants', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('BorderRadius');
    });

    it('should use FontWeights constants', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('FontWeights');
    });

    it('should use Shadows constants', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Shadows');
    });

    it('should use Colors theme', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('Colors');
      expect(content).toContain('Colors[colorScheme]');
    });

    it('should use useSafeAreaInsets', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('useSafeAreaInsets');
      expect(content).toContain('insets.top');
      expect(content).toContain('insets.bottom');
    });
  });

  describe('UI Components Used', () => {
    it('should import Button component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("import { Avatar, Button, Card, Input } from '@/components/ui'");
    });

    it('should import Input component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('<Input');
    });

    it('should import Card component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('<Card');
    });

    it('should import Avatar component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('<Avatar');
    });

    it('should import ThemedText component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('ThemedText');
    });

    it('should use Ionicons for icons', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("from '@expo/vector-icons'");
      expect(content).toContain('<Ionicons');
    });
  });

  describe('Menu Item Component', () => {
    it('should define MenuItem function component', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('function MenuItem');
    });

    it('should accept required props', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('interface MenuItemProps');
      expect(content).toContain('icon: keyof typeof Ionicons.glyphMap');
      expect(content).toContain('label: string');
      expect(content).toContain('onPress: () => void');
    });

    it('should accept optional props', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('showBadge?: boolean');
      expect(content).toContain('danger?: boolean');
      expect(content).toContain('rightContent?: React.ReactNode');
    });

    it('should have accessibility role button', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('accessibilityRole="button"');
    });
  });

  describe('Modal Presentation', () => {
    it('should use pageSheet presentation style', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('presentationStyle="pageSheet"');
    });

    it('should use slide animation', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('animationType="slide"');
    });

    it('should have onRequestClose handler', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('onRequestClose={handleClose}');
    });
  });

  describe('Address Modal State Management', () => {
    it('should have addressModalVisible state', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('addressModalVisible');
      expect(content).toContain('setAddressModalVisible');
    });

    it('should have editingAddress state', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('editingAddress');
      expect(content).toContain('setEditingAddress');
    });

    it('should have openEditAddress function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('openEditAddress');
    });

    it('should have closeAddressModal function', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('closeAddressModal');
    });

    it('should pass editingAddress to AddressModal', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('initialData={editingAddress || undefined}');
      expect(content).toContain('isEditing={!!editingAddress}');
    });
  });

  describe('Form Reset on Modal Close', () => {
    it('should reset form on handleClose', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('form.reset()');
    });

    it('should reset form on handleSave', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      // Should reset after save
      expect(content).toMatch(/handleSave[\s\S]*?form\.reset\(\)/);
    });
  });

  describe('Type Definitions', () => {
    it('should import Address type', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain("import type { Address, AddressLabel } from '@/types'");
    });

    it('should import AddressLabel type', () => {
      const content = fs.readFileSync(profileScreenPath, 'utf8');
      expect(content).toContain('AddressLabel');
    });
  });
});
