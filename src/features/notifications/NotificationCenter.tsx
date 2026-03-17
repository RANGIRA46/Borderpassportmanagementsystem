import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Trash2,
  CheckCheck,
  Settings,
  Clock,
  Filter,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  useNotification,
  Notification,
  NotificationType,
} from "./hooks/useNotification";

interface NotificationCenterProps {
  onClose?: () => void;
}

const ICON_MAP: Record<NotificationType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  reminder: Bell,
};

const ICON_COLOR_MAP: Record<NotificationType, string> = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  reminder: "text-purple-500",
};

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function NotificationCenter({ onClose: _onClose }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updatePreferences,
  } = useNotification();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const displayed = notifications.filter((n) =>
    filter === "unread" ? !n.read : true
  );

  function NotificationItem({ n }: { n: Notification }) {
    const Icon = ICON_MAP[n.type];
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors group ${
          n.read
            ? "bg-transparent hover:bg-gray-50 dark:hover:bg-white/5"
            : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
        }`}
        onClick={() => markAsRead(n.id)}
      >
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={`h-5 w-5 ${ICON_COLOR_MAP[n.type]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm ${
                n.read
                  ? "font-normal text-gray-700 dark:text-gray-300"
                  : "font-semibold text-gray-900 dark:text-white"
              } truncate`}
            >
              {n.title}
            </p>
            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
              {formatRelativeTime(n.createdAt)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {n.message}
          </p>
          {n.actionUrl && n.actionLabel && (
            <a
              href={n.actionUrl}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 text-xs font-medium text-primary hover:underline inline-block"
            >
              {n.actionLabel} →
            </a>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(n.id);
          }}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-opacity"
          aria-label="Delete notification"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    );
  }

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="w-full rounded-none border-b dark:border-white/10 bg-transparent h-auto p-0">
        <TabsTrigger
          value="notifications"
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs"
        >
          <Bell className="h-3.5 w-3.5 mr-1.5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-xs">
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="preferences"
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs"
        >
          <Settings className="h-3.5 w-3.5 mr-1.5" />
          Settings
        </TabsTrigger>
      </TabsList>

      {/* Notifications tab */}
      <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-white/10">
          <div className="flex items-center gap-1">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setFilter("all")}
            >
              <Filter className="h-3 w-3 mr-1" />
              All
            </Button>
            <Button
              variant={filter === "unread" ? "secondary" : "ghost"}
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setFilter("unread")}
            >
              <Clock className="h-3 w-3 mr-1" />
              Unread
            </Button>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 text-destructive hover:text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[340px]">
          <div className="p-2 space-y-1">
            <AnimatePresence initial={false}>
              {displayed.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Bell className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    You'll see updates about your applications here
                  </p>
                </motion.div>
              ) : (
                displayed.map((n) => <NotificationItem key={n.id} n={n} />)
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </TabsContent>

      {/* Preferences tab */}
      <TabsContent
        value="preferences"
        className="mt-0 focus-visible:outline-none"
      >
        <ScrollArea className="h-[380px]">
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Channels
              </h4>
              <div className="space-y-3">
                {(
                  [
                    { key: "emailEnabled", label: "Email notifications" },
                    { key: "smsEnabled", label: "SMS notifications" },
                    { key: "pushEnabled", label: "Browser push notifications" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                    <Switch
                      id={key}
                      checked={preferences[key]}
                      onCheckedChange={(v) => updatePreferences({ [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Notification types
              </h4>
              <div className="space-y-3">
                {(
                  [
                    { key: "appointmentReminders", label: "Appointment reminders" },
                    { key: "statusUpdates", label: "Application status updates" },
                    { key: "documentRequests", label: "Document upload requests" },
                    { key: "renewalReminders", label: "Passport renewal reminders" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                    <Switch
                      id={key}
                      checked={preferences[key]}
                      onCheckedChange={(v) => updatePreferences({ [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
