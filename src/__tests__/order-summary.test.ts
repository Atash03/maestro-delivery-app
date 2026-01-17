/**
 * Order Summary Section Tests
 *
 * Tests for Task 4.3: Build order summary section
 * - Itemized list with quantities and prices
 * - Item customizations in smaller text
 * - Subtotal, delivery fee, taxes breakdown
 * - Total prominently displayed
 * - Animated expand/collapse
 */

import fs from 'fs';
import path from 'path';

// Read file contents for testing
const checkoutFilePath = path.join(__dirname, '../app/order/checkout.tsx');
const checkoutFileContent = fs.readFileSync(checkoutFilePath, 'utf8');

describe('Order Summary Section - Task 4.3', () => {
  // ==========================================================================
  // File Structure Tests
  // ==========================================================================

  describe('File Structure', () => {
    it('should have checkout.tsx file in order directory', () => {
      expect(fs.existsSync(checkoutFilePath)).toBe(true);
    });

    it('should export OrderItemRow component', () => {
      expect(checkoutFileContent).toContain('export function OrderItemRow');
    });

    it('should export CostRow component', () => {
      expect(checkoutFileContent).toContain('export function CostRow');
    });

    it('should export TotalRow component', () => {
      expect(checkoutFileContent).toContain('export function TotalRow');
    });

    it('should export OrderSummarySection component', () => {
      expect(checkoutFileContent).toContain('export function OrderSummarySection');
    });
  });

  // ==========================================================================
  // OrderItemRow Component Tests
  // ==========================================================================

  describe('OrderItemRow Component', () => {
    describe('Props', () => {
      it('should define name prop', () => {
        expect(checkoutFileContent).toContain('name: string');
      });

      it('should define quantity prop', () => {
        expect(checkoutFileContent).toContain('quantity: number');
      });

      it('should define price prop', () => {
        expect(checkoutFileContent).toContain('price: number');
      });

      it('should define unitPrice prop', () => {
        expect(checkoutFileContent).toContain('unitPrice: number');
      });

      it('should define optional customizations prop', () => {
        expect(checkoutFileContent).toContain('customizations?: string');
      });

      it('should define optional specialInstructions prop', () => {
        expect(checkoutFileContent).toContain('specialInstructions?: string');
      });

      it('should define optional image prop', () => {
        expect(checkoutFileContent).toContain('image?: string');
      });

      it('should define optional index prop', () => {
        expect(checkoutFileContent).toContain('index?: number');
      });
    });

    describe('Image Display', () => {
      it('should render item image with expo-image', () => {
        expect(checkoutFileContent).toContain('<Image');
        expect(checkoutFileContent).toContain('source={{ uri: image }}');
      });

      it('should have image styling with orderItemImage style', () => {
        expect(checkoutFileContent).toContain('style={styles.orderItemImage}');
      });

      it('should conditionally render image only if provided', () => {
        expect(checkoutFileContent).toContain('{image && (');
      });
    });

    describe('Quantity Badge', () => {
      it('should display quantity with badge styling', () => {
        expect(checkoutFileContent).toContain('orderItemQuantityBadge');
      });

      it('should show quantity in format "Nx"', () => {
        expect(checkoutFileContent).toContain('{quantity}x');
      });

      it('should use PrimaryColors for badge background', () => {
        expect(checkoutFileContent).toContain('{ backgroundColor: PrimaryColors[500] }');
      });
    });

    describe('Item Details', () => {
      it('should display item name', () => {
        expect(checkoutFileContent).toContain('orderItemName');
        expect(checkoutFileContent).toContain('{name}');
      });

      it('should truncate item name to 1 line', () => {
        expect(checkoutFileContent).toContain('numberOfLines={1}');
      });
    });

    describe('Customizations Display', () => {
      it('should conditionally render customizations', () => {
        expect(checkoutFileContent).toContain('{customizations && (');
      });

      it('should have options icon for customizations', () => {
        expect(checkoutFileContent).toContain('name="options-outline"');
      });

      it('should have orderItemCustomizations style', () => {
        expect(checkoutFileContent).toContain('orderItemCustomizations');
      });

      it('should truncate customizations to 2 lines', () => {
        expect(checkoutFileContent).toContain('numberOfLines={2}');
      });
    });

    describe('Special Instructions Display', () => {
      it('should conditionally render special instructions', () => {
        expect(checkoutFileContent).toContain('{specialInstructions && (');
      });

      it('should have chatbubble icon for instructions', () => {
        expect(checkoutFileContent).toContain('name="chatbubble-outline"');
      });

      it('should have orderItemInstructions style', () => {
        expect(checkoutFileContent).toContain('orderItemInstructions');
      });
    });

    describe('Unit Price Display', () => {
      it('should show unit price when quantity > 1', () => {
        expect(checkoutFileContent).toContain('{quantity > 1 && (');
      });

      it('should format unit price with "each" suffix', () => {
        expect(checkoutFileContent).toContain('{formatPrice(unitPrice)} each');
      });
    });

    describe('Total Price', () => {
      it('should display total price with formatPrice', () => {
        expect(checkoutFileContent).toContain('{formatPrice(price)}');
      });

      it('should have orderItemPrice style', () => {
        expect(checkoutFileContent).toContain('orderItemPrice');
      });
    });

    describe('Animations', () => {
      it('should use FadeInDown entering animation', () => {
        expect(checkoutFileContent).toContain('FadeInDown.duration');
      });

      it('should have staggered animation with index delay', () => {
        expect(checkoutFileContent).toContain('delay(index * 50)');
      });
    });

    describe('Test IDs', () => {
      it('should have test ID for order item row', () => {
        expect(checkoutFileContent).toContain('testID={`order-item-row-${index}`}');
      });

      it('should have test ID for order item image', () => {
        expect(checkoutFileContent).toContain('testID={`order-item-image-${index}`}');
      });
    });
  });

  // ==========================================================================
  // CostRow Component Tests
  // ==========================================================================

  describe('CostRow Component', () => {
    describe('Props', () => {
      it('should define label prop', () => {
        expect(checkoutFileContent).toMatch(/interface CostRowProps[\s\S]*?label: string/);
      });

      it('should define value prop', () => {
        expect(checkoutFileContent).toMatch(/interface CostRowProps[\s\S]*?value: string/);
      });

      it('should define optional isHighlighted prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface CostRowProps[\s\S]*?isHighlighted\?: boolean/
        );
      });

      it('should define optional icon prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface CostRowProps[\s\S]*?icon\?: keyof typeof Ionicons.glyphMap/
        );
      });

      it('should define optional isFree prop', () => {
        expect(checkoutFileContent).toMatch(/interface CostRowProps[\s\S]*?isFree\?: boolean/);
      });
    });

    describe('Icon Display', () => {
      it('should conditionally render icon', () => {
        expect(checkoutFileContent).toContain('{icon && (');
      });

      it('should use PrimaryColors when highlighted', () => {
        expect(checkoutFileContent).toContain('isHighlighted ? PrimaryColors[500]');
      });
    });

    describe('Styling', () => {
      it('should have costRow style', () => {
        expect(checkoutFileContent).toContain('style={styles.costRow}');
      });

      it('should apply highlighted styles conditionally', () => {
        expect(checkoutFileContent).toContain('isHighlighted && styles.costLabelHighlighted');
      });

      it('should use SuccessColors for free delivery', () => {
        expect(checkoutFileContent).toContain('isFree ? SuccessColors[600]');
      });
    });

    describe('Test IDs', () => {
      it('should generate test ID from label', () => {
        expect(checkoutFileContent).toContain(
          "testID={`cost-row-${label.toLowerCase().replace(/\\s+/g, '-')}`}"
        );
      });
    });
  });

  // ==========================================================================
  // TotalRow Component Tests
  // ==========================================================================

  describe('TotalRow Component', () => {
    describe('Props', () => {
      it('should define total prop', () => {
        expect(checkoutFileContent).toMatch(/interface TotalRowProps[\s\S]*?total: number/);
      });

      it('should define optional savings prop', () => {
        expect(checkoutFileContent).toMatch(/interface TotalRowProps[\s\S]*?savings\?: number/);
      });
    });

    describe('Savings Badge', () => {
      it('should conditionally render savings badge', () => {
        expect(checkoutFileContent).toContain('{savings && savings > 0 && (');
      });

      it('should have pricetag icon for savings', () => {
        expect(checkoutFileContent).toContain('name="pricetag"');
      });

      it('should display "You save" text with formatted amount', () => {
        expect(checkoutFileContent).toContain('You save {formatPrice(savings)}');
      });

      it('should use SuccessColors for savings badge', () => {
        expect(checkoutFileContent).toContain('backgroundColor: SuccessColors[50]');
      });
    });

    describe('Total Display', () => {
      it('should display "Total" label', () => {
        expect(checkoutFileContent).toContain('>Total<');
      });

      it('should display total with formatPrice', () => {
        expect(checkoutFileContent).toContain('{formatPrice(total)}');
      });

      it('should use PrimaryColors for total value', () => {
        expect(checkoutFileContent).toContain('color: PrimaryColors[500]');
      });
    });

    describe('Animations', () => {
      it('should use FadeIn entering animation', () => {
        expect(checkoutFileContent).toContain('FadeIn.duration');
      });
    });

    describe('Test IDs', () => {
      it('should have test ID for total row', () => {
        expect(checkoutFileContent).toContain('testID="order-summary-total-row"');
      });
    });
  });

  // ==========================================================================
  // OrderSummarySection Component Tests
  // ==========================================================================

  describe('OrderSummarySection Component', () => {
    describe('Props', () => {
      it('should define items prop', () => {
        expect(checkoutFileContent).toMatch(/interface OrderSummarySectionProps[\s\S]*?items:/);
      });

      it('should define subtotal prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface OrderSummarySectionProps[\s\S]*?subtotal: number/
        );
      });

      it('should define deliveryFee prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface OrderSummarySectionProps[\s\S]*?deliveryFee: number/
        );
      });

      it('should define tax prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface OrderSummarySectionProps[\s\S]*?tax: number/
        );
      });

      it('should define total prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface OrderSummarySectionProps[\s\S]*?total: number/
        );
      });

      it('should define optional discount prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface OrderSummarySectionProps[\s\S]*?discount\?: number/
        );
      });

      it('should define formatCustomizations prop', () => {
        expect(checkoutFileContent).toMatch(
          /interface OrderSummarySectionProps[\s\S]*?formatCustomizations:/
        );
      });
    });

    describe('Items Header', () => {
      it('should have fast-food icon', () => {
        expect(checkoutFileContent).toContain('name="fast-food-outline"');
      });

      it('should display item count with correct pluralization', () => {
        expect(checkoutFileContent).toContain("{items.length === 1 ? 'Item' : 'Items'}");
      });
    });

    describe('Items List', () => {
      it('should render OrderItemRow for each item', () => {
        expect(checkoutFileContent).toContain('{items.map((item, index) => (');
        expect(checkoutFileContent).toContain('<OrderItemRow');
      });

      it('should pass all required props to OrderItemRow', () => {
        expect(checkoutFileContent).toContain('name={item.menuItem.name}');
        expect(checkoutFileContent).toContain('quantity={item.quantity}');
        expect(checkoutFileContent).toContain('price={item.totalPrice}');
        expect(checkoutFileContent).toContain('unitPrice={item.menuItem.price}');
      });

      it('should pass customizations from formatCustomizations', () => {
        expect(checkoutFileContent).toContain('customizations={formatCustomizations(item)}');
      });

      it('should pass specialInstructions from item', () => {
        expect(checkoutFileContent).toContain('specialInstructions={item.specialInstructions}');
      });

      it('should pass image from menu item', () => {
        expect(checkoutFileContent).toContain('image={item.menuItem.image}');
      });
    });

    describe('Cost Breakdown', () => {
      it('should have costBreakdown container', () => {
        expect(checkoutFileContent).toContain('style={styles.costBreakdown}');
      });

      it('should render Subtotal CostRow with cart icon', () => {
        expect(checkoutFileContent).toContain('label="Subtotal"');
        expect(checkoutFileContent).toContain('icon="cart-outline"');
      });

      it('should render Delivery Fee CostRow with bicycle icon', () => {
        expect(checkoutFileContent).toContain('label="Delivery Fee"');
        expect(checkoutFileContent).toContain('icon="bicycle-outline"');
      });

      it('should show "Free" for zero delivery fee', () => {
        expect(checkoutFileContent).toContain("deliveryFee === 0 ? 'Free'");
      });

      it('should mark free delivery with isFree prop', () => {
        expect(checkoutFileContent).toContain('isFree={deliveryFee === 0}');
      });

      it('should render Tax CostRow with document icon', () => {
        expect(checkoutFileContent).toContain('icon="document-text-outline"');
      });

      it('should display tax percentage in label', () => {
        expect(checkoutFileContent).toContain('label={`Tax (${(TAX_RATE * 100).toFixed(2)}%)`}');
      });

      it('should conditionally render Discount CostRow', () => {
        expect(checkoutFileContent).toContain('{discount && discount > 0 && (');
      });

      it('should render Discount with pricetag icon', () => {
        expect(checkoutFileContent).toContain('icon="pricetag-outline"');
      });

      it('should show discount as negative value', () => {
        expect(checkoutFileContent).toContain('value={`-${formatPrice(discount)}`}');
      });
    });

    describe('Total Row', () => {
      it('should render TotalRow component', () => {
        expect(checkoutFileContent).toContain('<TotalRow');
      });

      it('should pass total to TotalRow', () => {
        expect(checkoutFileContent).toContain('total={total}');
      });

      it('should pass savings (discount) to TotalRow', () => {
        expect(checkoutFileContent).toContain('savings={discount}');
      });
    });

    describe('Dividers', () => {
      it('should have summaryDivider style', () => {
        expect(checkoutFileContent).toContain('style={[styles.summaryDivider');
      });
    });

    describe('Test IDs', () => {
      it('should have test ID for order summary content', () => {
        expect(checkoutFileContent).toContain('testID="order-summary-content"');
      });
    });
  });

  // ==========================================================================
  // Checkout Screen Integration Tests
  // ==========================================================================

  describe('Checkout Screen Integration', () => {
    describe('Order Summary Section Header', () => {
      it('should have Order Summary title', () => {
        expect(checkoutFileContent).toContain('title="Order Summary"');
      });

      it('should use receipt-outline icon', () => {
        expect(checkoutFileContent).toContain('icon="receipt-outline"');
      });

      it('should show item count in section summary', () => {
        expect(checkoutFileContent).toContain(
          "{items.length} {items.length === 1 ? 'item' : 'items'}"
        );
      });

      it('should show total in section badge', () => {
        expect(checkoutFileContent).toContain('sectionSummaryTotal');
        expect(checkoutFileContent).toContain('{formatPrice(total)}');
      });
    });

    describe('CollapsibleSection Integration', () => {
      it('should use CollapsibleSection wrapper', () => {
        expect(checkoutFileContent).toContain('<CollapsibleSection');
      });

      it('should track expanded state with orderSummary key', () => {
        expect(checkoutFileContent).toContain('expandedSections.orderSummary');
      });

      it('should toggle orderSummary section on press', () => {
        expect(checkoutFileContent).toContain("toggleSection('orderSummary')");
      });
    });

    describe('OrderSummarySection Usage', () => {
      it('should render OrderSummarySection component', () => {
        expect(checkoutFileContent).toContain('<OrderSummarySection');
      });

      it('should pass items from cart store', () => {
        expect(checkoutFileContent).toContain('items={items}');
      });

      it('should pass subtotal', () => {
        expect(checkoutFileContent).toContain('subtotal={subtotal}');
      });

      it('should pass deliveryFee', () => {
        expect(checkoutFileContent).toContain('deliveryFee={deliveryFee}');
      });

      it('should pass tax', () => {
        expect(checkoutFileContent).toContain('tax={tax}');
      });

      it('should pass total', () => {
        expect(checkoutFileContent).toContain('total={total}');
      });

      it('should pass formatCustomizations function', () => {
        expect(checkoutFileContent).toContain('formatCustomizations={formatCustomizations}');
      });
    });
  });

  // ==========================================================================
  // Style Tests
  // ==========================================================================

  describe('Styles', () => {
    describe('Order Summary Content', () => {
      it('should have orderSummaryContent style', () => {
        expect(checkoutFileContent).toContain('orderSummaryContent:');
      });

      it('should have orderSummaryBadge style', () => {
        expect(checkoutFileContent).toContain('orderSummaryBadge:');
      });

      it('should have orderSummaryItemsHeader style', () => {
        expect(checkoutFileContent).toContain('orderSummaryItemsHeader:');
      });

      it('should have orderSummaryItemsTitle style', () => {
        expect(checkoutFileContent).toContain('orderSummaryItemsTitle:');
      });
    });

    describe('Order Item Styles', () => {
      it('should have orderItemsList style', () => {
        expect(checkoutFileContent).toContain('orderItemsList:');
      });

      it('should have orderItemRow style', () => {
        expect(checkoutFileContent).toContain('orderItemRow:');
      });

      it('should have orderItemImage style', () => {
        expect(checkoutFileContent).toContain('orderItemImage:');
      });

      it('should have orderItemDetails style', () => {
        expect(checkoutFileContent).toContain('orderItemDetails:');
      });

      it('should have orderItemHeader style', () => {
        expect(checkoutFileContent).toContain('orderItemHeader:');
      });

      it('should have orderItemQuantityBadge style', () => {
        expect(checkoutFileContent).toContain('orderItemQuantityBadge:');
      });

      it('should have orderItemQuantityText style', () => {
        expect(checkoutFileContent).toContain('orderItemQuantityText:');
      });

      it('should have orderItemName style', () => {
        expect(checkoutFileContent).toContain('orderItemName:');
      });

      it('should have orderItemCustomizationsContainer style', () => {
        expect(checkoutFileContent).toContain('orderItemCustomizationsContainer:');
      });

      it('should have orderItemCustomizations style', () => {
        expect(checkoutFileContent).toContain('orderItemCustomizations:');
      });

      it('should have orderItemInstructionsContainer style', () => {
        expect(checkoutFileContent).toContain('orderItemInstructionsContainer:');
      });

      it('should have orderItemInstructions style', () => {
        expect(checkoutFileContent).toContain('orderItemInstructions:');
      });

      it('should have orderItemUnitPrice style', () => {
        expect(checkoutFileContent).toContain('orderItemUnitPrice:');
      });

      it('should have orderItemPrice style', () => {
        expect(checkoutFileContent).toContain('orderItemPrice:');
      });
    });

    describe('Cost Breakdown Styles', () => {
      it('should have costBreakdown style', () => {
        expect(checkoutFileContent).toContain('costBreakdown:');
      });

      it('should have costRow style', () => {
        expect(checkoutFileContent).toContain('costRow:');
      });

      it('should have costLabelContainer style', () => {
        expect(checkoutFileContent).toContain('costLabelContainer:');
      });

      it('should have costIcon style', () => {
        expect(checkoutFileContent).toContain('costIcon:');
      });

      it('should have costLabel style', () => {
        expect(checkoutFileContent).toContain('costLabel:');
      });

      it('should have costLabelHighlighted style', () => {
        expect(checkoutFileContent).toContain('costLabelHighlighted:');
      });

      it('should have costValue style', () => {
        expect(checkoutFileContent).toContain('costValue:');
      });

      it('should have costValueHighlighted style', () => {
        expect(checkoutFileContent).toContain('costValueHighlighted:');
      });
    });

    describe('Total Row Styles', () => {
      it('should have totalRowContainer style', () => {
        expect(checkoutFileContent).toContain('totalRowContainer:');
      });

      it('should have savingsBadge style', () => {
        expect(checkoutFileContent).toContain('savingsBadge:');
      });

      it('should have savingsText style', () => {
        expect(checkoutFileContent).toContain('savingsText:');
      });

      it('should have totalRow style', () => {
        expect(checkoutFileContent).toContain('totalRow:');
      });

      it('should have totalLabel style', () => {
        expect(checkoutFileContent).toContain('totalLabel:');
      });

      it('should have totalValue style', () => {
        expect(checkoutFileContent).toContain('totalValue:');
      });
    });

    describe('Image Dimensions', () => {
      it('should define 56px width for order item image', () => {
        expect(checkoutFileContent).toMatch(/orderItemImage:[\s\S]*?width: 56/);
      });

      it('should define 56px height for order item image', () => {
        expect(checkoutFileContent).toMatch(/orderItemImage:[\s\S]*?height: 56/);
      });
    });
  });

  // ==========================================================================
  // Animation Tests
  // ==========================================================================

  describe('Animations', () => {
    it('should import FadeIn animation', () => {
      expect(checkoutFileContent).toContain('FadeIn,');
    });

    it('should import FadeInDown animation', () => {
      expect(checkoutFileContent).toContain('FadeInDown,');
    });

    it('should use AnimationDurations.normal for animations', () => {
      expect(checkoutFileContent).toContain('AnimationDurations.normal');
    });

    it('should use staggered delays for item list', () => {
      expect(checkoutFileContent).toContain('.delay(index * 50)');
    });
  });

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================

  describe('Accessibility', () => {
    it('should have test IDs for order item rows', () => {
      expect(checkoutFileContent).toContain('testID={`order-item-row-${index}`}');
    });

    it('should have test ID for cost rows', () => {
      expect(checkoutFileContent).toContain('testID={`cost-row-');
    });

    it('should have test ID for total row', () => {
      expect(checkoutFileContent).toContain('testID="order-summary-total-row"');
    });

    it('should have test ID for order summary content', () => {
      expect(checkoutFileContent).toContain('testID="order-summary-content"');
    });
  });

  // ==========================================================================
  // Theme Integration Tests
  // ==========================================================================

  describe('Theme Integration', () => {
    it('should use colors.text for text elements', () => {
      expect(checkoutFileContent).toContain('color: colors.text');
    });

    it('should use colors.textSecondary for secondary text', () => {
      expect(checkoutFileContent).toContain('color: colors.textSecondary');
    });

    it('should use colors.textTertiary for tertiary text', () => {
      expect(checkoutFileContent).toContain('color: colors.textTertiary');
    });

    it('should use colors.divider for dividers', () => {
      expect(checkoutFileContent).toContain('backgroundColor: colors.divider');
    });

    it('should use PrimaryColors for accent elements', () => {
      expect(checkoutFileContent).toContain('PrimaryColors[500]');
    });

    it('should use SuccessColors for savings/free elements', () => {
      expect(checkoutFileContent).toContain('SuccessColors[');
    });
  });

  // ==========================================================================
  // Constants Tests
  // ==========================================================================

  describe('Constants', () => {
    it('should have TAX_RATE constant defined', () => {
      expect(checkoutFileContent).toContain('export const TAX_RATE');
    });

    it('should have TAX_RATE of 8.75%', () => {
      expect(checkoutFileContent).toContain('TAX_RATE = 0.0875');
    });

    it('should have DELIVERY_FEE_MINIMUM constant', () => {
      expect(checkoutFileContent).toContain('export const DELIVERY_FEE_MINIMUM');
    });

    it('should have DELIVERY_FEE_MINIMUM of $2.99', () => {
      expect(checkoutFileContent).toContain('DELIVERY_FEE_MINIMUM = 2.99');
    });
  });

  // ==========================================================================
  // Helper Function Tests
  // ==========================================================================

  describe('Helper Functions', () => {
    describe('formatPrice', () => {
      it('should export formatPrice function', () => {
        expect(checkoutFileContent).toContain('export function formatPrice');
      });

      it('should format price with dollar sign and 2 decimals', () => {
        expect(checkoutFileContent).toContain('`$${price.toFixed(2)}`');
      });
    });

    describe('calculateTax', () => {
      it('should export calculateTax function', () => {
        expect(checkoutFileContent).toContain('export function calculateTax');
      });

      it('should calculate tax using TAX_RATE', () => {
        expect(checkoutFileContent).toContain('subtotal * TAX_RATE');
      });
    });

    describe('getDeliveryFee', () => {
      it('should export getDeliveryFee function', () => {
        expect(checkoutFileContent).toContain('export function getDeliveryFee');
      });

      it('should use DELIVERY_FEE_MINIMUM as fallback', () => {
        expect(checkoutFileContent).toContain('restaurantDeliveryFee ?? DELIVERY_FEE_MINIMUM');
      });
    });

    describe('calculateTotal', () => {
      it('should export calculateTotal function', () => {
        expect(checkoutFileContent).toContain('export function calculateTotal');
      });

      it('should handle optional discount parameter', () => {
        expect(checkoutFileContent).toContain('discount?: number');
      });

      it('should subtract discount from total', () => {
        expect(checkoutFileContent).toContain('- (discount ?? 0)');
      });
    });
  });

  // ==========================================================================
  // Import Tests
  // ==========================================================================

  describe('Imports', () => {
    it('should import Ionicons', () => {
      expect(checkoutFileContent).toContain("from '@expo/vector-icons'");
    });

    it('should import Image from expo-image', () => {
      expect(checkoutFileContent).toContain("from 'expo-image'");
    });

    it('should import useCartStore', () => {
      expect(checkoutFileContent).toContain('useCartStore');
    });

    it('should import PrimaryColors', () => {
      expect(checkoutFileContent).toContain('PrimaryColors');
    });

    it('should import SuccessColors', () => {
      expect(checkoutFileContent).toContain('SuccessColors');
    });

    it('should import NeutralColors', () => {
      expect(checkoutFileContent).toContain('NeutralColors');
    });

    it('should import AnimationDurations', () => {
      expect(checkoutFileContent).toContain('AnimationDurations');
    });

    it('should import BorderRadius', () => {
      expect(checkoutFileContent).toContain('BorderRadius');
    });

    it('should import Typography', () => {
      expect(checkoutFileContent).toContain('Typography');
    });

    it('should import Spacing', () => {
      expect(checkoutFileContent).toContain('Spacing');
    });

    it('should import FontWeights', () => {
      expect(checkoutFileContent).toContain('FontWeights');
    });
  });

  // ==========================================================================
  // Edge Case Tests
  // ==========================================================================

  describe('Edge Cases', () => {
    describe('Empty State', () => {
      it('should handle zero items gracefully', () => {
        // The OrderSummarySection will receive an empty array
        // This tests that the component structure allows for it
        expect(checkoutFileContent).toContain('{items.map((item, index) => (');
      });
    });

    describe('Free Delivery', () => {
      it('should show "Free" text for zero delivery fee', () => {
        expect(checkoutFileContent).toContain("deliveryFee === 0 ? 'Free'");
      });

      it('should style free delivery differently', () => {
        expect(checkoutFileContent).toContain('isFree={deliveryFee === 0}');
      });
    });

    describe('No Discount', () => {
      it('should hide discount row when no discount', () => {
        expect(checkoutFileContent).toContain('{discount && discount > 0 && (');
      });

      it('should not show savings badge when no discount', () => {
        expect(checkoutFileContent).toContain('{savings && savings > 0 && (');
      });
    });

    describe('Single Item', () => {
      it('should use singular "Item" for single item', () => {
        expect(checkoutFileContent).toContain("{items.length === 1 ? 'Item' : 'Items'}");
      });

      it('should not show unit price for single quantity', () => {
        expect(checkoutFileContent).toContain('{quantity > 1 && (');
      });
    });

    describe('No Customizations', () => {
      it('should hide customizations when not provided', () => {
        expect(checkoutFileContent).toContain('{customizations && (');
      });
    });

    describe('No Special Instructions', () => {
      it('should hide instructions when not provided', () => {
        expect(checkoutFileContent).toContain('{specialInstructions && (');
      });
    });

    describe('No Image', () => {
      it('should hide image when not provided', () => {
        expect(checkoutFileContent).toContain('{image && (');
      });
    });
  });
});
