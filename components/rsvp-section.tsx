import { CornerFlourish } from "./ornaments";
import { Reveal } from "./reveal";
import { RsvpForm } from "./rsvp-form";
import { SectionHeading } from "./section-heading";

export function RsvpSection() {
  return (
    <section aria-labelledby="rsvp-title" id="rsvp" className="paper bg-cream/60 px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading id="rsvp-title" eyebrow="Մասնակցություն" title="Ձեր ներկայությունը մեզ համար մեծ ուրախություն է">
        <p>Խնդրում ենք տեղեկացնել Ձեր մասնակցության մասին։</p>
      </SectionHeading>

      <Reveal delay={150} className="relative mx-auto mt-14 max-w-2xl">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-gold/70">
          <CornerFlourish className="absolute -top-px -left-px size-9" />
          <CornerFlourish className="absolute -top-px -right-px size-9 rotate-90" />
          <CornerFlourish className="absolute -right-px -bottom-px size-9 rotate-180" />
          <CornerFlourish className="absolute -bottom-px -left-px size-9 -rotate-90" />
        </div>
        <div className="border border-gold/25 bg-ivory px-6 py-10 shadow-[0_40px_80px_-50px_rgba(55,53,47,0.5)] sm:px-14 sm:py-14">
          <RsvpForm />
        </div>
      </Reveal>
    </section>
  );
}
