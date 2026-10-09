import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { eventConfig, eventDateTimeISO, googleMapsUrl, type ScheduleItem } from "@/lib/event-config";
import { formatEventDate } from "@/lib/armenian-date";
import { BraidBand } from "./ornaments";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/** Armenian alphabetic numerals: Ա = 1, Բ = 2, … */
const ARMENIAN_NUMERALS = ["Ա", "Բ", "Գ", "Դ"];

export function EventSchedule() {
  return (
    <section aria-labelledby="program-title" id="program" className="paper relative px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading id="program-title" eyebrow="Օրվա ծրագիրը" title="Մեր օրհնյալ օրը">
        <p className="font-serif">{formatEventDate()}</p>
      </SectionHeading>

      <ol className="relative mx-auto mt-16 grid max-w-6xl gap-14 sm:mt-20 md:grid-cols-2 md:gap-10 lg:gap-16">
        {/* Timeline rail: vertical on mobile, horizontal on desktop. */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[15px] w-px bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0 md:hidden"
        />
        <span
          aria-hidden="true"
          className="absolute -top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 md:block"
        />
        {eventConfig.schedule.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 160} className="relative pl-12 md:pl-0">
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border border-gold/60 bg-ivory font-serif text-sm text-gold-ink shadow-[0_0_0_6px_var(--color-ivory)] md:-top-12 md:left-1/2 md:-translate-x-1/2"
            >
              {ARMENIAN_NUMERALS[index]}
            </span>
            <EventCard item={item} priority={index === 0} />
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function EventCard({ item, priority }: { item: ScheduleItem; priority: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-t-[999px] rounded-b-md border border-gold/25 bg-ivory/70 p-3 shadow-[0_30px_60px_-40px_rgba(55,53,47,0.45)] sm:p-4">
      <div className="arch relative aspect-[4/4.4] overflow-hidden sm:aspect-[4/3.6]">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1152px) 540px, (min-width: 768px) 46vw, 92vw"
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: item.image.position }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
        <div aria-hidden="true" className="arch absolute inset-2.5 border border-ivory/45" />
      </div>

      <BraidBand className="mt-4 text-gold/45" />

      <div className="flex flex-1 flex-col items-center px-3 pt-6 pb-5 text-center sm:px-8">
        <p className="text-[0.72rem] tracking-[0.24em] text-gold-ink uppercase">{item.eyebrow}</p>

        <p className="mt-4 flex items-center gap-2 text-gold-ink">
          <Clock aria-hidden="true" className="size-4 stroke-[1.25]" />
          <time dateTime={eventDateTimeISO(item.time)} className="numerals text-4xl leading-none text-ink sm:text-5xl">
            {item.time}
          </time>
        </p>

        <h3 className="mt-4 font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">{item.title}</h3>

        <p className="mt-3 font-serif text-lg text-balance text-olive">
          <MapPin aria-hidden="true" className="mr-1.5 inline size-4 -translate-y-px stroke-[1.25] align-middle text-gold-ink" />
          <span>
            {item.venue.name}
            {item.venue.address ? <span className="block text-sm text-muted">{item.venue.address}</span> : null}
          </span>
        </p>

        <p className="mt-5 mb-8 max-w-md text-[0.97rem] leading-relaxed text-muted">{item.description}</p>

        <a
          href={googleMapsUrl(item.venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 rounded-full border border-olive/70 px-6 py-3 text-sm tracking-[0.06em] text-olive transition-colors duration-300 hover:bg-olive hover:text-ivory"
          aria-label={`Դիտել քարտեզը՝ ${item.venue.name} (բացվում է նոր պատուհանում)`}
        >
          <MapPin aria-hidden="true" className="size-4 stroke-[1.5]" />
          Դիտել քարտեզը
        </a>
      </div>
    </article>
  );
}
