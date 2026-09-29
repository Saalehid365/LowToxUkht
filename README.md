# Low Tox Opt: website

A wellness consultancy site with booking, form collection and a private dashboard.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dashboard is at http://localhost:3000/admin.

Settings are in `.env.local`. Until you add a Neon database, form submissions are saved to `.data/submissions.json`, so you can test everything straight away.

## Connect Neon (your database)

1. Create a free project at https://neon.tech.
2. Click **Connect** and copy the connection string (it starts with `postgresql://`).
3. Paste it into `.env.local` as `DATABASE_URL=...` and restart the site.

The `submissions` table is created automatically the first time a form is sent.

## Connect Calendly (bookings)

1. In Calendly, create an event type (e.g. "Home reset consultation").
2. Copy its link, e.g. `https://calendly.com/your-name/home-reset`.
3. Put it in `.env.local` as `NEXT_PUBLIC_CALENDLY_URL=...`.

Booking flow: the client fills in the intake form (saved to your dashboard), then picks a time in Calendly with their name and email already filled in. Without a Calendly link, they see a message saying you'll email them to arrange a time.

## Dashboard

Go to `/admin` and sign in with `ADMIN_PASSWORD`. You can filter and search submissions, change each one's status (New, Contacted, Booked, Closed), reply by email, delete entries and download everything as a CSV.

## Change the name, prices and copy

- Business name, email, packages and prices: `lib/site.ts`
- Home page text: `app/page.tsx`
- Colours and fonts: the top of `app/globals.css`
- Your photo: add `public/photo.jpg` and follow the comment in `app/page.tsx`
- The testimonials are placeholders. Replace them with real client quotes before launch.

## Put it online (Vercel)

1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new.
3. Add `DATABASE_URL`, `ADMIN_PASSWORD` and `NEXT_PUBLIC_CALENDLY_URL` under **Environment Variables**, then deploy.

On Vercel you need Neon: the local-file fallback does not work there.
