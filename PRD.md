# Maestro Food Delivery App - Product Requirements Document

> **Purpose**: This document serves as a comprehensive guide for AI agents to build the Maestro food delivery application. Follow these instructions precisely, complete tasks in order, and commit after each task.

---

## Agent Instructions

### Core Principles

1. **Use All Available Skills**: Leverage your React, React Native, Expo, and frontend development skills to design beautiful UI components and build a polished application. When building UI, invoke the `building-ui`, `frontend-design`, and `react-native-best-practices` skills.

2. **Consult Documentation When Uncertain**: If you encounter something unfamiliar or need clarification:
   - Use the Context7 MCP tools (`resolve-library-id` and `query-docs`) to fetch up-to-date documentation
   - Use `WebSearch` to find solutions, best practices, or examples
   - Never guess - always verify with authoritative sources

3. **Animations Are Critical**: This is a premium food delivery experience. Add smooth, delightful animations in these crucial places:
   - Screen transitions (use `react-native-reanimated` shared element transitions)
   - Button interactions (scale, opacity feedback)
   - Cart item additions (bounce, slide-in effects)
   - Loading states (skeleton loaders, shimmer effects)
   - Pull-to-refresh with custom animations
   - Order status changes (pulse, progress animations)
   - Modal appearances (spring-based slide-up)
   - Onboarding carousel (parallax, fade effects)

4. **Mock Data Everywhere**: Until backend integration, use comprehensive mock data:
   - Create a `/src/data/mock/` directory for all mock data files
   - Use realistic restaurant names, dish descriptions, prices, and images
   - Simulate network delays with `setTimeout` (300-800ms) for realistic UX
   - Include edge cases (empty states, long text, missing images)

5. **Commit After Each Task**: After completing each task marked with `- [ ]`:
   - Stage all changes
   - Write a descriptive commit message following conventional commits
   - Format: `type(scope): description` (e.g., `feat(auth): add phone number sign-up screen`)

6. **Progress Tracking**: After completing each task:
   - Update the `progress.txt` file in the project root
   - Write an overview of the current work completed
   - Include: task number, brief description of what was done, any notable decisions or challenges
   - This helps maintain continuity across sessions and provides visibility into project progress

7. **Code Quality Standards**:
   - Run `bun run lint:fix` and `bun run format` before each commit
   - Use TypeScript strictly - no `any` types unless absolutely necessary
   - Follow the existing project structure and naming conventions
   - Use the `@/` path alias for imports

8. **Component Architecture**:
   - Create reusable components in `/src/components/`
   - Screen-specific components go in `/src/app/` with the screen
   - Use composition over inheritance
   - Extract hooks into `/src/hooks/` when logic is reusable

### Technology Stack Reference

| Category | Technology | Notes |
|----------|------------|-------|
| Framework | Expo 54, React Native 0.81.5 | Use Expo APIs when available |
| Navigation | Expo Router | File-based routing in `/src/app/` |
| State Management | Zustand | Install and configure in Phase 0 |
| Animations | react-native-reanimated | Already installed |
| Styling | React Native StyleSheet | Use existing theme system |
| Forms | React Hook Form + Zod | Install in Phase 0 |
| Icons | @expo/vector-icons | Use Ionicons or MaterialIcons |

---

## Project Structure

```
src/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Auth flow (unauthenticated)
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── verify.tsx
│   ├── (tabs)/                   # Main app (authenticated)
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home/Discovery
│   │   ├── search.tsx            # Search & Filters
│   │   ├── orders.tsx            # Order History
│   │   └── profile.tsx           # User Profile
│   ├── (modals)/                 # Modal screens
│   │   ├── cart.tsx
│   │   ├── filters.tsx
│   │   └── dish-customization.tsx
│   ├── restaurant/
│   │   └── [id].tsx              # Restaurant detail
│   ├── order/
│   │   ├── [id].tsx              # Order tracking
│   │   └── checkout.tsx          # Checkout flow
│   ├── support/
│   │   ├── index.tsx             # Help center
│   │   └── issue/[orderId].tsx   # Report issue
│   └── _layout.tsx               # Root layout
├── components/
│   ├── ui/                       # Base UI components
│   ├── cards/                    # Card components
│   ├── forms/                    # Form components
│   ├── animations/               # Animation wrappers
│   └── layout/                   # Layout components
├── data/
│   └── mock/                     # Mock data files
├── hooks/                        # Custom hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
├── utils/                        # Utility functions
├── constants/                    # App constants
└── assets/                       # Images, fonts
```

