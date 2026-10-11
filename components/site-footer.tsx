import type { SiteContent } from "@/lib/content/types";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { formatEventDate } from "@/lib/armenian-date";
import { ArmenianCross, BraidBand } from "./ornaments";

export function SiteFooter({ content = DEFAULT_CONTENT }: { content?: SiteContent }) {
  const credits = content.footer.credits || [];

  return (
    <footer className="relative bg-olive-deep px-6 pt-20 pb-10 text-center text-ivory">
      <BraidBand className="absolute inset-x-0 top-0 text-gold-soft/30" />
      <ArmenianCross className="mx-auto h-10 w-auto text-gold-soft" />
      <p className="mt-8 font-serif text-2xl font-light sm:text-3xl">
        {content.footer.signature || "Սիրով՝ մեր ընտանիք"}
      </p>
      <p className="mt-4 text-sm tracking-[0.12em] text-ivory/60">{formatEventDate(content.event)}</p>

      {credits.length > 0 ? (
        <details className="mx-auto mt-16 max-w-xl text-[0.72rem] leading-relaxed text-ivory/55">
          <summary className="cursor-pointer list-none tracking-[0.12em] transition-colors hover:text-ivory/70">
            Լուսանկարների աղբյուրները
          </summary>
          <ul className="mt-3 space-y-1">
            {credits.map((credit, idx) => (
              <li key={credit.source || idx}>
                {credit.source ? (
                  <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                    {credit.label}՝ {credit.author}, {credit.license}
                  </a>
                ) : (
                  <span>{credit.label}՝ {credit.author}, {credit.license}</span>
                )}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </footer>
  );
}
