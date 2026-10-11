export type Attendance = "yes" | "no";

export type RsvpInput = {
  name: string;
  attendance: Attendance;
  /** 0 when declining. */
  guests: number;
};

export type RsvpRecord = RsvpInput & { submittedAt: string };

export type RsvpSummary = {
  totalGuests: number;
  attendingResponses: number;
  declinedResponses: number;
};

export function summarize(records: RsvpRecord[]): RsvpSummary {
  const attending = records.filter((r) => r.attendance === "yes");
  return {
    totalGuests: attending.reduce((sum, r) => sum + r.guests, 0),
    attendingResponses: attending.length,
    declinedResponses: records.length - attending.length,
  };
}

export type RsvpFieldErrors = Partial<Record<"name" | "attendance" | "guests", string>>;

export const NAME_MAX = 80;

export const rsvpMessages = {
  nameRequired: "Խնդրում ենք նշել Ձեր անունը և ազգանունը։",
  nameTooLong: `Անունը չպետք է գերազանցի ${NAME_MAX} նիշը։`,
  attendanceRequired: "Խնդրում ենք ընտրել պատասխաններից մեկը։",
  guestsRange: (max: number) => `Հյուրերի քանակը պետք է լինի 1-ից մինչև ${max}։`,
  saveFailed:
    "Ցավոք, այս պահին չհաջողվեց պահպանել Ձեր պատասխանը։ Խնդրում ենք փորձել մի փոքր ուշ կամ կապվել մեզ հետ անմիջապես։",
  success: "Շնորհակալ ենք Ձեր պատասխանի համար։ Սիրով սպասում ենք Ձեզ։",
  successDeclined: "Շնորհակալ ենք Ձեր պատասխանի համար։ Այդ օրը Դուք մեր մտքերում և սրտում կլինեք։",
};

export type RsvpState =
  | { status: "idle" }
  | { status: "invalid"; errors: RsvpFieldErrors }
  | { status: "error"; message: string }
  | { status: "success"; attendance: Attendance };

/** Runs identically in the browser (instant feedback) and on the server (source of truth). */
export function validateRsvp(
  raw: {
    name: unknown;
    attendance: unknown;
    guests: unknown;
  },
  maxGuests = 10
): { ok: true; data: RsvpInput } | { ok: false; errors: RsvpFieldErrors } {
  const errors: RsvpFieldErrors = {};

  const name = typeof raw.name === "string" ? raw.name.trim().replace(/\s+/g, " ") : "";
  // Expect at least a first name and a surname.
  if (name.length < 3 || name.split(" ").length < 2) errors.name = rsvpMessages.nameRequired;
  else if (name.length > NAME_MAX) errors.name = rsvpMessages.nameTooLong;

  const attendance = raw.attendance === "yes" || raw.attendance === "no" ? raw.attendance : null;
  if (!attendance) errors.attendance = rsvpMessages.attendanceRequired;

  let guests = 0;
  if (attendance === "yes") {
    guests = Number(raw.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) {
      errors.guests = rsvpMessages.guestsRange(maxGuests);
    }
  }

  if (Object.keys(errors).length > 0 || !attendance) return { ok: false, errors };
  return { ok: true, data: { name, attendance, guests } };
}
