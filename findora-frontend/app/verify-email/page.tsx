"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MailCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"pending" | "done">("pending");

  useEffect(() => {
    // MVP stub: a real implementation verifies a token from the query string
    // against POST /api/auth/verify-email, then flips the user's isVerified flag.
    const t = setTimeout(() => setStatus("done"), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 flex justify-center">
          {status === "pending" ? (
            <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-brand-indigo">
              <Loader2 className="size-7 animate-spin" />
            </span>
          ) : (
            <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-brand-green">
              <CheckCircle2 className="size-7" />
            </span>
          )}
        </div>
        <h1 className="mt-5 font-heading text-lg font-bold text-slate-900">
          {status === "pending" ? "Verifying your email..." : "Email verified!"}
        </h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <MailCheck className="size-4" />
          {status === "pending"
            ? "Hang tight while we confirm your address."
            : "You're all set — you can now use every Findora feature."}
        </p>
        {status === "done" && (
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-brand-indigo px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-indigo/30 transition hover:bg-brand-indigo-dark"
          >
            Go to dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
