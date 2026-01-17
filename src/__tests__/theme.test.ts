/**
 * Tests for the design system constants
 * Verifies all theme tokens are properly defined and typed
 */

// Mock react-native Platform module
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => {
      return obj.ios ?? obj.default;
    },
  },
}));

import {
  AnimationDurations,
  BorderRadius,
  type BorderRadiusSize,
  Colors,
  type ColorTheme,
  type ColorToken,
  ErrorColors,
  Fonts,
  type FontWeight,
  FontWeights,
  NeutralColors,
  PrimaryColors,
  SecondaryColors,
  type ShadowSize,
  Shadows,
  Spacing,
  type SpacingSize,
  SuccessColors,
  Typography,
  type TypographySize,
  WarningColors,
  ZIndex,
} from '@/constants/theme';

describe('Design System - Color Palette', () => {
  describe('PrimaryColors', () => {
    it('should have all shade levels from 50 to 900', () => {
      expect(PrimaryColors[50]).toBeDefined();
      expect(PrimaryColors[100]).toBeDefined();
      expect(PrimaryColors[200]).toBeDefined();
      expect(PrimaryColors[300]).toBeDefined();
      expect(PrimaryColors[400]).toBeDefined();
      expect(PrimaryColors[500]).toBeDefined();
      expect(PrimaryColors[600]).toBeDefined();
      expect(PrimaryColors[700]).toBeDefined();
      expect(PrimaryColors[800]).toBeDefined();
      expect(PrimaryColors[900]).toBeDefined();
    });

    it('should have valid hex color values', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(PrimaryColors).forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should have #FF6B35 as the main primary color (500)', () => {
      expect(PrimaryColors[500]).toBe('#FF6B35');
    });
  });

  describe('SecondaryColors', () => {
    it('should have all shade levels from 50 to 900', () => {
      expect(SecondaryColors[50]).toBeDefined();
      expect(SecondaryColors[500]).toBeDefined();
      expect(SecondaryColors[900]).toBeDefined();
    });

    it('should have #0EA5E9 as the main secondary color (500)', () => {
      expect(SecondaryColors[500]).toBe('#0EA5E9');
    });
  });

  describe('SuccessColors', () => {
    it('should have #22C55E as the main success color (500)', () => {
      expect(SuccessColors[500]).toBe('#22C55E');
    });
  });

  describe('WarningColors', () => {
    it('should have #F59E0B as the main warning color (500)', () => {
      expect(WarningColors[500]).toBe('#F59E0B');
    });
  });

  describe('ErrorColors', () => {
    it('should have #EF4444 as the main error color (500)', () => {
      expect(ErrorColors[500]).toBe('#EF4444');
    });
  });

  describe('NeutralColors', () => {
    it('should have shade levels from 0 to 950', () => {
      expect(NeutralColors[0]).toBe('#FFFFFF');
      expect(NeutralColors[50]).toBeDefined();
      expect(NeutralColors[500]).toBeDefined();
      expect(NeutralColors[950]).toBe('#0A0A0A');
    });
  });
});

describe('Design System - Theme Colors', () => {
  describe('Light theme', () => {
    it('should have all required color tokens', () => {
      const lightColors = Colors.light;

      // Base colors
      expect(lightColors.text).toBeDefined();
      expect(lightColors.textSecondary).toBeDefined();
      expect(lightColors.textTertiary).toBeDefined();
      expect(lightColors.background).toBeDefined();
      expect(lightColors.backgroundSecondary).toBeDefined();
      expect(lightColors.backgroundTertiary).toBeDefined();

      // Brand colors
      expect(lightColors.primary).toBeDefined();
      expect(lightColors.primaryLight).toBeDefined();
      expect(lightColors.primaryDark).toBeDefined();
      expect(lightColors.secondary).toBeDefined();

      // Semantic colors
      expect(lightColors.success).toBeDefined();
      expect(lightColors.warning).toBeDefined();
      expect(lightColors.error).toBeDefined();

      // UI Elements
      expect(lightColors.border).toBeDefined();
      expect(lightColors.divider).toBeDefined();
      expect(lightColors.icon).toBeDefined();

      // Cards and surfaces
      expect(lightColors.card).toBeDefined();
      expect(lightColors.overlay).toBeDefined();
    });

    it('should have white background and dark text', () => {
      expect(Colors.light.background).toBe('#FFFFFF');
      expect(Colors.light.text).toBe('#171717');
    });
  });

  describe('Dark theme', () => {
    it('should have all required color tokens', () => {
      const darkColors = Colors.dark;

      expect(darkColors.text).toBeDefined();
      expect(darkColors.background).toBeDefined();
      expect(darkColors.primary).toBeDefined();
      expect(darkColors.success).toBeDefined();
      expect(darkColors.card).toBeDefined();
    });

    it('should have dark background and light text', () => {
      expect(Colors.dark.background).toBe('#0A0A0A');
      expect(Colors.dark.text).toBe('#FAFAFA');
    });

    it('should have overlay with higher opacity than light theme', () => {
      expect(Colors.light.overlay).toBe('rgba(0, 0, 0, 0.5)');
      expect(Colors.dark.overlay).toBe('rgba(0, 0, 0, 0.7)');
    });
  });
});

