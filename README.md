# Low Tox Opt: website

A wellness coaching site for Muslim women at home, with booking, a family intake form that emails you a PDF, and a private dashboard.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dashboard is at http://localhost:3000/admin.

Settings are in `.env.local`. Without a Neon database, form submissions are saved to `.data/submissions.json` instead.

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

## Family intake form (/intake)

Clients on the family package are sent to `/intake` straight after booking. It is the 8 section intake form, one section per step, and answers are kept on their device until they send it.

When a form is sent:
1. It is saved to your database and appears in the dashboard (with an **Open PDF** button).
2. A PDF of the full form is emailed to you, with a "Before the session" summary of allergies, medications and triggers at the top and ruled lines for session notes.

To turn on the email:
1. Create a free account at https://resend.com and make an API key.
2. In `.env.local`, set `RESEND_API_KEY=...` and `INTAKE_EMAIL_TO=` your email address.
3. Until you verify your own domain in Resend, emails come from `onboarding@resend.dev` and can only be delivered to the address you signed up to Resend with.

Edit the questions in `lib/intake.ts`. The web form, PDF, email and dashboard all update together.

## Dashboard

Go to `/admin`. There is no password while `ADMIN_PASSWORD` is empty, which means anyone with the link can see submissions. Set a password before the site goes live. You can filter and search submissions, change each one's status (New, Contacted, Booked, Closed), open intake PDFs, reply by email, delete entries and download everything as a CSV.

## Change the name, prices and copy

- Business name, email, packages and prices: `lib/site.ts`
- Home page text: `app/page.tsx`
- Colours and fonts: the top of `app/globals.css`
- Your photo: add `public/photo.jpg` and follow the comment in `app/page.tsx`
- Testimonials: add real client quotes to `testimonials` in `lib/site.ts` and the section appears on the home page.
- Prices in `lib/site.ts` are placeholders. Set your own.

## Put it online (Vercel)

1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new.
3. Add `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_CALENDLY_URL`, `RESEND_API_KEY`, `INTAKE_EMAIL_TO`, `INTAKE_EMAIL_FROM` and `NEXT_PUBLIC_SITE_URL` under **Environment Variables**, then deploy.

On Vercel you need Neon: the local-file fallback does not work there.
