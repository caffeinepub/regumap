import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { getUserId, logout } from "../services/authService";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Projects", icon: FolderOpen, path: "/projects" },
  { label: "Regulations Base", icon: BookOpen, path: "/regulations" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
}

export default function AppLayout({
  children,
  title,
  subtitle,
  headerRight,
}: AppLayoutProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const userId = getUserId() || "User";
  const initials = userId.slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground tracking-tight">
            ReguMap
          </span>
        </div>

        <div className="px-4 pt-4 pb-2">
          <button
            type="button"
            data-ocid="nav.new_project.button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full flex items-center justify-center gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <nav
          className="flex-1 px-3 py-2 space-y-0.5"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                onClick={() => navigate({ to: item.path })}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userId}
              </p>
              <p className="text-xs text-muted-foreground">Member</p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="nav.logout.button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-card border-b border-border flex items-center px-6 gap-4">
          <div className="flex-1" />
          {headerRight}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              data-ocid="header.search_input"
              type="text"
              placeholder="Search..."
              className="h-8 pl-9 pr-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring/40 w-52"
            />
          </div>
          <button
            type="button"
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            data-ocid="header.bell.button"
            onClick={() => navigate({ to: "/notifications" })}
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {initials}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {children}
          <footer className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