---

## Phase 0: Project Foundation

**Goal**: Set up the core infrastructure, state management, design system, and mock data layer before building features.

### Tasks

- [x] **0.1 Install required dependencies**
  ```bash
  bun add zustand react-hook-form @hookform/resolvers zod
  bun add react-native-maps expo-location expo-image-picker
  bun add @shopify/flash-list date-fns
  ```
  - Commit: `chore(deps): install state management, forms, and utility packages`

- [x] **0.2 Create TypeScript type definitions**
  - Create `/src/types/index.ts` with interfaces for:
    - `User` (id, name, email, phone, avatar, addresses)
    - `Address` (id, label, street, city, zipCode, coordinates, isDefault)
    - `Restaurant` (id, name, image, rating, reviewCount, deliveryTime, deliveryFee, cuisine, priceLevel, isOpen)
    - `MenuItem` (id, restaurantId, name, description, price, image, category, customizations, isAvailable)
    - `Customization` (id, name, options, required, maxSelections)
    - `CartItem` (menuItem, quantity, selectedCustomizations, specialInstructions, totalPrice)
    - `Order` (id, userId, restaurant, items, status, createdAt, estimatedDelivery, address, paymentMethod, subtotal, deliveryFee, tax, total, driver)
    - `OrderStatus` (enum: PENDING, CONFIRMED, PREPARING, READY, PICKED_UP, ON_THE_WAY, DELIVERED, CANCELLED)
    - `Driver` (id, name, avatar, phone, vehicle, currentLocation)
    - `Review` (id, userId, rating, comment, createdAt, photos)
    - `Issue` (id, orderId, category, description, photos, status, createdAt)
  - Commit: `feat(types): add core TypeScript interfaces for app entities`

- [x] **0.3 Set up Zustand stores**
  - Create `/src/stores/auth-store.ts`:
    - State: user, isAuthenticated, isGuest
    - Actions: signIn, signUp, signOut, setGuest, updateProfile
  - Create `/src/stores/cart-store.ts`:
    - State: items, restaurantId
    - Actions: addItem, removeItem, updateQuantity, clearCart, getTotal
  - Create `/src/stores/order-store.ts`:
    - State: currentOrder, orderHistory
    - Actions: createOrder, updateOrderStatus, fetchOrderHistory
  - Create `/src/stores/index.ts` to export all stores
  - Commit: `feat(stores): set up Zustand stores for auth, cart, and orders`

- [x] **0.4 Create design system constants**
  - Update `/src/constants/theme.ts` with:
    - Extended color palette (primary, secondary, success, warning, error, neutral shades)
    - Typography scale (xs, sm, base, lg, xl, 2xl, 3xl)
    - Spacing scale (0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24)
    - Border radius values (none, sm, md, lg, xl, full)
    - Shadow definitions (sm, md, lg)
  - Commit: `feat(theme): extend design system with typography, spacing, and shadows`

- [x] **0.5 Create comprehensive mock data**
  - Create `/src/data/mock/restaurants.ts` with 15+ restaurants
  - Create `/src/data/mock/menu-items.ts` with 5-10 items per restaurant
  - Create `/src/data/mock/users.ts` with sample user data
  - Create `/src/data/mock/orders.ts` with various order statuses
  - Create `/src/data/mock/categories.ts` (cuisine types with icons)
  - Use placeholder images from `https://picsum.photos/` or include local assets
  - Commit: `feat(mock): add comprehensive mock data for restaurants, menus, and orders`

