import type { SiteContent } from "./types";

/**
 * The invitation exactly as it was before the editor existed.
 * Used for a fresh site, for any field missing from stored content,
 * and by "Reset to defaults" in the admin.
 *
 * Every array here must stay non-empty: its first element is the
 * template used to validate new items (see sanitize.ts).
 */
export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  theme: {
    olive: "#555b46",
    oliveDeep: "#3f4434",
    gold: "#b59a63",
    goldSoft: "#d8c49b",
    ivory: "#faf7f0",
    cream: "#f2ebdd",
  },
  people: {
    names: ["Աննա", "Հայկ"],
    genitive: "Աննայի և Հայկի",
  },
  event: { year: 2026, month: 10, day: 25, utcOffset: "+04:00" },
  seo: { title: "", description: "" },
  intro: {
    enabled: true,
    eyebrow: "Սուրբ Մկրտություն",
    buttonLabel: "Բացել հրավերը",
  },
  hero: {
    image: {
      src: "/images/hero-etchmiadzin.png",
      alt: "Էջմիածնի Մայր տաճարը աշնանային լույսի ներքո",
      position: "50% 35%",
    },
    greeting: "Սիրելի հյուրեր",
    inviteLine: "Սիրով հրավիրում ենք Ձեզ կիսելու մեզ հետ",
    subtitle: "Սուրբ Մկրտության լուսավոր օրը",
    closing: "Սպասում ենք Ձեզ",
  },
  program: {
    eyebrow: "Օրվա ծրագիրը",
    title: "Մեր օրհնյալ օրը",
    items: [
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
          lat: 40.16184,
          lng: 44.29112,
        },
        description:
          "Հավատքի, սիրո և օրհնության ճանապարհի սկիզբը։ Միացե՛ք մեզ՝ կիսելու մեր կյանքի այս սուրբ ու կարևոր պահը։",
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
          lat: 40.00848,
          lng: 44.47105,
        },
        description:
          "Մկրտության ուրախությունը շարունակելու ենք ջերմ մթնոլորտում՝ համեղ սեղանի, անկեղծ ժպիտների և սիրելի մարդկանց ընկերակցությամբ։",
        image: {
          src: "/images/celebration-table.jpg",
          alt: "Տոնական սեղան՝ մոմերի մեղմ լույսի ներքո",
          position: "50% 55%",
        },
      },
    ],
  },
  blessing: {
    enabled: true,
    lines: ["Օրհնված լինի այս օրը,", "լույսով ու սիրով լցված՝", "Աննայի և Հայկի կյանքի յուրաքանչյուր քայլը։"],
  },
  countdown: {
    enabled: true,
    title: "Մինչև մեր տոնը մնացել է",
  },
  gallery: {
    enabled: false,
    eyebrow: "Լուսանկարներ",
    title: "Մեր փոքրիկների լուսավոր աշխարհը",
    photos: [
      { src: "", alt: "Մեր փոքրիկների լուսանկարը" },
      { src: "", alt: "Ընտանեկան լուսանկար" },
      { src: "", alt: "Մկրտության օրվա պահեր" },
      { src: "", alt: "Մեր փոքրիկները" },
    ],
  },
  rsvp: {
    enabled: true,
    eyebrow: "Մասնակցություն",
    title: "Ձեր ներկայությունը մեզ համար մեծ ուրախություն է",
    text: "Խնդրում ենք տեղեկացնել Ձեր մասնակցության մասին։",
    maxGuests: 10,
    yesLabel: "Սիրով կմասնակցեմ",
    noLabel: "Ցավոք, չեմ կարողանա ներկա լինել",
    submitLabel: "Հաստատել մասնակցությունը",
    success: "Շնորհակալ ենք Ձեր պատասխանի համար։ Սիրով սպասում ենք Ձեզ։",
    successDeclined: "Շնորհակալ ենք Ձեր պատասխանի համար։ Այդ օրը Դուք մեր մտքերում և սրտում կլինեք։",
  },
  music: {
    enabled: true,
    src: "/sound/sound.mp3",
    volume: 0.5,
  },
  footer: {
    signature: "Սիրով՝ Աննայի և Հայկի ընտանիք",
    /* Required by the Creative Commons licences of the bundled Wikimedia photos. */
    credits: [
      {
        label: "Էջմիածնի Մայր տաճարը, աշուն",
        author: "23artashes",
        license: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Etchmiadzin_Cathedral,_%D4%B1%D4%B9_043.jpg",
      },
      {
        label: "Էջմիածնի Մայր տաճարը",
        author: "Luigi Guarino",
        license: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Etchmiadzin_Cathedral_2011.jpg",
      },
      {
        label: "Տոնական սեղան",
        author: "PattayaPatrol",
        license: "CC BY-SA 4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:DZ6_2629_A_cozy_table_for_two_-_soft_lights_a_single_orchid_and_the_promise_of_a_perfect_evening.jpg",
      },
    ],
  },
};
