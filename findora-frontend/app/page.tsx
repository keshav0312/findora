import Link from "next/link";
import {
  FileText,
  Sparkles,
  Bell,
  MessagesSquare,
  CheckCircle2,
  MapPin,
  Wallet,
  Smartphone,
  KeyRound,
  Backpack,
  Cat,
  Watch,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { MapPreview } from "@/components/map-preview";

const STEPS = [
  { icon: FileText, title: "Report", desc: "Post what you lost or found in under a minute." },
  { icon: Sparkles, title: "AI Matching", desc: "Findora compares category, location, date & photos." },
  { icon: Bell, title: "Get Notified", desc: "Both sides are alerted the moment a likely match appears." },
  { icon: MessagesSquare, title: "Connect", desc: "Chat safely, verify ownership, agree on a meeting point." },
  { icon: CheckCircle2, title: "Return", desc: "Mark it resolved and earn trust points for the community." },
];

const CATEGORY_ICONS = [
  { icon: Wallet, label: "Wallets" },
  { icon: Smartphone, label: "Phones" },
  { icon: KeyRound, label: "Keys" },
  { icon: Backpack, label: "Bags" },
  { icon: Cat, label: "Pets" },
  { icon: Watch, label: "Watches" },
];

const AUDIENCES = [
  { icon: Users, title: "Individuals", desc: "Students, travelers, families, commuters." },
  { icon: Building2, title: "Businesses", desc: "Malls, restaurants, hotels, airports, stations." },
  { icon: ShieldCheck, title: "Authorities", desc: "Police stations, municipal offices, campuses." },
];

export default function LandingPage() {
  return (
    <div className="flex-1 bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="hover:text-brand-indigo">How it works</a>
          <a href="#categories" className="hover:text-brand-indigo">What we cover</a>
          <a href="#trust" className="hover:text-brand-indigo">Trust & safety</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-brand-indigo">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-indigo px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-indigo/30 transition hover:bg-brand-indigo-dark"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand-indigo">
              <Sparkles className="size-3.5" /> Community-powered &amp; AI-matched
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
              Lost Something?
              <br />
              <span className="text-brand-indigo">Findora</span> Helps You Find It.
            </h1>
            <p className="mt-5 max-w-md text-base text-slate-600">
              Skip the WhatsApp groups and Facebook posts. Report your lost or found item once,
              and Findora automatically connects likely matches by location, date and category.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/report/lost"
                className="rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-indigo/30 transition hover:bg-brand-indigo-dark"
              >
                Report Lost Item
              </Link>
              <Link
                href="/report/found"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-indigo hover:text-brand-indigo"
              >
                Report Found Item
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
              <div>
                <p className="font-heading text-xl font-bold text-slate-900">2,543+</p>
                <p>Community members</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="font-heading text-xl font-bold text-slate-900">1,132</p>
                <p>Items reunited</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <MapPreview className="aspect-[4/5] w-full" dense />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-brand-green">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-slate-900">92% Likely Match</p>
                  <p className="text-xs text-slate-500">Black Wallet · DB Mall · 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-2xl font-bold text-slate-900 md:text-3xl">
            How Findora Works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-brand-indigo">
                  <s.icon className="size-5" />
                </span>
                <p className="mt-4 font-heading text-sm font-semibold text-slate-900">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">
                What people find and lose
              </h2>
              <p className="mt-2 max-w-lg text-sm text-slate-500">
                Wallets, phones, keys, pets, documents and more — plus custom categories for
                anything else.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {CATEGORY_ICONS.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-brand-indigo">
                  <c.icon className="size-5" />
                </span>
                <p className="text-xs font-medium text-slate-600">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Audiences */}
      <section id="trust" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">
            Built for the whole community
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-brand-indigo">
                  <a.icon className="size-5" />
                </span>
                <p className="mt-4 font-heading text-base font-semibold text-slate-900">{a.title}</p>
                <p className="mt-1 text-sm text-slate-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-brand-ink px-8 py-14 text-center">
          <MapPin className="mx-auto size-8 text-brand-indigo" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-white md:text-3xl">
            Where lost things find their way home.
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Join the community and report your first item in under a minute.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-block rounded-full bg-brand-indigo px-7 py-3 text-sm font-semibold text-white shadow-md shadow-brand-indigo/40 transition hover:bg-brand-indigo-dark"
          >
            Create your free account
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <Logo className="scale-90" />
          <p>© {new Date().getFullYear()} Findora. Helping communities reunite with what matters.</p>
        </div>
      </footer>
    </div>
  );
}
