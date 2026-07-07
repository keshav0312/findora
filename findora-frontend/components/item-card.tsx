import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ImageOff } from "lucide-react";
import { Report } from "@/lib/types";
import { formatDate, resolveImage } from "@/lib/format";
import { StatusPill } from "./ui-bits";

export function ItemCard({ item, kind }: { item: Report; kind: "lost" | "found" }) {
  const photo = resolveImage(item.photos?.[0]);
  return (
    <Link
      href={`/items/${kind}/${item._id}`}
      className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-300">
        {photo ? (
          <Image src={photo} alt={item.title} width={64} height={64} className="size-full object-cover" />
        ) : (
          <ImageOff className="size-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-heading text-sm font-semibold text-slate-900 group-hover:text-brand-indigo">
            {item.title}
          </p>
          <StatusPill status={kind} />
        </div>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
          <MapPin className="size-3.5 shrink-0" /> {item.location}
          {item.city ? `, ${item.city}` : ""}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
          <Calendar className="size-3.5 shrink-0" /> {formatDate(item.date)}
        </p>
      </div>
    </Link>
  );
}
