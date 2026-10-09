"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle, Minus, Plus } from "lucide-react";
import {
  NAME_MAX,
  rsvpMessages,
  validateRsvp,
  type Attendance,
  type RsvpFieldErrors,
  type RsvpState,
} from "@/lib/rsvp/validation";
import { eventConfig } from "@/lib/event-config";
import { ArmenianCross } from "./ornaments";

const initialState: RsvpState = { status: "idle" };

/** Sends the form to POST /api/rsvp. Success is shown only after the server confirms the save. */
async function submitRsvp(_prev: RsvpState, formData: FormData): Promise<RsvpState> {
  const attendance = formData.get("attendance") as Attendance;
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        attendance,
        guests: Number(formData.get("guests") ?? 0),
        website: formData.get("website"),
      }),
    });
    if (res.ok) return { status: "success", attendance };
    const data = await res.json().catch(() => ({}));
    if (res.status === 400 && data.errors) return { status: "invalid", errors: data.errors };
  } catch {
    // Network error — fall through to the error message.
  }
  return { status: "error", message: rsvpMessages.saveFailed };
}
const { maxGuests } = eventConfig.rsvp;

const options: { value: Attendance; label: string }[] = [
  { value: "yes", label: "Սիրով կմասնակցեմ" },
  { value: "no", label: "Ցավոք, չեմ կարողանա ներկա լինել" },
];

export function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [guests, setGuests] = useState("1");
  const [clientErrors, setClientErrors] = useState<RsvpFieldErrors>({});
  const successRef = useRef<HTMLDivElement>(null);
  const errorSummaryRef = useRef<HTMLParagraphElement>(null);

  const errors: RsvpFieldErrors = { ...(state.status === "invalid" ? state.errors : {}), ...clientErrors };

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") errorSummaryRef.current?.focus();
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = validateRsvp({ name, attendance, guests });
    if (!result.ok) {
      event.preventDefault();
      setClientErrors(result.errors);
      const firstInvalid = (["name", "attendance", "guests"] as const).find((f) => result.errors[f]);
      event.currentTarget.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }
    setClientErrors({});
  }

  function clearError(field: keyof RsvpFieldErrors) {
    if (errors[field]) setClientErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function stepGuests(delta: number) {
    const current = Number.parseInt(guests, 10) || 1;
    setGuests(String(Math.min(maxGuests, Math.max(1, current + delta))));
    clearError("guests");
  }

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center px-2 py-10 text-center outline-none"
      >
        <span className="flex size-16 items-center justify-center rounded-full border border-gold/50 text-gold">
          <Check aria-hidden="true" className="size-7 stroke-[1.25]" />
        </span>
        <p className="mt-8 max-w-md font-serif text-2xl leading-relaxed text-balance text-ink sm:text-[1.7rem]">
          {state.attendance === "yes" ? rsvpMessages.success : rsvpMessages.successDeclined}
        </p>
        <ArmenianCross aria-hidden="true" className="mt-8 h-7 w-auto text-gold" />
      </div>
    );
  }

  const declining = attendance === "no";

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-9">
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Կայք
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="rsvp-name" className="block text-sm tracking-[0.06em] text-olive">
          Ձեր անունը և ազգանունը
        </label>
        <input
          id="rsvp-name"
          data-field="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={NAME_MAX + 10}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "rsvp-name-error" : undefined}
          className="mt-3 w-full border-0 border-b border-gold/50 bg-transparent px-0 py-2.5 font-serif text-xl text-ink transition-colors placeholder:text-muted/50 focus:border-olive focus:ring-0 focus:outline-none aria-[invalid]:border-[#9a4a3a]"
        />
        <FieldError id="rsvp-name-error" message={errors.name} />
      </div>

      <fieldset aria-describedby={errors.attendance ? "rsvp-attendance-error" : undefined}>
        <legend className="text-sm tracking-[0.06em] text-olive">Կմիանա՞ք մեզ այս օրը</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {options.map((option, i) => {
            const checked = attendance === option.value;
            return (
              <label
                key={option.value}
                className={`relative flex cursor-pointer items-center gap-3 rounded-md border px-4 py-4 text-[0.97rem] leading-snug transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-ink ${
                  checked ? "border-olive bg-olive/[0.06] text-ink" : "border-gold/35 text-muted hover:border-gold/70"
                }`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  checked={checked}
                  data-field={i === 0 ? "attendance" : undefined}
                  onChange={() => {
                    setAttendance(option.value);
                    clearError("attendance");
                    clearError("guests");
                  }}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    checked ? "border-olive" : "border-gold/60"
                  }`}
                >
                  <span className={`size-2.5 rounded-full bg-olive transition-transform ${checked ? "scale-100" : "scale-0"}`} />
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
        <FieldError id="rsvp-attendance-error" message={errors.attendance} />
      </fieldset>

      <div className={`transition-opacity duration-500 ${declining ? "opacity-40" : ""}`}>
        <label htmlFor="rsvp-guests" className="block text-sm tracking-[0.06em] text-olive">
          Հյուրերի քանակը
        </label>
        <p id="rsvp-guests-hint" className="mt-1 text-xs text-muted">
          Ներառյալ Ձեզ
        </p>
        <div className="mt-3 flex items-center gap-3">
          <StepButton label="Պակասեցնել" disabled={declining || pending} onClick={() => stepGuests(-1)}>
            <Minus aria-hidden="true" className="size-4" />
          </StepButton>
          <input
            id="rsvp-guests"
            data-field="guests"
            name="guests"
            type="number"
            inputMode="numeric"
            min={1}
            max={maxGuests}
            disabled={declining}
            value={declining ? "" : guests}
            onChange={(e) => {
              setGuests(e.target.value);
              clearError("guests");
            }}
            aria-invalid={errors.guests ? true : undefined}
            aria-describedby={`rsvp-guests-hint${errors.guests ? " rsvp-guests-error" : ""}`}
            className="numerals w-16 [appearance:textfield] border-0 border-b border-gold/50 bg-transparent py-1 text-center text-3xl text-ink focus:border-olive focus:outline-none disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <StepButton label="Ավելացնել" disabled={declining || pending} onClick={() => stepGuests(1)}>
            <Plus aria-hidden="true" className="size-4" />
          </StepButton>
        </div>
        <FieldError id="rsvp-guests-error" message={errors.guests} />
      </div>

      {state.status === "error" ? (
        <p
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border border-[#9a4a3a]/30 bg-[#9a4a3a]/[0.06] px-4 py-3 text-sm leading-relaxed text-[#7d3a2d] outline-none"
        >
          {state.message}
        </p>
      ) : null}

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-olive px-6 py-3.5 text-[0.95rem] tracking-[0.02em] whitespace-nowrap text-ivory sm:px-10 shadow-[0_18px_40px_-20px_rgba(63,68,52,0.9)] transition-colors duration-300 hover:bg-olive-deep disabled:cursor-wait disabled:opacity-80 sm:w-auto"
        >
          {pending ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Ուղարկվում է…
            </>
          ) : (
            "Հաստատել մասնակցությունը"
          )}
        </button>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-[#8a4334]">
      {message}
    </p>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full border border-gold/50 text-olive transition-colors hover:border-olive hover:bg-olive hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gold/50 disabled:hover:bg-transparent disabled:hover:text-olive"
    >
      {children}
    </button>
  );
}
