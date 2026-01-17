/**
 * Core TypeScript type definitions for the Maestro Food Delivery App
 */

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  label: AddressLabel;
  street: string;
  city: string;
  zipCode: string;
  coordinates: Coordinates;
  isDefault: boolean;
  instructions?: string;
}

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ============================================================================
// Restaurant Types
// ============================================================================

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  deliveryTime: DeliveryTimeRange;
  deliveryFee: number;
  minOrder?: number;
  cuisine: string[];
  priceLevel: PriceLevel;
  isOpen: boolean;
  address: string;
  description?: string;
  hours?: BusinessHours;
  coordinates?: Coordinates;
}

export interface DeliveryTimeRange {
  min: number;
  max: number;
}

export type PriceLevel = 1 | 2 | 3 | 4;

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

// ============================================================================
// Menu Types
// ============================================================================

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  customizations: Customization[];
  isAvailable: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
  calories?: number;
  allergens?: string[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  required: boolean;
  maxSelections: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  customizationName: string;
  selectedOptions: SelectedOption[];
}

export interface SelectedOption {
  optionId: string;
  optionName: string;
  price: number;
}

// ============================================================================
// Order Types
// ============================================================================

export interface Order {
  id: string;
  userId: string;
  restaurant: Restaurant;
  items: CartItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  address: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip?: number;
  discount?: number;
  total: number;
  driver?: Driver;
  promoCode?: string;
  specialInstructions?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PICKED_UP = 'PICKED_UP',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4?: string;
  brand?: CardBrand;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export type PaymentMethodType = 'card' | 'cash';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

// ============================================================================
// Driver Types
// ============================================================================

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  vehicle: Vehicle;
  currentLocation?: Coordinates;
  rating: number;
}

export interface Vehicle {
  type: VehicleType;
  make?: string;
  model?: string;
  color?: string;
  licensePlate?: string;
}

export type VehicleType = 'car' | 'motorcycle' | 'bicycle' | 'scooter';

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId?: string;
  orderId?: string;
  driverId?: string;
  rating: number;
  comment?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// Issue & Support Types
// ============================================================================

export interface Issue {
  id: string;
  orderId: string;
  userId: string;
  category: IssueCategory;
  description: string;
  photos?: string[];
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  affectedItems?: string[];
}

export type IssueCategory =
  | 'missing_items'
  | 'wrong_items'
  | 'food_quality'
  | 'late_delivery'
  | 'order_never_arrived'
  | 'other';

export type IssueStatus = 'reported' | 'under_review' | 'resolved' | 'refunded';

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

// ============================================================================
// Promo & Discount Types
// ============================================================================

export interface PromoCode {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  isValid: boolean;
}

export type DiscountType = 'percentage' | 'fixed';

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType =
  | 'order_confirmed'
  | 'driver_assigned'
  | 'driver_nearby'
  | 'order_delivered'
  | 'promo'
  | 'general';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface RestaurantFilters {
  cuisine?: string[];
  priceLevel?: PriceLevel[];
  rating?: number;
  maxDeliveryTime?: number;
  maxDeliveryFee?: number;
  dietary?: DietaryOption[];
  sortBy?: SortOption;
}

export type DietaryOption = 'vegetarian' | 'vegan' | 'gluten_free' | 'halal' | 'kosher';

export type SortOption =
  | 'recommended'
  | 'fastest_delivery'
  | 'rating'
  | 'distance'
  | 'price_low_to_high'
  | 'price_high_to_low';

export interface SearchQuery {
  query: string;
  filters?: RestaurantFilters;
  location?: Coordinates;
}

export interface SearchResult {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
}
