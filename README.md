# Աննայի և Հայկի Մկրտությունը — invitation site

A one-page christening invitation in Armenian. It's built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static page + one server action)
```

## Editing event details

Every date, time, name and venue lives in **[lib/event-config.ts](lib/event-config.ts)**:

- `EVENT_YEAR`: the year, stored in one place. The month and day are next to it.
- `schedule`: the two events (time, title, venue, description, photo).
- `venue.address` / `venue.mapsQuery` / `venue.placeId`: these drive the "Դիտել քարտեզը" links.
  - **Restaurant Adana:** no branch or address is confirmed yet, so the map link searches for `Adana Restaurant, Armenia`. Once you know the branch, set `address` (and ideally `placeId`) and the link updates.
- `childrenGenitiveNames`: the Armenian genitive forms. They're written out because they can't be derived reliably.

The countdown runs to the baptism's start time (`15:20`, `Asia/Yerevan`, UTC+4). It works correctly in any visitor time zone and hides itself once that moment passes.

## Gallery photos

The gallery shows tasteful placeholders. To add real photos, put them in `public/images/`. Then set `src` for each entry in `eventConfig.gallery.photos`, for example `{ src: "/images/anna.jpg", alt: "Աննան" }`. Set `gallery.enabled = false` to hide the section entirely.

## RSVP and the owner page

### API ([app/api/rsvp/route.ts](app/api/rsvp/route.ts))

- `POST /api/rsvp` is public and used by the form. It takes `{ name, attendance: "yes" | "no", guests }` and returns `201`, or `400` with field errors, or `500`.
- `GET /api/rsvp` is for the owner only and requires the login cookie. It returns `{ totalGuests, attendingResponses, declinedResponses, responses }`.

Guests must enter a first name and a surname. If the same name answers again, the newer answer replaces the older one, so guests aren't counted twice. Guests see the thank-you message only after the response has been saved.

### Owner page: `/admin`

Log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Locally these are in `.env.local`; on Vercel, set them under Project → Settings → Environment Variables. The page shows the total number of guests at the top, then every response with the name, the answer and the guest count. The login lasts 7 days, and changing the password logs everyone out.

### Where responses are stored ([lib/rsvp/store.ts](lib/rsvp/store.ts))

- **Locally:** `data/rsvps.json`. It isn't committed to git.
- **On Vercel:** files can't be kept there, so add **Upstash for Redis** (free) from the Vercel Marketplace (Project → Storage). It sets `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` automatically, and storage switches to Redis on its own.

  > Without Redis on Vercel, saving fails and guests see an error message. No response is silently lost.

## Deploying to Vercel

Import the repo into Vercel; no extra configuration is needed. Add the environment variables above (see [.env.example](.env.example)).

## Photo credits

The architectural and table photos come from Wikimedia Commons under Creative Commons licences. Credits are listed in the footer ("Լուսանկարների աղբյուրները") and in [components/site-footer.tsx](components/site-footer.tsx). Keep them while you use these photos, or replace the files in `public/images/` with your own.
