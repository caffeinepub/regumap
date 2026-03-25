import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCheck, FileCheck, Info, Share2 } from "lucide-react";
import { useState } from "react";
import AppLayout from "../components/AppLayout";

type NotificationType = "mapping" | "shared" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "mapping",
    title: "Mapping Complete",
    description:
      'Your CFR Part 11 mapping for "Patient Portal Login Flow" has finished with 14 rows generated.',
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "shared",
    title: "Project Shared With You",
    description:
      'admin@company.com shared the "GDPR Data Retention Policy" project with you.',
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "system",
    title: "System Update",
    description:
      "ReguMap has been updated to v2.4.1. New CFR Part 11 clause templates have been added.",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: "n4",
    type: "mapping",
    title: "Mapping Complete",
    description:
      'Your HIPAA mapping for "Access Control Review" finished with 18 rows and 15 mapped.',
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "n5",
    type: "shared",
    title: "Project Shared With You",
    description:
      'qa@company.com shared "ISO 13485 Design Controls" with you and 2 others.',
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "system",
    title: "Regulatory Update",
    description:
      "GDPR Article 25 guidance has been updated. Review your existing GDPR projects for compliance.",
    timestamp: "4 days ago",
    read: true,
  },
  {
    id: "n7",
    type: "mapping",
    title: "Mapping Complete",
    description:
      'Your SOC 2 mapping for "Cloud Infrastructure Review" finished with 22 rows.',
    timestamp: "5 days ago",
    read: true,
  },
  {
    id: "n8",
    type: "system",
    title: "Welcome to ReguMap",
    description:
      "Your account was created successfully. Start by running your first regulatory mapping.",
    timestamp: "1 week ago",
    read: true,
  },
];

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  mapping: FileCheck,
  shared: Share2,
  system: Info,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  mapping: "bg-green-50 text-green-600",
  shared: "bg-blue-50 text-blue-600",
  system: "bg-amber-50 text-amber-600",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  const displayed =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <AppLayout
      title="Notifications"
      subtitle={
        unreadCount > 0
          ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
          : "You're all caught up."
      }
    >
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | "unread")}
          >
            <TabsList>
              <TabsTrigger data-ocid="notifications.all.tab" value="all">
                All
              </TabsTrigger>
              <TabsTrigger data-ocid="notifications.unread.tab" value="unread">
                Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {unreadCount > 0 && (
            <Button
              data-ocid="notifications.mark_all_read.button"
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="text-sm"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
              Mark all as read
            </Button>
          )}
        </div>

        {displayed.length === 0 ? (
          <div
            data-ocid="notifications.empty_state"
            className="py-16 text-center"
          >
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No unread notifications.
            </p>
          </div>
        ) : (
          <div data-ocid="notifications.list" className="space-y-2">
            {displayed.map((notif, i) => {
              const Icon = TYPE_ICON[notif.type];
              const colorClass = TYPE_COLOR[notif.type];
              return (
                <button
                  key={notif.id}
                  type="button"
                  data-ocid={`notifications.item.${i + 1}`}
                  onClick={() => markRead(notif.id)}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    notif.read
                      ? "bg-card border-border hover:bg-accent/30"
                      : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {notif.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {notif.timestamp}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
