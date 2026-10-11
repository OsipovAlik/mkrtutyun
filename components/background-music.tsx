"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { ArmenianCross, CornerFlourish } from "./ornaments";

/** Only these count as a "user gesture" for browser autoplay rules (touchstart does not). */
const UNLOCK_EVENTS = ["pointerup", "click", "touchend", "keydown"] as const;
const GATE_FADE_MS = 900;

export function BackgroundMusic({ content = DEFAULT_CONTENT }: { content?: SiteContent }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [gate, setGate] = useState<"shown" | "leaving" | "gone">(
    content.intro.enabled ? "shown" : "gone"
  );
  // Once the visitor mutes, never auto-resume on later interactions.
  const userPausedRef = useRef(false);

  const musicEnabled = content.music.enabled && Boolean(content.music.src);
  const volume = content.music.volume ?? 0.5;

  const play = useCallback(() => {
    if (!musicEnabled) return;
    const audio = audioRef.current;
    if (!audio || userPausedRef.current) return;
    audio.play().catch(() => {});
  }, [musicEnabled]);

  useEffect(() => {
    if (!musicEnabled) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const removeUnlock = () =>
      UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, unlock, true));

    function unlock(event: Event) {
      // The mute button handles its own taps.
      if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
      removeUnlock();
      play();
    }

    audio.play().catch(() => {
      UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, unlock, true));
    });

    return removeUnlock;
  }, [musicEnabled, volume, play]);

  // Keep the page still while the welcome screen is up.
  useEffect(() => {
    if (gate === "gone") return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [gate]);

  function openInvitation() {
    play();
    setGate("leaving");
    window.setTimeout(() => setGate("gone"), GATE_FADE_MS);
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPausedRef.current = false;
      audio.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      audio.pause();
    }
  }

  if (!musicEnabled && !content.intro.enabled) {
    return null;
  }

  return (
    <>
      {musicEnabled ? (
        <audio
          ref={audioRef}
          src={content.music.src}
          loop
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : null}

      {content.intro.enabled && gate !== "gone" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-gate-title"
          className={`intro-gate paper fixed inset-0 z-[60] isolate flex items-center justify-center bg-ivory text-ink transition-[opacity,visibility] ease-out ${
            gate === "leaving" ? "invisible opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: `${GATE_FADE_MS}ms` }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(231,220,198,0.85)_100%)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-3 sm:inset-6 lg:inset-8">
            <div className="absolute inset-0 border border-gold/40" />
            <div className="absolute inset-[5px] border border-gold/25" />
            <CornerFlourish className="absolute -top-px -left-px size-10 text-gold sm:size-14" />
            <CornerFlourish className="absolute -top-px -right-px size-10 rotate-90 text-gold sm:size-14" />
            <CornerFlourish className="absolute -right-px -bottom-px size-10 rotate-180 text-gold sm:size-14" />
            <CornerFlourish className="absolute -bottom-px -left-px size-10 -rotate-90 text-gold sm:size-14" />
          </div>

          <div className="relative flex flex-col items-center px-8 text-center">
            <div className="relative mb-8 animate-rise">
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -z-10 size-40 -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-[radial-gradient(circle,rgba(216,196,155,0.55)_0%,rgba(216,196,155,0.15)_40%,transparent_70%)]"
              />
              <ArmenianCross className="h-12 w-auto text-gold" />
            </div>

            <p className="animate-rise text-xs tracking-[0.32em] text-gold-ink uppercase [animation-delay:200ms] sm:text-sm">
              {content.intro.eyebrow || "Սուրբ Մկրտություն"}
            </p>
            <h2
              id="intro-gate-title"
              className="mt-5 animate-rise font-serif text-4xl font-medium text-ink [animation-delay:400ms] sm:text-6xl"
            >
              {content.people.genitive}
            </h2>

            <button
              id="open-invitation"
              type="button"
              autoFocus
              onClick={openInvitation}
              className="group mt-12 inline-flex animate-rise items-center gap-3 rounded-full border border-gold bg-ivory/70 px-8 py-3.5 font-serif text-base tracking-[0.12em] text-gold-ink shadow-[0_8px_30px_-12px_rgba(122,98,52,0.45)] transition duration-500 [animation-delay:700ms] hover:bg-olive hover:border-olive hover:text-ivory sm:text-lg"
            >
              {musicEnabled ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l11-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="17" cy="16" r="3" />
                </svg>
              ) : null}
              {content.intro.buttonLabel || "Բացել հրավերը"}
            </button>
          </div>
        </div>
      )}

      {musicEnabled ? (
        <button
          ref={buttonRef}
          id="music-toggle"
          type="button"
          onClick={toggle}
          aria-label={playing ? "Անջատել երաժշտությունը" : "Միացնել երաժշտությունը"}
          aria-pressed={playing}
          className="fixed right-4 bottom-4 z-50 flex size-12 items-center justify-center rounded-full border border-gold-soft/40 bg-olive/85 text-gold-soft shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-olive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-6 sm:bottom-6"
        >
          {playing ? (
            <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="animate-music-bar h-full w-[3px] rounded-full bg-current"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l11-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="17" cy="16" r="3" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
