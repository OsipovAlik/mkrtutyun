import { eventConfig } from "./event-config";

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

export function eventDateParts() {
  const { year, month, day } = eventConfig.date;
  // Calendar-date arithmetic only, so UTC is safe regardless of server zone.
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return {
    weekday,
    day: String(day),
    month: MONTHS_GENITIVE[month - 1],
    year: `${year} թ.`,
  };
}

/** «Կիրակի, 25 հոկտեմբերի, 2026 թ.» */
export function formatEventDate() {
  const { weekday, day, month, year } = eventDateParts();
  return `${weekday}, ${day} ${month}, ${year}`;
}
