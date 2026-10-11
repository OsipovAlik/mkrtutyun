"use client";

import { useEffect, useState } from "react";
import { CEREMONY_START_ISO } from "@/lib/event-config";
import { BraidBand } from "./ornaments";

const UNITS = [
  { key: "days", label: "Օր" },
  { key: "hours", label: "Ժամ" },
  { key: "minutes", label: "Րոպե" },
  { key: "seconds", label: "Վայրկյան" },
] as const;

type Remaining = Record<(typeof UNITS)[number]["key"], number>;

function getRemaining(now: number, target: number): Remaining | null {
  const diff = target - now;
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86_400),
    hours: Math.floor((s % 86_400) / 3_600),
    minutes: Math.floor((s % 3_600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({
  targetIso = CEREMONY_START_ISO,
  title = "Մինչև մեր տոնը մնացել է",
  enabled = true,
}: {
  targetIso?: string;
  title?: string;
  enabled?: boolean;
}) {
  const [remaining, setRemaining] = useState<Remaining | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const target = Date.parse(targetIso);
    const tick = () => setRemaining(getRemaining(Date.now(), target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso, enabled]);

  if (!enabled || remaining === null) return null;

  return (
    <section
      aria-labelledby="countdown-title"
      className="relative overflow-hidden bg-olive px-5 py-20 text-ivory sm:py-24"
    >
      <BraidBand className="absolute inset-x-0 top-5 text-gold-soft/25" />
      <BraidBand className="absolute inset-x-0 bottom-5 text-gold-soft/25" />

      <div className="mx-auto max-w-4xl text-center">
        <h2 id="countdown-title" className="text-xs tracking-[0.32em] text-gold-soft uppercase sm:text-sm">
          {title}
        </h2>

        <div
          role="timer"
          aria-live="off"
          className="mt-10 grid grid-cols-4 items-start sm:mt-12"
        >
          {UNITS.map((unit, i) => (
            <div
              key={unit.key}
              className={`flex flex-col items-center px-1 ${i > 0 ? "border-l border-gold-soft/25" : ""}`}
            >
              <span className="numerals text-[2.6rem] leading-none font-light sm:text-7xl" suppressHydrationWarning>
                {remaining ? String(remaining[unit.key]).padStart(2, "0") : "··"}
              </span>
              <span className="mt-3 text-[0.62rem] tracking-[0.06em] text-ivory/75 uppercase sm:text-sm sm:tracking-[0.22em]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
