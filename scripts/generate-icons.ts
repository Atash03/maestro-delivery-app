/**
 * Maestro App Icon Generator
 *
 * This script generates all required app icons for iOS, Android, and Web
 * using the Maestro brand colors and a custom food delivery icon design.
 *
 * Usage: npx tsx scripts/generate-icons.ts
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Brand colors from theme.ts
const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#C44A22',
  primaryLight: '#FFF5F0',
  white: '#FFFFFF',
  darkBg: '#0A0A0A',
};

// Icon output directory
const OUTPUT_DIR = path.join(__dirname, '../src/assets/images');

/**
 * Generate a clean, simple icon that works well at all sizes
 */
function generateSimpleIconSVG(
  size: number,
  variant: 'standard' | 'foreground' | 'monochrome' | 'splash' = 'standard'
): string {
  const isSplash = variant === 'splash';
  const isMonochrome = variant === 'monochrome';
  const isForeground = variant === 'foreground';

  // For foreground icon, we need white elements on transparent background
  // For monochrome, we need black elements on transparent background (no outer shape)
  const needsBackground = !isForeground && !isMonochrome;
  const elementColor = isMonochrome
    ? '#000000'
    : isForeground
      ? COLORS.white
      : isSplash
        ? COLORS.primary
        : COLORS.white;
  const steamColor = isMonochrome
    ? '#000000'
    : isForeground
      ? COLORS.primary
      : isSplash
        ? COLORS.white
        : COLORS.primary;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${
    needsBackground
      ? `
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${isSplash ? COLORS.primaryLight : COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${isSplash ? COLORS.white : COLORS.primaryDark};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1024" height="1024" rx="${isSplash ? '0' : '220'}" fill="url(#bgGrad)"/>
  `
      : ''
  }

  <!-- Centered food bowl icon -->
  <g transform="translate(512, 530)">
    <!-- Shadow/reflection -->
    ${needsBackground ? `<ellipse cx="0" cy="150" rx="220" ry="50" fill="${COLORS.white}" opacity="0.1"/>` : ''}

    <!-- Plate/bowl base -->
    <ellipse cx="0" cy="90" rx="260" ry="75" fill="${elementColor}"/>

    <!-- Dome/cloche -->
    <path d="M-240,60 Q-240,-180 0,-230 Q240,-180 240,60 Z" fill="${elementColor}"/>

    <!-- Inner highlight on dome -->
    ${needsBackground ? `<path d="M-200,40 Q-200,-140 0,-185 Q200,-140 200,40 Z" fill="${isSplash ? COLORS.primaryDark : COLORS.primary}" opacity="0.15"/>` : ''}

    <!-- Steam lines forming abstract M -->
    <g stroke="${steamColor}" stroke-width="${isMonochrome ? '24' : '32'}" stroke-linecap="round" fill="none" ${needsBackground && !isSplash ? 'opacity="0.95"' : ''}>
      <path d="M-100,-160 C-120,-220 -80,-280 -100,-340"/>
      <path d="M0,-180 C-25,-260 25,-320 0,-400"/>
      <path d="M100,-160 C120,-220 80,-280 100,-340"/>
    </g>
  </g>
</svg>`.trim();
}

/**
 * Generate the Android adaptive icon background (solid color or pattern)
 */
function generateAdaptiveBackgroundSVG(size: number): string {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.primaryDark};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1024" height="1024" fill="url(#bgGrad)"/>
</svg>`.trim();
}

/**
 * Generate favicon optimized for small sizes
 */
function generateFaviconSVG(size: number): string {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.primaryDark};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="64" height="64" rx="12" fill="url(#bgGrad)"/>

  <!-- Simplified bowl -->
  <g transform="translate(32, 36)">
    <ellipse cx="0" cy="8" rx="18" ry="6" fill="${COLORS.white}"/>
    <path d="M-17,5 Q-17,-12 0,-16 Q17,-12 17,5 Z" fill="${COLORS.white}"/>

    <!-- Steam -->
    <g stroke="${COLORS.primary}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9">
      <path d="M-6,-12 Q-8,-18 -6,-24"/>
      <path d="M0,-14 Q-2,-22 0,-30"/>
      <path d="M6,-12 Q8,-18 6,-24"/>
    </g>
  </g>
</svg>`.trim();
}

async function generateIcon(
  svgContent: string,
  outputPath: string,
  width: number,
  height: number = width
): Promise<void> {
  const buffer = Buffer.from(svgContent);

  await sharp(buffer)
    .resize(width, height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outputPath);

  console.log(`Generated: ${path.basename(outputPath)} (${width}x${height})`);
}

async function main() {
  console.log('🍽️  Maestro App Icon Generator\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // 1. Main app icon (1024x1024) - iOS and general use
    console.log('Generating main app icon...');
    await generateIcon(
      generateSimpleIconSVG(1024, 'standard'),
      path.join(OUTPUT_DIR, 'icon.png'),
      1024
    );

    // 2. Android adaptive icon foreground (1024x1024 with safe zone)
    console.log('\nGenerating Android adaptive icons...');
    await generateIcon(
      generateSimpleIconSVG(1024, 'foreground'),
      path.join(OUTPUT_DIR, 'android-icon-foreground.png'),
      1024
    );

    // 3. Android adaptive icon background
    await generateIcon(
      generateAdaptiveBackgroundSVG(1024),
      path.join(OUTPUT_DIR, 'android-icon-background.png'),
      1024
    );

    // 4. Android monochrome icon (for themed icons on Android 13+)
    await generateIcon(
      generateSimpleIconSVG(1024, 'monochrome'),
      path.join(OUTPUT_DIR, 'android-icon-monochrome.png'),
      1024
    );

    // 5. Splash screen icon (centered, smaller, for splash screen)
    console.log('\nGenerating splash screen icon...');
    await generateIcon(
      generateSimpleIconSVG(512, 'splash'),
      path.join(OUTPUT_DIR, 'splash-icon.png'),
      512
    );

    // 6. Favicon for web (64x64)
    console.log('\nGenerating web favicon...');
    await generateIcon(generateFaviconSVG(64), path.join(OUTPUT_DIR, 'favicon.png'), 64);

    console.log('\n✅ All icons generated successfully!');
    console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
