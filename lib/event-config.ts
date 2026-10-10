/**
 * Single source of truth for every event detail shown on the invitation.
 * Change the year, times, names or venues here — the whole site follows.
 */

export const EVENT_YEAR = 2026;

/** Armenia has been on UTC+4 year-round (no DST) since 2012. */
export const EVENT_TIME_ZONE = "Asia/Yerevan";
export const EVENT_UTC_OFFSET = "+04:00";

const MONTH = 10;
const DAY = 25;

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Venue = {
  /** Visible Armenian name. */
  name: string;
  /**
   * Exact street address, if known. Leave `null` rather than guessing —
   * the map link then falls back to `mapsQuery`.
   */
  address: string | null;
  /** Free-text query used for the Google Maps search link. */
  mapsQuery: string;
  /** Optional Google Maps place ID for a pinpoint-accurate link. */
  placeId?: string;
  /** Direct Google Maps link to open the exact place/location. */
  mapsUrl?: string;
  /** Coordinates for GPS navigation (turn-by-turn). */
  coordinates: Coordinates;
};

export type ScheduleItem = {
  id: string;
  /** Local Yerevan time, 24h "HH:MM". */
  time: string;
  eyebrow: string;
  title: string;
  venue: Venue;
  description: string;
  image: { src: string; alt: string; position?: string };
};

export const eventConfig = {
  children: ["Աննա", "Հայկ"] as const,
  /** Genitive (սեռական) forms — Armenian declension, so set them explicitly. */
  childrenGenitiveNames: ["Աննայի", "Հայկի"] as const,
  childrenGenitive: "Աննայի և Հայկի",
  monogram: ["Ա", "Հ"] as const,

  date: { year: EVENT_YEAR, month: MONTH, day: DAY },

  schedule: [
    {
      id: "baptism",
      time: "15:20",
      eyebrow: "Սուրբ Մկրտություն",
      title: "Աննայի և Հայկի մկրտությունը",
      venue: {
        name: "Մայր Աթոռ Սուրբ Էջմիածին",
        address: "Վաղարշապատ",
        mapsQuery: "Mother See of Holy Etchmiadzin, Vagharshapat, Armenia",
        mapsUrl: "https://www.google.com/maps/place/Etchmiadzin+Cathedral/@40.1618404,44.2911157,17z",
        coordinates: { lat: 40.16184, lng: 44.29112 },
      },
      description:
        "Հավատքի, սիրո և օրհնության ճանապարհի սկիզբը։ Միացե՛ք մեզ՝ կիսելու Դավիթի կյանքի այս սուրբ ու կարևոր պահը։",
      image: {
        src: "/images/etchmiadzin-cathedral.jpg",
        alt: "Էջմիածնի Մայր տաճարը",
        position: "50% 30%",
      },
    },
    {
      id: "celebration",
      time: "17:30",
      eyebrow: "Տոնական երեկո",
      title: "Տոնական ընթրիք",
      venue: {
        name: "Ռեստորան Ադանա",
        address: "Aura by Adana Complex",
        mapsQuery: "Aura by Adana Complex",
        mapsUrl:
          "https://www.google.com/maps/place/Aura+by+Adana+Complex/@40.0082542,44.4687452,16.97z/data=!4m10!1m2!2m1!1saura+by+adana+complex!3m6!1s0x406abdb283a4c9e5:0xe26036db5367bf1f!8m2!3d40.0084784!4d44.4710483!15sChVhdXJhIGJ5IGFkYW5hIGNvbXBsZXiSAQtldmVudF92ZW51ZeABAA!16s%2Fg%2F11zcy090hx?entry=ttu",
        coordinates: { lat: 40.00848, lng: 44.47105 },
      },
      description:
        "Մկրտության ուրախությունը շարունակելու ենք ջերմ մթնոլորտում՝ համեղ սեղանի, անկեղծ ժպիտների և սիրելի մարդկանց ընկերակցությամբ։",
      image: {
        src: "/images/celebration-table.jpg",
        alt: "Տոնական սեղան՝ մոմերի մեղմ լույսի ներքո",
        position: "50% 55%",
      },
    },
  ] satisfies ScheduleItem[],

  gallery: {
    enabled: true,
    /** Replace `src: null` with a path in /public/images to show a real photo. */
    photos: [
      { src: null, alt: "Դավիթի լուսանկարը" },
      { src: null, alt: "Ընտանեկան լուսանկար" },
      { src: null, alt: "Մկրտության օրվա պահեր" },
      { src: null, alt: "Մեր փոքրիկը" },
    ] as { src: string | null; alt: string }[],
  },

  rsvp: {
    maxGuests: 10,
  },
} as const;

/** ISO timestamp with Yerevan offset for a given "HH:MM" on the event day. */
export function eventDateTimeISO(time = "00:00") {
  const { year, month, day } = eventConfig.date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${time}:00${EVENT_UTC_OFFSET}`;
}

/** The moment the countdown runs to: the start of the baptism. */
export const CEREMONY_START_ISO = eventDateTimeISO(eventConfig.schedule[0].time);

export function googleMapsUrl(venue: Venue) {
  if (venue.mapsUrl) return venue.mapsUrl;
  const params = new URLSearchParams({
    api: "1",
    query: venue.address ? `${venue.mapsQuery}, ${venue.address}` : venue.mapsQuery,
  });
  if (venue.placeId) params.set("query_place_id", venue.placeId);
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function googleNavigationUrl(venue: Venue) {
  const { lat, lng } = venue.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&dir_action=navigate`;
}
