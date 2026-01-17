/**
 * UI Component Library
 *
 * Re-exports all base UI components for easy importing:
 * import { Button, Input, Card } from '@/components/ui';
 */

export {
  Avatar,
  AvatarGroup,
  type AvatarGroupProps,
  type AvatarProps,
  type AvatarSize,
} from './avatar';
export { Badge, type BadgeProps, type BadgeSize, type BadgeVariant } from './badge';
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './button';
export { Card, type CardProps, type CardVariant } from './card';
export { Divider, type DividerOrientation, type DividerProps } from './divider';
export { Input, type InputProps } from './input';
export {
  Skeleton,
  SkeletonCard,
  type SkeletonCardProps,
  type SkeletonProps,
  SkeletonText,
  type SkeletonTextProps,
  type SkeletonVariant,
} from './skeleton';
