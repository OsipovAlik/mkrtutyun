import Image from "next/image";
import type { SiteContent } from "@/lib/content/types";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { EternityRosette } from "./ornaments";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Gallery({ content = DEFAULT_CONTENT }: { content?: SiteContent }) {
  const { enabled, eyebrow, title, photos } = content.gallery;
  if (!enabled || photos.length === 0) return null;

  return (
    <section aria-labelledby="gallery-title" id="gallery" className="paper px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        id="gallery-title"
        eyebrow={eyebrow || "Լուսանկարներ"}
        title={title || "Մեր փոքրիկների լուսավոր աշխարհը"}
      />

      <ul className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 sm:mt-16 sm:gap-5 md:grid-cols-4">
        {photos.map((photo, i) => {
          const featured = i === 0;
          return (
            <Reveal
              as="li"
              key={i}
              delay={i * 110}
              className={featured ? "col-span-2 md:row-span-2" : ""}
            >
              <figure
                className={`relative h-full overflow-hidden rounded-md border border-gold/25 bg-cream ${
                  featured ? "aspect-[4/3] md:aspect-auto md:min-h-full" : "aspect-[4/5]"
                } ${i === 1 || i === 4 ? "md:arch" : ""}`}
              >
                {photo.src ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                    className="object-cover"
                  />
                ) : (
                  <Placeholder label={photo.alt} large={featured} />
                )}
              </figure>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

function Placeholder({ label, large }: { label: string; large: boolean }) {
  return (
    <div
      role="img"
      aria-label={`${label} — շուտով`}
      className="paper absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,var(--color-ivory)_0%,var(--color-cream)_75%)] p-4 text-center"
    >
      <div aria-hidden="true" className="absolute inset-2 rounded-[inherit] border border-gold/20 sm:inset-3" />
      <EternityRosette aria-hidden="true" className={`text-gold/45 ${large ? "size-20 sm:size-28" : "size-12 sm:size-16"}`} />
      <p aria-hidden="true" className={`font-serif text-gold-ink/80 ${large ? "text-base sm:text-lg" : "text-xs sm:text-sm"}`}>
        Լուսանկարը շուտով կհայտնվի
      </p>
    </div>
  );
}
