/**
 * Guest Mode Tests
 *
 * Tests for Task 1.6: Implement guest mode
 * - Guest login flow in auth store
 * - Limited UI for guests with sign-up prompts
 * - Guest-to-user conversion flow
 */

import * as fs from 'node:fs';

const guestPromptPath = './src/components/guest-prompt-banner.tsx';
const profileScreenPath = './src/app/(tabs)/profile.tsx';
const ordersScreenPath = './src/app/(tabs)/orders.tsx';
const authStorePath = './src/stores/auth-store.ts';
const signInPath = './src/app/(auth)/sign-in.tsx';
const signUpPath = './src/app/(auth)/sign-up.tsx';
const hookPath = './src/hooks/use-guest-conversion.ts';

describe('Task 1.6: Guest Mode Implementation', () => {
  describe('GuestPromptBanner Component', () => {
    describe('File Structure', () => {
      it('should exist in components directory', () => {
        expect(fs.existsSync(guestPromptPath)).toBe(true);
      });

      it('should export GuestPromptBanner component', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('export function GuestPromptBanner');
      });

      it('should export GuestPromptType type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('export type GuestPromptType');
      });
    });

    describe('Prompt Types', () => {
      it('should define orders prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("'orders'");
      });

      it('should define addresses prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("'addresses'");
      });

      it('should define profile prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("'profile'");
      });

      it('should define favorites prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("'favorites'");
      });

      it('should define general prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("'general'");
      });
    });

    describe('Prompt Content Configuration', () => {
      it('should have title for orders type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("title: 'Track Your Orders'");
      });

      it('should have title for addresses type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("title: 'Save Your Addresses'");
      });

      it('should have title for profile type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("title: 'Create Your Profile'");
      });

      it('should have title for favorites type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("title: 'Save Your Favorites'");
      });

      it('should have title for general type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("title: 'Unlock More Features'");
      });

      it('should have icons for each prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("icon: 'receipt-outline'");
        expect(content).toContain("icon: 'location-outline'");
        expect(content).toContain("icon: 'person-outline'");
        expect(content).toContain("icon: 'heart-outline'");
        expect(content).toContain("icon: 'sparkles-outline'");
      });

      it('should have descriptions for each prompt type', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('description:');
        // Check that descriptions exist (5 types should have descriptions)
        const descMatches = content.match(/description:/g);
        expect(descMatches).toBeDefined();
        expect(descMatches?.length).toBeGreaterThanOrEqual(5);
      });
    });

    describe('Props Interface', () => {
      it('should accept type prop', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('type?: GuestPromptType');
      });

      it('should accept optional title prop', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('title?: string');
      });

      it('should accept optional description prop', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('description?: string');
      });

      it('should accept fullScreen prop', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('fullScreen?: boolean');
      });

      it('should accept optional onSignUp callback', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('onSignUp?: () => void');
      });

      it('should accept optional onSignIn callback', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('onSignIn?: () => void');
      });
    });

    describe('Full Screen Mode', () => {
      it('should have fullScreenContainer style', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('fullScreenContainer');
      });

      it('should render centered content', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("justifyContent: 'center'");
        expect(content).toContain("alignItems: 'center'");
      });

      it('should have iconCircle style with size 100', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('width: 100');
        expect(content).toContain('height: 100');
      });

      it('should render Sign Up button', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        // Button uses children prop, check for the button text
        expect(content).toMatch(/Button[\s\S]*?Sign Up/);
      });

      it('should render Sign In link', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        // Check for the sign in text in ThemedText
        expect(content).toMatch(/<ThemedText[\s\S]*?Sign In/);
      });
    });

    describe('Banner Mode (non-fullScreen)', () => {
      it('should have bannerCard style', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('bannerCard');
      });

      it('should render as a Card component', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('<Card');
      });

      it('should have smaller icon in banner mode', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('size={24}');
      });
    });

    describe('Animations', () => {
      it('should use FadeInUp animation for full screen', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('FadeInUp');
      });

      it('should use FadeInDown animation for banner', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('FadeInDown');
      });

      it('should have staggered animation delays', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('.delay(100)');
        expect(content).toContain('.delay(200)');
        expect(content).toContain('.delay(300)');
      });
    });

    describe('Accessibility', () => {
      it('should have accessibility label for Sign Up button', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('accessibilityLabel="Sign up for an account"');
      });

      it('should have accessibility label for Sign In', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('accessibilityLabel="Sign in to existing account"');
      });
    });

    describe('Theming', () => {
      it('should import PrimaryColors', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('PrimaryColors');
      });

      it('should import Colors', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('Colors');
      });

      it('should use theme-aware colors', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('Colors[colorScheme');
      });
    });

    describe('Navigation', () => {
      it('should import useRouter from expo-router', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("import { useRouter } from 'expo-router'");
      });

      it('should navigate to sign-up on handleSignUp', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("router.push('/(auth)/sign-up')");
      });

      it('should navigate to sign-in on handleSignIn', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("router.push('/(auth)/sign-in')");
      });
    });
  });

  describe('Profile Screen Guest Mode', () => {
    describe('File Structure', () => {
      it('should import GuestPromptBanner component', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('GuestPromptBanner');
        expect(content).toContain("from '@/components/guest-prompt-banner'");
      });

      it('should import useAuthStore from stores', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('useAuthStore');
        expect(content).toContain("from '@/stores'");
      });
    });

    describe('Guest Mode Logic', () => {
      it('should check isGuest state', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('isGuest');
      });

      it('should render GuestPromptBanner when isGuest', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('if (isGuest)');
        expect(content).toContain('<GuestPromptBanner');
      });

      it('should use profile type for guest prompt', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('type="profile"');
      });

      it('should use fullScreen mode for guest prompt', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('fullScreen');
      });
    });

    describe('Authenticated User View', () => {
      it('should show user name', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('user.name');
      });

      it('should show user email', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('user.email');
      });

      it('should use Avatar component', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('<Avatar');
      });

      it('should show Edit Profile menu item', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('Edit Profile');
      });

      it('should show Saved Addresses menu item', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('Saved Addresses');
      });

      it('should show Payment Methods menu item', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('Payment Methods');
      });

      it('should show Sign Out option', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('Sign Out');
      });

      it('should call signOut from auth store', () => {
        const content = fs.readFileSync(profileScreenPath, 'utf8');
        expect(content).toContain('signOut');
      });
    });
  });

  describe('Orders Screen Guest Mode', () => {
    describe('File Structure', () => {
      it('should import GuestPromptBanner component', () => {
        const content = fs.readFileSync(ordersScreenPath, 'utf8');
        expect(content).toContain('GuestPromptBanner');
        expect(content).toContain("from '@/components/guest-prompt-banner'");
      });

      it('should import useAuthStore from stores', () => {
        const content = fs.readFileSync(ordersScreenPath, 'utf8');
        expect(content).toContain('useAuthStore');
        expect(content).toContain("from '@/stores'");
      });
    });

    describe('Guest Mode Logic', () => {
      it('should check isGuest state', () => {
        const content = fs.readFileSync(ordersScreenPath, 'utf8');
        expect(content).toContain('isGuest');
      });

      it('should render GuestPromptBanner when isGuest', () => {
        const content = fs.readFileSync(ordersScreenPath, 'utf8');
        expect(content).toContain('if (isGuest)');
        expect(content).toContain('<GuestPromptBanner');
      });

      it('should use orders type for guest prompt', () => {
        const content = fs.readFileSync(ordersScreenPath, 'utf8');
        expect(content).toContain('type="orders"');
      });

      it('should use fullScreen mode for guest prompt', () => {
        const content = fs.readFileSync(ordersScreenPath, 'utf8');
        expect(content).toContain('fullScreen');
      });
    });
  });

  describe('useGuestConversion Hook', () => {
    describe('File Structure', () => {
      it('should exist in hooks directory', () => {
        expect(fs.existsSync(hookPath)).toBe(true);
      });

      it('should export useGuestConversion hook', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('export function useGuestConversion');
      });

      it('should export RestrictedFeature type', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('export type RestrictedFeature');
      });
    });

    describe('Restricted Features', () => {
      it('should define order_history as restricted', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'order_history'");
      });

      it('should define saved_addresses as restricted', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'saved_addresses'");
      });

      it('should define saved_payments as restricted', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'saved_payments'");
      });

      it('should define favorites as restricted', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'favorites'");
      });

      it('should define profile as restricted', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'profile'");
      });

      it('should define checkout as restricted', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'checkout'");
      });
    });

    describe('Return Value Interface', () => {
      it('should return isGuest boolean', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('isGuest');
        expect(content).toContain('isGuest: boolean');
      });

      it('should return isAuthenticated boolean', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('isAuthenticated');
        expect(content).toContain('isAuthenticated: boolean');
      });

      it('should return isFeatureRestricted function', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('isFeatureRestricted');
      });

      it('should return restrictedFeatures array', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('restrictedFeatures');
      });

      it('should return promptSignUp function', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('promptSignUp');
      });

      it('should return promptSignIn function', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('promptSignIn');
      });

      it('should return convertToUser function', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('convertToUser');
      });

      it('should return hasGuestCart boolean', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('hasGuestCart');
        expect(content).toContain('hasGuestCart: boolean');
      });

      it('should return guestCartItemCount number', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('guestCartItemCount');
        expect(content).toContain('guestCartItemCount: number');
      });
    });

    describe('Store Integration', () => {
      it('should import useAuthStore', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('useAuthStore');
        expect(content).toContain("from '@/stores'");
      });

      it('should import useCartStore', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('useCartStore');
      });

      it('should use convertGuestToUser from auth store', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain('convertGuestToUser');
      });
    });

    describe('Navigation', () => {
      it('should import useRouter from expo-router', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("import { useRouter } from 'expo-router'");
      });

      it('should navigate to sign-up in promptSignUp', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'/(auth)/sign-up'");
      });

      it('should navigate to sign-in in promptSignIn', () => {
        const content = fs.readFileSync(hookPath, 'utf8');
        expect(content).toContain("'/(auth)/sign-in'");
      });
    });
  });

  describe('Auth Store Guest Mode', () => {
    describe('Existing Functionality', () => {
      it('should have setGuest action', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('setGuest');
      });

      it('should have convertGuestToUser action', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('convertGuestToUser');
      });

      it('should have isGuest state', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('isGuest');
      });
    });

    describe('setGuest Action', () => {
      it('should set isGuest to true', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('isGuest: true');
      });

      it('should set user to null', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('user: null');
      });

      it('should set isAuthenticated to false', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('isAuthenticated: false');
      });
    });

    describe('convertGuestToUser Action', () => {
      it('should accept User parameter', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toContain('convertGuestToUser: (user: User)');
      });

      it('should set isGuest to false', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        // Check that convertGuestToUser sets isGuest: false
        expect(content).toMatch(/convertGuestToUser[\s\S]*?isGuest:\s*false/);
      });

      it('should set isAuthenticated to true', () => {
        const content = fs.readFileSync(authStorePath, 'utf8');
        expect(content).toMatch(/convertGuestToUser[\s\S]*?isAuthenticated:\s*true/);
      });
    });
  });

  describe('Navigation Integration', () => {
    describe('Sign-In Screen Guest Option', () => {
      it('should have Continue as Guest option', () => {
        const content = fs.readFileSync(signInPath, 'utf8');
        expect(content).toContain('Continue as Guest');
      });

      it('should call setGuest when guest option is selected', () => {
        const content = fs.readFileSync(signInPath, 'utf8');
        expect(content).toContain('setGuest');
      });

      it('should navigate to tabs after guest selection', () => {
        const content = fs.readFileSync(signInPath, 'utf8');
        expect(content).toContain('/(tabs)');
      });
    });

    describe('Sign-Up Screen Guest Option', () => {
      it('should have Continue as Guest option', () => {
        const content = fs.readFileSync(signUpPath, 'utf8');
        expect(content).toContain('Continue as Guest');
      });

      it('should call setGuest when guest option is selected', () => {
        const content = fs.readFileSync(signUpPath, 'utf8');
        expect(content).toContain('setGuest');
      });

      it('should navigate to tabs after guest selection', () => {
        const content = fs.readFileSync(signUpPath, 'utf8');
        expect(content).toContain('/(tabs)');
      });
    });
  });

  describe('Styling and Theming', () => {
    describe('GuestPromptBanner Styles', () => {
      it('should use Spacing constants', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('Spacing');
      });

      it('should use Typography constants', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('Typography');
      });

      it('should use BorderRadius constants', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('BorderRadius');
      });
    });
  });

  describe('Component Integration', () => {
    describe('UI Components Used in GuestPromptBanner', () => {
      it('should use Button component', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("from '@/components/ui/button'");
        expect(content).toContain('<Button');
      });

      it('should use Card component', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("from '@/components/ui/card'");
        expect(content).toContain('<Card');
      });

      it('should use ThemedText component', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("from '@/components/themed-text'");
        expect(content).toContain('<ThemedText');
      });

      it('should use Ionicons for icons', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("from '@expo/vector-icons'");
        expect(content).toContain('<Ionicons');
      });
    });

    describe('Animation Components Used', () => {
      it('should use react-native-reanimated', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain("from 'react-native-reanimated'");
      });

      it('should import Animated', () => {
        const content = fs.readFileSync(guestPromptPath, 'utf8');
        expect(content).toContain('Animated');
        expect(content).toContain('<Animated.View');
      });
    });
  });

  describe('Feature Restriction Logic', () => {
    it('should check isGuest before restricting features', () => {
      const content = fs.readFileSync(hookPath, 'utf8');
      expect(content).toContain('if (!isGuest)');
      expect(content).toContain('return false');
    });

    it('should use RESTRICTED_FEATURES constant', () => {
      const content = fs.readFileSync(hookPath, 'utf8');
      expect(content).toContain('RESTRICTED_FEATURES');
    });
  });

  describe('Guest Cart Logic', () => {
    it('should check cart items for hasGuestCart', () => {
      const content = fs.readFileSync(hookPath, 'utf8');
      expect(content).toContain('items.length > 0');
    });

    it('should use getItemCount for guestCartItemCount', () => {
      const content = fs.readFileSync(hookPath, 'utf8');
      expect(content).toContain('getItemCount');
    });
  });
});
