import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { listRsvps, summarize } from "@/lib/rsvp/store";
import { logout } from "./actions";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Հյուրերի ցուցակ",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="paper min-h-svh px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
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
      <Card>
        <h1 className="font-serif text-2xl text-ink">Մուտքը կարգավորված չէ</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Նշեք <code>ADMIN_USERNAME</code> և <code>ADMIN_PASSWORD</code> միջավայրի փոփոխականները և վերագործարկեք կայքը։
        </p>
      </Card>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="mx-auto max-w-sm">
        <Card>
          <h1 className="mb-6 text-center font-serif text-2xl text-ink">Կառավարման էջ</h1>
          <LoginForm />
        </Card>
      </div>
    );
  }

  return <Dashboard />;
}

async function Dashboard() {
  let responses;
  try {
    responses = await listRsvps();
  } catch (error) {
    console.error("[admin] Could not load responses:", error);
    return (
      <Card>
        <p role="alert" className="text-[#8a4334]">Չհաջողվեց բեռնել պատասխանները։ Փորձեք թարմացնել էջը։</p>
      </Card>
    );
  }
  const { totalGuests, attendingResponses, declinedResponses } = summarize(responses);

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-ink sm:text-3xl">Հյուրերի ցուցակ</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="rounded-full border border-gold/50 px-4 py-1.5 text-sm text-olive hover:bg-cream">
            Թարմացնել
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-full border border-gold/50 px-4 py-1.5 text-sm text-olive hover:bg-cream">
              Դուրս գալ
            </button>
          </form>
        </div>
      </header>

      <section className="mt-8 rounded-lg bg-olive px-6 py-8 text-center text-ivory">
        <p className="text-sm tracking-[0.1em] text-gold-soft">Ընդհանուր հյուրեր</p>
        <p className="numerals mt-2 text-7xl leading-none">{totalGuests}</p>
        <p className="mt-4 text-sm text-ivory/75">
          Կմասնակցեն՝ {attendingResponses} պատասխան · Չեն մասնակցի՝ {declinedResponses}
        </p>
      </section>

      <Card flush className="mt-6">
        {responses.length === 0 ? (
          <p className="px-6 py-10 text-center text-muted">Դեռ պատասխաններ չկան։</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gold/30 text-olive">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-6">Անուն, ազգանուն</th>
                  <th className="px-4 py-3 font-medium">Պատասխան</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-6">Հյուրեր</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => (
                  <tr key={r.name + r.submittedAt} className="border-b border-gold/15 last:border-0">
                    <td className="px-4 py-3 sm:px-6">
                      <span className="text-ink">{r.name}</span>
                      <span className="block text-xs text-muted">
                        {new Date(r.submittedAt).toLocaleString("hy-AM", {
                          timeZone: "Asia/Yerevan",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.attendance === "yes" ? (
                        <span className="text-olive">Կմասնակցի</span>
                      ) : (
                        <span className="text-muted">Չի մասնակցի</span>
                      )}
                    </td>
                    <td className="numerals px-4 py-3 text-right text-xl sm:px-6">
                      {r.attendance === "yes" ? r.guests : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

function Card({ children, className = "", flush = false }: { children: React.ReactNode; className?: string; flush?: boolean }) {
  return (
    <div className={`rounded-lg border border-gold/30 bg-ivory shadow-[0_20px_50px_-35px_rgba(55,53,47,0.5)] ${flush ? "" : "p-6 sm:p-8"} ${className}`}>
      {children}
    </div>
  );
}
