import { useState, useCallback, useEffect, useRef } from "react";

export type NotificationType = "info" | "success" | "warning" | "error" | "reminder";
export type NotificationChannel = "in-app" | "email" | "sms" | "push";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  appointmentReminders: boolean;
  statusUpdates: boolean;
  documentRequests: boolean;
  renewalReminders: boolean;
}

const STORAGE_KEY = "bpms_notifications";
const PREFS_KEY = "bpms_notification_prefs";

const DEFAULT_PREFS: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: true,
  pushEnabled: false,
  appointmentReminders: true,
  statusUpdates: true,
  documentRequests: true,
  renewalReminders: true,
};

function loadNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<{
      id: string;
      type: NotificationType;
      title: string;
      message: string;
      channel: NotificationChannel;
      read: boolean;
      createdAt: string;
      expiresAt?: string;
      actionUrl?: string;
      actionLabel?: string;
      metadata?: Record<string, unknown>;
    }>;
    return parsed.map((n) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
    }));
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // Storage quota exceeded — ignore
  }
}

function loadPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    if (!stored) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadNotifications()
  );
  const [preferences, setPreferences] = useState<NotificationPreferences>(() =>
    loadPreferences()
  );
  const listenerRef = useRef<Array<(n: Notification) => void>>([]);

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Persist preferences whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  const addNotification = useCallback(
    (
      partial: Omit<Notification, "id" | "read" | "createdAt">
    ): Notification => {
      const notification: Notification = {
        ...partial,
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 100));
      listenerRef.current.forEach((cb) => cb(notification));
      return notification;
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback(
    (updates: Partial<NotificationPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const onNewNotification = useCallback(
    (callback: (n: Notification) => void) => {
      listenerRef.current.push(callback);
      return () => {
        listenerRef.current = listenerRef.current.filter((cb) => cb !== callback);
      };
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updatePreferences,
    onNewNotification,
  };
}