describe('Design System - Typography', () => {
  describe('Typography scale', () => {
    it('should have all size variants', () => {
      expect(Typography.xs).toBeDefined();
      expect(Typography.sm).toBeDefined();
      expect(Typography.base).toBeDefined();
      expect(Typography.lg).toBeDefined();
      expect(Typography.xl).toBeDefined();
      expect(Typography['2xl']).toBeDefined();
      expect(Typography['3xl']).toBeDefined();
      expect(Typography['4xl']).toBeDefined();
      expect(Typography['5xl']).toBeDefined();
    });

    it('should have correct font sizes', () => {
      expect(Typography.xs.fontSize).toBe(10);
      expect(Typography.sm.fontSize).toBe(12);
      expect(Typography.base.fontSize).toBe(14);
      expect(Typography.lg.fontSize).toBe(16);
      expect(Typography.xl.fontSize).toBe(18);
      expect(Typography['2xl'].fontSize).toBe(20);
      expect(Typography['3xl'].fontSize).toBe(24);
      expect(Typography['4xl'].fontSize).toBe(30);
      expect(Typography['5xl'].fontSize).toBe(36);
    });

    it('should have line heights greater than font sizes', () => {
      Object.values(Typography).forEach((style) => {
        expect(style.lineHeight).toBeGreaterThan(style.fontSize);
      });
    });
  });

  describe('FontWeights', () => {
    it('should have all weight variants', () => {
      expect(FontWeights.thin).toBe('100');
      expect(FontWeights.extralight).toBe('200');
      expect(FontWeights.light).toBe('300');
      expect(FontWeights.normal).toBe('400');
      expect(FontWeights.medium).toBe('500');
      expect(FontWeights.semibold).toBe('600');
      expect(FontWeights.bold).toBe('700');
      expect(FontWeights.extrabold).toBe('800');
      expect(FontWeights.black).toBe('900');
    });
  });

  describe('Fonts', () => {
    it('should have font family definitions', () => {
      expect(Fonts).toBeDefined();
      expect(Fonts?.sans).toBeDefined();
      expect(Fonts?.serif).toBeDefined();
      expect(Fonts?.mono).toBeDefined();
    });
  });
});

describe('Design System - Spacing', () => {
  it('should have all spacing scale values', () => {
    expect(Spacing[0]).toBe(0);
    expect(Spacing[0.5]).toBe(2);
    expect(Spacing[1]).toBe(4);
    expect(Spacing[1.5]).toBe(6);
    expect(Spacing[2]).toBe(8);
    expect(Spacing[3]).toBe(12);
    expect(Spacing[4]).toBe(16);
    expect(Spacing[5]).toBe(20);
    expect(Spacing[6]).toBe(24);
    expect(Spacing[8]).toBe(32);
    expect(Spacing[10]).toBe(40);
    expect(Spacing[12]).toBe(48);
    expect(Spacing[16]).toBe(64);
    expect(Spacing[20]).toBe(80);
    expect(Spacing[24]).toBe(96);
  });

  it('should follow a consistent 4px base unit pattern', () => {
    expect(Spacing[1]).toBe(4 * 1);
    expect(Spacing[2]).toBe(4 * 2);
    expect(Spacing[4]).toBe(4 * 4);
    expect(Spacing[8]).toBe(4 * 8);
  });
});

describe('Design System - Border Radius', () => {
  it('should have all radius size variants', () => {
    expect(BorderRadius.none).toBe(0);
    expect(BorderRadius.xs).toBe(2);
    expect(BorderRadius.sm).toBe(4);
    expect(BorderRadius.md).toBe(8);
    expect(BorderRadius.lg).toBe(12);
    expect(BorderRadius.xl).toBe(16);
    expect(BorderRadius['2xl']).toBe(24);
    expect(BorderRadius['3xl']).toBe(32);
    expect(BorderRadius.full).toBe(9999);
  });

  it('should have increasing values', () => {
    expect(BorderRadius.none).toBeLessThan(BorderRadius.xs);
    expect(BorderRadius.xs).toBeLessThan(BorderRadius.sm);
    expect(BorderRadius.sm).toBeLessThan(BorderRadius.md);
    expect(BorderRadius.md).toBeLessThan(BorderRadius.lg);
    expect(BorderRadius.lg).toBeLessThan(BorderRadius.xl);
    expect(BorderRadius.xl).toBeLessThan(BorderRadius['2xl']);
    expect(BorderRadius['2xl']).toBeLessThan(BorderRadius['3xl']);
    expect(BorderRadius['3xl']).toBeLessThan(BorderRadius.full);
  });
});

