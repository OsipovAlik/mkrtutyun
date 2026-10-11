import { DEFAULT_CONTENT } from "./defaults";
import type { GalleryPhoto, ImageRef, PhotoCredit, ScheduleItem, SiteContent, Venue } from "./types";

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function str(val: unknown, fallback: string): string {
  return typeof val === "string" ? val : fallback;
}

function num(val: unknown, fallback: number): number {
  return typeof val === "number" && !Number.isNaN(val) ? val : fallback;
}

function bool(val: unknown, fallback: boolean): boolean {
  return typeof val === "boolean" ? val : fallback;
}

function sanitizeImage(raw: unknown, fallback: ImageRef): ImageRef {
  if (!isObject(raw)) return fallback;
  return {
    src: str(raw.src, fallback.src),
    alt: str(raw.alt, fallback.alt),
    position: str(raw.position, fallback.position),
  };
}

function sanitizeVenue(raw: unknown, fallback: Venue): Venue {
  if (!isObject(raw)) return fallback;
  return {
    name: str(raw.name, fallback.name),
    address: str(raw.address, fallback.address),
    mapsQuery: str(raw.mapsQuery, fallback.mapsQuery),
    mapsUrl: str(raw.mapsUrl, fallback.mapsUrl),
    lat: num(raw.lat, fallback.lat),
    lng: num(raw.lng, fallback.lng),
  };
}

function sanitizeScheduleItem(raw: unknown, fallback: ScheduleItem, index: number): ScheduleItem {
  if (!isObject(raw)) return fallback;
  return {
    id: str(raw.id, `item-${index}`),
    time: str(raw.time, fallback.time),
    eyebrow: str(raw.eyebrow, fallback.eyebrow),
    title: str(raw.title, fallback.title),
    venue: sanitizeVenue(raw.venue, fallback.venue),
    description: str(raw.description, fallback.description),
    image: sanitizeImage(raw.image, fallback.image),
  };
}

function sanitizePhoto(raw: unknown, fallback: GalleryPhoto): GalleryPhoto {
  if (!isObject(raw)) return fallback;
  return {
    src: str(raw.src, fallback.src),
    alt: str(raw.alt, fallback.alt),
  };
}

function sanitizeCredit(raw: unknown, fallback: PhotoCredit): PhotoCredit {
  if (!isObject(raw)) return fallback;
  return {
    label: str(raw.label, fallback.label),
    author: str(raw.author, fallback.author),
    license: str(raw.license, fallback.license),
    source: str(raw.source, fallback.source),
  };
}

/**
 * Validates and merges untrusted data with DEFAULT_CONTENT,
 * ensuring complete type safety and no missing or crashing properties.
 */
