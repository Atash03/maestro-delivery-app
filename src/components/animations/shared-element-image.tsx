/**
 * SharedElementImage Component
 *
 * An image component that participates in shared element transitions.
 * Captures its layout and registers with the shared transition context
 * to enable smooth image transitions between screens.
 */

import { Image, type ImageContentFit, type ImageProps } from 'expo-image';
import { useCallback, useRef } from 'react';
import { type LayoutChangeEvent, StyleSheet, type View, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimationDurations, BorderRadius } from '@/constants/theme';
import { useSharedTransitionOptional } from '@/context';

// ============================================================================
// Types
// ============================================================================

export interface SharedElementImageProps {
  /** Unique identifier for this shared element */
  sharedId: string;
  /** Image source URI */
  uri: string;
  /** Image width */
  width: number | string;
  /** Image height */
  height: number | string;
  /** Border radius */
  borderRadius?: number;
  /** Content fit mode */
  contentFit?: ImageContentFit;
  /** Whether this is the source (origin) element */
  isSource?: boolean;
  /** Whether to animate entry */
  animateEntry?: boolean;
  /** Entry animation delay */
  entryDelay?: number;
  /** Additional image props */
  imageProps?: Partial<ImageProps>;
  /** Additional container style */
  style?: ViewStyle;
  /** Callback when layout is measured */
  onLayout?: (event: LayoutChangeEvent) => void;
  /** Test ID */
  testID?: string;
}

// ============================================================================
// Component
// ============================================================================

export function SharedElementImage({
  sharedId,
  uri,
  width,
  height,
  borderRadius = BorderRadius.lg,
  contentFit = 'cover',
  isSource = false,
  animateEntry = false,
  entryDelay = 0,
  imageProps,
  style,
  onLayout,
  testID,
}: SharedElementImageProps) {
  const sharedTransition = useSharedTransitionOptional();
  const viewRef = useRef<View>(null);

  // Animation values for the destination element
  const opacity = useSharedValue(animateEntry ? 0 : 1);
  const scale = useSharedValue(animateEntry ? 0.95 : 1);

  // Handle layout measurement
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);

      // If this is a source element, register its layout
      if (isSource && sharedTransition && viewRef.current) {
        viewRef.current.measureInWindow((x, y, measuredWidth, measuredHeight) => {
          sharedTransition.registerSourceElement(
            {
              id: sharedId,
              layout: {
                x,
                y,
                width: measuredWidth,
                height: measuredHeight,
              },
              imageUri: uri,
            },
            '' // Target route will be set by navigation
          );
        });
      }

      // Trigger entry animation for destination elements
      if (!isSource && animateEntry) {
        setTimeout(() => {
          opacity.value = withTiming(1, { duration: AnimationDurations.normal });
          scale.value = withTiming(1, { duration: AnimationDurations.normal });
        }, entryDelay);
      }
    },
    [isSource, sharedTransition, sharedId, uri, animateEntry, entryDelay, opacity, scale, onLayout]
  );

  // Animated style for destination elements
  const animatedStyle = useAnimatedStyle(() => {
    if (isSource) {
      return {};
    }
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Check if there's a matching source element for transition
  const sourceElement = sharedTransition?.getSourceElement(sharedId);
  const hasSourceTransition = !isSource && sourceElement !== null;

  return (
    <Animated.View
      ref={viewRef}
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
        },
        style,
        !isSource && animatedStyle,
      ]}
      onLayout={handleLayout}
      testID={testID}
    >
      {hasSourceTransition && animateEntry ? (
        <Animated.View entering={FadeIn.delay(entryDelay).duration(AnimationDurations.normal)}>
          <Image
            source={{ uri }}
            style={[styles.image, { borderRadius }]}
            contentFit={contentFit}
            transition={200}
            {...imageProps}
          />
        </Animated.View>
      ) : (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius }]}
          contentFit={contentFit}
          transition={200}
          {...imageProps}
        />
      )}
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

// ============================================================================
// Exports
// ============================================================================

export default SharedElementImage;
