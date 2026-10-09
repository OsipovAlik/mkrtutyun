import { Blessing } from "@/components/blessing";
import { Countdown } from "@/components/countdown";
import { EventSchedule } from "@/components/event-schedule";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { RsvpSection } from "@/components/rsvp-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { eventConfig, eventDateTimeISO } from "@/lib/event-config";

export default function Home() {
  const [baptism, celebration] = eventConfig.schedule;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${eventConfig.childrenGenitive} Մկրտությունը`,
    inLanguage: "hy",
    startDate: eventDateTimeISO(baptism.time),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: [
      { "@type": "Place", name: baptism.venue.name, address: { "@type": "PostalAddress", addressLocality: "Վաղարշապատ", addressCountry: "AM" } },
      { "@type": "Place", name: celebration.venue.name, ...(celebration.venue.address ? { address: celebration.venue.address } : {}) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* <SiteHeader /> */}
      <main>
        <Hero />
        <EventSchedule />
        <Blessing />
        <Countdown />
        {/* <Gallery /> */}
        <RsvpSection />
      </main>
      <SiteFooter />
    </>
  );
}
