/**
 * Shape of everything editable on the invitation.
 *
 * Stored as one JSON document (Redis on Vercel, data/content.json locally).
 * Every field is required and has a default (see ./defaults.ts); missing or
 * invalid stored values are filled in from those defaults by ./sanitize.ts,
 * so adding a new field later never breaks existing sites.
 *
 * Empty strings mean "none" (e.g. no address, no custom map link).
 */

export type ImageRef = {
  /** "/images/…" (bundled) or "https://…" (uploaded to Vercel Blob). */
  src: string;
  alt: string;
  /** CSS object-position, e.g. "50% 30%". */
  position: string;
};

export type Venue = {
  name: string;
  address: string;
  /** Free-text query for the Google Maps search link (used when mapsUrl is empty). */
  mapsQuery: string;
  /** Direct Google Maps link to the exact place. */
  mapsUrl: string;
  /** Coordinates for turn-by-turn navigation. */
  lat: number;
  lng: number;
};

export type ScheduleItem = {
  id: string;
  /** Local event time, 24h "HH:MM". */
  time: string;
  eyebrow: string;
  title: string;
  venue: Venue;
  description: string;
  image: ImageRef;
};

export type GalleryPhoto = {
  /** Empty = show the decorative "photo coming soon" placeholder. */
  src: string;
  alt: string;
};

export type PhotoCredit = {
  label: string;
  author: string;
  license: string;
  source: string;
};

export type EventDate = {
  year: number;
  month: number;
  day: number;
  /** Fixed UTC offset of the event location, e.g. "+04:00" for Armenia. */
  utcOffset: string;
};

export type SiteContent = {
  version: 1;
  theme: {
    olive: string;
    oliveDeep: string;
    gold: string;
    goldSoft: string;
    ivory: string;
    cream: string;
  };
  people: {
    /** Nominative names, e.g. ["Աննա", "Հայկ"]. */
    names: string[];
    /** Genitive (սեռական) phrase used in headings, e.g. "Աննայի և Հայկի". */
    genitive: string;
  };
  event: EventDate;
  seo: {
    /** Empty = "<genitive> Մկրտությունը". */
    title: string;
    /** Empty = generated from the date and first venue. */
    description: string;
  };
  intro: {
    enabled: boolean;
    eyebrow: string;
    buttonLabel: string;
  };
  hero: {
    image: ImageRef;
    greeting: string;
    inviteLine: string;
    subtitle: string;
    closing: string;
  };
  program: {
    eyebrow: string;
    title: string;
    items: ScheduleItem[];
  };
  blessing: {
    enabled: boolean;
    lines: string[];
  };
  countdown: {
    enabled: boolean;
    title: string;
  };
  gallery: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    photos: GalleryPhoto[];
  };
  rsvp: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    text: string;
    maxGuests: number;
    yesLabel: string;
    noLabel: string;
    submitLabel: string;
    success: string;
    successDeclined: string;
  };
  music: {
    enabled: boolean;
    src: string;
    /** 0–1 */
    volume: number;
  };
  footer: {
    signature: string;
    credits: PhotoCredit[];
  };
};
