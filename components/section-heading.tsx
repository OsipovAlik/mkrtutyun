import type { ReactNode } from "react";
import { CrossDivider } from "./ornaments";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
};

export function SectionHeading({ id, eyebrow, title, children, tone = "light" }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <CrossDivider className={dark ? "text-gold-soft" : "text-gold"} />
      <p className={`mt-5 text-xs tracking-[0.32em] uppercase sm:text-[0.8rem] ${dark ? "text-gold-soft" : "text-gold-ink"}`}>
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-4 font-serif text-[1.95rem] leading-tight font-light text-balance sm:text-5xl ${dark ? "text-ivory" : "text-ink"}`}
      >
        {title}
      </h2>
      {children ? (
        <div className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? "text-ivory/75" : "text-muted"}`}>{children}</div>
      ) : null}
    </Reveal>
  );
}
