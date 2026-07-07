"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Lock, LogOut, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    matchAlerts: true,
    messageAlerts: true,
    nearbyAlerts: false,
    emailDigest: true,
  });

  return (
    <DashboardShell>
      <h1 className="mb-6 font-heading text-2xl font-bold text-slate-900">Settings</h1>

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-slate-900">
            <Bell className="size-4.5 text-brand-indigo" /> Notification preferences
          </p>
          <div className="space-y-3">
            <Toggle
              label="Match alerts"
              description="Get notified when a possible match is found"
              checked={prefs.matchAlerts}
              onChange={(v) => setPrefs({ ...prefs, matchAlerts: v })}
            />
            <Toggle
              label="Message alerts"
              description="Get notified about new chat messages"
              checked={prefs.messageAlerts}
              onChange={(v) => setPrefs({ ...prefs, messageAlerts: v })}
            />
            <Toggle
              label="Nearby reports"
              description="Alert me about reports filed within 5km"
              checked={prefs.nearbyAlerts}
              onChange={(v) => setPrefs({ ...prefs, nearbyAlerts: v })}
            />
            <Toggle
              label="Weekly email digest"
              description="A summary of activity in your area"
              checked={prefs.emailDigest}
              onChange={(v) => setPrefs({ ...prefs, emailDigest: v })}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-slate-900">
            <Lock className="size-4.5 text-brand-indigo" /> Account
          </p>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <LogOut className="size-4" /> Log out
            </span>
          </button>
          <button className="mt-2 flex w-full items-center justify-between rounded-xl border border-red-100 px-4 py-3 text-sm font-medium text-brand-red hover:bg-red-50">
            <span className="flex items-center gap-2">
              <Trash2 className="size-4" /> Delete account
            </span>
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-indigo" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