- [x] **0.6 Create base UI components**
  - Create `/src/components/ui/button.tsx` - Primary, secondary, outline, ghost variants with press animation
  - Create `/src/components/ui/input.tsx` - Text input with label, error state, icons
  - Create `/src/components/ui/card.tsx` - Pressable card with shadow and scale animation
  - Create `/src/components/ui/badge.tsx` - Status badges with colors
  - Create `/src/components/ui/skeleton.tsx` - Loading skeleton with shimmer animation
  - Create `/src/components/ui/divider.tsx` - Horizontal/vertical divider
  - Create `/src/components/ui/avatar.tsx` - User/restaurant avatar with fallback
  - Commit: `feat(ui): create base UI component library with animations`

- [x] **0.7 Create animation utility components**
  - Create `/src/components/animations/fade-in.tsx` - Fade in on mount
  - Create `/src/components/animations/slide-up.tsx` - Slide up on mount
  - Create `/src/components/animations/scale-press.tsx` - Scale on press wrapper
  - Create `/src/components/animations/stagger-list.tsx` - Staggered list animation
  - All should use `react-native-reanimated` with `entering`/`exiting` props
  - Commit: `feat(animations): add reusable animation wrapper components`

- [x] **0.8 Configure navigation structure**
  - Update `/src/app/_layout.tsx` for auth/main flow routing
  - Create `/src/app/(auth)/_layout.tsx` with stack navigation
  - Update `/src/app/(tabs)/_layout.tsx` with 4 tabs: Home, Search, Orders, Profile
  - Set up deep linking configuration
  - Commit: `feat(navigation): configure auth and main app navigation structure`

---

## Phase 1: Onboarding & Authentication

**Goal**: Create a smooth, engaging onboarding experience with multiple sign-up options and guest mode.

### Design Requirements
- Onboarding should feel premium with smooth page transitions
- Use illustrations or Lottie animations for onboarding slides
- Forms should have real-time validation feedback
- Support both light and dark mode

### Tasks

- [x] **1.1 Create splash screen configuration**
  - Configure `expo-splash-screen` in `app.json`
  - Add animated logo reveal on app launch
  - Commit: `feat(splash): configure animated splash screen`

- [x] **1.2 Build onboarding carousel screen**
  - Create `/src/app/(auth)/onboarding.tsx`
  - 4 slides with parallax image effect:
    1. "Discover Local Favorites" - Browse restaurants near you
    2. "Easy Ordering" - Customize your perfect meal
    3. "Real-Time Tracking" - Watch your order arrive
    4. "Quick Reordering" - Your favorites, one tap away
  - Animated pagination dots
  - Skip button and Get Started button
  - Persist `hasOnboarded` flag to AsyncStorage
  - Commit: `feat(onboarding): create animated onboarding carousel with 4 slides`

- [x] **1.3 Build sign-up screen**
  - Create `/src/app/(auth)/sign-up.tsx`
  - Toggle between Email and Phone sign-up methods
  - Form fields:
    - Email: email input with validation
    - Phone: phone input with country code picker
    - Password: password input with strength indicator
    - Name: text input
  - Terms & conditions checkbox
  - "Continue as Guest" link at bottom
  - Form validation using react-hook-form + zod
  - Animated form field focus states
  - Commit: `feat(auth): build sign-up screen with email and phone options`

- [x] **1.4 Build sign-in screen**
  - Create `/src/app/(auth)/sign-in.tsx`
  - Email/Phone toggle (remember last used method)
  - Password field with show/hide toggle
  - "Forgot Password?" link
  - "Don't have an account? Sign Up" link
  - "Continue as Guest" option
  - Biometric authentication option (if available)
  - Animated button loading state
  - Commit: `feat(auth): build sign-in screen with biometric support`

- [x] **1.5 Build verification screen**
  - Create `/src/app/(auth)/verify.tsx`
  - OTP input (6 digits) with auto-focus between inputs
  - Resend code timer (60 seconds countdown)
  - Auto-submit when all digits entered
  - Animated success checkmark on verification
  - Commit: `feat(auth): build OTP verification screen with auto-submit`

- [x] **1.6 Implement guest mode**
  - Add guest login flow in auth store
  - Show limited UI for guests (prompt to sign up for saved addresses, order history)
  - Guest-to-user conversion flow
  - Commit: `feat(auth): implement guest mode with conversion prompts`

