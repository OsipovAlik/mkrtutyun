import type { Metadata } from "next";
import { Suspense } from "react";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { getContent } from "@/lib/content/store";
import { listRsvps } from "@/lib/rsvp/store";
import { AdminView } from "./admin-view";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Կառավարման վահանակ",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="paper min-h-svh px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<p className="text-center text-muted">Բեռնվում է…</p>}>
          <AdminGate />
        </Suspense>
      </div>
    </main>
  );
}

async function AdminGate() {
  if (!isAdminConfigured()) {
    return (
      <div className="rounded-lg border border-gold/30 bg-ivory p-6 shadow-sm sm:p-8">
        <h1 className="font-serif text-2xl text-ink">Մուտքը կարգավորված չէ</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Նշեք <code>ADMIN_USERNAME</code> և <code>ADMIN_PASSWORD</code> միջավայրի փոփոխականները և վերագործարկեք կայքը։
        </p>
      </div>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="mx-auto max-w-sm pt-12">
        <div className="rounded-lg border border-gold/30 bg-ivory p-6 shadow-[0_20px_50px_-35px_rgba(55,53,47,0.5)] sm:p-8">
          <h1 className="mb-6 text-center font-serif text-2xl text-ink">Կառավարման էջ</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  const [content, responses] = await Promise.all([
    getContent(),
    listRsvps().catch((err) => {
      console.error("[admin] Could not load responses:", err);
      return [];
    }),
  ]);

  return <AdminView initialContent={content} responses={responses} />;
}
