/**
 * OptimizedImage Component
 *
 * A performance-optimized image component built on top of expo-image.
 * Features:
 * - Automatic caching with memory and disk cache policies
 * - Placeholder support with fade-in transition
 * - Blurhash placeholder for smooth loading experience
 * - Recycling optimization for list views
 * - Priority loading support for above-the-fold images
 */

import { Image, type ImageContentFit, type ImageProps } from 'expo-image';
import { memo, useMemo } from 'react';
import { type ImageStyle, type StyleProp, StyleSheet } from 'react-native';

import { NeutralColors } from '@/constants/theme';

// ============================================================================
// Types
// ============================================================================

export interface OptimizedImageProps extends Omit<ImageProps, 'cachePolicy' | 'recyclingKey'> {
  /** The image source URI */
  uri: string;
  /** Optional placeholder blurhash string for loading state */
  blurhash?: string;
  /** Image content fit mode */
  contentFit?: ImageContentFit;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** Priority level for image loading */
  priority?: 'low' | 'normal' | 'high';
  /** Enable recycling optimization (recommended for list items) */
  recyclingKey?: string;
  /** Style for the image */
  style?: StyleProp<ImageStyle>;
  /** Whether this image is for a list item (enables additional optimizations) */
  isListItem?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TRANSITION_DURATION = 200;

// Default blurhash placeholder (a neutral gray)
const DEFAULT_BLURHASH = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

// ============================================================================
// Component
// ============================================================================

export const OptimizedImage = memo(function OptimizedImage({
  uri,
  blurhash = DEFAULT_BLURHASH,
  contentFit = 'cover',
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  priority = 'normal',
  recyclingKey,
  style,
  isListItem = false,
  ...props
}: OptimizedImageProps) {
  // Build source object with optimizations
  const source = useMemo(() => {
    if (!uri) return undefined;

    return {
      uri,
      // Add cache headers for better caching
      headers: {
        'Cache-Control': 'max-age=604800', // Cache for 7 days
      },
    };
  }, [uri]);

  // Build placeholder props
  const placeholderProps = useMemo(
    () =>
      blurhash
        ? {
            placeholder: { blurhash },
            placeholderContentFit: 'cover' as ImageContentFit,
          }
        : {},
    [blurhash]
  );

  // Determine cache policy based on usage context
  const cachePolicy = isListItem ? 'memory-disk' : 'memory-disk';

  // Map priority to expo-image priority prop
  const imagePriority = priority === 'high' ? 'high' : priority === 'low' ? 'low' : 'normal';

  if (!source) {
    return null;
  }

  return (
    <Image
      {...props}
      source={source}
      {...placeholderProps}
      contentFit={contentFit}
      transition={transitionDuration}
      cachePolicy={cachePolicy}
      recyclingKey={recyclingKey}
      priority={imagePriority}
      style={[styles.image, style]}
    />
  );
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  image: {
    backgroundColor: NeutralColors[100],
  },
});

// ============================================================================
// Exports
// ============================================================================

export default OptimizedImage;