- [x] **1.7 Build profile creation/edit screen**
  - Create `/src/app/(tabs)/profile.tsx` with edit mode
  - Profile photo picker (camera/gallery)
  - Name, email, phone fields
  - Manage saved addresses section
  - Add new address modal with:
    - Address label (Home, Work, Other)
    - Street address autocomplete (mock)
    - City, ZIP code
    - Set as default toggle
  - Payment methods section (placeholder for Phase 4)
  - Commit: `feat(profile): build profile screen with address management`

---

## Phase 2: Discovery - Finding the Perfect Meal

**Goal**: Create an engaging home screen where users can explore restaurants with powerful search and filtering.

### Design Requirements
- Home screen should feel alive with subtle animations
- Restaurant cards should be visually appealing with key info at a glance
- Search should be instant and responsive
- Filters should be comprehensive but not overwhelming

### Tasks

- [x] **2.1 Build home screen header**
  - Create delivery address selector with current address display
  - Tappable to open address picker modal
  - Animated dropdown arrow
  - Commit: `feat(home): add delivery address header with selector`

- [x] **2.2 Create search bar component**
  - Create `/src/components/search-bar.tsx`
  - Search icon with animated focus state
  - Clear button when text entered
  - Recent searches dropdown (stored in AsyncStorage)
  - Navigate to search screen on focus
  - Commit: `feat(search): create animated search bar component`

- [x] **2.3 Build cuisine category horizontal scroll**
  - Create `/src/components/cards/category-chip.tsx`
  - Horizontal FlatList of cuisine categories with icons
  - Categories: All, Pizza, Burgers, Sushi, Chinese, Indian, Mexican, Thai, Italian, Healthy, Desserts
  - Selected state with scale animation
  - Commit: `feat(home): add horizontal cuisine category scroll`

- [x] **2.4 Create restaurant card component**
  - Create `/src/components/cards/restaurant-card.tsx`
  - Restaurant image with gradient overlay
  - Name, cuisine type, rating with star icon
  - Delivery time and fee
  - Promotional badge (if applicable)
  - "Closed" overlay when not available
  - Press animation (scale down slightly)
  - Commit: `feat(cards): create restaurant card with rating and delivery info`

- [x] **2.5 Build home screen sections**
  - Update `/src/app/(tabs)/index.tsx`:
    - "Featured Restaurants" carousel (horizontal scroll with larger cards)
    - "Popular Near You" section
    - "Quick Bites" section (fast delivery)
    - "New on Maestro" section
  - Use `@shopify/flash-list` for performance
  - Pull-to-refresh with custom animation
  - Skeleton loading state on initial load
  - Commit: `feat(home): build home screen with featured and category sections`

- [x] **2.6 Build search screen**
  - Create `/src/app/(tabs)/search.tsx`
  - Large search input at top
  - Search results as user types (debounced)
  - Show restaurants and menu items matching query
  - Empty state: "Search for restaurants or dishes"
  - No results state: "No results for [query]"
  - Commit: `feat(search): build search screen with instant results`

- [x] **2.7 Create filter modal**
  - Create `/src/app/(modals)/filters.tsx`
  - Filter sections:
    - Sort by: Recommended, Fastest Delivery, Rating, Distance
    - Price Range: $, $$, $$$, $$$$
    - Rating: 4.5+, 4.0+, 3.5+
    - Delivery Time: Under 30 min, Under 45 min, Under 60 min
    - Dietary: Vegetarian, Vegan, Gluten-Free, Halal, Kosher
  - "Apply Filters" button with count badge
  - "Clear All" option
  - Animated filter chip selection
  - Commit: `feat(filters): create comprehensive filter modal with all options`

- [x] **2.8 Implement filter logic**
  - Create `/src/hooks/use-filtered-restaurants.ts`
  - Apply all filter criteria to restaurant list
  - Persist selected filters in store
  - Show active filter count on filter button
  - Commit: `feat(filters): implement filter logic with persistence`

---

## Phase 3: Restaurant & Menu Selection

**Goal**: Create an immersive restaurant detail view with an interactive menu and customization options.

