/**
 * Animation Component Library
 *
 * Re-exports all animation wrapper components for easy importing:
 * import { FadeIn, SlideUp, ScalePress, StaggerList } from '@/components/animations';
 *
 * All components use react-native-reanimated's entering/exiting props
 * for smooth, native-driven animations.
 */

export { FadeIn, type FadeInProps } from './fade-in';
export { ScalePress, type ScalePressProps } from './scale-press';
export { type SlideDirection, SlideUp, type SlideUpProps } from './slide-up';
export {
  type StaggerAnimationType,
  StaggerChild,
  type StaggerChildProps,
  StaggerList,
  type StaggerListProps,
} from './stagger-list';
