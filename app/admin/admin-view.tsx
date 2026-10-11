"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit3, Users, LogOut, RefreshCw, ExternalLink } from "lucide-react";
import type { SiteContent } from "@/lib/content/types";
import { type RsvpRecord, summarize } from "@/lib/rsvp/validation";
import { ContentEditor } from "./content-editor";
import { logout } from "./actions";

interface AdminViewProps {
  initialContent: SiteContent;
  responses: RsvpRecord[];
}

export function AdminView({ initialContent, responses }: AdminViewProps) {
  const [mainTab, setMainTab] = useState<"editor" | "rsvps">("editor");
  const { totalGuests, attendingResponses, declinedResponses } = summarize(responses);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/25 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-light text-ink sm:text-3xl">Կառավարման վահանակ</h1>
          <p className="mt-1 text-xs text-muted">
            {initialContent.people.genitive} Մկրտության հրավիրատոմս
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1.5 text-xs text-olive transition-colors hover:bg-cream"
          >
            Դիտել կայքը
            <ExternalLink className="size-3" />
          </a>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1.5 text-xs text-olive transition-colors hover:bg-cream"
          >
            <RefreshCw className="size-3" />
            Թարմացնել
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1.5 text-xs text-olive transition-colors hover:bg-cream"
            >
              <LogOut className="size-3" />
              Դուրս գալ
            </button>
          </form>
        </div>
      </header>

      {/* Main Switcher */}
      <div className="flex border-b border-gold/20">
        <button
          type="button"
          onClick={() => setMainTab("editor")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 font-serif text-base transition-colors ${
            mainTab === "editor"
              ? "border-olive font-medium text-olive"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Edit3 className="size-4" />
          Կայքի խմբագրում (Template Editor)
        </button>
        <button
          type="button"
          onClick={() => setMainTab("rsvps")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 font-serif text-base transition-colors ${
            mainTab === "rsvps"
              ? "border-olive font-medium text-olive"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Users className="size-4" />
          Հյուրերի ցուցակ ({responses.length})
        </button>
      </div>

      {mainTab === "editor" ? (
        <ContentEditor initialContent={initialContent} />
      ) : (
        <div className="space-y-6">
          <section className="rounded-lg bg-olive px-6 py-8 text-center text-ivory">
            <p className="text-sm tracking-[0.1em] text-gold-soft">Ընդհանուր հյուրեր</p>
            <p className="numerals mt-2 text-7xl leading-none">{totalGuests}</p>
            <p className="mt-4 text-sm text-ivory/75">
              Կմասնակցեն՝ {attendingResponses} պատասխան · Չեն մասնակցի՝ {declinedResponses}
            </p>
          </section>

          <div className="overflow-hidden rounded-lg border border-gold/30 bg-ivory shadow-sm">
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
          </div>
        </div>
      )}
    </div>
  );
}