### Design Requirements
- Restaurant header should have parallax scroll effect
- Menu should be easy to navigate with sticky category tabs
- Dish customization should be intuitive
- Cart preview should be always accessible

### Tasks

- [x] **3.1 Build restaurant detail header**
  - Create `/src/app/restaurant/[id].tsx`
  - Hero image with parallax effect on scroll
  - Restaurant name, rating, review count
  - Cuisine tags, price level indicators
  - Delivery time and fee
  - "More Info" expandable section (hours, address, about)
  - Share and favorite buttons (heart icon with fill animation)
  - Commit: `feat(restaurant): build restaurant header with parallax effect`

- [x] **3.2 Create sticky menu category tabs**
  - Horizontal scrollable category tabs
  - Auto-scroll to active category as user scrolls menu
  - Tap to scroll to category section
  - Animated underline indicator
  - Commit: `feat(menu): add sticky category tabs with scroll sync`

- [x] **3.3 Build menu item card**
  - Create `/src/components/cards/menu-item-card.tsx`
  - Item image (square, right-aligned)
  - Name and description (truncated)
  - Price with "from" prefix if customizable
  - "Popular" or "Spicy" badges
  - Add button that transforms to quantity selector
  - Commit: `feat(menu): create menu item card with add-to-cart button`

- [x] **3.4 Build menu list with sections**
  - SectionList with category headers
  - Sticky category headers on scroll
  - Empty category message if all items unavailable
  - Skeleton loading for menu
  - Commit: `feat(menu): build sectioned menu list with sticky headers`

- [x] **3.5 Create dish customization modal**
  - Create `/src/app/(modals)/dish-customization.tsx`
  - Large dish image at top
  - Full description
  - Customization sections:
    - Required choices (radio buttons): Size, Base, etc.
    - Optional add-ons (checkboxes): Extra toppings, sides
    - Quantity selector
  - Special instructions text input
  - Running total at bottom
  - "Add to Cart" button with price
  - Animated section expansions
  - Commit: `feat(menu): build dish customization modal with options`

