/**
 * StaggerList animation component
 *
 * Renders a list of items with staggered animations on mount.
 * Each item animates in sequence with configurable delay between items.
 */

import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import Animated, {
  type AnimatedProps,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';

export type StaggerAnimationType = 'fade' | 'slideUp' | 'slideDown';

export interface StaggerListProps<T> {
  /** Array of items to render */
  data: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Key extractor function */
  keyExtractor: (item: T, index: number) => string;
  /** Delay between each item's animation in milliseconds */
  staggerDelay?: number;
  /** Duration of each item's animation in milliseconds */
  itemDuration?: number;
  /** Initial delay before first item animates */
  initialDelay?: number;
  /** Type of animation for each item */
  animationType?: StaggerAnimationType;
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Custom style for each item wrapper */
  itemStyle?: StyleProp<ViewStyle>;
}

/**
 * StaggerListItem - Individual animated item wrapper
 */
interface StaggerListItemProps extends AnimatedProps<ViewStyle> {
  delay: number;
  duration: number;
  animationType: StaggerAnimationType;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function StaggerListItem({
  delay,
  duration,
  animationType,
  children,
  style,
}: StaggerListItemProps) {
  const getEntering = () => {
    switch (animationType) {
      case 'slideUp':
        return FadeInUp.duration(duration).delay(delay).springify().damping(20).stiffness(200);
      case 'slideDown':
        return FadeInDown.duration(duration).delay(delay).springify().damping(20).stiffness(200);
      default:
        return FadeIn.duration(duration).delay(delay);
    }
  };

  return (
    <Animated.View entering={getEntering()} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * StaggerList - Renders items with staggered animation
 *
 * @example
 * // Basic usage with fade animation
 * <StaggerList
 *   data={items}
 *   renderItem={(item) => <Text>{item.name}</Text>}
 *   keyExtractor={(item) => item.id}
 * />
 *
 * @example
 * // Slide up with custom timing
 * <StaggerList
 *   data={restaurants}
 *   renderItem={(restaurant) => <RestaurantCard {...restaurant} />}
 *   keyExtractor={(r) => r.id}
 *   animationType="slideUp"
 *   staggerDelay={100}
 *   itemDuration={300}
 * />
 *
 * @example
 * // With initial delay
 * <StaggerList
 *   data={menuItems}
 *   renderItem={(item) => <MenuItem {...item} />}
 *   keyExtractor={(item) => item.id}
 *   initialDelay={200}
 *   staggerDelay={50}
 * />
 */
export function StaggerList<T>({
  data,
  renderItem,
  keyExtractor,
  staggerDelay = 50,
  itemDuration = AnimationDurations.normal,
  initialDelay = 0,
  animationType = 'fade',
  style,
  itemStyle,
}: StaggerListProps<T>) {
  return (
    <View style={style}>
      {data.map((item, index) => {
        const delay = initialDelay + index * staggerDelay;
        const key = keyExtractor(item, index);

        return (
          <StaggerListItem
            key={key}
            delay={delay}
            duration={itemDuration}
            animationType={animationType}
            style={itemStyle}
          >
            {renderItem(item, index)}
          </StaggerListItem>
        );
      })}
    </View>
  );
}

/**
 * StaggerChild - Standalone component for staggering individual children
 * Useful when you want to manually control staggered animations
 */
export interface StaggerChildProps {
  /** Index of this child in the stagger sequence */
  index: number;
  /** Delay between each child in milliseconds */
  staggerDelay?: number;
  /** Initial delay before first child animates */
  initialDelay?: number;
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Type of animation */
  animationType?: StaggerAnimationType;
  /** Content to render */
  children: ReactNode;
  /** Custom style for the wrapper */
  style?: StyleProp<ViewStyle>;
}

/**
 * StaggerChild - Individual child with staggered animation
 *
 * @example
 * // Manual staggered children
 * {items.map((item, index) => (
 *   <StaggerChild key={item.id} index={index} animationType="slideUp">
 *     <Card>{item.title}</Card>
 *   </StaggerChild>
 * ))}
 */
export function StaggerChild({
  index,
  staggerDelay = 50,
  initialDelay = 0,
  duration = AnimationDurations.normal,
  animationType = 'fade',
  children,
  style,
}: StaggerChildProps) {
  const delay = initialDelay + index * staggerDelay;

  return (
    <StaggerListItem delay={delay} duration={duration} animationType={animationType} style={style}>
      {children}
    </StaggerListItem>
  );
}
