import Image from "next/image";
import heroImage from "@/public/images/hero-etchmiadzin.png";
import { eventConfig, eventDateTimeISO } from "@/lib/event-config";
import { eventDateParts, formatEventDate } from "@/lib/armenian-date";
import { ArmenianCross, CornerFlourish, OliveBranch } from "./ornaments";

export function Hero() {
  const { weekday, day, month, year } = eventDateParts();

  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-olive-deep text-ivory"
    >
      <div className="absolute inset-0 -z-20 animate-settle">
        <Image
          src={heroImage}
          alt="Էջմիածնի Մայր տաճարը աշնանային լույսի ներքո"
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
      </div>
      {/* Warm, candle-like veil so ivory text reads over the photograph. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(48,38,24,0.42)_0%,rgba(48,38,24,0.22)_28%,rgba(40,33,22,0.5)_62%,rgba(30,27,20,0.86)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(25,22,16,0.5)_100%)]"
      />

      {/* Double hairline frame with carved corners. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 animate-fade sm:inset-6 lg:inset-8">
        <div className="absolute inset-0 border border-gold-soft/35" />
        <div className="absolute inset-[5px] border border-gold-soft/20" />
        <CornerFlourish className="absolute -top-px -left-px size-10 text-gold-soft/80 sm:size-14" />
        <CornerFlourish className="absolute -top-px -right-px size-10 rotate-90 text-gold-soft/80 sm:size-14" />
        <CornerFlourish className="absolute -right-px -bottom-px size-10 rotate-180 text-gold-soft/80 sm:size-14" />
        <CornerFlourish className="absolute -bottom-px -left-px size-10 -rotate-90 text-gold-soft/80 sm:size-14" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-8 pt-24 pb-28 text-center sm:px-12">
        <div className="relative mb-7 animate-rise [animation-delay:150ms]">
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-40 -translate-x-1/2 -translate-y-1/2 animate-glow rounded-full bg-[radial-gradient(circle,rgba(232,214,170,0.45)_0%,rgba(232,214,170,0.12)_40%,transparent_70%)]"
          />
          <ArmenianCross className="h-11 w-auto text-gold-soft drop-shadow-[0_0_12px_rgba(232,214,170,0.45)]" />
        </div>

        <p className="animate-rise font-serif text-lg tracking-[0.24em] uppercase text-[#efe2c4] [text-shadow:0_1px_14px_rgba(30,26,18,0.75)] [animation-delay:400ms] sm:text-2xl">
          Սիրելի հյուրեր
        </p>

        <h1 className="mt-6 animate-rise [text-shadow:0_2px_24px_rgba(30,26,18,0.45)] font-serif leading-[1.2] [animation-delay:650ms]">
          <span className="block text-base font-normal tracking-[0.04em] text-ivory/90 sm:text-xl lg:text-2xl">
            Սիրով հրավիրում ենք Ձեզ կիսելու մեզ հետ
          </span>
          <span className="mt-4 block text-[2.85rem] font-medium text-white sm:mt-5 sm:text-6xl lg:text-7xl">
            Աննայի և Հայկի
          </span>
          <span className="mt-2 block text-base font-normal tracking-[0.04em] text-ivory/90 sm:mt-3 sm:text-xl lg:text-2xl">
            Սուրբ Մկրտության լուսավոր օրը
          </span>
        </h1>

        <div className="mt-7 flex animate-rise items-center gap-3 text-gold-soft/90 [animation-delay:900ms]" aria-hidden="true">
          <OliveBranch className="h-6 w-24 -scale-x-100 sm:w-28" />
          <OliveBranch className="h-6 w-24 sm:w-28" />
        </div>

        <p className="mt-6 max-w-xl animate-rise font-serif text-lg tracking-[0.06em] text-ivory/90 [animation-delay:1100ms] sm:text-2xl">
          Սպասում ենք Ձեզ
        </p>

        <time
          dateTime={eventDateTimeISO(eventConfig.schedule[0].time)}
          className="mt-10 flex animate-rise flex-col items-center [animation-delay:1350ms]"
        >
          <span className="sr-only">{formatEventDate()}</span>
          <span aria-hidden="true" className="text-xs tracking-[0.3em] text-gold-soft uppercase sm:text-sm">
            {weekday}
          </span>
          <span aria-hidden="true" className="mt-3 flex items-center gap-4 sm:gap-6">
            <span className="h-px w-8 bg-gold-soft/60 sm:w-14" />
            <span className="flex items-baseline gap-3 sm:gap-4">
              <span className="numerals text-5xl leading-none font-light sm:text-6xl">{day}</span>
              <span className="font-serif text-xl tracking-[0.2em] uppercase sm:text-2xl">{month}</span>
            </span>
            <span className="h-px w-8 bg-gold-soft/60 sm:w-14" />
          </span>
          <span aria-hidden="true" className="mt-3 text-sm tracking-[0.12em] text-ivory/75">
            {year}
          </span>
        </time>
      </div>

      <a
        href="#program"
        aria-label="Անցնել օրվա ծրագրին"
        className="group absolute bottom-7 left-1/2 flex -translate-x-1/2 animate-fade flex-col items-center gap-2 text-gold-soft/80 [animation-delay:2000ms] sm:bottom-10"
      >
        <span className="relative h-12 w-px overflow-hidden bg-gold-soft/25">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-gold-soft" />
        </span>
      </a>
    </section>
  );
}
