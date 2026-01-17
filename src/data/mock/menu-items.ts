/**
 * Mock menu items data for Maestro Food Delivery App
 */

import type { Customization, MenuItem } from '@/types';

// ============================================================================
// Customization Templates
// ============================================================================

const sizeCustomization: Customization = {
  id: 'cust-size',
  name: 'Size',
  options: [
    { id: 'size-sm', name: 'Small', price: 0, isDefault: true },
    { id: 'size-md', name: 'Medium', price: 2.0 },
    { id: 'size-lg', name: 'Large', price: 4.0 },
  ],
  required: true,
  maxSelections: 1,
};

const spiceLevelCustomization: Customization = {
  id: 'cust-spice',
  name: 'Spice Level',
  options: [
    { id: 'spice-mild', name: 'Mild', price: 0, isDefault: true },
    { id: 'spice-med', name: 'Medium', price: 0 },
    { id: 'spice-hot', name: 'Hot', price: 0 },
    { id: 'spice-xhot', name: 'Extra Hot', price: 0 },
  ],
  required: true,
  maxSelections: 1,
};

const pizzaToppingsCustomization: Customization = {
  id: 'cust-toppings',
  name: 'Extra Toppings',
  options: [
    { id: 'top-pepperoni', name: 'Pepperoni', price: 1.5 },
    { id: 'top-mushrooms', name: 'Mushrooms', price: 1.0 },
    { id: 'top-olives', name: 'Black Olives', price: 1.0 },
    { id: 'top-onions', name: 'Onions', price: 0.75 },
    { id: 'top-cheese', name: 'Extra Cheese', price: 2.0 },
  ],
  required: false,
  maxSelections: 5,
};

const burgerAddOnsCustomization: Customization = {
  id: 'cust-burger-addons',
  name: 'Add-ons',
  options: [
    { id: 'add-bacon', name: 'Bacon', price: 2.0 },
    { id: 'add-avocado', name: 'Avocado', price: 1.5 },
    { id: 'add-egg', name: 'Fried Egg', price: 1.5 },
    { id: 'add-cheese', name: 'Extra Cheese', price: 1.0 },
    { id: 'add-jalapenos', name: 'Jalapeños', price: 0.75 },
  ],
  required: false,
  maxSelections: 5,
};

const drinkSizeCustomization: Customization = {
  id: 'cust-drink-size',
  name: 'Size',
  options: [
    { id: 'drink-sm', name: 'Small (12 oz)', price: 0, isDefault: true },
    { id: 'drink-md', name: 'Medium (16 oz)', price: 0.5 },
    { id: 'drink-lg', name: 'Large (20 oz)', price: 1.0 },
  ],
  required: true,
  maxSelections: 1,
};

const proteinCustomization: Customization = {
  id: 'cust-protein',
  name: 'Protein',
  options: [
    { id: 'prot-chicken', name: 'Chicken', price: 0, isDefault: true },
    { id: 'prot-beef', name: 'Beef', price: 2.0 },
    { id: 'prot-shrimp', name: 'Shrimp', price: 3.0 },
    { id: 'prot-tofu', name: 'Tofu', price: 0 },
  ],
  required: true,
  maxSelections: 1,
};

const noodleTypeCustomization: Customization = {
  id: 'cust-noodle',
  name: 'Noodle Type',
  options: [
    { id: 'noodle-thin', name: 'Thin Noodles', price: 0, isDefault: true },
    { id: 'noodle-thick', name: 'Thick Noodles', price: 0 },
    { id: 'noodle-wavy', name: 'Wavy Noodles', price: 0.5 },
  ],
  required: true,
  maxSelections: 1,
};

const ramenToppingsCustomization: Customization = {
  id: 'cust-ramen-toppings',
  name: 'Extra Toppings',
  options: [
    { id: 'ramen-egg', name: 'Extra Egg', price: 1.5 },
    { id: 'ramen-chashu', name: 'Extra Chashu', price: 3.0 },
    { id: 'ramen-nori', name: 'Extra Nori', price: 0.5 },
    { id: 'ramen-corn', name: 'Corn', price: 1.0 },
  ],
  required: false,
  maxSelections: 4,
};

// ============================================================================
// Menu Items by Restaurant
// ============================================================================

