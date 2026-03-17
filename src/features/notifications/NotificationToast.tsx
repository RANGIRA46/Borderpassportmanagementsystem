import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X, Bell } from "lucide-react";
import { useNotification, Notification } from "./hooks/useNotification";

interface NotificationToastProps {
  maxVisible?: number;
}

const ICON_MAP = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  reminder: Bell,
};

const COLOR_MAP: Record<Notification["type"], string> = {
  success: "border-l-4 border-l-green-500 bg-white dark:bg-[#1a1a1a]",
  error: "border-l-4 border-l-red-500 bg-white dark:bg-[#1a1a1a]",
  warning: "border-l-4 border-l-yellow-500 bg-white dark:bg-[#1a1a1a]",
  info: "border-l-4 border-l-blue-500 bg-white dark:bg-[#1a1a1a]",
  reminder: "border-l-4 border-l-purple-500 bg-white dark:bg-[#1a1a1a]",
};

const ICON_COLOR_MAP: Record<Notification["type"], string> = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  reminder: "text-purple-500",
};

// Auto-dismiss delay in ms (0 = no auto-dismiss)
const AUTO_DISMISS: Record<Notification["type"], number> = {
  success: 5000,
  error: 0,
  warning: 8000,
  info: 5000,
  reminder: 0,
};

export function NotificationToast({ maxVisible = 4 }: NotificationToastProps) {
  const { notifications, removeNotification, onNewNotification } = useNotification();

  // Auto-dismiss toasts
  useEffect(() => {
    const unsubscribe = onNewNotification((n) => {
      const delay = AUTO_DISMISS[n.type];
      if (delay > 0) {
        setTimeout(() => removeNotification(n.id), delay);
      }
    });
    return unsubscribe;
  }, [onNewNotification, removeNotification]);

  const recent = notifications.slice(0, maxVisible).filter((n) => !n.read);

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {recent.map((notification) => {
          const Icon = ICON_MAP[notification.type];
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`pointer-events-auto w-80 rounded-lg shadow-xl ${
                COLOR_MAP[notification.type]
              } flex items-start gap-3 p-4`}
              role="alert"
            >
              <Icon
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  ICON_COLOR_MAP[notification.type]
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                {notification.actionUrl && notification.actionLabel && (
                  <a
                    href={notification.actionUrl}
                    className="mt-1 text-xs font-medium text-primary hover:underline inline-block"
                  >
                    {notification.actionLabel}
                  </a>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