export function sanitizeContent(raw: unknown): SiteContent {
  if (!isObject(raw)) return DEFAULT_CONTENT;

  const d = DEFAULT_CONTENT;

  const themeRaw = isObject(raw.theme) ? raw.theme : {};
  const theme = {
    olive: str(themeRaw.olive, d.theme.olive),
    oliveDeep: str(themeRaw.oliveDeep, d.theme.oliveDeep),
    gold: str(themeRaw.gold, d.theme.gold),
    goldSoft: str(themeRaw.goldSoft, d.theme.goldSoft),
    ivory: str(themeRaw.ivory, d.theme.ivory),
    cream: str(themeRaw.cream, d.theme.cream),
  };

  const peopleRaw = isObject(raw.people) ? raw.people : {};
  const names = Array.isArray(peopleRaw.names)
    ? peopleRaw.names.map((n) => str(n, "")).filter(Boolean)
    : d.people.names;
  const people = {
    names: names.length > 0 ? names : d.people.names,
    genitive: str(peopleRaw.genitive, d.people.genitive),
  };

  const eventRaw = isObject(raw.event) ? raw.event : {};
  const event = {
    year: num(eventRaw.year, d.event.year),
    month: num(eventRaw.month, d.event.month),
    day: num(eventRaw.day, d.event.day),
    utcOffset: str(eventRaw.utcOffset, d.event.utcOffset),
  };

  const seoRaw = isObject(raw.seo) ? raw.seo : {};
  const seo = {
    title: str(seoRaw.title, d.seo.title),
    description: str(seoRaw.description, d.seo.description),
  };

  const introRaw = isObject(raw.intro) ? raw.intro : {};
  const intro = {
    enabled: bool(introRaw.enabled, d.intro.enabled),
    eyebrow: str(introRaw.eyebrow, d.intro.eyebrow),
    buttonLabel: str(introRaw.buttonLabel, d.intro.buttonLabel),
  };

  const heroRaw = isObject(raw.hero) ? raw.hero : {};
  const hero = {
    image: sanitizeImage(heroRaw.image, d.hero.image),
    greeting: str(heroRaw.greeting, d.hero.greeting),
    inviteLine: str(heroRaw.inviteLine, d.hero.inviteLine),
    subtitle: str(heroRaw.subtitle, d.hero.subtitle),
    closing: str(heroRaw.closing, d.hero.closing),
  };

  const programRaw = isObject(raw.program) ? raw.program : {};
  const itemsFallback = d.program.items;
  const items = Array.isArray(programRaw.items)
    ? programRaw.items.map((item, idx) =>
        sanitizeScheduleItem(item, itemsFallback[idx] ?? itemsFallback[0], idx)
      )
    : itemsFallback;
  const program = {
    eyebrow: str(programRaw.eyebrow, d.program.eyebrow),
    title: str(programRaw.title, d.program.title),
    items: items.length > 0 ? items : itemsFallback,
  };

  const blessingRaw = isObject(raw.blessing) ? raw.blessing : {};
  const blessingLines = Array.isArray(blessingRaw.lines)
    ? blessingRaw.lines.map((l) => str(l, "")).filter(Boolean)
    : d.blessing.lines;
  const blessing = {
    enabled: bool(blessingRaw.enabled, d.blessing.enabled),
    lines: blessingLines.length > 0 ? blessingLines : d.blessing.lines,
  };

  const countdownRaw = isObject(raw.countdown) ? raw.countdown : {};
  const countdown = {
    enabled: bool(countdownRaw.enabled, d.countdown.enabled),
    title: str(countdownRaw.title, d.countdown.title),
  };

  const galleryRaw = isObject(raw.gallery) ? raw.gallery : {};
  const photosFallback = d.gallery.photos;
  const photos = Array.isArray(galleryRaw.photos)
    ? galleryRaw.photos.map((p, idx) => sanitizePhoto(p, photosFallback[idx] ?? photosFallback[0]))
    : photosFallback;
  const gallery = {
    enabled: bool(galleryRaw.enabled, d.gallery.enabled),
    eyebrow: str(galleryRaw.eyebrow, d.gallery.eyebrow),
    title: str(galleryRaw.title, d.gallery.title),
    photos,
  };

  const rsvpRaw = isObject(raw.rsvp) ? raw.rsvp : {};
  const rsvp = {
    enabled: bool(rsvpRaw.enabled, d.rsvp.enabled),
    eyebrow: str(rsvpRaw.eyebrow, d.rsvp.eyebrow),
    title: str(rsvpRaw.title, d.rsvp.title),
    text: str(rsvpRaw.text, d.rsvp.text),
    maxGuests: Math.max(1, Math.min(50, num(rsvpRaw.maxGuests, d.rsvp.maxGuests))),
    yesLabel: str(rsvpRaw.yesLabel, d.rsvp.yesLabel),
    noLabel: str(rsvpRaw.noLabel, d.rsvp.noLabel),
    submitLabel: str(rsvpRaw.submitLabel, d.rsvp.submitLabel),
    success: str(rsvpRaw.success, d.rsvp.success),
    successDeclined: str(rsvpRaw.successDeclined, d.rsvp.successDeclined),
  };

  const musicRaw = isObject(raw.music) ? raw.music : {};
  const volume = num(musicRaw.volume, d.music.volume);
  const music = {
    enabled: bool(musicRaw.enabled, d.music.enabled),
    src: str(musicRaw.src, d.music.src),
    volume: Math.max(0, Math.min(1, volume)),
  };

  const footerRaw = isObject(raw.footer) ? raw.footer : {};
  const creditsFallback = d.footer.credits;
  const credits = Array.isArray(footerRaw.credits)
    ? footerRaw.credits.map((c, idx) => sanitizeCredit(c, creditsFallback[idx] ?? creditsFallback[0]))
    : creditsFallback;
  const footer = {
    signature: str(footerRaw.signature, d.footer.signature),
    credits,
  };

  return {
    version: 1,
    theme,
    people,
    event,
    seo,
    intro,
    hero,
    program,
    blessing,
    countdown,
    gallery,
    rsvp,
    music,
    footer,
  };
}