export const mockMenuItems: MenuItem[] = [
  // --------------------------------
  // Bella Italia (rest-001) - Italian
  // --------------------------------
  {
    id: 'menu-001-01',
    restaurantId: 'rest-001',
    name: 'Margherita Pizza',
    description:
      'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil.',
    price: 14.99,
    image: 'https://picsum.photos/seed/margherita/400/300',
    category: 'Pizza',
    customizations: [sizeCustomization, pizzaToppingsCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 850,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-001-02',
    restaurantId: 'rest-001',
    name: 'Spaghetti Carbonara',
    description:
      'Traditional Roman pasta with guanciale, egg yolk, Pecorino Romano, and black pepper.',
    price: 16.99,
    image: 'https://picsum.photos/seed/carbonara/400/300',
    category: 'Pasta',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 780,
    allergens: ['Gluten', 'Eggs', 'Dairy'],
  },
  {
    id: 'menu-001-03',
    restaurantId: 'rest-001',
    name: 'Chicken Parmigiana',
    description:
      'Breaded chicken cutlet topped with marinara sauce and melted mozzarella, served with spaghetti.',
    price: 18.99,
    image: 'https://picsum.photos/seed/parmigiana/400/300',
    category: 'Mains',
    customizations: [],
    isAvailable: true,
    calories: 920,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-001-04',
    restaurantId: 'rest-001',
    name: 'Caesar Salad',
    description:
      'Crisp romaine lettuce, house-made Caesar dressing, croutons, and shaved Parmesan.',
    price: 10.99,
    image: 'https://picsum.photos/seed/caesar/400/300',
    category: 'Salads',
    customizations: [
      {
        id: 'cust-caesar-protein',
        name: 'Add Protein',
        options: [
          { id: 'caesar-none', name: 'No Protein', price: 0, isDefault: true },
          { id: 'caesar-chicken', name: 'Grilled Chicken', price: 4.0 },
          { id: 'caesar-shrimp', name: 'Grilled Shrimp', price: 6.0 },
        ],
        required: false,
        maxSelections: 1,
      },
    ],
    isAvailable: true,
    calories: 420,
    allergens: ['Gluten', 'Dairy', 'Fish'],
  },
  {
    id: 'menu-001-05',
    restaurantId: 'rest-001',
    name: 'Tiramisu',
    description:
      'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.',
    price: 8.99,
    image: 'https://picsum.photos/seed/tiramisu/400/300',
    category: 'Desserts',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 450,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-001-06',
    restaurantId: 'rest-001',
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and balsamic glaze.',
    price: 9.99,
    image: 'https://picsum.photos/seed/bruschetta/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    calories: 280,
    allergens: ['Gluten'],
  },

  // --------------------------------
  // Tokyo Ramen House (rest-002) - Japanese
  // --------------------------------
  {
    id: 'menu-002-01',
    restaurantId: 'rest-002',
    name: 'Tonkotsu Ramen',
    description:
      'Rich pork bone broth with chashu pork, soft-boiled egg, bamboo shoots, nori, and green onions.',
    price: 15.99,
    image: 'https://picsum.photos/seed/tonkotsu/400/300',
    category: 'Ramen',
    customizations: [noodleTypeCustomization, spiceLevelCustomization, ramenToppingsCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 720,
    allergens: ['Gluten', 'Soy', 'Eggs'],
  },
  {
    id: 'menu-002-02',
    restaurantId: 'rest-002',
    name: 'Miso Ramen',
    description:
      'Savory miso-based broth with ground pork, corn, butter, bean sprouts, and soft-boiled egg.',
    price: 14.99,
    image: 'https://picsum.photos/seed/miso-ramen/400/300',
    category: 'Ramen',
    customizations: [noodleTypeCustomization, spiceLevelCustomization, ramenToppingsCustomization],
    isAvailable: true,
    calories: 680,
    allergens: ['Gluten', 'Soy', 'Eggs', 'Dairy'],
  },
  {
    id: 'menu-002-03',
    restaurantId: 'rest-002',
    name: 'Spicy Tantanmen',
    description:
      'Creamy sesame and chili broth with minced pork, bok choy, and a perfectly soft-boiled egg.',
    price: 16.99,
    image: 'https://picsum.photos/seed/tantanmen/400/300',
    category: 'Ramen',
    customizations: [noodleTypeCustomization, ramenToppingsCustomization],
    isAvailable: true,
    isSpicy: true,
    calories: 750,
    allergens: ['Gluten', 'Soy', 'Sesame', 'Eggs'],
  },
  {
    id: 'menu-002-04',
    restaurantId: 'rest-002',
    name: 'Gyoza (6 pcs)',
    description: 'Pan-fried pork and vegetable dumplings served with house ponzu sauce.',
    price: 8.99,
    image: 'https://picsum.photos/seed/gyoza/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 320,
    allergens: ['Gluten', 'Soy'],
  },
  {
    id: 'menu-002-05',
    restaurantId: 'rest-002',
    name: 'Edamame',
    description: 'Steamed soybeans lightly salted with sea salt.',
    price: 5.99,
    image: 'https://picsum.photos/seed/edamame/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    calories: 180,
    allergens: ['Soy'],
  },
  {
    id: 'menu-002-06',
    restaurantId: 'rest-002',
    name: 'Karaage',
    description: 'Japanese fried chicken marinated in soy, ginger, and garlic. Served with mayo.',
    price: 10.99,
    image: 'https://picsum.photos/seed/karaage/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 450,
    allergens: ['Gluten', 'Soy', 'Eggs'],
  },

  // --------------------------------
  // Burger Barn (rest-003) - American
  // --------------------------------
  {
    id: 'menu-003-01',
    restaurantId: 'rest-003',
    name: 'Classic Cheeseburger',
    description:
      '1/3 lb Angus beef patty with American cheese, lettuce, tomato, onion, pickles, and our secret sauce.',
    price: 12.99,
    image: 'https://picsum.photos/seed/cheeseburger/400/300',
    category: 'Burgers',
    customizations: [burgerAddOnsCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 750,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-003-02',
    restaurantId: 'rest-003',
    name: 'BBQ Bacon Burger',
    description: '1/3 lb Angus beef with crispy bacon, cheddar, onion rings, and tangy BBQ sauce.',
    price: 14.99,
    image: 'https://picsum.photos/seed/bbq-burger/400/300',
    category: 'Burgers',
    customizations: [burgerAddOnsCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 920,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-003-03',
    restaurantId: 'rest-003',
    name: 'Mushroom Swiss Burger',
    description:
      '1/3 lb Angus beef topped with sautéed mushrooms, melted Swiss cheese, and garlic aioli.',
    price: 13.99,
    image: 'https://picsum.photos/seed/mushroom-burger/400/300',
    category: 'Burgers',
    customizations: [burgerAddOnsCustomization],
    isAvailable: true,
    calories: 800,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-003-04',
    restaurantId: 'rest-003',
    name: 'Crispy Chicken Sandwich',
    description: 'Buttermilk-brined fried chicken breast with pickles, coleslaw, and spicy mayo.',
    price: 11.99,
    image: 'https://picsum.photos/seed/chicken-sandwich/400/300',
    category: 'Sandwiches',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    calories: 680,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-003-05',
    restaurantId: 'rest-003',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with cheese sauce, bacon bits, jalapeños, and sour cream.',
    price: 8.99,
    image: 'https://picsum.photos/seed/loaded-fries/400/300',
    category: 'Sides',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 650,
    allergens: ['Dairy'],
  },
  {
    id: 'menu-003-06',
    restaurantId: 'rest-003',
    name: 'Onion Rings',
    description: 'Beer-battered onion rings served with ranch dipping sauce.',
    price: 6.99,
    image: 'https://picsum.photos/seed/onion-rings/400/300',
    category: 'Sides',
    customizations: [],
    isAvailable: true,
    calories: 420,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-003-07',
    restaurantId: 'rest-003',
    name: 'Chocolate Milkshake',
    description: 'Thick and creamy chocolate milkshake made with premium ice cream.',
    price: 5.99,
    image: 'https://picsum.photos/seed/milkshake/400/300',
    category: 'Drinks',
    customizations: [drinkSizeCustomization],
    isAvailable: true,
    calories: 580,
    allergens: ['Dairy'],
  },

  // --------------------------------
  // Spice Garden (rest-004) - Indian
  // --------------------------------
  {
    id: 'menu-004-01',
    restaurantId: 'rest-004',
    name: 'Butter Chicken',
    description:
      'Tender chicken in a rich, creamy tomato sauce with aromatic spices. Served with basmati rice.',
    price: 16.99,
    image: 'https://picsum.photos/seed/butter-chicken/400/300',
    category: 'Curries',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 720,
    allergens: ['Dairy'],
  },
  {
    id: 'menu-004-02',
    restaurantId: 'rest-004',
    name: 'Lamb Biryani',
    description:
      'Fragrant basmati rice layered with spiced lamb, saffron, fried onions, and fresh herbs.',
    price: 18.99,
    image: 'https://picsum.photos/seed/biryani/400/300',
    category: 'Rice Dishes',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 850,
    allergens: ['Dairy'],
  },
  {
    id: 'menu-004-03',
    restaurantId: 'rest-004',
    name: 'Palak Paneer',
    description: 'Cubes of fresh paneer cheese in a creamy spinach sauce with garlic and ginger.',
    price: 14.99,
    image: 'https://picsum.photos/seed/palak-paneer/400/300',
    category: 'Vegetarian',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    calories: 520,
    allergens: ['Dairy'],
  },
  {
    id: 'menu-004-04',
    restaurantId: 'rest-004',
    name: 'Chicken Tikka Masala',
    description: 'Grilled chicken tikka in a spiced, creamy tomato and onion gravy.',
    price: 17.99,
    image: 'https://picsum.photos/seed/tikka-masala/400/300',
    category: 'Curries',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    calories: 680,
    allergens: ['Dairy'],
  },
  {
    id: 'menu-004-05',
    restaurantId: 'rest-004',
    name: 'Samosa (2 pcs)',
    description:
      'Crispy pastries filled with spiced potatoes and peas, served with mint and tamarind chutneys.',
    price: 6.99,
    image: 'https://picsum.photos/seed/samosa/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 340,
    allergens: ['Gluten'],
  },
  {
    id: 'menu-004-06',
    restaurantId: 'rest-004',
    name: 'Garlic Naan',
    description: 'Soft, fluffy bread brushed with garlic butter, baked in a tandoor oven.',
    price: 3.99,
    image: 'https://picsum.photos/seed/naan/400/300',
    category: 'Bread',
    customizations: [],
    isAvailable: true,
    calories: 280,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-004-07',
    restaurantId: 'rest-004',
    name: 'Mango Lassi',
    description: 'Sweet and creamy yogurt drink blended with ripe mango.',
    price: 4.99,
    image: 'https://picsum.photos/seed/mango-lassi/400/300',
    category: 'Drinks',
    customizations: [],
    isAvailable: true,
    calories: 220,
    allergens: ['Dairy'],
  },

  // --------------------------------
  // Sushi Master (rest-005) - Japanese/Sushi
  // --------------------------------
  {
    id: 'menu-005-01',
    restaurantId: 'rest-005',
    name: 'Rainbow Roll',
    description:
      'California roll topped with assorted sashimi including tuna, salmon, and yellowtail.',
    price: 18.99,
    image: 'https://picsum.photos/seed/rainbow-roll/400/300',
    category: 'Specialty Rolls',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 420,
    allergens: ['Fish', 'Shellfish', 'Gluten', 'Soy'],
  },
  {
    id: 'menu-005-02',
    restaurantId: 'rest-005',
    name: 'Dragon Roll',
    description: 'Shrimp tempura roll topped with avocado and eel, drizzled with eel sauce.',
    price: 19.99,
    image: 'https://picsum.photos/seed/dragon-roll/400/300',
    category: 'Specialty Rolls',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 480,
    allergens: ['Fish', 'Shellfish', 'Gluten', 'Soy'],
  },
  {
    id: 'menu-005-03',
    restaurantId: 'rest-005',
    name: 'Salmon Sashimi (5 pcs)',
    description: 'Premium Atlantic salmon sliced fresh to order.',
    price: 14.99,
    image: 'https://picsum.photos/seed/salmon-sashimi/400/300',
    category: 'Sashimi',
    customizations: [],
    isAvailable: true,
    calories: 180,
    allergens: ['Fish'],
  },
  {
    id: 'menu-005-04',
    restaurantId: 'rest-005',
    name: 'Tuna Nigiri (2 pcs)',
    description: 'Fresh bluefin tuna over hand-pressed seasoned rice.',
    price: 9.99,
    image: 'https://picsum.photos/seed/tuna-nigiri/400/300',
    category: 'Nigiri',
    customizations: [],
    isAvailable: true,
    calories: 120,
    allergens: ['Fish', 'Soy'],
  },
  {
    id: 'menu-005-05',
    restaurantId: 'rest-005',
    name: 'Spicy Tuna Roll',
    description: 'Fresh tuna mixed with spicy mayo, cucumber, and topped with sesame seeds.',
    price: 12.99,
    image: 'https://picsum.photos/seed/spicy-tuna/400/300',
    category: 'Maki Rolls',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isSpicy: true,
    calories: 290,
    allergens: ['Fish', 'Gluten', 'Soy', 'Eggs'],
  },
  {
    id: 'menu-005-06',
    restaurantId: 'rest-005',
    name: 'Chirashi Bowl',
    description: 'Assorted sashimi over sushi rice with cucumber, avocado, and pickled ginger.',
    price: 24.99,
    image: 'https://picsum.photos/seed/chirashi/400/300',
    category: 'Bowls',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 520,
    allergens: ['Fish', 'Shellfish', 'Soy'],
  },

  // --------------------------------
  // Taco Loco (rest-006) - Mexican
  // --------------------------------
  {
    id: 'menu-006-01',
    restaurantId: 'rest-006',
    name: 'Street Tacos (3 pcs)',
    description:
      'Authentic corn tortilla tacos with your choice of meat, onion, cilantro, and salsa verde.',
    price: 9.99,
    image: 'https://picsum.photos/seed/street-tacos/400/300',
    category: 'Tacos',
    customizations: [proteinCustomization, spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 380,
    allergens: [],
  },
  {
    id: 'menu-006-02',
    restaurantId: 'rest-006',
    name: 'Carnitas Burrito',
    description:
      'Large flour tortilla stuffed with slow-roasted pork, rice, beans, cheese, sour cream, and guacamole.',
    price: 12.99,
    image: 'https://picsum.photos/seed/burrito/400/300',
    category: 'Burritos',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 920,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-006-03',
    restaurantId: 'rest-006',
    name: 'Chicken Quesadilla',
    description:
      'Grilled flour tortilla filled with seasoned chicken, melted cheese, peppers, and onions.',
    price: 10.99,
    image: 'https://picsum.photos/seed/quesadilla/400/300',
    category: 'Quesadillas',
    customizations: [],
    isAvailable: true,
    calories: 680,
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'menu-006-04',
    restaurantId: 'rest-006',
    name: 'Nachos Supreme',
    description:
      'Crispy tortilla chips loaded with cheese, jalapeños, beans, sour cream, and guacamole.',
    price: 11.99,
    image: 'https://picsum.photos/seed/nachos/400/300',
    category: 'Appetizers',
    customizations: [proteinCustomization],
    isAvailable: true,
    calories: 850,
    allergens: ['Dairy'],
  },
  {
    id: 'menu-006-05',
    restaurantId: 'rest-006',
    name: 'Churros (4 pcs)',
    description:
      'Crispy fried dough dusted with cinnamon sugar, served with chocolate dipping sauce.',
    price: 6.99,
    image: 'https://picsum.photos/seed/churros/400/300',
    category: 'Desserts',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 420,
    allergens: ['Gluten', 'Eggs'],
  },
  {
    id: 'menu-006-06',
    restaurantId: 'rest-006',
    name: 'Mexican Rice & Beans',
    description: 'Traditional Spanish rice with pinto beans, topped with fresh cilantro.',
    price: 4.99,
    image: 'https://picsum.photos/seed/rice-beans/400/300',
    category: 'Sides',
    customizations: [],
    isAvailable: true,
    calories: 280,
    allergens: [],
  },

  // --------------------------------
  // Dragon Palace (rest-007) - Chinese
  // --------------------------------
  {
    id: 'menu-007-01',
    restaurantId: 'rest-007',
    name: 'Kung Pao Chicken',
    description: 'Wok-fried chicken with peanuts, dried chilies, and vegetables in a savory sauce.',
    price: 14.99,
    image: 'https://picsum.photos/seed/kung-pao/400/300',
    category: 'Poultry',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    isSpicy: true,
    calories: 620,
    allergens: ['Peanuts', 'Soy', 'Gluten'],
  },
  {
    id: 'menu-007-02',
    restaurantId: 'rest-007',
    name: 'Sweet & Sour Pork',
    description:
      'Crispy pork pieces with bell peppers and pineapple in tangy sweet and sour sauce.',
    price: 15.99,
    image: 'https://picsum.photos/seed/sweet-sour/400/300',
    category: 'Pork',
    customizations: [],
    isAvailable: true,
    calories: 680,
    allergens: ['Gluten', 'Soy'],
  },
  {
    id: 'menu-007-03',
    restaurantId: 'rest-007',
    name: 'Beef & Broccoli',
    description: 'Tender beef slices stir-fried with fresh broccoli in oyster sauce.',
    price: 16.99,
    image: 'https://picsum.photos/seed/beef-broccoli/400/300',
    category: 'Beef',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 580,
    allergens: ['Soy', 'Gluten', 'Shellfish'],
  },
  {
    id: 'menu-007-04',
    restaurantId: 'rest-007',
    name: 'Shrimp Fried Rice',
    description: 'Wok-tossed rice with jumbo shrimp, eggs, peas, carrots, and green onions.',
    price: 13.99,
    image: 'https://picsum.photos/seed/fried-rice/400/300',
    category: 'Rice & Noodles',
    customizations: [],
    isAvailable: true,
    calories: 520,
    allergens: ['Shellfish', 'Eggs', 'Soy'],
  },
  {
    id: 'menu-007-05',
    restaurantId: 'rest-007',
    name: 'Spring Rolls (4 pcs)',
    description: 'Crispy vegetable spring rolls served with sweet chili dipping sauce.',
    price: 7.99,
    image: 'https://picsum.photos/seed/spring-rolls/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    calories: 320,
    allergens: ['Gluten', 'Soy'],
  },
  {
    id: 'menu-007-06',
    restaurantId: 'rest-007',
    name: 'Hot & Sour Soup',
    description: 'Traditional soup with tofu, bamboo shoots, egg, and a spicy, tangy broth.',
    price: 6.99,
    image: 'https://picsum.photos/seed/hot-sour-soup/400/300',
    category: 'Soups',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isSpicy: true,
    calories: 180,
    allergens: ['Soy', 'Eggs', 'Gluten'],
  },

  // --------------------------------
  // Thai Orchid (rest-008) - Thai
  // --------------------------------
  {
    id: 'menu-008-01',
    restaurantId: 'rest-008',
    name: 'Pad Thai',
    description:
      'Stir-fried rice noodles with shrimp, tofu, egg, bean sprouts, and crushed peanuts.',
    price: 14.99,
    image: 'https://picsum.photos/seed/pad-thai/400/300',
    category: 'Noodles',
    customizations: [proteinCustomization, spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 650,
    allergens: ['Peanuts', 'Shellfish', 'Eggs', 'Soy'],
  },
  {
    id: 'menu-008-02',
    restaurantId: 'rest-008',
    name: 'Green Curry',
    description:
      'Coconut milk curry with bamboo shoots, Thai basil, and bell peppers. Served with jasmine rice.',
    price: 15.99,
    image: 'https://picsum.photos/seed/green-curry/400/300',
    category: 'Curries',
    customizations: [proteinCustomization, spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    isSpicy: true,
    calories: 580,
    allergens: ['Shellfish'],
  },
  {
    id: 'menu-008-03',
    restaurantId: 'rest-008',
    name: 'Tom Yum Soup',
    description: 'Hot and sour soup with shrimp, mushrooms, lemongrass, galangal, and lime.',
    price: 8.99,
    image: 'https://picsum.photos/seed/tom-yum/400/300',
    category: 'Soups',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isSpicy: true,
    calories: 180,
    allergens: ['Shellfish'],
  },
  {
    id: 'menu-008-04',
    restaurantId: 'rest-008',
    name: 'Massaman Curry',
    description:
      'Rich, mild curry with potatoes, peanuts, and onions in coconut milk. Served with jasmine rice.',
    price: 16.99,
    image: 'https://picsum.photos/seed/massaman/400/300',
    category: 'Curries',
    customizations: [proteinCustomization],
    isAvailable: true,
    calories: 720,
    allergens: ['Peanuts'],
  },
  {
    id: 'menu-008-05',
    restaurantId: 'rest-008',
    name: 'Mango Sticky Rice',
    description: 'Sweet coconut sticky rice with fresh ripe mango and toasted sesame seeds.',
    price: 7.99,
    image: 'https://picsum.photos/seed/mango-sticky/400/300',
    category: 'Desserts',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 380,
    allergens: ['Sesame'],
  },
  {
    id: 'menu-008-06',
    restaurantId: 'rest-008',
    name: 'Thai Iced Tea',
    description: 'Sweet and creamy Thai tea with condensed milk over ice.',
    price: 4.99,
    image: 'https://picsum.photos/seed/thai-tea/400/300',
    category: 'Drinks',
    customizations: [],
    isAvailable: true,
    calories: 200,
    allergens: ['Dairy'],
  },

  // --------------------------------
  // Green Bowl (rest-012) - Healthy
  // --------------------------------
  {
    id: 'menu-012-01',
    restaurantId: 'rest-012',
    name: 'Buddha Bowl',
    description: 'Quinoa, roasted chickpeas, sweet potato, avocado, kale, and tahini dressing.',
    price: 14.99,
    image: 'https://picsum.photos/seed/buddha-bowl/400/300',
    category: 'Bowls',
    customizations: [
      {
        id: 'cust-bowl-protein',
        name: 'Add Protein',
        options: [
          { id: 'bowl-none', name: 'No Extra Protein', price: 0, isDefault: true },
          { id: 'bowl-chicken', name: 'Grilled Chicken', price: 4.0 },
          { id: 'bowl-salmon', name: 'Grilled Salmon', price: 6.0 },
          { id: 'bowl-tofu', name: 'Crispy Tofu', price: 3.0 },
        ],
        required: false,
        maxSelections: 1,
      },
    ],
    isAvailable: true,
    isPopular: true,
    calories: 480,
    allergens: ['Sesame'],
  },
  {
    id: 'menu-012-02',
    restaurantId: 'rest-012',
    name: 'Açaí Bowl',
    description:
      'Blended açaí with banana, topped with granola, fresh berries, coconut, and honey.',
    price: 12.99,
    image: 'https://picsum.photos/seed/acai-bowl/400/300',
    category: 'Bowls',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 420,
    allergens: ['Tree Nuts'],
  },
  {
    id: 'menu-012-03',
    restaurantId: 'rest-012',
    name: 'Kale Caesar Salad',
    description:
      'Massaged kale with vegan Caesar dressing, crispy chickpeas, and nutritional yeast.',
    price: 11.99,
    image: 'https://picsum.photos/seed/kale-caesar/400/300',
    category: 'Salads',
    customizations: [],
    isAvailable: true,
    calories: 320,
    allergens: [],
  },
  {
    id: 'menu-012-04',
    restaurantId: 'rest-012',
    name: 'Green Goddess Smoothie',
    description: 'Spinach, banana, mango, almond milk, and spirulina blended to perfection.',
    price: 8.99,
    image: 'https://picsum.photos/seed/green-smoothie/400/300',
    category: 'Smoothies',
    customizations: [],
    isAvailable: true,
    calories: 280,
    allergens: ['Tree Nuts'],
  },
  {
    id: 'menu-012-05',
    restaurantId: 'rest-012',
    name: 'Avocado Toast',
    description:
      'Sourdough toast with smashed avocado, cherry tomatoes, microgreens, and everything seasoning.',
    price: 10.99,
    image: 'https://picsum.photos/seed/avo-toast/400/300',
    category: 'Toasts',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 380,
    allergens: ['Gluten'],
  },

  // --------------------------------
  // Sweet Dreams Bakery (rest-013) - Desserts
  // --------------------------------
  {
    id: 'menu-013-01',
    restaurantId: 'rest-013',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    price: 9.99,
    image: 'https://picsum.photos/seed/lava-cake/400/300',
    category: 'Cakes',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 520,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-013-02',
    restaurantId: 'rest-013',
    name: 'New York Cheesecake',
    description: 'Classic creamy cheesecake with graham cracker crust and berry compote.',
    price: 8.99,
    image: 'https://picsum.photos/seed/cheesecake/400/300',
    category: 'Cakes',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 450,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-013-03',
    restaurantId: 'rest-013',
    name: 'Croissant',
    description: 'Buttery, flaky French pastry baked fresh every morning.',
    price: 4.99,
    image: 'https://picsum.photos/seed/croissant/400/300',
    category: 'Pastries',
    customizations: [],
    isAvailable: true,
    calories: 280,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  {
    id: 'menu-013-04',
    restaurantId: 'rest-013',
    name: 'Macarons (6 pcs)',
    description:
      'Assorted French macarons in flavors like pistachio, raspberry, and salted caramel.',
    price: 14.99,
    image: 'https://picsum.photos/seed/macarons/400/300',
    category: 'Cookies',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 360,
    allergens: ['Tree Nuts', 'Eggs', 'Dairy'],
  },
  {
    id: 'menu-013-05',
    restaurantId: 'rest-013',
    name: 'Espresso',
    description: 'Double shot of rich, bold espresso.',
    price: 3.99,
    image: 'https://picsum.photos/seed/espresso/400/300',
    category: 'Coffee',
    customizations: [],
    isAvailable: true,
    calories: 5,
    allergens: [],
  },
  {
    id: 'menu-013-06',
    restaurantId: 'rest-013',
    name: 'Cinnamon Roll',
    description: 'Warm, gooey cinnamon roll with cream cheese frosting.',
    price: 5.99,
    image: 'https://picsum.photos/seed/cinnamon-roll/400/300',
    category: 'Pastries',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 420,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },

  // --------------------------------
  // Seoul Kitchen (rest-014) - Korean
  // --------------------------------
  {
    id: 'menu-014-01',
    restaurantId: 'rest-014',
    name: 'Bibimbap',
    description: 'Rice bowl topped with seasoned vegetables, beef, egg, and gochujang sauce.',
    price: 15.99,
    image: 'https://picsum.photos/seed/bibimbap/400/300',
    category: 'Rice Bowls',
    customizations: [proteinCustomization, spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    calories: 580,
    allergens: ['Eggs', 'Soy', 'Sesame'],
  },
  {
    id: 'menu-014-02',
    restaurantId: 'rest-014',
    name: 'Korean Fried Chicken',
    description: 'Double-fried crispy chicken glazed with sweet and spicy gochujang sauce.',
    price: 16.99,
    image: 'https://picsum.photos/seed/korean-chicken/400/300',
    category: 'Chicken',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isPopular: true,
    isSpicy: true,
    calories: 680,
    allergens: ['Gluten', 'Soy', 'Sesame'],
  },
  {
    id: 'menu-014-03',
    restaurantId: 'rest-014',
    name: 'Bulgogi',
    description:
      'Thinly sliced marinated beef grilled to perfection. Served with rice and banchan.',
    price: 18.99,
    image: 'https://picsum.photos/seed/bulgogi/400/300',
    category: 'BBQ',
    customizations: [],
    isAvailable: true,
    isPopular: true,
    calories: 620,
    allergens: ['Soy', 'Sesame'],
  },
  {
    id: 'menu-014-04',
    restaurantId: 'rest-014',
    name: 'Japchae',
    description: 'Sweet potato glass noodles stir-fried with vegetables and beef in sesame oil.',
    price: 14.99,
    image: 'https://picsum.photos/seed/japchae/400/300',
    category: 'Noodles',
    customizations: [],
    isAvailable: true,
    calories: 480,
    allergens: ['Soy', 'Sesame', 'Gluten'],
  },
  {
    id: 'menu-014-05',
    restaurantId: 'rest-014',
    name: 'Kimchi Jjigae',
    description: 'Spicy kimchi stew with pork belly, tofu, and vegetables. Served with rice.',
    price: 13.99,
    image: 'https://picsum.photos/seed/kimchi-stew/400/300',
    category: 'Soups & Stews',
    customizations: [spiceLevelCustomization],
    isAvailable: true,
    isSpicy: true,
    calories: 420,
    allergens: ['Soy', 'Shellfish'],
  },
  {
    id: 'menu-014-06',
    restaurantId: 'rest-014',
    name: 'Korean Pancake (Pajeon)',
    description: 'Savory green onion pancake served with soy dipping sauce.',
    price: 10.99,
    image: 'https://picsum.photos/seed/pajeon/400/300',
    category: 'Appetizers',
    customizations: [],
    isAvailable: true,
    calories: 380,
    allergens: ['Gluten', 'Soy', 'Eggs'],
  },
];

/**
 * Get menu items for a specific restaurant
 */
export function getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId);
}

/**
 * Get a menu item by ID
 */
export function getMenuItemById(id: string): MenuItem | undefined {
  return mockMenuItems.find((item) => item.id === id);
}

/**
 * Get menu items grouped by category for a restaurant
 */
export function getMenuByCategory(restaurantId: string): Record<string, MenuItem[]> {
  const items = getMenuItemsByRestaurant(restaurantId);
  return items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );
}

/**
 * Get popular items for a restaurant
 */
export function getPopularItems(restaurantId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId && item.isPopular);
}

/**
 * Search menu items by name or description
 */
export function searchMenuItems(query: string): MenuItem[] {
  const lowerQuery = query.toLowerCase();
  return mockMenuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Simulates fetching menu items with network delay
 */
export async function fetchMenuItems(
  restaurantId: string,
  delayMs: number = 400
): Promise<MenuItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMenuItemsByRestaurant(restaurantId)), delayMs);
  });
}
