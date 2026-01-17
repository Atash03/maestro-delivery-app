/**
 * Tests for TypeScript type definitions
 * These tests verify that the types are correctly defined and can be used properly
 */

import {
  type Address,
  type AddressLabel,
  type ApiResponse,
  type BusinessHours,
  type CardBrand,
  type CartItem,
  type Category,
  type Customization,
  type CustomizationOption,
  type DayHours,
  type DietaryOption,
  type DiscountType,
  type Driver,
  type Issue,
  type IssueCategory,
  type IssueStatus,
  type MenuItem,
  type Notification,
  type NotificationType,
  OrderStatus,
  type PaginatedResponse,
  type PaymentMethod,
  type PaymentMethodType,
  type PriceLevel,
  type PromoCode,
  type Restaurant,
  type RestaurantFilters,
  type Review,
  type SearchQuery,
  type SearchResult,
  type SelectedCustomization,
  type SelectedOption,
  type SortOption,
  type User,
  type Vehicle,
  type VehicleType,
} from '../types';

describe('TypeScript Type Definitions', () => {
  describe('User & Authentication Types', () => {
    it('should create a valid User object', () => {
      const user: User = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        avatar: 'https://example.com/avatar.jpg',
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(user.id).toBe('user-1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.addresses).toEqual([]);
    });

    it('should create a valid Address object', () => {
      const address: Address = {
        id: 'addr-1',
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        isDefault: true,
        instructions: 'Ring doorbell twice',
      };

      expect(address.label).toBe('Home');
      expect(address.isDefault).toBe(true);
      expect(address.coordinates.latitude).toBe(40.7128);
    });

    it('should only allow valid AddressLabel values', () => {
      const validLabels: AddressLabel[] = ['Home', 'Work', 'Other'];
      expect(validLabels).toHaveLength(3);
    });
  });

  describe('Restaurant Types', () => {
    it('should create a valid Restaurant object', () => {
      const restaurant: Restaurant = {
        id: 'rest-1',
        name: 'Pizza Palace',
        image: 'https://example.com/pizza.jpg',
        rating: 4.5,
        reviewCount: 250,
        deliveryTime: { min: 20, max: 30 },
        deliveryFee: 2.99,
        cuisine: ['Italian', 'Pizza'],
        priceLevel: 2,
        isOpen: true,
        address: '456 Food Street',
      };

      expect(restaurant.name).toBe('Pizza Palace');
      expect(restaurant.rating).toBe(4.5);
      expect(restaurant.deliveryTime.min).toBe(20);
      expect(restaurant.priceLevel).toBe(2);
    });

    it('should allow valid PriceLevel values', () => {
      const priceLevels: PriceLevel[] = [1, 2, 3, 4];
      expect(priceLevels).toContain(1);
      expect(priceLevels).toContain(4);
    });

    it('should create valid BusinessHours', () => {
      const dayHours: DayHours = {
        open: '09:00',
        close: '22:00',
        isClosed: false,
      };

      const hours: BusinessHours = {
        monday: dayHours,
        tuesday: dayHours,
        wednesday: dayHours,
        thursday: dayHours,
        friday: dayHours,
        saturday: { ...dayHours, close: '23:00' },
        sunday: { open: '', close: '', isClosed: true },
      };

      expect(hours.monday.open).toBe('09:00');
      expect(hours.sunday.isClosed).toBe(true);
    });
  });

  describe('Menu Types', () => {
    it('should create a valid MenuItem object', () => {
      const menuItem: MenuItem = {
        id: 'item-1',
        restaurantId: 'rest-1',
        name: 'Margherita Pizza',
        description: 'Classic tomato and mozzarella',
        price: 14.99,
        image: 'https://example.com/margherita.jpg',
        category: 'Pizza',
        customizations: [],
        isAvailable: true,
        isPopular: true,
        isSpicy: false,
        calories: 800,
        allergens: ['gluten', 'dairy'],
      };

      expect(menuItem.name).toBe('Margherita Pizza');
      expect(menuItem.price).toBe(14.99);
      expect(menuItem.isPopular).toBe(true);
    });

    it('should create a valid Customization with options', () => {
      const option: CustomizationOption = {
        id: 'opt-1',
        name: 'Large',
        price: 3.0,
        isDefault: false,
      };

      const customization: Customization = {
        id: 'cust-1',
        name: 'Size',
        options: [option],
        required: true,
        maxSelections: 1,
      };

      expect(customization.name).toBe('Size');
      expect(customization.required).toBe(true);
      expect(customization.options[0].price).toBe(3.0);
    });
  });

  describe('Cart Types', () => {
    it('should create a valid CartItem object', () => {
      const selectedOption: SelectedOption = {
        optionId: 'opt-1',
        optionName: 'Large',
        price: 3.0,
      };

      const selectedCustomization: SelectedCustomization = {
        customizationId: 'cust-1',
        customizationName: 'Size',
        selectedOptions: [selectedOption],
      };

      const cartItem: CartItem = {
        id: 'cart-item-1',
        menuItem: {
          id: 'item-1',
          restaurantId: 'rest-1',
          name: 'Pizza',
          description: 'Delicious pizza',
          price: 14.99,
          category: 'Pizza',
          customizations: [],
          isAvailable: true,
        },
        quantity: 2,
        selectedCustomizations: [selectedCustomization],
        specialInstructions: 'Extra crispy',
        totalPrice: 35.98,
      };

      expect(cartItem.quantity).toBe(2);
      expect(cartItem.totalPrice).toBe(35.98);
      expect(cartItem.selectedCustomizations[0].customizationName).toBe('Size');
    });
  });

  describe('Order Types', () => {
    it('should have all OrderStatus enum values', () => {
      expect(OrderStatus.PENDING).toBe('PENDING');
      expect(OrderStatus.CONFIRMED).toBe('CONFIRMED');
      expect(OrderStatus.PREPARING).toBe('PREPARING');
      expect(OrderStatus.READY).toBe('READY');
      expect(OrderStatus.PICKED_UP).toBe('PICKED_UP');
      expect(OrderStatus.ON_THE_WAY).toBe('ON_THE_WAY');
      expect(OrderStatus.DELIVERED).toBe('DELIVERED');
      expect(OrderStatus.CANCELLED).toBe('CANCELLED');
    });

    it('should create a valid PaymentMethod object', () => {
      const paymentMethod: PaymentMethod = {
        id: 'pm-1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      };

      expect(paymentMethod.type).toBe('card');
      expect(paymentMethod.brand).toBe('visa');
      expect(paymentMethod.last4).toBe('4242');
    });

    it('should allow valid PaymentMethodType values', () => {
      const types: PaymentMethodType[] = ['card', 'cash'];
      expect(types).toContain('card');
      expect(types).toContain('cash');
    });

    it('should allow valid CardBrand values', () => {
      const brands: CardBrand[] = ['visa', 'mastercard', 'amex', 'discover'];
      expect(brands).toHaveLength(4);
    });
  });

  describe('Driver Types', () => {
    it('should create a valid Driver object', () => {
      const vehicle: Vehicle = {
        type: 'car',
        make: 'Toyota',
        model: 'Camry',
        color: 'Blue',
        licensePlate: 'ABC123',
      };

      const driver: Driver = {
        id: 'driver-1',
        name: 'Jane Smith',
        avatar: 'https://example.com/jane.jpg',
        phone: '+1987654321',
        vehicle,
        currentLocation: { latitude: 40.7128, longitude: -74.006 },
        rating: 4.8,
      };

      expect(driver.name).toBe('Jane Smith');
      expect(driver.vehicle.type).toBe('car');
      expect(driver.rating).toBe(4.8);
    });

    it('should allow valid VehicleType values', () => {
      const types: VehicleType[] = ['car', 'motorcycle', 'bicycle', 'scooter'];
      expect(types).toHaveLength(4);
    });
  });

  describe('Review Types', () => {
    it('should create a valid Review object', () => {
      const review: Review = {
        id: 'review-1',
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'https://example.com/john.jpg',
        restaurantId: 'rest-1',
        orderId: 'order-1',
        rating: 5,
        comment: 'Excellent food and fast delivery!',
        photos: ['https://example.com/food1.jpg'],
        createdAt: new Date(),
      };

      expect(review.rating).toBe(5);
      expect(review.comment).toBe('Excellent food and fast delivery!');
    });
  });

  describe('Issue & Support Types', () => {
    it('should create a valid Issue object', () => {
      const issue: Issue = {
        id: 'issue-1',
        orderId: 'order-1',
        userId: 'user-1',
        category: 'missing_items',
        description: 'Missing fries from order',
        photos: ['https://example.com/issue.jpg'],
        status: 'reported',
        createdAt: new Date(),
        updatedAt: new Date(),
        affectedItems: ['item-3'],
      };

      expect(issue.category).toBe('missing_items');
      expect(issue.status).toBe('reported');
    });

    it('should allow valid IssueCategory values', () => {
      const categories: IssueCategory[] = [
        'missing_items',
        'wrong_items',
        'food_quality',
        'late_delivery',
        'order_never_arrived',
        'other',
      ];
      expect(categories).toHaveLength(6);
    });

    it('should allow valid IssueStatus values', () => {
      const statuses: IssueStatus[] = ['reported', 'under_review', 'resolved', 'refunded'];
      expect(statuses).toHaveLength(4);
    });
  });

  describe('Category Types', () => {
    it('should create a valid Category object', () => {
      const category: Category = {
        id: 'cat-1',
        name: 'Pizza',
        icon: 'pizza-outline',
        image: 'https://example.com/pizza-cat.jpg',
      };

      expect(category.name).toBe('Pizza');
      expect(category.icon).toBe('pizza-outline');
    });
  });

  describe('Promo & Discount Types', () => {
    it('should create a valid PromoCode object', () => {
      const promo: PromoCode = {
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 25.0,
        maxDiscount: 10.0,
        expiresAt: new Date('2026-12-31'),
        isValid: true,
      };

      expect(promo.code).toBe('SAVE20');
      expect(promo.discountType).toBe('percentage');
      expect(promo.discountValue).toBe(20);
    });

    it('should allow valid DiscountType values', () => {
      const types: DiscountType[] = ['percentage', 'fixed'];
      expect(types).toContain('percentage');
      expect(types).toContain('fixed');
    });
  });

  describe('Notification Types', () => {
    it('should create a valid Notification object', () => {
      const notification: Notification = {
        id: 'notif-1',
        type: 'order_confirmed',
        title: 'Order Confirmed',
        body: 'Your order has been confirmed!',
        data: { orderId: 'order-1' },
        read: false,
        createdAt: new Date(),
      };

      expect(notification.type).toBe('order_confirmed');
      expect(notification.read).toBe(false);
    });

    it('should allow valid NotificationType values', () => {
      const types: NotificationType[] = [
        'order_confirmed',
        'driver_assigned',
        'driver_nearby',
        'order_delivered',
        'promo',
        'general',
      ];
      expect(types).toHaveLength(6);
    });
  });

  describe('API Response Types', () => {
    it('should create a valid ApiResponse object', () => {
      const successResponse: ApiResponse<{ id: string }> = {
        success: true,
        data: { id: 'test-1' },
      };

      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
          details: { resourceId: '123' },
        },
      };

      expect(successResponse.success).toBe(true);
      expect(successResponse.data?.id).toBe('test-1');
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error?.code).toBe('NOT_FOUND');
    });

    it('should create a valid PaginatedResponse object', () => {
      const paginatedResponse: PaginatedResponse<Restaurant> = {
        items: [],
        total: 100,
        page: 1,
        pageSize: 10,
        hasMore: true,
      };

      expect(paginatedResponse.total).toBe(100);
      expect(paginatedResponse.hasMore).toBe(true);
    });
  });

  describe('Filter & Search Types', () => {
    it('should create valid RestaurantFilters', () => {
      const filters: RestaurantFilters = {
        cuisine: ['Italian', 'Pizza'],
        priceLevel: [1, 2],
        rating: 4.0,
        maxDeliveryTime: 30,
        maxDeliveryFee: 5.0,
        dietary: ['vegetarian', 'vegan'],
        sortBy: 'rating',
      };

      expect(filters.cuisine).toContain('Italian');
      expect(filters.rating).toBe(4.0);
      expect(filters.sortBy).toBe('rating');
    });

    it('should allow valid DietaryOption values', () => {
      const options: DietaryOption[] = ['vegetarian', 'vegan', 'gluten_free', 'halal', 'kosher'];
      expect(options).toHaveLength(5);
    });

    it('should allow valid SortOption values', () => {
      const options: SortOption[] = [
        'recommended',
        'fastest_delivery',
        'rating',
        'distance',
        'price_low_to_high',
        'price_high_to_low',
      ];
      expect(options).toHaveLength(6);
    });

    it('should create a valid SearchQuery object', () => {
      const query: SearchQuery = {
        query: 'pizza',
        filters: { cuisine: ['Italian'] },
        location: { latitude: 40.7128, longitude: -74.006 },
      };

      expect(query.query).toBe('pizza');
      expect(query.filters?.cuisine).toContain('Italian');
    });

    it('should create a valid SearchResult object', () => {
      const result: SearchResult = {
        restaurants: [],
        menuItems: [],
      };

      expect(result.restaurants).toEqual([]);
      expect(result.menuItems).toEqual([]);
    });
  });
});
