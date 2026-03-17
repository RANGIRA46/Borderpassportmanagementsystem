/**
 * Browser push notification service.
 *
 * Handles Service-Worker registration, permission requests, and sending
 * local/FCM push notifications.  FCM integration requires a valid VAPID
 * public key supplied via the VITE_VAPID_PUBLIC_KEY environment variable.
 */

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
}

export interface PushResult {
  success: boolean;
  error?: string;
}

const VAPID_PUBLIC_KEY =
  typeof window !== "undefined"
    ? (import.meta as unknown as { env: Record<string, string> }).env
        ?.VITE_VAPID_PUBLIC_KEY ?? ""
    : "";

// ── Helpers ──────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// ── Service Worker registration ───────────────────────────────────────────────

let _swRegistration: ServiceWorkerRegistration | null = null;

export async function registerServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    _swRegistration = reg;
    console.info("[pushService] Service Worker registered", reg.scope);
    return true;
  } catch (err) {
    console.warn("[pushService] Service Worker registration failed", err);
    return false;
  }
}

// ── Permission handling ───────────────────────────────────────────────────────

export async function requestPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}

export function getPermission(): NotificationPermission {
  if (!("Notification" in window)) return "denied";
  return Notification.permission;
}

// ── Web Push subscription ─────────────────────────────────────────────────────

export async function subscribeToWebPush(): Promise<PushSubscription | null> {
  const permission = await requestPermission();
  if (permission !== "granted") return null;

  const reg = _swRegistration ?? (await navigator.serviceWorker.ready);
  if (!reg.pushManager) return null;

  try {
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    if (!VAPID_PUBLIC_KEY) {
      console.warn("[pushService] VAPID public key not configured");
      return null;
    }

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    return subscription;
  } catch (err) {
    console.warn("[pushService] Push subscription failed", err);
    return null;
  }
}

// ── Local (non-FCM) notifications ─────────────────────────────────────────────

export async function showLocalNotification(
  payload: PushPayload
): Promise<PushResult> {
  const permission = await requestPermission();
  if (permission !== "granted") {
    return { success: false, error: "permission_denied" };
  }

  try {
    if (_swRegistration) {
      await _swRegistration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon ?? "/icons/icon-192.png",
        badge: payload.badge ?? "/icons/badge-72.png",
        tag: payload.tag,
        data: payload.data,
        actions: payload.actions,
        requireInteraction: payload.requireInteraction ?? false,
      });
    } else {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon ?? "/icons/icon-192.png",
        tag: payload.tag,
      });
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "notification_failed",
    };
  }
}

// ── Typed helpers ─────────────────────────────────────────────────────────────

export function notifyAppointmentReminder(
  appointmentDate: string,
  location: string
): Promise<PushResult> {
  return showLocalNotification({
    title: "Appointment Reminder",
    body: `Your appointment is on ${appointmentDate} at ${location}.`,
    tag: "appointment",
    requireInteraction: true,
    actions: [
      { action: "view", title: "View Details" },
      { action: "dismiss", title: "Dismiss" },
    ],
  });
}

export function notifyStatusUpdate(
  referenceNumber: string,
  newStatus: string
): Promise<PushResult> {
  return showLocalNotification({
    title: "Application Status Updated",
    body: `Application ${referenceNumber}: ${newStatus}`,
    tag: `status-${referenceNumber}`,
  });
}

export function notifyDocumentRequest(referenceNumber: string): Promise<PushResult> {
  return showLocalNotification({
    title: "Documents Required",
    body: `Please upload the requested documents for ${referenceNumber}.`,
    tag: `docs-${referenceNumber}`,
    requireInteraction: true,
    actions: [{ action: "upload", title: "Upload Now" }],
  });
}

export function notifyRenewalReminder(expiryDate: string): Promise<PushResult> {
  return showLocalNotification({
    title: "Passport Expiry Reminder",
    body: `Your passport expires on ${expiryDate}. Start your renewal now.`,
    tag: "renewal-reminder",
    requireInteraction: true,
    actions: [
      { action: "renew", title: "Renew Now" },
      { action: "dismiss", title: "Later" },
    ],
  });
}
