/**
 * ToastProvider component
 *
 * A context provider that manages toast notifications globally.
 * Wrap your app with this provider to use the useToast hook.
 */

import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Toast, type ToastProps, type ToastType } from './toast';

export interface ToastOptions {
  /** Type of toast */
  type?: ToastType;
  /** Optional title */
  title?: string;
  /** Duration in milliseconds (default: 4000, 0 = persistent) */
  duration?: number;
  /** Whether the toast can be dismissed by tapping */
  dismissible?: boolean;
  /** Optional action button */
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  /** Show a toast notification */
  showToast: (message: string, options?: ToastOptions) => string;
  /** Show a success toast */
  showSuccess: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  /** Show an error toast */
  showError: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  /** Show a warning toast */
  showWarning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  /** Show an info toast */
  showInfo: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  /** Dismiss a specific toast by ID */
  dismissToast: (id: string) => void;
  /** Dismiss all toasts */
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastState extends Omit<ToastProps, 'onDismiss'> {
  id: string;
}

interface ToastProviderProps {
  children: ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
}

/**
 * Generate a unique toast ID
 */
function generateToastId(): string {
  return `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * ToastProvider - Global toast notification manager
 *
 * @example
 * // In your app root
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // In any component
 * const { showSuccess, showError } = useToast();
 *
 * showSuccess('Order placed!');
 * showError('Something went wrong');
 */
export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions): string => {
      const id = generateToastId();
      const newToast: ToastState = {
        id,
        type: options?.type ?? 'info',
        message,
        title: options?.title,
        duration: options?.duration,
        dismissible: options?.dismissible,
        action: options?.action,
      };

      setToasts((prev) => {
        // Limit the number of toasts
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const showSuccess = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>): string => {
      return showToast(message, { ...options, type: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>): string => {
      return showToast(message, { ...options, type: 'error' });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>): string => {
      return showToast(message, { ...options, type: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>): string => {
      return showToast(message, { ...options, type: 'info' });
    },
    [showToast]
  );

  const value: ToastContextValue = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container - rendered at root level */}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <View
            key={toast.id}
            style={[styles.toastWrapper, { top: index * 80 }]}
            pointerEvents="box-none"
          >
            <Toast {...toast} onDismiss={dismissToast} />
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

/**
 * useToast - Hook to access toast notifications
 *
 * @throws Error if used outside of ToastProvider
 *
 * @example
 * const { showSuccess, showError } = useToast();
 *
 * // Show success toast
 * showSuccess('Item added to cart!');
 *
 * // Show error toast with title
 * showError('Please try again', { title: 'Payment Failed' });
 *
 * // Show toast with action
 * showInfo('Item removed', {
 *   action: { label: 'Undo', onPress: () => undoRemove() }
 * });
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
});
