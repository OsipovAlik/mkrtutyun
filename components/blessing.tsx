import type { SiteContent } from "@/lib/content/types";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { EternityRosette, OliveBranch } from "./ornaments";
import { Reveal } from "./reveal";

export function Blessing({ content = DEFAULT_CONTENT }: { content?: SiteContent }) {
  if (!content.blessing.enabled || content.blessing.lines.length === 0) return null;

  return (
    <section
      id="blessing"
      aria-label="Մաղթանք"
      className="paper relative overflow-hidden bg-cream px-6 py-28 sm:py-40"
    >
      <EternityRosette
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 text-gold/[0.09] sm:size-[44rem]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <EternityRosette className="mx-auto size-16 text-gold sm:size-20" />
        </Reveal>

        <blockquote className="mt-12 font-serif text-[1.55rem] leading-[1.6] font-light text-balance text-ink sm:text-[2.3rem] sm:leading-[1.6]">
          {content.blessing.lines.map((line, i) => (
            <Reveal as="span" key={line + i} delay={250 + i * 300} className="block">
              {line}
            </Reveal>
          ))}
        </blockquote>

        <Reveal delay={1300} className="mt-12 flex items-center justify-center gap-3 text-olive/70">
          <OliveBranch className="h-6 w-24 -scale-x-100 sm:w-28" />
          <OliveBranch className="h-6 w-24 sm:w-28" />
        </Reveal>
      </div>
    </section>
  );
}
