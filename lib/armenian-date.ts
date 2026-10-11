import { DEFAULT_CONTENT } from "./content/defaults";

const WEEKDAYS = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];

/** Month names in the genitive case, as used in dates: «25 հոկտեմբերի». */
const MONTHS_GENITIVE = [
  "հունվարի",
  "փետրվարի",
  "մարտի",
  "ապրիլի",
  "մայիսի",
  "հունիսի",
  "հուլիսի",
  "օգոստոսի",
  "սեպտեմբերի",
  "հոկտեմբերի",
  "նոյեմբերի",
  "դեկտեմբերի",
];

export type SimpleDate = {
  year: number;
  month: number;
  day: number;
};

export function eventDateParts(customDate?: SimpleDate) {
  const date = customDate ?? DEFAULT_CONTENT.event;
  const { year, month, day } = date;
  // Calendar-date arithmetic only, so UTC is safe regardless of server zone.
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return {
    weekday,
    day: String(day),
    month: MONTHS_GENITIVE[month - 1] ?? "",
    year: String(year),
  };
}

/** «Շաբաթ, 20 մարտի, 2027 թ.» */
export function formatEventDate(customDate?: SimpleDate) {
  const { weekday, day, month, year } = eventDateParts(customDate);
  return `${weekday}, ${day} ${month}, ${year} թ.`;
}
