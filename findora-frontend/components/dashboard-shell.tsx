"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessagesSquare,
  Bell,
  Search,
  User as UserIcon,
  Settings,
  LogOut,
  Plus,
  MapPin,
  Shield,
} from "lucide-react";
import { Logo } from "./logo";
import { Avatar } from "./ui-bits";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { useUserSocket, useLiveNotifications } from "@/lib/socket";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-reports", label: "My Reports", icon: FileText },
  { href: "/matches", label: "Matches", icon: MapPin },
  { href: "/search", label: "Search / Explore", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "My Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [query, setQuery] = useState("");

  // Joins this user's private Socket.IO room so the server can push
  // real-time match/notification/chat events straight to this browser tab.
  useUserSocket();
  const liveNotification = useLiveNotifications();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!liveNotification) return;
    setToast(liveNotification.title);
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [liveNotification]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="size-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-800/50 bg-brand-ink px-4 py-6 lg:flex">
        <Logo dark />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-brand-indigo text-white shadow-sm shadow-brand-indigo/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
          {(user.role === "admin" || user.role === "police") && (
            <Link
              href={user.role === "admin" ? "/admin" : "/police"}
              className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Shield className="size-4.5" />
              {user.role === "admin" ? "Admin Dashboard" : "Police Dashboard"}
            </Link>
          )}
        </nav>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4.5" />
          Log out
        </button>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="relative hidden flex-1 max-w-md sm:block"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items, categories, locations..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/report"
              className="hidden items-center gap-1.5 rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-indigo/30 transition hover:bg-brand-indigo-dark sm:flex"
            >
              <Plus className="size-4" /> Report
            </Link>
            <Link
              href="/notifications"
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <Bell className="size-4.5" />
            </Link>
            <Link href="/profile">
              <Avatar name={user.name} src={user.avatar} size={9} />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-xs items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/10 animate-in slide-in-from-bottom-4">
          <Bell className="mt-0.5 size-4 shrink-0 text-brand-indigo" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{toast}</p>
            <p className="text-xs text-slate-500">Real-time update via Socket.IO</p>
          </div>
        </div>
      )}
    </div>
  );
}
