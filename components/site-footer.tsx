import { formatEventDate } from "@/lib/armenian-date";
import { ArmenianCross, BraidBand } from "./ornaments";

/**
 * Photo credits are required by the Creative Commons licences of the
 * Wikimedia Commons images in /public/images. Keep them if you keep the photos.
 */
const photoCredits = [
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
];

export function SiteFooter() {
  return (
    <footer className="relative bg-olive-deep px-6 pt-20 pb-10 text-center text-ivory">
      <BraidBand className="absolute inset-x-0 top-0 text-gold-soft/30" />
      <ArmenianCross className="mx-auto h-10 w-auto text-gold-soft" />
      <p className="mt-8 font-serif text-2xl font-light sm:text-3xl">Սիրով՝ Աննայի և Հայկի ընտանիք</p>
      <p className="mt-4 text-sm tracking-[0.12em] text-ivory/60">{formatEventDate()}</p>

      <details className="mx-auto mt-16 max-w-xl text-[0.72rem] leading-relaxed text-ivory/55">
        <summary className="cursor-pointer list-none tracking-[0.12em] transition-colors hover:text-ivory/70">
          Լուսանկարների աղբյուրները
        </summary>
        <ul className="mt-3 space-y-1">
          {photoCredits.map((credit) => (
            <li key={credit.source}>
              <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                {credit.label}՝ {credit.author}, {credit.license}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}
