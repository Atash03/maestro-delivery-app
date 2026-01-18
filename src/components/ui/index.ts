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
export { EmptyState, type EmptyStateProps, type EmptyStateVariant } from './empty-state';
export { Input, type InputProps } from './input';
export { NetworkError, type NetworkErrorProps } from './network-error';
export {
  Skeleton,
  SkeletonCard,
  type SkeletonCardProps,
  type SkeletonProps,
  SkeletonText,
  type SkeletonTextProps,
  type SkeletonVariant,
} from './skeleton';
export { Toast, type ToastProps, type ToastType } from './toast';
export { type ToastOptions, ToastProvider, useToast } from './toast-provider';
