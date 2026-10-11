import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { formatEventDate } from "@/lib/armenian-date";
import { getContent } from "@/lib/content/store";
import { eventDateTimeISO } from "@/lib/event-config";
import { BackgroundMusic } from "@/components/background-music";
import { Blessing } from "@/components/blessing";
import { Countdown } from "@/components/countdown";
import { EventSchedule } from "@/components/event-schedule";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { RsvpSection } from "@/components/rsvp-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const title = content.seo.title || `${content.people.genitive} Մկրտությունը`;
  const firstVenue = content.program.items[0]?.venue.name ?? "";
  const description =
    content.seo.description ||
    `Սիրով հրավիրում ենք Ձեզ՝ ${formatEventDate(content.event)}${firstVenue ? `։ ${firstVenue}։` : ""}`;
  const heroImg = content.hero.image.src || "/images/hero-etchmiadzin.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "hy_AM",
      images: [
        {
          url: heroImg,
          width: 1448,
          height: 1086,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImg],
    },
  };
}

export default async function Home() {
  const content = await getContent();
  const { isEnabled: isDraft } = await draftMode();

  const firstItem = content.program.items[0];
  const startTime = firstItem?.time ?? "15:20";
  const startIso = eventDateTimeISO(startTime, content.event, content.event.utcOffset);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: content.seo.title || `${content.people.genitive} Մկրտությունը`,
    inLanguage: "hy",
    startDate: startIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: content.program.items.map((item) => ({
      "@type": "Place",
      name: item.venue.name,
      ...(item.venue.address ? { address: item.venue.address } : {}),
    })),
  };

  // Inject CSS custom variables from content.theme
  const themeStyles = `
    :root {
      --color-olive: ${content.theme.olive};
      --color-olive-deep: ${content.theme.oliveDeep};
      --color-gold: ${content.theme.gold};
      --color-gold-soft: ${content.theme.goldSoft};
      --color-ivory: ${content.theme.ivory};
      --color-cream: ${content.theme.cream};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {isDraft ? (
        <aside
          role="status"
          aria-label="Նախադիտման ռեժիմ"
          className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 bg-gold-ink px-4 py-2 text-xs text-ivory shadow-md"
        >
          <span>✨ Դուք գտնվում եք նախադիտման ռեժիմում (Draft Mode)</span>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded bg-ivory/20 px-2.5 py-1 text-ivory hover:bg-ivory/30"
            >
              Վերադառնալ Admin
            </Link>
            <a
              href="/api/draft/disable"
              className="rounded bg-black/25 px-2.5 py-1 text-ivory hover:bg-black/40"
            >
              Դուրս գալ
            </a>
          </div>
        </aside>
      ) : null}

      <SiteHeader content={content} />
      <main className={isDraft ? "pt-8" : ""}>
        <Hero content={content} />
        <EventSchedule content={content} />
        <Blessing content={content} />
        <Countdown
          targetIso={startIso}
          title={content.countdown.title}
          enabled={content.countdown.enabled}
        />
        <Gallery content={content} />
        <RsvpSection content={content} />
      </main>
      <SiteFooter content={content} />
      <BackgroundMusic content={content} />
    </>
  );
}