describe('Design System - Shadows', () => {
  it('should have all shadow size variants', () => {
    expect(Shadows.sm).toBeDefined();
    expect(Shadows.md).toBeDefined();
    expect(Shadows.lg).toBeDefined();
    expect(Shadows.xl).toBeDefined();
  });

  it('should have shadow properties', () => {
    // Test that shadows are platform-selected ViewStyle objects
    const smShadow = Shadows.sm;
    expect(smShadow).toBeDefined();

    // Shadows should be objects with shadow properties or elevation
    if (smShadow && 'elevation' in smShadow) {
      expect(typeof smShadow.elevation).toBe('number');
    } else if (smShadow && 'shadowColor' in smShadow) {
      expect(smShadow.shadowColor).toBeDefined();
      expect(smShadow.shadowOffset).toBeDefined();
      expect(smShadow.shadowOpacity).toBeDefined();
      expect(smShadow.shadowRadius).toBeDefined();
    }
  });
});

describe('Design System - Animation Durations', () => {
  it('should have all duration presets', () => {
    expect(AnimationDurations.instant).toBe(100);
    expect(AnimationDurations.fast).toBe(150);
    expect(AnimationDurations.normal).toBe(250);
    expect(AnimationDurations.slow).toBe(350);
    expect(AnimationDurations.slower).toBe(500);
  });

  it('should have increasing duration values', () => {
    expect(AnimationDurations.instant).toBeLessThan(AnimationDurations.fast);
    expect(AnimationDurations.fast).toBeLessThan(AnimationDurations.normal);
    expect(AnimationDurations.normal).toBeLessThan(AnimationDurations.slow);
    expect(AnimationDurations.slow).toBeLessThan(AnimationDurations.slower);
  });
});

describe('Design System - Z-Index', () => {
  it('should have all z-index levels', () => {
    expect(ZIndex.behind).toBe(-1);
    expect(ZIndex.base).toBe(0);
    expect(ZIndex.raised).toBe(10);
    expect(ZIndex.dropdown).toBe(100);
    expect(ZIndex.sticky).toBe(200);
    expect(ZIndex.fixed).toBe(300);
    expect(ZIndex.modal).toBe(400);
    expect(ZIndex.popover).toBe(500);
    expect(ZIndex.toast).toBe(600);
    expect(ZIndex.max).toBe(9999);
  });

  it('should have increasing z-index values (except behind)', () => {
    expect(ZIndex.behind).toBeLessThan(ZIndex.base);
    expect(ZIndex.base).toBeLessThan(ZIndex.raised);
    expect(ZIndex.raised).toBeLessThan(ZIndex.dropdown);
    expect(ZIndex.dropdown).toBeLessThan(ZIndex.sticky);
    expect(ZIndex.sticky).toBeLessThan(ZIndex.fixed);
    expect(ZIndex.fixed).toBeLessThan(ZIndex.modal);
    expect(ZIndex.modal).toBeLessThan(ZIndex.popover);
    expect(ZIndex.popover).toBeLessThan(ZIndex.toast);
    expect(ZIndex.toast).toBeLessThan(ZIndex.max);
  });
});

describe('Design System - Type Exports', () => {
  it('should export ColorTheme type correctly', () => {
    const theme: ColorTheme = 'light';
    expect(['light', 'dark']).toContain(theme);
  });

  it('should export ColorToken type correctly', () => {
    const token: ColorToken = 'primary';
    expect(Colors.light[token]).toBeDefined();
  });

  it('should export TypographySize type correctly', () => {
    const size: TypographySize = 'base';
    expect(Typography[size]).toBeDefined();
  });

  it('should export SpacingSize type correctly', () => {
    const size: SpacingSize = 4;
    expect(Spacing[size]).toBe(16);
  });

  it('should export BorderRadiusSize type correctly', () => {
    const size: BorderRadiusSize = 'md';
    expect(BorderRadius[size]).toBe(8);
  });

  it('should export ShadowSize type correctly', () => {
    const size: ShadowSize = 'md';
    expect(Shadows[size]).toBeDefined();
  });

  it('should export FontWeight type correctly', () => {
    const weight: FontWeight = 'bold';
    expect(FontWeights[weight]).toBe('700');
  });
});