- [x] **3.6 Implement cart functionality**
  - Cart store integration with restaurant check (can't mix restaurants)
  - Show confirmation when switching restaurants
  - Update cart item quantities
  - Remove items with swipe-to-delete
  - Commit: `feat(cart): implement cart management with restaurant validation`

- [x] **3.7 Build floating cart preview**
  - Create `/src/components/cart-preview.tsx`
  - Fixed at bottom of restaurant screen
  - Shows item count and total
  - Animated appearance when items added
  - Tap to open cart modal
  - Subtle bounce animation on item add
  - Commit: `feat(cart): add floating cart preview with animations`

- [x] **3.8 Build cart modal**
  - Create `/src/app/(modals)/cart.tsx`
  - Full item list with customizations shown
  - Edit item (re-open customization modal)
  - Quantity +/- controls
  - Swipe to delete with animated removal
  - Subtotal, fees breakdown preview
  - "Add more items" button (returns to restaurant)
  - "Checkout" button
  - Commit: `feat(cart): build full cart modal with edit and delete`

---

## Phase 4: Checkout & Payment

**Goal**: Create a smooth checkout flow with address confirmation, payment selection, and order placement.

### Design Requirements
- Checkout should be single-page with collapsible sections
- Order summary should be clear and itemized
- Payment should feel secure
- Place order button should have loading and success states

### Tasks

- [x] **4.1 Build checkout screen layout**
  - Create `/src/app/order/checkout.tsx`
  - Collapsible sections:
    1. Delivery Address
    2. Order Summary
    3. Payment Method
    4. Promo Code
  - Sticky "Place Order" button at bottom
  - Commit: `feat(checkout): create checkout screen with collapsible sections`

- [x] **4.2 Build delivery address section**
  - Show selected address with edit button
  - "Add New Address" option
  - Delivery instructions input
  - Estimated delivery time display
  - Commit: `feat(checkout): add delivery address section with instructions`

- [x] **4.3 Build order summary section**
  - Itemized list with quantities and prices
  - Item customizations in smaller text
  - Subtotal, delivery fee, taxes breakdown
  - Total prominently displayed
  - Animated expand/collapse
  - Commit: `feat(checkout): build order summary with cost breakdown`

- [x] **4.4 Build payment method section**
  - Payment options:
    - Saved cards (show last 4 digits)
    - Add new card (navigate to add card screen)
    - Cash on Delivery
  - Card icons (Visa, Mastercard, Amex)
  - Radio button selection
  - Commit: `feat(checkout): add payment method selection`

- [x] **4.5 Build add card screen**
  - Create `/src/app/order/add-card.tsx`
  - Card number input with formatting
  - Expiry date (MM/YY) input
  - CVV input
  - Cardholder name input
  - Card type auto-detection with icon
  - Save card toggle
  - Commit: `feat(payment): build add card screen with validation`

- [x] **4.6 Build promo code section**
  - Promo code input with Apply button
  - Success/error feedback animation
  - Applied discount shown in summary
  - Remove promo code option
  - Commit: `feat(checkout): add promo code input with validation`

- [x] **4.7 Implement place order flow**
  - Validate all sections complete
  - Loading state on button
  - Mock API call with delay
  - Success: Navigate to order tracking
  - Error: Show error toast and retry option
  - Clear cart on success
  - Animated success transition
  - Commit: `feat(checkout): implement place order with success flow`

---

## Phase 5: Real-Time Order Tracking

**Goal**: Provide a transparent, engaging order tracking experience with status updates and driver location.

### Design Requirements
- Status progress should be visually clear
- Map should show driver movement (simulated)
- Updates should feel real-time with animations
- ETA should be prominent

### Tasks

- [x] **5.1 Build order confirmation screen**
  - Create `/src/app/order/[id].tsx`
  - Success animation (checkmark with confetti or particles)
  - Order number and estimated time
  - Restaurant name
  - "Track Order" button
  - Commit: `feat(tracking): build order confirmation with success animation`

- [x] **5.2 Create order status tracker component**
  - Create `/src/components/order-status-tracker.tsx`
  - Visual progress steps:
    1. Order Placed (checkmark)
    2. Restaurant Confirmed
    3. Preparing Your Order
    4. Ready for Pickup
    5. Driver On The Way
    6. Delivered
  - Animated progress line between steps
  - Current step highlighted with pulse animation
  - Timestamp for completed steps
  - Commit: `feat(tracking): create animated order status tracker`

- [x] **5.3 Build map view with driver location**
  - Integrate `react-native-maps`
  - Show restaurant marker
  - Show delivery address marker
  - Animated driver marker that moves along route (mock movement)
  - Route polyline between points
  - Re-center button
  - Commit: `feat(tracking): add map with driver location tracking`

- [x] **5.4 Build ETA display component**
  - Create `/src/components/eta-display.tsx`
  - Large countdown timer
  - "Arriving in X minutes" text
  - Update animation when ETA changes
  - Commit: `feat(tracking): create ETA countdown display`

- [x] **5.5 Build driver info card**
  - Create `/src/components/cards/driver-card.tsx`
  - Driver photo, name
  - Vehicle description
  - Rating
  - Call button (opens phone dialer)
  - Message button (placeholder for chat)
  - Animated slide-up appearance when driver assigned
  - Commit: `feat(tracking): add driver info card with contact options`

- [x] **5.6 Implement mock real-time updates**
  - Create `/src/hooks/use-order-tracking.ts`
  - Simulate status changes with setTimeout
  - Update driver location periodically
  - Update ETA as driver moves
  - Commit: `feat(tracking): implement mock real-time order updates`

- [x] **5.7 Set up push notification placeholders**
  - Create `/src/utils/notifications.ts`
  - Request notification permissions
  - Mock notification triggers for:
    - Order confirmed
    - Driver assigned
    - Driver nearby
    - Order delivered
  - In-app notification toast
  - Commit: `feat(notifications): set up push notification placeholders`

---

## Phase 6: Post-Delivery & Order History

**Goal**: Enable users to view past orders, rate their experience, and quickly reorder favorites.

### Design Requirements
- Order history should be easy to browse
- Rating flow should be simple and quick
- Reorder should be one-tap with confirmation

### Tasks

- [x] **6.1 Build order history screen**
  - Update `/src/app/(tabs)/orders.tsx`
  - Tabs: Active Orders | Past Orders
  - Order cards showing:
    - Restaurant name and image
    - Order date
    - Total amount
    - Status badge
    - Item count
  - Tap to view order details
  - Empty state for no orders
  - Commit: `feat(orders): build order history with active and past tabs`

- [x] **6.2 Build order details screen**
  - Create `/src/app/order/details/[id].tsx`
  - Order summary with all items
  - Order status and timeline
  - Delivery address used
  - Payment method used
  - Receipt/invoice view
  - "Reorder" button
  - "Get Help" button
  - Commit: `feat(orders): build order details with full summary`

- [x] **6.3 Build rating modal**
  - Create `/src/components/rating-modal.tsx`
  - Star rating (1-5) with tap and swipe
  - "How was your food?" - Restaurant rating
  - "How was your delivery?" - Driver rating
  - Optional text review
  - Optional photo upload
  - Animated star selection
  - Commit: `feat(ratings): create rating modal for restaurant and driver`

- [x] **6.4 Trigger rating prompt**
  - Show rating modal after order marked delivered
  - Can dismiss and rate later
  - "Rate Order" button in order history
  - Commit: `feat(ratings): trigger rating prompt after delivery`

- [x] **6.5 Build review display on restaurant**
  - Show ratings on restaurant detail page
  - Recent reviews section
  - Review cards with:
    - User avatar and name
    - Rating stars
    - Review text
    - Photos (if any)
    - Date
  - Commit: `feat(reviews): display reviews on restaurant page`

- [x] **6.6 Implement reorder functionality**
  - "Reorder" button on past orders
  - Check item availability (mock)
  - Show unavailable items warning
  - Add available items to cart
  - Navigate to cart for checkout
  - Commit: `feat(orders): implement reorder with availability check`

---

## Phase 7: Issue Resolution

**Goal**: Provide users with an accessible way to report and track issues with their orders.

### Design Requirements
- Issue reporting should be straightforward
- Users should feel heard and supported
- Status updates should be clear

### Tasks

- [ ] **7.1 Build help center screen**
  - Create `/src/app/support/index.tsx`
  - FAQ accordion sections
  - Common topics:
    - Order issues
    - Payment questions
    - Account settings
    - Restaurant feedback
  - "Contact Support" button
  - Search FAQs
  - Commit: `feat(support): build help center with FAQ sections`

- [ ] **7.2 Build report issue screen**
  - Create `/src/app/support/issue/[orderId].tsx`
  - Pre-select order from navigation param
  - Issue categories:
    - Missing items
    - Wrong items
    - Food quality
    - Late delivery
    - Order never arrived
    - Other
  - Commit: `feat(support): create issue reporting screen`

- [ ] **7.3 Build issue details form**
  - Category selection (required)
  - If "Missing items" or "Wrong items":
    - Checkbox list of order items
  - Description text area
  - Photo upload (up to 3 photos)
  - Photo preview with remove option
  - Submit button with loading state
  - Commit: `feat(support): build issue details form with photo upload`

- [ ] **7.4 Implement issue submission flow**
  - Validate required fields
  - Mock API submission
  - Success confirmation with issue ID
  - Navigate to issue tracking
  - Commit: `feat(support): implement issue submission with confirmation`

- [ ] **7.5 Build issue tracking screen**
  - Create `/src/app/support/issue/status/[issueId].tsx`
  - Issue summary
  - Status timeline:
    - Reported
    - Under Review
    - Resolved/Refunded
  - Resolution details when complete
  - Contact support option
  - Commit: `feat(support): build issue status tracking screen`

- [ ] **7.6 Add help access throughout app**
  - Help button in order details
  - Help button in order tracking
  - Help icon in profile/settings
  - Consistent navigation to help center
  - Commit: `feat(support): add help access points throughout app`

---

## Phase 8: Polish & Final Touches

**Goal**: Add finishing touches, micro-interactions, and ensure the app feels premium and complete.

### Tasks

- [ ] **8.1 Add loading skeletons everywhere**
  - Home screen skeleton
  - Restaurant list skeleton
  - Menu skeleton
  - Order details skeleton
  - Shimmer animation on all skeletons
  - Commit: `feat(ui): add skeleton loading states with shimmer animation`

- [ ] **8.2 Add error states**
  - Network error screen with retry
  - Empty states for:
    - No restaurants found
    - No search results
    - No orders yet
  - Error toasts for failed actions
  - Commit: `feat(ui): add error states and empty states`

- [ ] **8.3 Add pull-to-refresh**
  - Home screen refresh
  - Order history refresh
  - Restaurant list refresh
  - Custom refresh indicator with animation
  - Commit: `feat(ui): add pull-to-refresh with custom animation`

- [ ] **8.4 Enhance screen transitions**
  - Shared element transitions for:
    - Restaurant card to restaurant detail
    - Menu item to customization modal
  - Smooth modal presentations
  - Tab switching animations
  - Commit: `feat(animations): add shared element and screen transitions`

- [ ] **8.5 Add haptic feedback**
  - Button presses
  - Tab switches
  - Add to cart
  - Form submissions
  - Error feedback
  - Commit: `feat(ux): add haptic feedback throughout app`

- [ ] **8.6 Implement dark mode support**
  - Verify all screens support dark mode
  - Test color contrast
  - Image overlays for dark mode
  - Fix any theme issues
  - Commit: `feat(theme): complete dark mode support`

- [ ] **8.7 Add app icons and splash screen**
  - Create custom app icon
  - Configure adaptive icons for Android
  - Animated splash screen
  - Commit: `feat(assets): add custom app icons and splash screen`

- [ ] **8.8 Performance optimization**
  - Memoize expensive components
  - Optimize list renders with FlashList
  - Lazy load screens
  - Image optimization
  - Commit: `perf: optimize rendering and lazy load screens`

- [ ] **8.9 Final testing and bug fixes**
  - Test all user flows end-to-end
  - Fix any discovered issues
  - Verify on iOS and Android
  - Test light and dark mode
  - Test different screen sizes
  - Commit: `fix: address final testing issues`

---

## Mock Data Specifications

### Restaurants Mock Data Structure
```typescript
// Example restaurant
{
  id: "1",
  name: "Bella Italia",
  image: "https://picsum.photos/seed/bella/400/300",
  coverImage: "https://picsum.photos/seed/bella-cover/800/400",
  cuisine: ["Italian", "Pizza", "Pasta"],
  rating: 4.7,
  reviewCount: 324,
  priceLevel: 2, // 1-4 ($-$$$$)
  deliveryTime: { min: 25, max: 35 },
  deliveryFee: 2.99,
  minOrder: 15.00,
  isOpen: true,
  address: "123 Main Street",
  description: "Authentic Italian cuisine...",
  hours: { /* opening hours */ }
}
```

### Categories
Pizza, Burgers, Sushi, Chinese, Indian, Mexican, Thai, Italian, American, Mediterranean, Healthy, Desserts, Breakfast, Coffee

### Order Statuses
PENDING → CONFIRMED → PREPARING → READY → PICKED_UP → ON_THE_WAY → DELIVERED

Use 3-5 second delays between status changes for mock tracking.

---

## Verification Checklist

After completing all phases, verify:

- [ ] All screens render correctly on iOS and Android
- [ ] Dark mode works throughout the app
- [ ] All animations are smooth (60fps)
- [ ] Forms validate correctly
- [ ] Cart persists across app sessions
- [ ] Order tracking simulation works
- [ ] All navigation flows work correctly
- [ ] Empty and error states display properly
- [ ] Haptic feedback works on physical devices
- [ ] App handles network simulation delays gracefully

---

## Notes for AI Agents

1. **Before starting each phase**, read through all tasks to understand the full scope
2. **When creating components**, check if similar components already exist and extend them
3. **When uncertain about implementation**, use `query-docs` to check Expo/React Native documentation
4. **For animations**, prefer `react-native-reanimated` layout animations over manual transforms
5. **Test frequently** - run the app after each major task to catch issues early
6. **Keep commits atomic** - each commit should represent one logical change
7. **Don't skip mock data** - realistic mock data is essential for proper UX testing
