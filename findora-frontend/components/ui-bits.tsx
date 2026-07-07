import { cn } from "@/lib/utils";
import { initials, resolveImage } from "@/lib/format";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    Lost: "bg-red-50 text-red-700 border-red-200",
    lost: "bg-red-50 text-red-700 border-red-200",
    Found: "bg-emerald-50 text-emerald-700 border-emerald-200",
    found: "bg-emerald-50 text-emerald-700 border-emerald-200",
    matched: "bg-amber-50 text-amber-700 border-amber-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    suggested: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    returned: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-slate-100 text-slate-500 border-slate-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const cls = map[status] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        cls
      )}
    >
      {status}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "indigo",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: "indigo" | "blue" | "green" | "orange" | "red";
}) {
  const accentMap = {
    indigo: "bg-indigo-50 text-brand-indigo",
    blue: "bg-blue-50 text-brand-blue",
    green: "bg-emerald-50 text-brand-green",
    orange: "bg-orange-50 text-brand-orange",
    red: "bg-red-50 text-brand-red",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", accentMap[accent])}>
          <Icon className="size-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-bold font-heading leading-tight text-slate-900">{value}</p>
          <p className="truncate text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function Avatar({
  name,
  src,
  size = 9,
}: {
  name?: string;
  src?: string | null;
  size?: 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20;
}) {
  const sizeMap: Record<number, string> = {
    6: "size-6 text-[10px]",
    7: "size-7 text-xs",
    8: "size-8 text-xs",
    9: "size-9 text-sm",
    10: "size-10 text-sm",
    12: "size-12 text-base",
    14: "size-14 text-lg",
    16: "size-16 text-xl",
    20: "size-20 text-2xl",
  };
  const dim = sizeMap[size] || sizeMap[9];
  const resolved = resolveImage(src);
  if (resolved) {
    return (
      <Image
        src={resolved}
        alt={name || "avatar"}
        width={size * 4}
        height={size * 4}
        className={cn("rounded-full object-cover shrink-0", dim.split(" ")[0])}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-indigo/10 font-semibold text-brand-indigo",
        dim
      )}
    >
      {initials(name)}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="size-7" />
      </span>
      <p className="font-heading text-base font-semibold text-slate-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
