import { DEFAULT_CONTENT } from "./content/defaults";
import type { Venue as ContentVenue } from "./content/types";

export const EVENT_YEAR = DEFAULT_CONTENT.event.year;
export const EVENT_TIME_ZONE = "Asia/Yerevan";
export const EVENT_UTC_OFFSET = DEFAULT_CONTENT.event.utcOffset;

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Venue = {
  name: string;
  address: string | null;
  mapsQuery: string;
  placeId?: string;
  mapsUrl?: string;
  coordinates?: Coordinates;
  lat?: number;
  lng?: number;
};

export type ScheduleItem = {
  id: string;
  time: string;
  eyebrow: string;
  title: string;
  venue: Venue;
  description: string;
  image: { src: string; alt: string; position?: string };
};

export const eventConfig = {
  children: DEFAULT_CONTENT.people.names,
  childrenGenitive: DEFAULT_CONTENT.people.genitive,
  monogram: DEFAULT_CONTENT.people.names.map((n) => n[0] ?? ""),
  date: DEFAULT_CONTENT.event,
  schedule: DEFAULT_CONTENT.program.items.map((item) => ({
    ...item,
    venue: {
      ...item.venue,
      coordinates: { lat: item.venue.lat, lng: item.venue.lng },
    },
  })),
  gallery: DEFAULT_CONTENT.gallery,
  rsvp: {
    maxGuests: DEFAULT_CONTENT.rsvp.maxGuests,
  },
};

/** ISO timestamp with UTC offset for a given "HH:MM" on the event day. */
export function eventDateTimeISO(
  time = "00:00",
  customDate?: { year: number; month: number; day: number },
  utcOffset?: string
) {
  const { year, month, day } = customDate ?? DEFAULT_CONTENT.event;
  const offset = utcOffset ?? DEFAULT_CONTENT.event.utcOffset;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${time}:00${offset}`;
}

export const CEREMONY_START_ISO = eventDateTimeISO(
  DEFAULT_CONTENT.program.items[0]?.time ?? "15:20"
);

export function googleMapsUrl(venue: Venue | ContentVenue) {
  if (venue.mapsUrl) return venue.mapsUrl;
  const params = new URLSearchParams({
    api: "1",
    query: venue.address ? `${venue.mapsQuery}, ${venue.address}` : venue.mapsQuery,
  });
  if ("placeId" in venue && venue.placeId) params.set("query_place_id", venue.placeId);
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function googleNavigationUrl(venue: Venue | ContentVenue) {
  let lat = 0;
  let lng = 0;
  if ("lat" in venue && typeof venue.lat === "number" && !isNaN(venue.lat)) {
    lat = venue.lat;
  } else if ("coordinates" in venue && venue.coordinates) {
    lat = venue.coordinates.lat;
  }
  if ("lng" in venue && typeof venue.lng === "number" && !isNaN(venue.lng)) {
    lng = venue.lng;
  } else if ("coordinates" in venue && venue.coordinates) {
    lng = venue.coordinates.lng;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&dir_action=navigate`;
}
