import { Navigation, MapPin } from "lucide-react";
import { type Venue, googleNavigationUrl, googleMapsUrl } from "@/lib/event-config";

interface VenueNavigationProps {
  venue: Venue;
  description: string;
}

export function VenueNavigation({ venue, description }: VenueNavigationProps) {
  const navUrl = googleNavigationUrl(venue);
  const mapUrl = googleMapsUrl(venue);

  return (
    <>
      {/* Clickable venue header that directly starts Google navigation */}
      <a
        href={navUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-3 inline-block cursor-pointer text-center font-serif text-lg text-balance text-olive transition-colors hover:text-olive-deep"
        aria-label={`Սկսել երթուղին դեպի ${venue.name} (Google Maps)`}
      >
        <MapPin aria-hidden="true" className="mr-1.5 inline size-4 -translate-y-px stroke-[1.25] align-middle text-gold-ink transition-transform group-hover:scale-110" />
        <span className="inline-block">
          <span className="underline decoration-gold/50 decoration-1 underline-offset-4 group-hover:decoration-olive">
            {venue.name}
          </span>
          {venue.address ? <span className="block text-sm text-muted no-underline">{venue.address}</span> : null}
        </span>
      </a>

      {/* Description */}
      <p className="mt-5 mb-8 max-w-md text-[0.97rem] leading-relaxed text-muted">
        {description}
      </p>

      {/* Action buttons */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-olive px-6 py-3 text-sm tracking-[0.06em] text-ivory shadow-md transition-all duration-300 hover:bg-olive-deep hover:shadow-lg active:scale-[0.98]"
          aria-label={`Սկսել երթուղին դեպի ${venue.name} Google Maps-ով`}
        >
          <Navigation aria-hidden="true" className="size-4 stroke-[1.75]" />
          Սկսել երթուղին
        </a>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-olive/80 underline-offset-4 transition-colors hover:text-olive hover:underline"
        >
          <MapPin aria-hidden="true" className="size-3.5" />
          Դիտել քարտեզը
        </a>
      </div>
    </>
  );
}
