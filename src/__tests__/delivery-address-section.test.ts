/**
 * Tests for Delivery Address Section in Checkout Screen
 *
 * Task 4.2: Build delivery address section
 *
 * Tests cover:
 * - Address display and selection
 * - Edit address functionality
 * - Add new address modal
 * - Delivery instructions input
 * - Estimated delivery time display
 * - Address validation schema
 * - Helper functions
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ============================================================================
// File Structure Tests
// ============================================================================

describe('Delivery Address Section - File Structure', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should have the checkout file', () => {
    expect(fs.existsSync(checkoutPath)).toBe(true);
  });

  it('should import zodResolver from @hookform/resolvers/zod', () => {
    expect(checkoutContent).toContain("import { zodResolver } from '@hookform/resolvers/zod'");
  });

  it('should import react-hook-form Controller and useForm', () => {
    expect(checkoutContent).toContain('Controller');
    expect(checkoutContent).toContain('useForm');
  });

  it('should import zod', () => {
    expect(checkoutContent).toContain("from 'zod'");
  });

  it('should import Modal from react-native', () => {
    expect(checkoutContent).toContain('Modal');
  });

  it('should import Switch from react-native', () => {
    expect(checkoutContent).toContain('Switch');
  });

  it('should import TextInput from react-native', () => {
    expect(checkoutContent).toContain('TextInput');
  });

  it('should import SuccessColors and ErrorColors from theme', () => {
    expect(checkoutContent).toContain('SuccessColors');
    expect(checkoutContent).toContain('ErrorColors');
  });

  it('should import AddressLabel type', () => {
    expect(checkoutContent).toContain('AddressLabel');
  });
});

// ============================================================================
// Export Tests
// ============================================================================

describe('Delivery Address Section - Exports', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should export MAX_DELIVERY_INSTRUCTIONS_LENGTH constant', () => {
    expect(checkoutContent).toContain('export const MAX_DELIVERY_INSTRUCTIONS_LENGTH');
  });

  it('should export addressSchema', () => {
    expect(checkoutContent).toContain('export const addressSchema');
  });

  it('should export AddressFormData type', () => {
    expect(checkoutContent).toContain('export type AddressFormData');
  });

  it('should export AddressLabelSelector component', () => {
    expect(checkoutContent).toContain('export function AddressLabelSelector');
  });

  it('should export AddressModal component', () => {
    expect(checkoutContent).toContain('export function AddressModal');
  });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Delivery Address Section - Constants', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should set MAX_DELIVERY_INSTRUCTIONS_LENGTH to 200', () => {
    expect(checkoutContent).toContain('MAX_DELIVERY_INSTRUCTIONS_LENGTH = 200');
  });
});

// ============================================================================
// Address Schema Tests
// ============================================================================

describe('Delivery Address Section - Address Schema', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should have label field with enum validation', () => {
    expect(checkoutContent).toContain("label: z.enum(['Home', 'Work', 'Other']");
  });

  it('should have street field with minimum length validation', () => {
    expect(checkoutContent).toContain("street: z.string().min(5, 'Street address is required')");
  });

  it('should have city field with minimum length validation', () => {
    expect(checkoutContent).toContain("city: z.string().min(2, 'City is required')");
  });

  it('should have zipCode field with minimum length validation', () => {
    expect(checkoutContent).toContain(
      "zipCode: z.string().min(5, 'ZIP code must be at least 5 characters')"
    );
  });

  it('should have optional instructions field', () => {
    expect(checkoutContent).toContain('instructions: z.string().optional()');
  });

  it('should have isDefault boolean field with default false', () => {
    expect(checkoutContent).toContain('isDefault: z.boolean().default(false)');
  });
});

// ============================================================================
// AddressLabelSelector Component Tests
// ============================================================================

describe('Delivery Address Section - AddressLabelSelector Component', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should define AddressLabelSelectorProps interface', () => {
    expect(checkoutContent).toContain('interface AddressLabelSelectorProps');
  });

  it('should accept value prop of type AddressLabel', () => {
    expect(checkoutContent).toContain('value: AddressLabel');
  });

  it('should accept onChange callback prop', () => {
    expect(checkoutContent).toContain('onChange: (label: AddressLabel) => void');
  });

  it('should accept colors prop', () => {
    expect(checkoutContent).toMatch(/AddressLabelSelectorProps[\s\S]*colors:/);
  });

  it('should have three label options: Home, Work, Other', () => {
    expect(checkoutContent).toContain("{ label: 'Home', icon: 'home-outline' }");
    expect(checkoutContent).toContain("{ label: 'Work', icon: 'briefcase-outline' }");
    expect(checkoutContent).toContain("{ label: 'Other', icon: 'location-outline' }");
  });

  it('should have test IDs for each label option', () => {
    expect(checkoutContent).toContain('testID={`address-label-${item.label.toLowerCase()}`}');
  });

  it('should have accessibility role "radio"', () => {
    expect(checkoutContent).toMatch(/AddressLabelSelector[\s\S]*accessibilityRole="radio"/);
  });

  it('should have accessibility state for selected', () => {
    expect(checkoutContent).toMatch(/AddressLabelSelector[\s\S]*accessibilityState.*selected/);
  });
});

// ============================================================================
// AddressModal Component Tests
// ============================================================================

describe('Delivery Address Section - AddressModal Component', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should define AddressModalProps interface', () => {
    expect(checkoutContent).toContain('interface AddressModalProps');
  });

  it('should accept visible prop', () => {
    expect(checkoutContent).toMatch(/AddressModalProps[\s\S]*visible: boolean/);
  });

  it('should accept onClose callback prop', () => {
    expect(checkoutContent).toMatch(/AddressModalProps[\s\S]*onClose: \(\) => void/);
  });

  it('should accept onSave callback prop', () => {
    expect(checkoutContent).toMatch(
      /AddressModalProps[\s\S]*onSave: \(address: AddressFormData\) => void/
    );
  });

  it('should accept optional initialData prop', () => {
    expect(checkoutContent).toMatch(/AddressModalProps[\s\S]*initialData\?: Address/);
  });

  it('should accept optional isEditing prop', () => {
    expect(checkoutContent).toMatch(/AddressModalProps[\s\S]*isEditing\?: boolean/);
  });

  it('should use react-hook-form with zodResolver', () => {
    expect(checkoutContent).toContain('resolver: zodResolver(addressSchema)');
  });

  it('should have default values for new address', () => {
    expect(checkoutContent).toMatch(/defaultValues:[\s\S]*label: 'Home'/);
    expect(checkoutContent).toMatch(/defaultValues:[\s\S]*street: ''/);
    expect(checkoutContent).toMatch(/defaultValues:[\s\S]*city: ''/);
    expect(checkoutContent).toMatch(/defaultValues:[\s\S]*zipCode: ''/);
    expect(checkoutContent).toMatch(/defaultValues:[\s\S]*instructions: ''/);
    expect(checkoutContent).toMatch(/defaultValues:[\s\S]*isDefault: false/);
  });

  it('should have Modal component with pageSheet presentation', () => {
    expect(checkoutContent).toContain('presentationStyle="pageSheet"');
  });

  it('should have close button with test ID', () => {
    expect(checkoutContent).toContain('testID="address-modal-close"');
  });

  it('should have save button with test ID', () => {
    expect(checkoutContent).toContain('testID="address-modal-save"');
  });

  it('should show different title for editing vs adding', () => {
    expect(checkoutContent).toContain("isEditing ? 'Edit Address' : 'Add New Address'");
  });

  it('should show different button text for editing vs adding', () => {
    expect(checkoutContent).toContain("isEditing ? 'Save Changes' : 'Add Address'");
  });

  it('should have street address input with test ID', () => {
    expect(checkoutContent).toContain('testID="address-street-input"');
  });

  it('should have city input with test ID', () => {
    expect(checkoutContent).toContain('testID="address-city-input"');
  });

  it('should have ZIP code input with test ID', () => {
    expect(checkoutContent).toContain('testID="address-zipcode-input"');
  });

  it('should have instructions input with test ID', () => {
    expect(checkoutContent).toContain('testID="address-instructions-input"');
  });

  it('should have default toggle with test ID', () => {
    expect(checkoutContent).toContain('testID="address-default-toggle"');
  });

  it('should show character count for instructions', () => {
    expect(checkoutContent).toContain("{(value || '').length}/{MAX_DELIVERY_INSTRUCTIONS_LENGTH}");
  });

  it('should use maxLength for instructions input', () => {
    expect(checkoutContent).toContain('maxLength={MAX_DELIVERY_INSTRUCTIONS_LENGTH}');
  });
});

// ============================================================================
// SelectedAddressDisplay Component Tests
// ============================================================================

describe('Delivery Address Section - SelectedAddressDisplay Component', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should define SelectedAddressDisplayProps interface', () => {
    expect(checkoutContent).toContain('interface SelectedAddressDisplayProps');
  });

  it('should accept address prop', () => {
    expect(checkoutContent).toMatch(/SelectedAddressDisplayProps[\s\S]*address: Address/);
  });

  it('should accept onEdit callback prop', () => {
    expect(checkoutContent).toMatch(/SelectedAddressDisplayProps[\s\S]*onEdit: \(\) => void/);
  });

  it('should have test ID for selected address display', () => {
    expect(checkoutContent).toContain('testID="selected-address-display"');
  });

  it('should have edit button with test ID', () => {
    expect(checkoutContent).toContain('testID="edit-selected-address-button"');
  });

  it('should show default badge when address is default', () => {
    expect(checkoutContent).toMatch(
      /SelectedAddressDisplay[\s\S]*address\.isDefault[\s\S]*Default/
    );
  });

  it('should show instructions preview when address has instructions', () => {
    expect(checkoutContent).toMatch(
      /SelectedAddressDisplay[\s\S]*address\.instructions[\s\S]*instructionsPreview/
    );
  });

  it('should have spring animation on press', () => {
    expect(checkoutContent).toMatch(/SelectedAddressDisplay[\s\S]*withSpring\(0\.98/);
  });
});

// ============================================================================
// DeliveryInstructionsInput Component Tests
// ============================================================================

describe('Delivery Address Section - DeliveryInstructionsInput Component', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should define DeliveryInstructionsInputProps interface', () => {
    expect(checkoutContent).toContain('interface DeliveryInstructionsInputProps');
  });

  it('should accept value prop', () => {
    expect(checkoutContent).toMatch(/DeliveryInstructionsInputProps[\s\S]*value: string/);
  });

  it('should accept onChange callback prop', () => {
    expect(checkoutContent).toMatch(
      /DeliveryInstructionsInputProps[\s\S]*onChange: \(text: string\) => void/
    );
  });

  it('should have test ID for delivery instructions input', () => {
    expect(checkoutContent).toContain('testID="delivery-instructions-input"');
  });

  it('should have label "Delivery Instructions"', () => {
    expect(checkoutContent).toContain('Delivery Instructions');
  });

  it('should have placeholder text', () => {
    expect(checkoutContent).toContain('Ring doorbell, leave at front door');
  });

  it('should show character count', () => {
    expect(checkoutContent).toContain('{value.length}/{MAX_DELIVERY_INSTRUCTIONS_LENGTH}');
  });

  it('should have hint text for special instructions', () => {
    expect(checkoutContent).toContain('Special instructions for the driver');
  });

  it('should track focus state', () => {
    expect(checkoutContent).toMatch(/DeliveryInstructionsInput[\s\S]*useState\(false\)/);
  });

  it('should use multiline text input', () => {
    expect(checkoutContent).toMatch(/DeliveryInstructionsInput[\s\S]*multiline/);
  });
});

// ============================================================================
// EstimatedDeliveryDisplay Component Tests
// ============================================================================

describe('Delivery Address Section - EstimatedDeliveryDisplay Component', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should define EstimatedDeliveryDisplayProps interface', () => {
    expect(checkoutContent).toContain('interface EstimatedDeliveryDisplayProps');
  });

  it('should accept estimatedTime prop', () => {
    expect(checkoutContent).toMatch(/EstimatedDeliveryDisplayProps[\s\S]*estimatedTime: string/);
  });

  it('should have label "Estimated Delivery"', () => {
    expect(checkoutContent).toContain('Estimated Delivery');
  });

  it('should have time icon', () => {
    expect(checkoutContent).toMatch(/EstimatedDeliveryDisplay[\s\S]*name="time-outline"/);
  });

  it('should display estimatedTime', () => {
    expect(checkoutContent).toMatch(/EstimatedDeliveryDisplay[\s\S]*{estimatedTime}/);
  });

  it('should have FadeInDown animation', () => {
    expect(checkoutContent).toMatch(/EstimatedDeliveryDisplay[\s\S]*FadeInDown/);
  });
});

// ============================================================================
// Checkout Screen Integration Tests
// ============================================================================

describe('Delivery Address Section - Checkout Integration', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should use addAddress from auth store', () => {
    expect(checkoutContent).toContain('addAddress = useAuthStore');
  });

  it('should use updateAddress from auth store', () => {
    expect(checkoutContent).toContain('updateAddress = useAuthStore');
  });

  it('should have deliveryInstructions state', () => {
    expect(checkoutContent).toContain('[deliveryInstructions, setDeliveryInstructions]');
  });

  it('should have addressModalVisible state', () => {
    expect(checkoutContent).toContain('[addressModalVisible, setAddressModalVisible]');
  });

  it('should have editingAddress state', () => {
    expect(checkoutContent).toContain('[editingAddress, setEditingAddress]');
  });

  it('should have handleDeliveryInstructionsChange handler', () => {
    expect(checkoutContent).toContain('const handleDeliveryInstructionsChange');
  });

  it('should have handleOpenAddAddressModal handler', () => {
    expect(checkoutContent).toContain('const handleOpenAddAddressModal');
  });

  it('should have handleOpenEditAddressModal handler', () => {
    expect(checkoutContent).toContain('const handleOpenEditAddressModal');
  });

  it('should have handleCloseAddressModal handler', () => {
    expect(checkoutContent).toContain('const handleCloseAddressModal');
  });

  it('should have handleSaveAddress handler', () => {
    expect(checkoutContent).toContain('const handleSaveAddress');
  });

  it('should render SelectedAddressDisplay component', () => {
    expect(checkoutContent).toContain('<SelectedAddressDisplay');
  });

  it('should render DeliveryInstructionsInput component', () => {
    expect(checkoutContent).toContain('<DeliveryInstructionsInput');
  });

  it('should render EstimatedDeliveryDisplay component', () => {
    expect(checkoutContent).toContain('<EstimatedDeliveryDisplay');
  });

  it('should render AddressModal component', () => {
    expect(checkoutContent).toContain('<AddressModal');
  });

  it('should have "Change address" link with test ID', () => {
    expect(checkoutContent).toContain('testID="change-address-link"');
  });

  it('should have "Add New Address" button with test ID', () => {
    expect(checkoutContent).toContain('testID="add-new-address-button"');
  });
});

// ============================================================================
// Address Operations Tests
// ============================================================================

describe('Delivery Address Section - Address Operations', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should update address when editing existing address', () => {
    expect(checkoutContent).toMatch(
      /if \(editingAddress\)[\s\S]*updateAddress\(editingAddress\.id/
    );
  });

  it('should add address when creating new address', () => {
    expect(checkoutContent).toMatch(/else[\s\S]*const newAddress: Address/);
    expect(checkoutContent).toContain('addAddress(newAddress)');
  });

  it('should generate unique ID for new address', () => {
    expect(checkoutContent).toContain('id: `addr-${Date.now()}`');
  });

  it('should set coordinates placeholder for new address', () => {
    expect(checkoutContent).toContain('coordinates: { latitude: 0, longitude: 0 }');
  });

  it('should select newly added address', () => {
    expect(checkoutContent).toContain('setSelectedAddressId(newAddress.id)');
  });

  it('should update delivery instructions when saving address', () => {
    expect(checkoutContent).toContain('setDeliveryInstructions(data.instructions)');
  });
});

// ============================================================================
// Styling Tests
// ============================================================================

describe('Delivery Address Section - Styling', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should have addressSectionContent style', () => {
    expect(checkoutContent).toContain('addressSectionContent:');
  });

  it('should have selectedAddressContainer style', () => {
    expect(checkoutContent).toContain('selectedAddressContainer:');
  });

  it('should have selectedAddressMain style', () => {
    expect(checkoutContent).toContain('selectedAddressMain:');
  });

  it('should have selectedAddressHeader style', () => {
    expect(checkoutContent).toContain('selectedAddressHeader:');
  });

  it('should have selectedAddressIconContainer style', () => {
    expect(checkoutContent).toContain('selectedAddressIconContainer:');
  });

  it('should have selectedAddressInfo style', () => {
    expect(checkoutContent).toContain('selectedAddressInfo:');
  });

  it('should have selectedAddressLabelRow style', () => {
    expect(checkoutContent).toContain('selectedAddressLabelRow:');
  });

  it('should have selectedAddressLabel style', () => {
    expect(checkoutContent).toContain('selectedAddressLabel:');
  });

  it('should have selectedAddressStreet style', () => {
    expect(checkoutContent).toContain('selectedAddressStreet:');
  });

  it('should have selectedAddressCity style', () => {
    expect(checkoutContent).toContain('selectedAddressCity:');
  });

  it('should have editAddressButton style', () => {
    expect(checkoutContent).toContain('editAddressButton:');
  });

  it('should have instructionsPreview style', () => {
    expect(checkoutContent).toContain('instructionsPreview:');
  });

  it('should have instructionsPreviewText style', () => {
    expect(checkoutContent).toContain('instructionsPreviewText:');
  });

  it('should have defaultBadge style', () => {
    expect(checkoutContent).toContain('defaultBadge:');
  });

  it('should have defaultBadgeText style', () => {
    expect(checkoutContent).toContain('defaultBadgeText:');
  });

  it('should have changeAddressLink style', () => {
    expect(checkoutContent).toContain('changeAddressLink:');
  });

  it('should have changeAddressText style', () => {
    expect(checkoutContent).toContain('changeAddressText:');
  });

  it('should have deliveryInstructionsContainer style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsContainer:');
  });

  it('should have deliveryInstructionsLabel style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsLabel:');
  });

  it('should have deliveryInstructionsInputWrapper style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsInputWrapper:');
  });

  it('should have deliveryInstructionsIcon style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsIcon:');
  });

  it('should have deliveryInstructionsInput style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsInput:');
  });

  it('should have deliveryInstructionsFooter style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsFooter:');
  });

  it('should have deliveryInstructionsHint style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsHint:');
  });

  it('should have deliveryInstructionsCount style', () => {
    expect(checkoutContent).toContain('deliveryInstructionsCount:');
  });

  it('should have estimatedDeliveryContainer style', () => {
    expect(checkoutContent).toContain('estimatedDeliveryContainer:');
  });

  it('should have estimatedDeliveryIcon style', () => {
    expect(checkoutContent).toContain('estimatedDeliveryIcon:');
  });

  it('should have estimatedDeliveryInfo style', () => {
    expect(checkoutContent).toContain('estimatedDeliveryInfo:');
  });

  it('should have estimatedDeliveryLabel style', () => {
    expect(checkoutContent).toContain('estimatedDeliveryLabel:');
  });

  it('should have estimatedDeliveryTime style', () => {
    expect(checkoutContent).toContain('estimatedDeliveryTime:');
  });

  it('should have addNewAddressButton style', () => {
    expect(checkoutContent).toContain('addNewAddressButton:');
  });

  it('should have addNewAddressText style', () => {
    expect(checkoutContent).toContain('addNewAddressText:');
  });

  it('should have modalContainer style', () => {
    expect(checkoutContent).toContain('modalContainer:');
  });

  it('should have modalContent style', () => {
    expect(checkoutContent).toContain('modalContent:');
  });

  it('should have modalHeader style', () => {
    expect(checkoutContent).toContain('modalHeader:');
  });

  it('should have modalTitle style', () => {
    expect(checkoutContent).toContain('modalTitle:');
  });

  it('should have modalScroll style', () => {
    expect(checkoutContent).toContain('modalScroll:');
  });

  it('should have modalScrollContent style', () => {
    expect(checkoutContent).toContain('modalScrollContent:');
  });

  it('should have modalFooter style', () => {
    expect(checkoutContent).toContain('modalFooter:');
  });

  it('should have modalSaveButton style', () => {
    expect(checkoutContent).toContain('modalSaveButton:');
  });

  it('should have modalSaveButtonText style', () => {
    expect(checkoutContent).toContain('modalSaveButtonText:');
  });

  it('should have labelSelectorContainer style', () => {
    expect(checkoutContent).toContain('labelSelectorContainer:');
  });

  it('should have labelSelectorTitle style', () => {
    expect(checkoutContent).toContain('labelSelectorTitle:');
  });

  it('should have labelOptions style', () => {
    expect(checkoutContent).toContain('labelOptions:');
  });

  it('should have labelOption style', () => {
    expect(checkoutContent).toContain('labelOption:');
  });

  it('should have labelOptionText style', () => {
    expect(checkoutContent).toContain('labelOptionText:');
  });

  it('should have inputContainer style', () => {
    expect(checkoutContent).toContain('inputContainer:');
  });

  it('should have inputLabel style', () => {
    expect(checkoutContent).toContain('inputLabel:');
  });

  it('should have inputWrapper style', () => {
    expect(checkoutContent).toContain('inputWrapper:');
  });

  it('should have inputWrapperMultiline style', () => {
    expect(checkoutContent).toContain('inputWrapperMultiline:');
  });

  it('should have inputIcon style', () => {
    expect(checkoutContent).toContain('inputIcon:');
  });

  it('should have input style', () => {
    expect(checkoutContent).toContain('input:');
  });

  it('should have inputNoPadding style', () => {
    expect(checkoutContent).toContain('inputNoPadding:');
  });

  it('should have inputMultiline style', () => {
    expect(checkoutContent).toContain('inputMultiline:');
  });

  it('should have inputError style', () => {
    expect(checkoutContent).toContain('inputError:');
  });

  it('should have characterCount style', () => {
    expect(checkoutContent).toContain('characterCount:');
  });

  it('should have defaultToggleContainer style', () => {
    expect(checkoutContent).toContain('defaultToggleContainer:');
  });

  it('should have defaultToggleTextContainer style', () => {
    expect(checkoutContent).toContain('defaultToggleTextContainer:');
  });

  it('should have defaultToggleLabel style', () => {
    expect(checkoutContent).toContain('defaultToggleLabel:');
  });

  it('should have defaultToggleDescription style', () => {
    expect(checkoutContent).toContain('defaultToggleDescription:');
  });
});

// ============================================================================
// Animation Tests
// ============================================================================

describe('Delivery Address Section - Animations', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should use FadeIn animation', () => {
    expect(checkoutContent).toContain('FadeIn');
  });

  it('should use FadeInDown animation', () => {
    expect(checkoutContent).toContain('FadeInDown');
  });

  it('should use FadeOut animation', () => {
    expect(checkoutContent).toContain('FadeOut');
  });

  it('should use withSpring for press animations', () => {
    expect(checkoutContent).toContain('withSpring');
  });

  it('should have staggered delays for animations', () => {
    expect(checkoutContent).toContain('.delay(50)');
    expect(checkoutContent).toContain('.delay(100)');
    expect(checkoutContent).toContain('.delay(150)');
    expect(checkoutContent).toContain('.delay(200)');
  });
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('Delivery Address Section - Accessibility', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should have accessibility labels for address modal close button', () => {
    expect(checkoutContent).toContain('accessibilityLabel="Close modal"');
  });

  it('should have accessibility labels for edit address button', () => {
    expect(checkoutContent).toContain('accessibilityLabel="Edit selected address"');
  });

  it('should have accessibility labels for change address link', () => {
    expect(checkoutContent).toContain('accessibilityLabel="Change delivery address"');
  });

  it('should have accessibility labels for add new address button', () => {
    expect(checkoutContent).toContain('accessibilityLabel="Add new address"');
  });

  it('should have accessibility labels for delivery instructions input', () => {
    expect(checkoutContent).toContain('accessibilityLabel="Delivery instructions"');
  });

  it('should have accessibility roles', () => {
    expect(checkoutContent).toContain('accessibilityRole="button"');
    expect(checkoutContent).toContain('accessibilityRole="radio"');
  });
});

// ============================================================================
// Edge Case Tests
// ============================================================================

describe('Delivery Address Section - Edge Cases', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should handle when no address is selected', () => {
    expect(checkoutContent).toContain('!selectedAddress');
  });

  it('should handle when user has no addresses', () => {
    expect(checkoutContent).toContain('No saved addresses');
  });

  it('should show change address link only when multiple addresses exist', () => {
    expect(checkoutContent).toContain('user.addresses.length > 1');
  });

  it('should handle empty instructions', () => {
    expect(checkoutContent).toContain("value || ''");
  });

  it('should initialize delivery instructions from selected address', () => {
    expect(checkoutContent).toContain(
      'user?.addresses.find((a) => a.id === selectedAddressId)?.instructions'
    );
  });

  it('should close modal after saving', () => {
    expect(checkoutContent).toContain('setAddressModalVisible(false)');
    expect(checkoutContent).toContain('setEditingAddress(null)');
  });

  it('should reset form on close', () => {
    expect(checkoutContent).toContain('form.reset()');
  });
});

// ============================================================================
// Form Validation Tests
// ============================================================================

describe('Delivery Address Section - Form Validation', () => {
  const checkoutPath = path.join(__dirname, '../app/order/checkout.tsx');
  let checkoutContent: string;

  beforeAll(() => {
    checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  });

  it('should use onChange mode for validation', () => {
    expect(checkoutContent).toContain("mode: 'onChange'");
  });

  it('should display error messages', () => {
    expect(checkoutContent).toContain('{error.message}');
  });

  it('should apply error border color', () => {
    expect(checkoutContent).toContain('error ? ErrorColors[500] : colors.border');
  });

  it('should use form handleSubmit for saving', () => {
    expect(checkoutContent).toContain('form.handleSubmit(handleSave)');
  });
});
